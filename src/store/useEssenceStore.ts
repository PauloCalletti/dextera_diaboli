import { create } from "zustand";

interface EssenceState {
  essence: number;
  maxEssence: number;
  addEssence: () => void;
  spendEssence: (amount: number) => boolean;
  resetEssence: () => void;
  increaseMaxEssence: () => void;
}

export const useEssenceStore = create<EssenceState>((set, get) => ({
  essence: 1, // Start with 1 essence
  maxEssence: 1, // Start with 1 max essence
  
  addEssence: () => set((state) => ({ 
    essence: Math.min(state.essence + 1, state.maxEssence) // Can't exceed max essence
  })),
  
  spendEssence: (amount: number) => {
    const currentEssence = get().essence;
    if (currentEssence >= amount) {
      set({ essence: currentEssence - amount });
      return true;
    }
    return false;
  },
  
  resetEssence: () => set({ 
    essence: 1,
    maxEssence: 1
  }),

  increaseMaxEssence: () => set((state) => ({
    maxEssence: state.maxEssence + 1,
    essence: state.maxEssence + 1 // Fill up to new max essence
  })),
})); 