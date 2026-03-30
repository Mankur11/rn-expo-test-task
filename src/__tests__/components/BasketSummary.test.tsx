import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BasketSummary } from '../../components/BasketSummary';

describe('BasketSummary', () => {
  it('renders formatted price and duration', () => {
    const { getByText } = render(
      <BasketSummary
        totalPrice={5390}
        totalDuration={90}
        canProceed={true}
        onNext={jest.fn()}
      />,
    );
    expect(getByText(/53,90/)).toBeTruthy();
    expect(getByText('1h30')).toBeTruthy();
  });

  it('shows default "Next" button label', () => {
    const { getByText } = render(
      <BasketSummary totalPrice={0} totalDuration={0} canProceed={false} onNext={jest.fn()} />,
    );
    expect(getByText('Next')).toBeTruthy();
  });

  it('shows custom button label', () => {
    const { getByText } = render(
      <BasketSummary
        totalPrice={0}
        totalDuration={0}
        canProceed={true}
        onNext={jest.fn()}
        buttonLabel="Confirm"
      />,
    );
    expect(getByText('Confirm')).toBeTruthy();
  });

  it('calls onNext when pressed and canProceed is true', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <BasketSummary totalPrice={1000} totalDuration={30} canProceed={true} onNext={onNext} />,
    );
    fireEvent.press(getByText('Next'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('disables button when canProceed is false', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <BasketSummary totalPrice={0} totalDuration={0} canProceed={false} onNext={onNext} />,
    );
    fireEvent.press(getByText('Next'));
    expect(onNext).not.toHaveBeenCalled();
  });
});
