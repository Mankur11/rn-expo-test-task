import React from 'react';
import { render } from '@testing-library/react-native';
import { ServiceLineItem } from '../../components/ServiceLineItem';
import type { GroupedItem } from '../../utils/basket';

describe('ServiceLineItem', () => {
  it('renders title and price for quantity 1', () => {
    const item: GroupedItem = {
      prestation: { reference: 'a', title: 'Haircut', price: 2990, duration: 30 },
      quantity: 1,
    };
    const { getByText } = render(<ServiceLineItem item={item} />);
    expect(getByText('Haircut')).toBeTruthy();
    expect(getByText(/29,90/)).toBeTruthy();
  });

  it('renders title with quantity suffix for quantity > 1', () => {
    const item: GroupedItem = {
      prestation: { reference: 'a', title: 'Haircut', price: 2990, duration: 30 },
      quantity: 3,
    };
    const { getByText } = render(<ServiceLineItem item={item} />);
    expect(getByText('Haircut ×3')).toBeTruthy();
    expect(getByText(/89,70/)).toBeTruthy();
  });
});
