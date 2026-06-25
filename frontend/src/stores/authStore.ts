// stores/authStore.ts
import { create } from "zustand";
import { fetchMe } from "../services/user";

export interface User {
  _id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  achievements: string[];
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    set({ loading: true });
    try {
      const user = await fetchMe();
      set({ user });
    } catch (err) {
      console.error("Failed to fetch user:", err);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => set({ user: null }),
}));
