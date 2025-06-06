import { create } from "zustand";
import turnEndSound from "../assets/audio/turn-end.mp3";

interface AudioState {
  musicVolume: number;
  effectsVolume: number;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  playTurnEndSound: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  musicVolume: 0.1,
  effectsVolume: 0.5,
  
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setEffectsVolume: (volume) => set({ effectsVolume: volume }),
  
  playTurnEndSound: () => {
    const audio = new Audio(turnEndSound);
    audio.volume = get().effectsVolume;
    audio.play().catch((error) => {
      console.log("Turn end audio playback failed:", error);
    });
  }
}));
