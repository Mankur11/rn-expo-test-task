import { useEffect } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useBookingStore } from '../store';
import { useCreateBooking } from '../api';
import { ScreenLayout, BasketSummary, DateTimePicker } from '../components';
import { isValidAppointment, getMinDate, getDefaultAppointment } from '../utils';
import { theme } from '../theme';
import { messages } from '../constants/messages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppointmentSelection'>;

export function AppointmentSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { mutate: submitBooking, isPending } = useCreateBooking();

  const basket = useBookingStore((s) => s.basket);
  const address = useBookingStore((s) => s.address);
  const appointment = useBookingStore((s) => s.appointment);
  const setAppointment = useBookingStore((s) => s.setAppointment);
  const totalPrice = useBookingStore((s) => s.totalPrice);
  const totalDuration = useBookingStore((s) => s.totalDuration);

  useEffect(() => {
    if (!appointment) {
      setAppointment(getDefaultAppointment().toISOString());
    }
  }, [appointment, setAppointment]);

  const appointmentDate = appointment ? new Date(appointment) : null;
  const appointmentValid = appointmentDate ? isValidAppointment(appointmentDate) : false;
  const price = totalPrice();
  const duration = totalDuration();
  const canSubmit = basket.length > 0 && address.trim().length > 0 && appointmentValid;
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

    submitBooking(
      {
        prestations: basket.map((p) => p.reference),
        appointment,
        address,
      },
      {
        onSuccess: () => navigation.navigate('Confirmation'),
        onError: () => Alert.alert(messages.bookingErrorTitle, messages.bookingError),
      },
    );
  };

  return (
    <ScreenLayout
      footer={
        <BasketSummary
          totalPrice={price}
          totalDuration={duration}
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
