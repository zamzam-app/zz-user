import { Flavor, Decoration } from './types';

export const FLAVORS: Flavor[] = [
  { name: 'Vanilla Cream', color: '#f9f5e7' },
  { name: 'Rich Chocolate', color: '#4b2c20' },
  { name: 'Fresh Strawberry', color: '#ffb7b7' },
  { name: 'Red Velvet', color: '#a70000' },
  { name: 'Lemon Zest', color: '#ffeb3b' },
  { name: 'Salted Caramel', color: '#e3c08d' },
];

export const DECORATIONS_LIST: Decoration[] = [
  { id: 'roses', name: 'Sugar Roses', price: 30 },
  { id: 'pearls', name: 'Edible Pearls', price: 15 },
  { id: 'gold', name: 'Gold Leaf', price: 45 },
  { id: 'berries', name: 'Fresh Berries', price: 20 },
  { id: 'macarons', name: 'Mini Macarons', price: 35 },
  { id: 'drip', name: 'Chocolate Drip', price: 25 },
];
