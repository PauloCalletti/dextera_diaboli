import { create } from "zustand";
import turnEndSound from "../assets/audio/Passturn.mp3";
import demageSound from "../assets/audio/Demage.mp3";

interface AudioState {
  musicVolume: number;
  effectsVolume: number;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  playTurnEndSound: () => void;
  playDemageSound: () => void;
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
  },
  playDemageSound: () => {
    console.log("playDemageSound called");
    const audio = new Audio(demageSound);
    audio.volume = get().effectsVolume;
    console.log("Audio volume:", get().effectsVolume);
    audio.play().catch((error) => {
      console.log("Demage audio playback failed:", error);
    });
  }
}));
