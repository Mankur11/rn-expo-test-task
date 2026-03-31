import { useEffect } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useBookingStore } from '../store';
import { useBookingSummary } from '../hooks';
import { useCreateBooking } from '../api';
import { ScreenLayout, BasketSummary, DateTimePicker } from '../components';
import { isValidAppointment, getMinDate, getDefaultAppointment, getErrorMessage } from '../utils';
import { theme } from '../theme';
import { messages } from '../constants/messages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppointmentSelection'>;

export function AppointmentSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { mutate: submitBooking, isPending } = useCreateBooking();

  const address = useBookingStore((s) => s.address);
  const appointment = useBookingStore((s) => s.appointment);
  const setAppointment = useBookingStore((s) => s.setAppointment);

  const { totalPrice, totalDuration, canConfirm } = useBookingSummary();

  useEffect(() => {
    if (!appointment) {
      setAppointment(getDefaultAppointment().toISOString());
    }
  }, [appointment, setAppointment]);

  const appointmentDate = appointment ? new Date(appointment) : null;
  const appointmentValid = appointmentDate ? isValidAppointment(appointmentDate) : false;
  const canSubmit = canConfirm && appointmentValid;
  const minDate = getMinDate();

  const handleDateChange = (date: Date) => {
    setAppointment(date.toISOString());
  };

  const handleConfirm = () => {
    if (!appointment) return;

    if (!appointmentValid) {
      Alert.alert(messages.invalidAppointmentTitle, messages.invalidAppointment);
      return;
    }

    const prestations = useBookingStore.getState().getPrestationReferences();

    submitBooking(
      { prestations, appointment, address },
      {
        onSuccess: () => navigation.navigate('Confirmation'),
        onError: (error) =>
          Alert.alert(messages.bookingErrorTitle, getErrorMessage(error)),
      },
    );
  };

  return (
    <ScreenLayout
      footer={
        <BasketSummary
          totalPrice={totalPrice}
          totalDuration={totalDuration}
          canProceed={canSubmit && !isPending}
          onNext={handleConfirm}
          buttonLabel={isPending ? messages.booking : messages.confirm}
        />
      }
    >
      <Text style={styles.label}>{messages.chooseDatetime}</Text>
      {!appointmentValid && appointment && (
        <Text style={styles.warning}>{messages.invalidAppointment}</Text>
      )}
      <DateTimePicker
        value={appointmentDate}
        onChange={handleDateChange}
        minimumDate={minDate}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  warning: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
});
