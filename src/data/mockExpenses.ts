import { ExpenseItem, MonthlyBudget } from '../types/expense';

export const DEFAULT_BUDGET: MonthlyBudget = {
  month: '2026-10',
  monthlyIncome: 2200,
  currency: 'USD',
  savingsGoal: 400,
};

export const INITIAL_EXPENSES: ExpenseItem[] = [
  // 🏢 Fixed Bills
  {
    id: 'exp-1',
    title: 'Apartment Rent',
    amount: 650,
    category: 'fixed',
    dueDate: 5,
    isPaid: true,
    notes: 'Monthly apartment leasing transfer',
    iconName: 'home-outline',
    color: '#3B82F6', // Blue
    createdAt: '2026-10-01',
  },
  {
    id: 'exp-2',
    title: 'Electricity (Luz)',
    amount: 48,
    category: 'fixed',
    dueDate: 12,
    isPaid: true,
    notes: 'Monthly power grid consumption',
    iconName: 'flash-outline',
    color: '#F59E0B', // Amber
    createdAt: '2026-10-02',
  },
  {
    id: 'exp-3',
    title: 'High-Speed Fiber Internet',
    amount: 55,
    category: 'fixed',
    dueDate: 15,
    isPaid: true,
    notes: '500 Mbps symmetrical fiber connection',
    iconName: 'wifi-outline',
    color: '#06B6D4', // Cyan
    createdAt: '2026-10-02',
  },
  {
    id: 'exp-4',
    title: 'Water Service (Agua)',
    amount: 22,
    category: 'fixed',
    dueDate: 18,
    isPaid: false,
    notes: 'Municipal running water supply',
    iconName: 'water-outline',
    color: '#0284C7', // Sky
    createdAt: '2026-10-03',
  },
  {
    id: 'exp-5',
    title: 'Natural Gas',
    amount: 28,
    category: 'fixed',
    dueDate: 22,
    isPaid: false,
    notes: 'Winter heating and stove supply',
    iconName: 'flame-outline',
    color: '#EF4444', // Red
    createdAt: '2026-10-04',
  },
  {
    id: 'exp-6',
    title: 'Unlimited Mobile Plan',
    amount: 32,
    category: 'fixed',
    dueDate: 25,
    isPaid: false,
    notes: '5G mobile data and roaming',
    iconName: 'phone-portrait-outline',
    color: '#8B5CF6', // Purple
    createdAt: '2026-10-05',
  },

  // 📺 Subscriptions
  {
    id: 'exp-7',
    title: 'Netflix 4K Premium',
    amount: 18,
    category: 'subscription',
    dueDate: 8,
    isPaid: true,
    notes: 'Streaming plan for 4 screens',
    iconName: 'film-outline',
    color: '#E50914', // Netflix Red
    createdAt: '2026-10-01',
  },
  {
    id: 'exp-8',
    title: 'Spotify Family Plan',
    amount: 14,
    category: 'subscription',
    dueDate: 14,
    isPaid: true,
    notes: 'Ad-free high-fidelity music',
    iconName: 'musical-notes-outline',
    color: '#1DB954', // Spotify Green
    createdAt: '2026-10-01',
  },
  {
    id: 'exp-9',
    title: 'Gym & Crossfit Pass',
    amount: 50,
    category: 'subscription',
    dueDate: 10,
    isPaid: true,
    notes: 'Full access + locker room',
    iconName: 'barbell-outline',
    color: '#10B981', // Emerald
    createdAt: '2026-10-01',
  },
  {
    id: 'exp-10',
    title: 'Cloud Storage 2TB',
    amount: 10,
    category: 'subscription',
    dueDate: 20,
    isPaid: false,
    notes: 'Automated photo & device backups',
    iconName: 'cloud-outline',
    color: '#6366F1', // Indigo
    createdAt: '2026-10-02',
  },

  // 🍕 Leisure & Outings
  {
    id: 'exp-11',
    title: 'Steakhouse Dinner with Friends',
    amount: 68,
    category: 'leisure',
    dueDate: 7,
    isPaid: true,
    notes: 'Friday celebration outing',
    iconName: 'restaurant-outline',
    color: '#F43F5E', // Rose
    createdAt: '2026-10-07',
  },
  {
    id: 'exp-12',
    title: 'Craft Beer Bar Night',
    amount: 36,
    category: 'leisure',
    dueDate: 14,
    isPaid: true,
    notes: 'Saturday night gathering',
    iconName: 'beer-outline',
    color: '#D97706', // Amber
    createdAt: '2026-10-14',
  },
  {
    id: 'exp-13',
    title: 'Cinema IMAX & Popcorn',
    amount: 25,
    category: 'leisure',
    dueDate: 21,
    isPaid: false,
    notes: 'New sci-fi premiere tickets',
    iconName: 'ticket-outline',
    color: '#A855F7', // Purple
    createdAt: '2026-10-19',
  },
  {
    id: 'exp-14',
    title: 'Weekend Coffee & Brunch',
    amount: 22,
    category: 'leisure',
    dueDate: 28,
    isPaid: false,
    notes: 'Sunday morning artisan bakery',
    iconName: 'cafe-outline',
    color: '#78350F', // Warm brown
    createdAt: '2026-10-19',
  },
];
