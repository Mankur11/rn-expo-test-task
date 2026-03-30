import type { Prestation } from '../api/universe';

export interface GroupedItem {
  prestation: Prestation;
  quantity: number;
}

export function groupBasketItems(basket: Prestation[]): GroupedItem[] {
  const map = new Map<string, GroupedItem>();
  for (const p of basket) {
    const existing = map.get(p.reference);
    if (existing) {
      existing.quantity += 1;
    } else {
      map.set(p.reference, { prestation: p, quantity: 1 });
    }
  }
  return Array.from(map.values());
}
