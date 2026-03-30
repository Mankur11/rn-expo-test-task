import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ServiceCard } from '../../components/ServiceCard';
import type { Prestation } from '../../api/universe';

const mockService: Prestation = {
  reference: 'cut-1',
  title: 'Haircut',
  price: 2990,
  duration: 45,
};

describe('ServiceCard', () => {
  it('renders service title', () => {
    const { getByText } = render(
      <ServiceCard service={mockService} quantity={0} onAdd={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(getByText('Haircut')).toBeTruthy();
  });

  it('renders formatted price and duration', () => {
    const { getByText } = render(
      <ServiceCard service={mockService} quantity={0} onAdd={jest.fn()} onRemove={jest.fn()} />,
    );
    const details = getByText(/29,90/);
    expect(details).toBeTruthy();
    expect(getByText(/45min/)).toBeTruthy();
  });

  it('shows + button when quantity is 0', () => {
    const { getByText, queryByText } = render(
      <ServiceCard service={mockService} quantity={0} onAdd={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(getByText('+')).toBeTruthy();
    expect(queryByText('−')).toBeNull();
  });

  it('shows − button and quantity when quantity > 0', () => {
    const { getByText } = render(
      <ServiceCard service={mockService} quantity={2} onAdd={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(getByText('+')).toBeTruthy();
    expect(getByText('−')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('calls onAdd when + is pressed', () => {
    const onAdd = jest.fn();
    const { getByText } = render(
      <ServiceCard service={mockService} quantity={0} onAdd={onAdd} onRemove={jest.fn()} />,
    );
    fireEvent.press(getByText('+'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when − is pressed', () => {
    const onRemove = jest.fn();
    const { getByText } = render(
      <ServiceCard service={mockService} quantity={1} onAdd={jest.fn()} onRemove={onRemove} />,
    );
    fireEvent.press(getByText('−'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
