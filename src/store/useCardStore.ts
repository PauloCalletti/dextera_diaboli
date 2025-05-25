import { create } from "zustand";

interface CardState {
  expandedCard: string | null;
  setExpandedCard: (cardId: string | null) => void;
}

export const useCardStore = create<CardState>((set) => ({
  expandedCard: null,
  setExpandedCard: (cardId) => set({ expandedCard: cardId }),
}));
