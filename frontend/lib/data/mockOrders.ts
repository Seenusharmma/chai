import { Order } from '../types';

export const mockLiveOrders = [
  {
    id: 'ORD-4281',
    customerName: 'Alex Rivera',
    customerPhone: '+1 (555) 012-3456',
    items: [
      { id: '1', name: 'Iced Oatmilk Latte', quantity: 2, price: 12.50 },
      { id: '2', name: 'Avocado Sourdough', quantity: 1, price: 14.00 }
    ],
    note: "Extra honey on the side please",
    total: 39.00,
    status: 'pending',
    type: 'dine-in',
    timeAgo: '2 mins ago'
  },
  {
    id: 'ORD-4282',
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 987-6543',
    items: [
      { id: '3', name: 'Caramel Macchiato', quantity: 1, price: 5.75 }
    ],
    total: 5.75,
    status: 'pending',
    type: 'parcel',
    timeAgo: '5 mins ago'
  },
  {
    id: 'ORD-4283',
    customerName: 'Michael Chen',
    customerPhone: '+1 (555) 234-5678',
    items: [
      { id: '4', name: 'Flat White (Large)', quantity: 3, price: 18.00 }
    ],
    total: 54.00,
    status: 'pending',
    type: 'dine-in',
    timeAgo: '8 mins ago'
  }
];
