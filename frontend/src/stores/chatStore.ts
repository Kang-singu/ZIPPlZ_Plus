import type { ChatMessageData, ChatRoomDetails } from '@/types';
import { create } from 'zustand';

interface ChatStoreState {
  selectedChatRoom: ChatRoomDetails | null;
  messages: ChatMessageData[];
  setSelectedChatRoom: (room: ChatRoomDetails) => void;
  addMessage: (message: ChatMessageData) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  selectedChatRoom: null,
  messages: [],
  setSelectedChatRoom: (room: ChatRoomDetails) =>
    set({ selectedChatRoom: room }),
  addMessage: (message: ChatMessageData) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
