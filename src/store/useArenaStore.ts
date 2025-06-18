import { create } from "zustand";
import { baseCards } from "../mocks/cards";
import { usePileStore } from "./usePileStore";

interface CardWithDrawnState {
  id: string;
  frontCardImage: string;
  backCardImage: string;
  attack: number;
  life: number;
  currentLife?: number;
  cost: number;
  isNew?: boolean;
}

interface ArenaState {
  playerArenaCards: CardWithDrawnState[];
  enemyArenaCards: CardWithDrawnState[];
  playCard: (cardId: string) => void;
  playEnemyCard: (cardId: string) => void;
  removeCard: (cardId: string, isPlayer: boolean) => void;
  updateCardLife: (cardId: string, newLife: number, isPlayer: boolean) => void;
  initializeEnemyCards: () => void;
  resetArena: () => void;
}

export const useArenaStore = create<ArenaState>((set) => ({
  playerArenaCards: [],
  enemyArenaCards: [],

  playCard: (cardId) => {
    set((state) => {
      if (state.playerArenaCards.length >= 5) {
        return state;
      }

      // Get the card from the pile store
      const pileStore = usePileStore.getState();
      const cardToPlay = pileStore.playerHand.find((card) => card.id === cardId);
      if (!cardToPlay) return state;

      return {
        playerArenaCards: [
          ...state.playerArenaCards,
          {
            ...cardToPlay,
            isNew: true,
            currentLife: cardToPlay.life,
          },
        ],
      };
    });
  },

  playEnemyCard: (cardId) => {
    set((state) => {
      if (state.enemyArenaCards.length >= 5) {
        return state;
      }

      const cardToPlay = baseCards.find((card) => card.id === cardId);
      if (!cardToPlay) return state;

      return {
        enemyArenaCards: [
          ...state.enemyArenaCards,
          {
            ...cardToPlay,
            isNew: true,
            currentLife: cardToPlay.life,
          },
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

  updateCardLife: (cardId, newLife, isPlayer) => {
    set((state) => {
      if (isPlayer) {
        const updatedCards = state.playerArenaCards.map((card) =>
          card.id === cardId ? { ...card, currentLife: newLife } : card
        );
        return { playerArenaCards: updatedCards };
      } else {
        const updatedCards = state.enemyArenaCards.map((card) =>
          card.id === cardId ? { ...card, currentLife: newLife } : card
        );
        return { enemyArenaCards: updatedCards };
      }
    });
  },

  initializeEnemyCards: () => {
    set({ enemyArenaCards: [] });
  },

  resetArena: () => {
    set({ playerArenaCards: [], enemyArenaCards: [] });
  },
}));
