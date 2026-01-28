import Cake1 from '../__mocks__/Cake1.png';
import Cake2 from '../__mocks__/Cake2.png';
import Cake3 from '../__mocks__/Cake3.png';
import Cake4 from '../__mocks__/Cake4.png';
import Cake5 from '../__mocks__/Cake5.png';
import Cake6 from '../__mocks__/Cake6.png';

export type CakeCategory = 'Wedding' | 'Birthday' | 'Anniversary';

export interface CakeOptions {
  shapes: string[];
  flavors: string[];
  decorations: string[];
}

export interface Cake {
  id: string;
  name: string;
  image: any;
  category: CakeCategory;
  basePrice: number;
  customizable: boolean;
  options: CakeOptions;
}

export const cakes: Cake[] = [
  {
    id: 'elegant-wedding-cake',
    name: 'Elegant Wedding Cake',
    image: Cake1,
    category: 'Wedding',
    basePrice: 250,
    customizable: true,
    options: {
      shapes: ['Round', 'Square', 'Heart'],
      flavors: ['Vanilla', 'Chocolate'],
      decorations: ['Edible Glitter', 'Fresh Flowers'],
    },
  },
  {
    id: 'whimsical-birthday-cake',
    name: 'Whimsical Birthday Cake',
    image: Cake2,
    category: 'Birthday',
    basePrice: 150,
    customizable: true,
    options: {
      shapes: ['Round', 'Square'],
      flavors: ['Chocolate', 'Strawberry'],
      decorations: ['Sprinkles', 'Edible Glitter'],
    },
  },
  {
    id: 'anniversary-delight-cake',
    name: 'Anniversary Delight',
    image: Cake3,
    category: 'Anniversary',
    basePrice: 350,
    customizable: true,
    options: {
      shapes: ['Round', 'Heart'],
      flavors: ['Vanilla', 'Chocolate'],
      decorations: ['Fresh Flowers'],
    },
  },
  {
    id: 'special-occasion-cake',
    name: 'Special Occasion Cake',
    image: Cake4,
    category: 'Anniversary',
    basePrice: 450,
    customizable: true,
    options: {
      shapes: ['Square', 'Heart'],
      flavors: ['Chocolate'],
      decorations: ['Sprinkles', 'Fresh Flowers'],
    },
  },
  {
    id: 'classic-wedding-cake',
    name: 'Classic Wedding Cake',
    image: Cake5,
    category: 'Wedding',
    basePrice: 550,
    customizable: true,
    options: {
      shapes: ['Round'],
      flavors: ['Vanilla'],
      decorations: ['Fresh Flowers'],
    },
  },
  {
    id: 'fun-birthday-cake',
    name: 'Fun Birthday Cake',
    image: Cake6,
    category: 'Birthday',
    basePrice: 650,
    customizable: true,
    options: {
      shapes: ['Round', 'Square'],
      flavors: ['Chocolate', 'Strawberry'],
      decorations: ['Sprinkles', 'Edible Glitter'],
    },
  },
];
export const cakeCategories: CakeCategory[] = Array.from(
  new Set(cakes.map((cake) => cake.category))
);