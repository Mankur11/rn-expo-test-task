import { StyleSheet, Text, TextInput } from 'react-native';
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

  const address = useBookingStore((s) => s.address);
  const setAddress = useBookingStore((s) => s.setAddress);
  const totalPrice = useBookingStore((s) => s.totalPrice);
  const totalDuration = useBookingStore((s) => s.totalDuration);
  const canProceed = useBookingStore((s) => s.canProceedToAppointment);

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
      <Text style={styles.label}>{messages.deliveryAddress}</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder={messages.addressPlaceholder}
        placeholderTextColor={theme.colors.textSecondary}
        autoFocus
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
  input: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
