import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  name: string;
  email: string;
};

type UserStore = {
  user: User | null; // Use null for initial empty state
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set((state) => ({ ...state, user })),
    }),
    {
      name: "user-storage",
    }
  )
);
