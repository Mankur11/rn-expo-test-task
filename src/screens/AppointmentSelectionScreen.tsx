import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { useBookingStore } from '../store';

export function AppointmentSelectionScreen() {
  const appointment = useBookingStore((s) => s.appointment);
  const setAppointment = useBookingStore((s) => s.setAppointment);
  const canConfirm = useBookingStore((s) => s.canConfirm);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Selection</Text>
      <Text style={styles.subtitle}>
        {appointment ? `Selected: ${appointment}` : 'No time selected'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
