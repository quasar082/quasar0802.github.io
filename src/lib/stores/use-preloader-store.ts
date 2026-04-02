import {create} from 'zustand';

interface PreloaderState {
  done: boolean;
  setDone: () => void;
}

export const usePreloaderStore = create<PreloaderState>((set) => ({
  done: false,
  setDone: () => set({done: true}),
}));
