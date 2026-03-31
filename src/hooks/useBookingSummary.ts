import { useMemo } from 'react';
import { useBookingStore } from '../store';

export function useBookingSummary() {
  const basketItems = useBookingStore((s) => s.basketItems);
  const address = useBookingStore((s) => s.address);
  const appointment = useBookingStore((s) => s.appointment);

  const basketEntries = useMemo(() => Object.values(basketItems), [basketItems]);

  const totalPrice = useMemo(
    () => basketEntries.reduce((sum, item) => sum + item.prestation.price * item.quantity, 0),
    [basketEntries],
  );

  const totalDuration = useMemo(
    () =>
      basketEntries.reduce((sum, item) => sum + item.prestation.duration * item.quantity, 0),
    [basketEntries],
  );

  const basketNotEmpty = basketEntries.length > 0;
  const canProceedToAddress = basketNotEmpty;
  const canProceedToAppointment = basketNotEmpty && address.trim().length > 0;
  const canConfirm = canProceedToAppointment && appointment !== null;

  return {
    totalPrice,
    totalDuration,
    basketNotEmpty,
    basketEntries,
    canProceedToAddress,
    canProceedToAppointment,
    canConfirm,
  };
}
