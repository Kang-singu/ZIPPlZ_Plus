import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface useBoardStore {
  keyword: string;
  setKeyword: (keyword: string) => void;
}
export const useBoardStore = create<useBoardStore>()(
  persist(
    (set) => ({
      keyword: '',
      setKeyword: (keyword: string) => set({ keyword }),
    }),
    {
      name: 'search-condition',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
