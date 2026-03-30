import { Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useBookingStore } from '../store';
import { useCreateBooking } from '../api';
import { ScreenLayout, BasketSummary, DateTimePicker } from '../components';
import { isValidAppointment, getMinDate } from '../utils';
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
  const canConfirm = useBookingStore((s) => s.canConfirm);

  const handleDateChange = (date: Date) => {
    if (isValidAppointment(date)) {
      setAppointment(date.toISOString());
    } else {
      Alert.alert(messages.invalidAppointmentTitle, messages.invalidAppointment);
    }
  };

  const handleConfirm = () => {
    if (!appointment) return;

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
          totalPrice={totalPrice()}
          totalDuration={totalDuration()}
          canProceed={canConfirm() && !isPending}
          onNext={handleConfirm}
          buttonLabel={isPending ? messages.booking : messages.confirm}
        />
      }
    >
      <Text style={styles.label}>{messages.chooseDatetime}</Text>
      <DateTimePicker
        value={appointment ? new Date(appointment) : null}
        onChange={handleDateChange}
        minimumDate={getMinDate()}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
});
