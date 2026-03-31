import { useBookingStore } from '../../store/booking-store';
import type { Prestation } from '../../api/universe';

const mockPrestation = (ref: string, price = 1000, duration = 30): Prestation => ({
  reference: ref,
  title: `Service ${ref}`,
  price,
  duration,
});

describe('booking-store', () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
  });

  describe('initial state', () => {
    it('starts with empty basketItems', () => {
      expect(useBookingStore.getState().basketItems).toEqual({});
    });

    it('starts with empty address', () => {
      expect(useBookingStore.getState().address).toBe('');
    });

    it('starts with null appointment', () => {
      expect(useBookingStore.getState().appointment).toBeNull();
    });
  });

  describe('addPrestation', () => {
    it('adds a prestation to the basket with quantity 1', () => {
      const p = mockPrestation('a');
      useBookingStore.getState().addPrestation(p);
      const items = useBookingStore.getState().basketItems;
      expect(Object.keys(items)).toHaveLength(1);
      expect(items['a'].prestation.reference).toBe('a');
      expect(items['a'].quantity).toBe(1);
    });

    it('increments quantity for duplicate prestations', () => {
      const p = mockPrestation('a');
      useBookingStore.getState().addPrestation(p);
      useBookingStore.getState().addPrestation(p);
      expect(useBookingStore.getState().basketItems['a'].quantity).toBe(2);
    });
  });

  describe('removePrestation', () => {
    it('decrements quantity of a prestation', () => {
      const p = mockPrestation('a');
      useBookingStore.getState().addPrestation(p);
      useBookingStore.getState().addPrestation(p);
      useBookingStore.getState().removePrestation('a');
      expect(useBookingStore.getState().basketItems['a'].quantity).toBe(1);
    });

    it('removes entry when quantity reaches zero', () => {
      const p = mockPrestation('a');
      useBookingStore.getState().addPrestation(p);
      useBookingStore.getState().removePrestation('a');
      expect(useBookingStore.getState().basketItems['a']).toBeUndefined();
    });

    it('does nothing if reference not found', () => {
      const p = mockPrestation('a');
      useBookingStore.getState().addPrestation(p);
      useBookingStore.getState().removePrestation('z');
      expect(Object.keys(useBookingStore.getState().basketItems)).toHaveLength(1);
    });
  });

  describe('setAddress', () => {
    it('updates address', () => {
      useBookingStore.getState().setAddress('123 Main St');
      expect(useBookingStore.getState().address).toBe('123 Main St');
    });
  });

  describe('setAppointment', () => {
    it('updates appointment', () => {
      const iso = '2026-04-01T10:00:00.000Z';
      useBookingStore.getState().setAppointment(iso);
      expect(useBookingStore.getState().appointment).toBe(iso);
    });
  });

  describe('derived selectors', () => {
    it('totalPrice sums basket prices with quantity', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a', 2000));
      useBookingStore.getState().addPrestation(mockPrestation('a', 2000));
      useBookingStore.getState().addPrestation(mockPrestation('b', 3000));
      expect(useBookingStore.getState().totalPrice()).toBe(7000);
    });

    it('totalDuration sums basket durations with quantity', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a', 1000, 30));
      useBookingStore.getState().addPrestation(mockPrestation('a', 1000, 30));
      useBookingStore.getState().addPrestation(mockPrestation('b', 1000, 60));
      expect(useBookingStore.getState().totalDuration()).toBe(120);
    });

    it('basketNotEmpty returns false for empty basket', () => {
      expect(useBookingStore.getState().basketNotEmpty()).toBe(false);
    });

    it('basketNotEmpty returns true when items exist', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      expect(useBookingStore.getState().basketNotEmpty()).toBe(true);
    });

    it('getQuantity returns quantity for a reference', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().addPrestation(mockPrestation('b'));
      expect(useBookingStore.getState().getQuantity('a')).toBe(2);
      expect(useBookingStore.getState().getQuantity('b')).toBe(1);
      expect(useBookingStore.getState().getQuantity('z')).toBe(0);
    });

    it('getBasketEntries returns array of BasketItems', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().addPrestation(mockPrestation('b'));
      const entries = useBookingStore.getState().getBasketEntries();
      expect(entries).toHaveLength(2);
      expect(entries.find((e) => e.prestation.reference === 'a')?.quantity).toBe(2);
      expect(entries.find((e) => e.prestation.reference === 'b')?.quantity).toBe(1);
    });

    it('getPrestationReferences returns flat array with duplicates for quantity', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().addPrestation(mockPrestation('b'));
      const refs = useBookingStore.getState().getPrestationReferences();
      expect(refs).toHaveLength(3);
      expect(refs.filter((r) => r === 'a')).toHaveLength(2);
      expect(refs.filter((r) => r === 'b')).toHaveLength(1);
    });
  });

  describe('gate checks', () => {
    it('canProceedToAddress requires non-empty basket', () => {
      expect(useBookingStore.getState().canProceedToAddress()).toBe(false);
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      expect(useBookingStore.getState().canProceedToAddress()).toBe(true);
    });

    it('canProceedToAppointment requires basket + address', () => {
      expect(useBookingStore.getState().canProceedToAppointment()).toBe(false);
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      expect(useBookingStore.getState().canProceedToAppointment()).toBe(false);
      useBookingStore.getState().setAddress('123 Main');
      expect(useBookingStore.getState().canProceedToAppointment()).toBe(true);
    });

    it('canProceedToAppointment rejects whitespace-only address', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().setAddress('   ');
      expect(useBookingStore.getState().canProceedToAppointment()).toBe(false);
    });

    it('canConfirm requires basket + address + appointment', () => {
      expect(useBookingStore.getState().canConfirm()).toBe(false);
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().setAddress('123 Main');
      expect(useBookingStore.getState().canConfirm()).toBe(false);
      useBookingStore.getState().setAppointment('2026-04-01T10:00:00.000Z');
      expect(useBookingStore.getState().canConfirm()).toBe(true);
    });
  });

  describe('reset', () => {
    it('restores initial state', () => {
      useBookingStore.getState().addPrestation(mockPrestation('a'));
      useBookingStore.getState().setAddress('123 Main');
      useBookingStore.getState().setAppointment('2026-04-01T10:00:00.000Z');
      useBookingStore.getState().reset();

      const state = useBookingStore.getState();
      expect(state.basketItems).toEqual({});
      expect(state.address).toBe('');
      expect(state.appointment).toBeNull();
    });
  });
});
