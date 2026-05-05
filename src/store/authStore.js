import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      rememberMe: false,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setRememberMe: (rememberMe) => set({ rememberMe }),

      initializeAuth: () => {
        set({ loading: true });
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            set({ user, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        });
        return unsubscribe;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    }
  )
);

export default useAuthStore;
