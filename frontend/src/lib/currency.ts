import { create } from 'zustand';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyState {
  rates: ExchangeRates;
  loading: boolean;
  error: string | null;
  fetchRates: () => Promise<void>;
  convertAmount: (amount: number, from: string, to: string) => number;
}

// We'll use the European Central Bank's free API
const API_URL = 'https://api.exchangerate.host/latest?base=EUR';

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  rates: {},
  loading: false,
  error: null,
  fetchRates: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(API_URL);
      const data = await response.json();
      set({ rates: data.rates, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch exchange rates', loading: false });
    }
  },
  convertAmount: (amount: number, from: string, to: string) => {
    const { rates } = get();
    if (!rates[from] || !rates[to]) return amount;
    return (amount / rates[from]) * rates[to];
  },
}));