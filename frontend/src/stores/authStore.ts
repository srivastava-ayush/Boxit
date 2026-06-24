// stores/authStore.ts
import { create } from "zustand";
import { fetchMe, addXp, incrementStreak, resetStreak } from "../services/user";

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
  addXp: (amount: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
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

  addXp: async (amount: number) => {
    const { user } = get();
    if (!user) return;

    // optimistic update
    set({ user: { ...user, xp: user.xp + amount } });

    try {
      await addXp(amount); 
    } catch (err) {
      console.error("Failed to update XP:", err);
      // rollback if needed (fetch fresh user)
      await get().fetchUser();
    }
  },

  incrementStreak: async () => {
    const { user } = get();
    if (!user) return;

    set({ user: { ...user, streak: user.streak + 1 } });

    try {
      await incrementStreak(); 
    } catch (err) {
      console.error("Failed to update streak:", err);
      await get().fetchUser();
    }
  },

  resetStreak: async () => {
    const { user } = get();
    if (!user) return;

    set({ user: { ...user, streak: 0 } });

    try {
      await resetStreak();
    } catch (err) {
      console.error("Failed to reset streak:", err);
      await get().fetchUser();
    }
  },

  logout: () => set({ user: null }),
}));
