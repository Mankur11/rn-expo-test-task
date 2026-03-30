import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useBookingStore } from '../store';
import {
  ScreenLayout,
  ConfirmationHeader,
  ServiceLineItem,
  BookingDetailRow,
} from '../components';
import { formatPrice, formatDuration, groupBasketItems } from '../utils';
import { theme } from '../theme';
import { messages } from '../constants/messages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Confirmation'>;

export function ConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();

  const basket = useBookingStore((s) => s.basket);
  const address = useBookingStore((s) => s.address);
  const appointment = useBookingStore((s) => s.appointment);
  const reset = useBookingStore((s) => s.reset);

  const groupedItems = useMemo(() => groupBasketItems(basket), [basket]);
  const formattedAppointment = useMemo(
    () => (appointment ? format(new Date(appointment), 'dd/MM/yyyy HH:mm') : ''),
    [appointment],
  );
  const formattedDuration = formatDuration(basket.reduce((sum, p) => sum + p.duration, 0));
  const formattedPrice = formatPrice(basket.reduce((sum, p) => sum + p.price, 0));

  const handleNewBooking = () => {
    reset();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'ServiceSelection' }] }),
    );
  };

  return (
    <ScreenLayout edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <ConfirmationHeader />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{messages.summaryServices}</Text>
          {groupedItems.map((item) => (
            <ServiceLineItem key={item.prestation.reference} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{messages.summaryDetails}</Text>
          <BookingDetailRow label={messages.deliveryAddress} value={address} />
          {formattedAppointment !== '' && (
            <BookingDetailRow
              label={messages.summaryAppointment}
              value={formattedAppointment}
            />
          )}
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{messages.summaryDuration}</Text>
            <Text style={styles.totalValue}>{formattedDuration}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{messages.summaryTotal}</Text>
            <Text style={styles.totalPrice}>{formattedPrice}</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleNewBooking}>
          <Text style={styles.buttonText}>{messages.newBooking}</Text>
        </Pressable>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  totalsSection: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  totalLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  totalPrice: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  button: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.background,
  },
});
