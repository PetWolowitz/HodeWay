import { create } from 'zustand';
import { User } from '../types';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../lib/validation';
import { hashPassword, verifyPassword, checkRateLimit, SecurityError } from '../lib/security';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

// Mock user storage
const mockUsers = new Map<string, { id: string; email: string; fullName: string; passwordHash: string }>();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (input) => {
    try {
      set({ loading: true, error: null });

      // Validate input
      const validated = loginSchema.parse(input);
      
      // Check rate limiting
      checkRateLimit(validated.email);

      // Mock authentication
      const user = mockUsers.get(validated.email);
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

      // Validate input
      const validated = registerSchema.parse(input);

      // Check if email already exists
      if (mockUsers.has(validated.email)) {
        throw new SecurityError('Email already in use');
      }

      // Hash password
      const passwordHash = await hashPassword(validated.password);

      // Create new user
      const id = crypto.randomUUID();
      mockUsers.set(validated.email, {
        id,
        email: validated.email,
        fullName: validated.fullName,
        passwordHash
      });

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
  signOut: async () => {
    set({ user: null, error: null });
  },
  setUser: (user) => set({ user }),
  clearError: () => set({ error: null })
}));