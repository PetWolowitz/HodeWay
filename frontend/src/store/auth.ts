import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../lib/validation';
import { hashPassword, verifyPassword, checkRateLimit, SecurityError } from '../lib/security';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => void; // Rimosso Promise<void> perché è una funzione sincrona
  setUser: (user: User | null) => void;
  clearError: () => void;
}

const MOCK_USERS_KEY = 'mock_users';

// Recupera gli utenti mock dal localStorage
const getMockUsers = (): Map<string, { id: string; email: string; fullName: string; passwordHash: string }> => {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    const users = JSON.parse(stored);
    return new Map(Object.entries(users));
  }
  return new Map();
};

// Salva gli utenti mock nel localStorage
const saveMockUsers = (users: Map<string, any>) => {
  const obj = Object.fromEntries(users);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(obj));
};

const mockUsers = getMockUsers();

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      signIn: async (input) => {
        try {
          set({ loading: true, error: null });
          const validated = loginSchema.parse(input);
          checkRateLimit(validated.email);
          
          const users = getMockUsers();
          const user = users.get(validated.email);
          
          if (!user) {
            throw new SecurityError('Invalid email or password');
          }

          const isValid = await verifyPassword(validated.password, user.passwordHash);
          if (!isValid) {
            throw new SecurityError('Invalid email or password'); 
          }

          set({
            user: {
              id: user.id,
              email: user.email,
              full_name: user.fullName
            }
          });

        } catch (error) {
          if (error instanceof SecurityError) {
            set({ error: error.message });
          } else {
            set({ error: 'An unexpected error occurred' });
          }
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (input) => {
        try {
          set({ loading: true, error: null });
          const validated = registerSchema.parse(input);
          
          const users = getMockUsers();
          if (users.has(validated.email)) {
            throw new SecurityError('Email already in use');
          }

          const passwordHash = await hashPassword(validated.password);
          const id = crypto.randomUUID();
          
          users.set(validated.email, {
            id,
            email: validated.email,
            fullName: validated.fullName,
            passwordHash
          });
          
          saveMockUsers(users);

          set({
            user: {
              id,
              email: validated.email,
              full_name: validated.fullName
            }
          });

        } catch (error) {
          if (error instanceof SecurityError) {
            set({ error: error.message });
          } else {
            set({ error: 'An unexpected error occurred' });
          }
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: () => {
        set({ user: null, error: null });
      },

      setUser: (user) => set({ user }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage'
    }
  )
);