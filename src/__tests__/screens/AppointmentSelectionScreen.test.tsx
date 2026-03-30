import React from 'react';
import { AppointmentSelectionScreen } from '../../screens/AppointmentSelectionScreen';
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

jest.mock('../../api', () => ({
  useUniverse: jest.fn(),
  useCreateBooking: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: () => null,
}));

describe('AppointmentSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.getState().reset();
    useBookingStore.getState().addPrestation({
      reference: 'cut-1',
      title: 'Haircut',
      price: 2990,
      duration: 30,
    });
    useBookingStore.getState().setAddress('123 Main St');
  });

  it('renders the date/time label', () => {
    const { getByText } = renderWithProviders(<AppointmentSelectionScreen />);
    expect(getByText('Choose a date and time')).toBeTruthy();
  });

  it('seeds default appointment on mount', () => {
    renderWithProviders(<AppointmentSelectionScreen />);
    expect(useBookingStore.getState().appointment).not.toBeNull();
  });

  it('renders basket totals in footer', () => {
    const { getByText } = renderWithProviders(<AppointmentSelectionScreen />);
    expect(getByText(/29,90/)).toBeTruthy();
    expect(getByText('30min')).toBeTruthy();
  });
});
