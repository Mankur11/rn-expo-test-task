import React from 'react';
import { render } from '@testing-library/react-native';
import { BookingDetailRow } from '../../components/BookingDetailRow';

describe('BookingDetailRow', () => {
  it('renders label and value', () => {
    const { getByText } = render(
      <BookingDetailRow label="Address" value="123 Main St" />,
    );
    expect(getByText('Address')).toBeTruthy();
    expect(getByText('123 Main St')).toBeTruthy();
  });
});
