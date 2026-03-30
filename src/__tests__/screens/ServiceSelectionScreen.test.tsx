import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ServiceSelectionScreen } from '../../screens/ServiceSelectionScreen';
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

const mockUniverse = {
  reference: 'hairdresser',
  title: 'Hairdresser',
  categories: [
    {
      reference: 'cat-1',
      title: 'Cuts',
      prestations: [
        { reference: 'cut-1', title: 'Haircut', price: 2990, duration: 30 },
        { reference: 'cut-2', title: 'Color', price: 4990, duration: 60 },
      ],
    },
  ],
};

jest.mock('../../api', () => ({
  useUniverse: jest.fn(),
  useCreateBooking: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

import { useUniverse } from '../../api';
const mockUseUniverse = useUniverse as jest.MockedFunction<typeof useUniverse>;

describe('ServiceSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.getState().reset();
  });

  it('shows loading state', () => {
    mockUseUniverse.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useUniverse>);

    const { getByTestId } = renderWithProviders(<ServiceSelectionScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows error state', () => {
    mockUseUniverse.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('fail'),
    } as ReturnType<typeof useUniverse>);

    const { getByText } = renderWithProviders(<ServiceSelectionScreen />);
    expect(getByText('Failed to load services')).toBeTruthy();
  });

  it('renders categories and prestations', () => {
    mockUseUniverse.mockReturnValue({
      data: mockUniverse,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useUniverse>);

    const { getByText } = renderWithProviders(<ServiceSelectionScreen />);
    expect(getByText('Cuts')).toBeTruthy();
    expect(getByText('Haircut')).toBeTruthy();
    expect(getByText('Color')).toBeTruthy();
  });

  it('adds prestation to basket when + is pressed', () => {
    mockUseUniverse.mockReturnValue({
      data: mockUniverse,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useUniverse>);

    const { getAllByText } = renderWithProviders(<ServiceSelectionScreen />);
    const addButtons = getAllByText('+');
    fireEvent.press(addButtons[0]);

    expect(useBookingStore.getState().basket).toHaveLength(1);
    expect(useBookingStore.getState().basket[0].reference).toBe('cut-1');
  });

  it('navigates to AddressSelection when Next is pressed with items', () => {
    mockUseUniverse.mockReturnValue({
      data: mockUniverse,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useUniverse>);

    useBookingStore.getState().addPrestation(mockUniverse.categories[0].prestations[0]);

    const { getByText } = renderWithProviders(<ServiceSelectionScreen />);
    fireEvent.press(getByText('Next'));
    expect(mockNavigate).toHaveBeenCalledWith('AddressSelection');
  });
});
