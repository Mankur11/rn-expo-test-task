import { create } from 'zustand';
import type { Prestation } from '../api/universe';

export interface BasketItem {
  prestation: Prestation;
  quantity: number;
}

interface BookingState {
  basketItems: Record<string, BasketItem>;
  address: string;
  appointment: string | null;

  addPrestation: (prestation: Prestation) => void;
  removePrestation: (reference: string) => void;
  setAddress: (address: string) => void;
  setAppointment: (appointment: string) => void;
  reset: () => void;

  totalPrice: () => number;
  totalDuration: () => number;
  basketNotEmpty: () => boolean;
  canProceedToAddress: () => boolean;
  canProceedToAppointment: () => boolean;
  canConfirm: () => boolean;
  getQuantity: (reference: string) => number;
  getBasketEntries: () => BasketItem[];
  getPrestationReferences: () => string[];
}

const initialState = {
  basketItems: {} as Record<string, BasketItem>,
  address: '',
  appointment: null as string | null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  addPrestation: (prestation) =>
    set((state) => {
      const existing = state.basketItems[prestation.reference];
      return {
        basketItems: {
          ...state.basketItems,
          [prestation.reference]: {
            prestation,
            quantity: existing ? existing.quantity + 1 : 1,
          },
        },
      };
    }),

  removePrestation: (reference) =>
    set((state) => {
      const existing = state.basketItems[reference];
      if (!existing) return state;

      if (existing.quantity <= 1) {
        const { [reference]: _, ...rest } = state.basketItems;
        return { basketItems: rest };
      }

      return {
        basketItems: {
          ...state.basketItems,
          [reference]: { ...existing, quantity: existing.quantity - 1 },
        },
      };
    }),

  setAddress: (address) => set({ address }),

  setAppointment: (appointment) => set({ appointment }),

  reset: () => set(initialState),

  totalPrice: () => {
    const items = Object.values(get().basketItems);
    return items.reduce((sum, item) => sum + item.prestation.price * item.quantity, 0);
  },

  totalDuration: () => {
    const items = Object.values(get().basketItems);
    return items.reduce((sum, item) => sum + item.prestation.duration * item.quantity, 0);
  },

  basketNotEmpty: () => Object.keys(get().basketItems).length > 0,

  canProceedToAddress: () => Object.keys(get().basketItems).length > 0,

  canProceedToAppointment: () =>
    Object.keys(get().basketItems).length > 0 && get().address.trim().length > 0,

  canConfirm: () =>
    Object.keys(get().basketItems).length > 0 &&
    get().address.trim().length > 0 &&
    get().appointment !== null,

  getQuantity: (reference) => get().basketItems[reference]?.quantity ?? 0,

  getBasketEntries: () => Object.values(get().basketItems),

  getPrestationReferences: () =>
    Object.values(get().basketItems).flatMap((item) =>
      Array.from({ length: item.quantity }, () => item.prestation.reference),
    ),
}));
