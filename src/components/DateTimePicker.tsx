import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePickerNative, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { theme } from '../theme';
import { messages } from '../constants/messages';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export function DateTimePicker({ value, onChange, minimumDate }: DateTimePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value ?? new Date());

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) {
      setTempDate(date);
      if (Platform.OS === 'android') {
        setShowTimePicker(true);
      } else {
        onChange(date);
      }
    }
  };

  const handleTimeChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (date) {
      onChange(date);
    }
  };

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <DateTimePickerNative
          value={value ?? new Date()}
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
      <Pressable style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.pickerButtonText}>
          {value ? format(value, 'dd/MM/yyyy HH:mm') : messages.selectDatetime}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePickerNative
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
        />
      )}

      {showTimePicker && (
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
