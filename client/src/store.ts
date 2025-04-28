import { create } from "zustand";

type User = {
  name: string;
  userId: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => void;
  loading: boolean;
  error: string;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  loading: true,
  error: "",
  setUser: (user) => set((state) => ({ ...state, user })),
  fetchUser: async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/user`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const user = await response.json();
        set((state) => ({ ...state, user }));
      } else {
        set((state) => ({ ...state, user: null }));
      }
    } catch (error) {
      set((state) => ({
        ...state,
        user: null,
        error:
          error instanceof Error ? error.message : "Error while fetching user",
      }));
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },
}));
