import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser';
import { create } from 'zustand';

interface VideoStore {
  session: Session | null;
  publisher: Publisher | null;
  subscriber: Subscriber | null;
  OV: OpenVidu | null;
  setSession: (session: Session) => void;
  setPublisher: (publisher: Publisher) => void;
  setSubscriber: (subscriber: Subscriber | null) => void;
  setOV: (OV: OpenVidu) => void;
  reset: () => void;
  leaveSession: () => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  session: null,
  publisher: null,
  subscriber: null,
  OV: null,
  setSession: (session) => set({ session }),
  setPublisher: (publisher) => set({ publisher }),
  setSubscriber: (subscriber) => set({ subscriber }),
  setOV: (OV) => set({ OV }),
  reset: () => set({ session: null, publisher: null, subscriber: null }),
  leaveSession: () => {
    set((state) => {
      if (state.session) {
        state.session.disconnect();
      }
      return { session: null, publisher: null, subscriber: null };
    });
  },
}));
