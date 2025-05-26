import { create } from "zustand";

interface EssenceState {
  essence: number;
  addEssence: () => void;
  spendEssence: (amount: number) => boolean;
  resetEssence: () => void;
}

export const useEssenceStore = create<EssenceState>((set, get) => ({
  essence: 1, // Start with 1 essence
  
  addEssence: () => set((state) => ({ 
    essence: state.essence + 1 
  })),
  
  spendEssence: (amount: number) => {
    const currentEssence = get().essence;
    if (currentEssence >= amount) {
      set({ essence: currentEssence - amount });
      return true;
    }
    return false;
  },
  
  resetEssence: () => set({ essence: 1 }),
})); 