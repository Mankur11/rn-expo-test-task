import { Pressable, StyleSheet, Text } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useBookingStore } from '../store';
import { ScreenLayout } from '../components';
import { theme } from '../theme';
import { messages } from '../constants/messages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Confirmation'>;

export function ConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const reset = useBookingStore((s) => s.reset);

  const handleNewBooking = () => {
    reset();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'ServiceSelection' }] }),
    );
  };

  return (
    <ScreenLayout style={styles.centered}>
      <Text style={styles.title}>{messages.bookingConfirmedTitle}</Text>
      <Text style={styles.subtitle}>{messages.bookingConfirmedMessage}</Text>
      <Pressable style={styles.button} onPress={handleNewBooking}>
        <Text style={styles.buttonText}>{messages.newBooking}</Text>
      </Pressable>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.background,
  },
});
