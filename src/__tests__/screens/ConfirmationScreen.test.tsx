import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ConfirmationScreen } from '../../screens/ConfirmationScreen';
import { useBookingStore } from '../../store/booking-store';
import { renderWithProviders } from '../helpers/test-utils';

const mockDispatch = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ dispatch: mockDispatch }),
    CommonActions: actual.CommonActions,
  };
});

describe('ConfirmationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.getState().reset();
    useBookingStore.getState().addPrestation({
      reference: 'cut-1',
      title: 'Haircut',
      price: 2990,
      duration: 30,
    });
    useBookingStore.getState().addPrestation({
      reference: 'cut-1',
      title: 'Haircut',
      price: 2990,
      duration: 30,
    });
    useBookingStore.getState().setAddress('123 Main St');
    useBookingStore.getState().setAppointment('2026-04-01T10:00:00.000Z');
  });

  it('renders confirmation title', () => {
    const { getByText } = renderWithProviders(<ConfirmationScreen />);
    expect(getByText('Booking Confirmed!')).toBeTruthy();
  });

  it('renders grouped basket items with quantity', () => {
    const { getByText } = renderWithProviders(<ConfirmationScreen />);
    expect(getByText('Haircut ×2')).toBeTruthy();
  });

  it('renders address', () => {
    const { getByText } = renderWithProviders(<ConfirmationScreen />);
    expect(getByText('123 Main St')).toBeTruthy();
  });

  it('renders formatted appointment', () => {
    const { getByText } = renderWithProviders(<ConfirmationScreen />);
    expect(getByText(/01\/04\/2026/)).toBeTruthy();
  });

  it('renders total price', () => {
    const { getAllByText } = renderWithProviders(<ConfirmationScreen />);
    expect(getAllByText(/59,80/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders total duration', () => {
    const { getByText } = renderWithProviders(<ConfirmationScreen />);
    expect(getByText('1h')).toBeTruthy();
  });

  it('resets store and navigation on New Booking press', () => {
    const { getByText } = renderWithProviders(<ConfirmationScreen />);
    fireEvent.press(getByText('New Booking'));

    expect(useBookingStore.getState().basketItems).toEqual({});
    expect(useBookingStore.getState().address).toBe('');
    expect(useBookingStore.getState().appointment).toBeNull();
    expect(mockDispatch).toHaveBeenCalled();
  });
});
