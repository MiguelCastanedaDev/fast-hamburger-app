export type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export const MENU_ITEMS = [
  {
    id: 1,
    name: 'Cheeseburger',
    description: 'A delicious cheeseburger with all the fixings.',
    price: 89.9,
    image: 'https://example.com/images/cheeseburger.jpg',
  },
  {
    id: 2,
    name: 'Veggie Burger',
    description: 'A tasty veggie burger made with fresh vegetables.',
    price: 79.9,
    image: 'https://example.com/images/veggie-burger.jpg',
  },
  {
    id: 3,
    name: 'Chicken Sandwich',
    description: 'A crispy chicken sandwich with lettuce and tomato.',
    price: 94.9,
    image: 'https://example.com/images/chicken-sandwich.jpg',
  },
  {
    id: 4,
    name: 'French Fries',
    description: 'Crispy golden french fries, perfect as a side.',
    price: 34.9,
    image: 'https://example.com/images/french-fries.jpg',
  },
  {
    id: 5,
    name: 'Onion Rings',
    description: 'Crispy onion rings, a great appetizer or side dish.',
    price: 44.9,
    image: 'https://example.com/images/onion-rings.jpg',
  },
] satisfies MenuItem[]
