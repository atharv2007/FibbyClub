import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  hinglish_mode: boolean;
}

interface BankAccount {
  _id: string;
  bank_name: string;
  bank_logo?: string;
  account_number: string;
  balance: number;
  last_updated: string;
  status: string;
}

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  merchant: string;
  description?: string;
  transaction_type: 'income' | 'expense';
  date: string;
}

interface Insight {
  _id: string;
  type: 'alert' | 'habit' | 'tip' | 'achievement';
  message: string;
  category?: string;
  is_read: boolean;
}

interface CategoryBreakdown {
  _id: string;
  total: number;
  count: number;
}

interface SpendVelocity {
  current_month: Record<number, number>;
  last_month: Record<number, number>;
  current_total: number;
  last_total: number;
  difference: number;
}

interface AppState {
  user: User | null;
  accounts: BankAccount[];
  transactions: Transaction[];
  insights: Insight[];
  categoryBreakdown: CategoryBreakdown[];
  spendVelocity: SpendVelocity | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  setAccounts: (accounts: BankAccount[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setInsights: (insights: Insight[]) => void;
  setCategoryBreakdown: (breakdown: CategoryBreakdown[]) => void;
  setSpendVelocity: (velocity: SpendVelocity) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  accounts: [],
  transactions: [],
  insights: [],
  categoryBreakdown: [],
  spendVelocity: null,
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  setInsights: (insights) => set({ insights }),
  setCategoryBreakdown: (categoryBreakdown) => set({ categoryBreakdown }),
  setSpendVelocity: (spendVelocity) => set({ spendVelocity }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    user: null,
    accounts: [],
    transactions: [],
    insights: [],
    categoryBreakdown: [],
    spendVelocity: null,
    loading: false,
    error: null,
  }),
}));