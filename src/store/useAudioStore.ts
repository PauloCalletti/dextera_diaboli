import { create } from "zustand";

interface AudioState {
  volume: number;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  volume: 0.1,
  setVolume: (volume) => set({ volume }),
}));
