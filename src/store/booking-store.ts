import { create } from 'zustand';
import type { Prestation } from '../api/universe';

interface BookingState {
  basket: Prestation[];
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
}

const initialState = {
  basket: [] as Prestation[],
  address: '',
  appointment: null as string | null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  addPrestation: (prestation) =>
    set((state) => ({ basket: [...state.basket, prestation] })),

  removePrestation: (reference) =>
    set((state) => {
      const index = state.basket.findIndex((p) => p.reference === reference);
      if (index === -1) return state;
      const basket = [...state.basket];
      basket.splice(index, 1);
      return { basket };
    }),

  setAddress: (address) => set({ address }),

  setAppointment: (appointment) => set({ appointment }),

  reset: () => set(initialState),

  totalPrice: () => get().basket.reduce((sum, p) => sum + p.price, 0),

  totalDuration: () => get().basket.reduce((sum, p) => sum + p.duration, 0),

  basketNotEmpty: () => get().basket.length > 0,

  canProceedToAddress: () => get().basket.length > 0,

  canProceedToAppointment: () =>
    get().basket.length > 0 && get().address.trim().length > 0,

  canConfirm: () =>
    get().basket.length > 0 &&
    get().address.trim().length > 0 &&
    get().appointment !== null,

  getQuantity: (reference) =>
    get().basket.filter((p) => p.reference === reference).length,
}));
