import { create } from "zustand";
import { mockCards } from "../mocks/cards";

type CardWithDrawnState = (typeof mockCards)[0] & { isNew?: boolean };

interface ArenaState {
  playerArenaCards: CardWithDrawnState[];
  enemyArenaCards: CardWithDrawnState[];
  playCard: (cardId: string) => void;
  removeCard: (cardId: string, isPlayer: boolean) => void;
}

export const useArenaStore = create<ArenaState>((set) => ({
  playerArenaCards: [],
  enemyArenaCards: [],

  playCard: (cardId) => {
    set((state) => {
      // Check if we already have 5 cards in the arena
      if (state.playerArenaCards.length >= 5) {
        return state;
      }

      // Find the card in the player's hand (this would be implemented in usePileStore)
      const cardToPlay = mockCards.find((card) => card.id === cardId);
      if (!cardToPlay) return state;

      return {
        playerArenaCards: [
          ...state.playerArenaCards,
          { ...cardToPlay, isNew: true },
        ],
      };
    });
  },

  removeCard: (cardId, isPlayer) => {
    set((state) => {
      if (isPlayer) {
        return {
          playerArenaCards: state.playerArenaCards.filter(
            (card) => card.id !== cardId
          ),
        };
      } else {
        return {
          enemyArenaCards: state.enemyArenaCards.filter(
            (card) => card.id !== cardId
          ),
        };
      }
    });
  },
}));
