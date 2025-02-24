import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LoginUser {
  userSerial: number;
  email: string;
  role: 'customer' | 'worker' | '';
  userName: string;
}

interface useLoginUserStore {
  loginUser: LoginUser | null;
  isLogin: boolean;
  setLoginUser: (loginUser: LoginUser | null) => void;
  setIsLogin: (isLogin: boolean) => void;
}

export const useLoginUserStore = create<useLoginUserStore>()(
  persist(
    (set) => ({
      loginUser: { userSerial: 0, email: '', role: '', userName: '' },
      isLogin: false,
      setLoginUser: (loginUser) => set({ loginUser }),
      setIsLogin: (isLogin) => set({ isLogin }),
    }),
    {
      name: 'login-user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
