import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { AddressSelectionScreen } from '../../screens/AddressSelectionScreen';
import { useBookingStore } from '../../store/booking-store';
import { renderWithProviders } from '../helpers/test-utils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate }),
  };
});

describe('AddressSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.getState().reset();
    useBookingStore.getState().addPrestation({
      reference: 'cut-1',
      title: 'Haircut',
      price: 2990,
      duration: 30,
    });
  });

  it('renders address input', () => {
    const { getByPlaceholderText } = renderWithProviders(<AddressSelectionScreen />);
    expect(getByPlaceholderText('Enter your address')).toBeTruthy();
  });

  it('updates store when typing', () => {
    const { getByPlaceholderText } = renderWithProviders(<AddressSelectionScreen />);
    fireEvent.changeText(getByPlaceholderText('Enter your address'), '123 Main St');
    expect(useBookingStore.getState().address).toBe('123 Main St');
  });

  it('shows error for whitespace-only input', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <AddressSelectionScreen />,
    );
    fireEvent.changeText(getByPlaceholderText('Enter your address'), '   ');
    expect(getByText('Address cannot be empty')).toBeTruthy();
  });

  it('does not show error for valid input', () => {
    const { getByPlaceholderText, queryByText } = renderWithProviders(
      <AddressSelectionScreen />,
    );
    fireEvent.changeText(getByPlaceholderText('Enter your address'), '123 Main');
    expect(queryByText('Address cannot be empty')).toBeNull();
  });

  it('navigates when Next pressed with valid address', () => {
    useBookingStore.getState().setAddress('123 Main St');
    const { getByText } = renderWithProviders(<AddressSelectionScreen />);
    fireEvent.press(getByText('Next'));
    expect(mockNavigate).toHaveBeenCalledWith('AppointmentSelection');
  });

  it('does not navigate when address is empty', () => {
    const { getByText } = renderWithProviders(<AddressSelectionScreen />);
    fireEvent.press(getByText('Next'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
