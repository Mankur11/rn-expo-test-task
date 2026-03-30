import { groupBasketItems } from '../../utils/basket';
import type { Prestation } from '../../api/universe';

const mockPrestation = (ref: string, price = 1000, duration = 30): Prestation => ({
  reference: ref,
  title: `Service ${ref}`,
  price,
  duration,
});

describe('groupBasketItems', () => {
  it('returns empty array for empty basket', () => {
    expect(groupBasketItems([])).toEqual([]);
  });

  it('groups single item with quantity 1', () => {
    const basket = [mockPrestation('a')];
    const result = groupBasketItems(basket);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
    expect(result[0].prestation.reference).toBe('a');
  });

  it('groups duplicate items by reference', () => {
    const basket = [mockPrestation('a'), mockPrestation('a'), mockPrestation('b')];
    const result = groupBasketItems(basket);
    expect(result).toHaveLength(2);

    const itemA = result.find((r) => r.prestation.reference === 'a');
    const itemB = result.find((r) => r.prestation.reference === 'b');
    expect(itemA?.quantity).toBe(2);
    expect(itemB?.quantity).toBe(1);
  });

  it('preserves prestation data', () => {
    const basket = [mockPrestation('x', 2990, 45)];
    const result = groupBasketItems(basket);
    expect(result[0].prestation.price).toBe(2990);
    expect(result[0].prestation.duration).toBe(45);
    expect(result[0].prestation.title).toBe('Service x');
  });
});
