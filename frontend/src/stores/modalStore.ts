import { create } from 'zustand';

type ModalType = 'survey' | 'chatRooms' | 'select' | 'mini' | null;

interface ModalState {
  openModals: ModalType[];
  openModal: (type: ModalType) => void;
  closeModal: (type: ModalType) => void;
  closeAllModals: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  openModals: [],
  openModal: (type: ModalType) =>
    set((state) => ({ openModals: [...state.openModals, type] })),
  closeModal: (type: ModalType) =>
    set((state) => ({
      openModals: state.openModals.filter((modal) => modal !== type),
    })),
  closeAllModals: () => set({ openModals: [] }),
}));

export const useModalActions = () => {
  const { openModal, closeModal, closeAllModals } = useModalStore();
  return { openModal, closeModal, closeAllModals };
};

export const useCurrentModals = () =>
  useModalStore((state) => state.openModals);
