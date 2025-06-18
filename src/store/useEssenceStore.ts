import { create } from "zustand";

interface EssenceState {
  essence: number;
  maxEssence: number;
  enemyEssence: number;
  enemyMaxEssence: number;
  addEssence: () => void;
  spendEssence: (amount: number) => boolean;
  spendEnemyEssence: (amount: number) => boolean;
  resetEssence: () => void;
  increaseMaxEssence: () => void;
  increaseEnemyMaxEssence: () => void;
}

export const useEssenceStore = create<EssenceState>((set, get) => ({
  essence: 1, // Start with 1 essence
  maxEssence: 1, // Start with 1 max essence
  enemyEssence: 1,
  enemyMaxEssence: 1,

  addEssence: () =>
    set((state) => ({
      essence: Math.min(state.essence + 1, state.maxEssence), // Can't exceed max essence
    })),

  spendEssence: (amount: number) => {
    const currentEssence = get().essence;
    if (currentEssence >= amount) {
      set({ essence: currentEssence - amount });
      return true;
    }
    return false;
  },

  spendEnemyEssence: (amount: number) => {
    const state = get();
    if (state.enemyEssence >= amount) {
      set({ enemyEssence: state.enemyEssence - amount });
      return true;
    }
    return false;
  },

  resetEssence: () =>
    set({
      essence: 1,
      maxEssence: 1,
      enemyEssence: 1,
      enemyMaxEssence: 1,
    }),

  increaseMaxEssence: () => {
    const state = get();
    const newMax = Math.min(state.maxEssence + 1, 10);
    set({
      maxEssence: newMax,
      essence: newMax,
    });
  },

  increaseEnemyMaxEssence: () => {
    const state = get();
    const newMax = Math.min(state.enemyMaxEssence + 1, 10);
    set({
      enemyMaxEssence: newMax,
      enemyEssence: newMax,
    });
  },
}));
