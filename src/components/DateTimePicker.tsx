import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePickerNative, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { theme } from '../theme';
import { messages } from '../constants/messages';

const isIOS = Platform.OS === 'ios';

const PICKER_STEP = {
  CLOSED: 'closed',
  DATE: 'date',
  TIME: 'time',
} as const;

type PickerStep = (typeof PICKER_STEP)[keyof typeof PICKER_STEP];

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export function DateTimePicker({ value, onChange, minimumDate }: DateTimePickerProps) {
  const pickerValue = useMemo(() => value ?? new Date(), [value]);
  const [pickerStep, setPickerStep] = useState<PickerStep>(PICKER_STEP.CLOSED);
  const [tempDate, setTempDate] = useState<Date>(pickerValue);

  useEffect(() => {
    setTempDate(pickerValue);
  }, [pickerValue]);

  const buttonLabel = useMemo(
    () => (value ? format(value, 'dd/MM/yyyy HH:mm') : messages.selectDatetime),
    [value],
  );

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (!date) {
      setPickerStep(PICKER_STEP.CLOSED);
      return;
    }

    if (isIOS) {
      onChange(date);
      return;
    }

    setTempDate(date);
    setPickerStep(PICKER_STEP.TIME);
  };

  const handleTimeChange = (_event: DateTimePickerEvent, date?: Date) => {
    setPickerStep(PICKER_STEP.CLOSED);
    if (date) onChange(date);
  };

  if (isIOS) {
    return (
      <View style={styles.container}>
        <DateTimePickerNative
          value={pickerValue}
          mode="datetime"
          display="spinner"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          minuteInterval={30}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.pickerButton} onPress={() => setPickerStep(PICKER_STEP.DATE)}>
        <Text style={styles.pickerButtonText}>{buttonLabel}</Text>
      </Pressable>

      {pickerStep === PICKER_STEP.DATE && (
        <DateTimePickerNative
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
        />
      )}

      {pickerStep === PICKER_STEP.TIME && (
        <DateTimePickerNative
          value={tempDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
          minuteInterval={30}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pickerButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
});
