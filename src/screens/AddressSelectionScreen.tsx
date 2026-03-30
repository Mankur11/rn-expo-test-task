import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useBookingStore } from '../store';
import { ScreenLayout, BasketSummary } from '../components';
import { theme } from '../theme';
import { messages } from '../constants/messages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddressSelection'>;

export function AddressSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();

  const basket = useBookingStore((s) => s.basket);
  const address = useBookingStore((s) => s.address);
  const setAddress = useBookingStore((s) => s.setAddress);
  const totalPrice = useBookingStore((s) => s.totalPrice);
  const totalDuration = useBookingStore((s) => s.totalDuration);
  const canProceed = useBookingStore((s) => s.canProceedToAppointment);

  const trimmed = address.trim();
  const showError = address.length > 0 && trimmed.length === 0;

  return (
    <ScreenLayout
      footer={
        <BasketSummary
          totalPrice={totalPrice()}
          totalDuration={totalDuration()}
          canProceed={canProceed()}
          onNext={() => navigation.navigate('AppointmentSelection')}
        />
      }
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
          <Text style={styles.label}>{messages.deliveryAddress}</Text>
          <TextInput
            style={[styles.input, showError && styles.inputError]}
            value={address}
            onChangeText={setAddress}
            placeholder={messages.addressPlaceholder}
            placeholderTextColor={theme.colors.textSecondary}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => {
              if (canProceed()) navigation.navigate('AppointmentSelection');
            }}
          />
          {showError && (
            <Text style={styles.errorText}>{messages.addressRequired}</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
