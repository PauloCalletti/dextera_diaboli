import { create } from "zustand";
import { baseCards } from "../mocks/cards";

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
  playerArenaCards: (CardWithDrawnState | null)[];
  enemyArenaCards: (CardWithDrawnState | null)[];
  playCard: (cardToPlay: CardWithDrawnState) => void;
  playCardInSlot: (cardToPlay: CardWithDrawnState, slotIndex: number) => void;
  playEnemyCard: (cardId: string) => void;
  removeCard: (cardId: string, isPlayer: boolean) => void;
  updateCardLife: (cardId: string, newLife: number, isPlayer: boolean) => void;
  initializeEnemyCards: () => void;
  resetArena: () => void;
}

export const useArenaStore = create<ArenaState>((set) => ({
  playerArenaCards: [],
  enemyArenaCards: [],

  playCard: (cardToPlay) => {
    set((state) => {
      if (state.playerArenaCards.length >= 5) {
        return state;
      }

      const newCard: CardWithDrawnState = {
        id: cardToPlay.id,
        frontCardImage: cardToPlay.frontCardImage,
        backCardImage: cardToPlay.backCardImage,
        attack: cardToPlay.attack,
        life: cardToPlay.life,
        cost: cardToPlay.cost,
        isNew: true,
        currentLife: cardToPlay.life,
      };

      // Find the first empty slot (null or undefined)
      let targetSlot = 0;
      for (let i = 0; i < 5; i++) {
        if (!state.playerArenaCards[i]) {
          targetSlot = i;
          break;
        }
      }

      // Create a new array with the card in the first empty slot
      const newArenaCards = [...state.playerArenaCards];
      
      // Ensure the array is long enough
      while (newArenaCards.length <= targetSlot) {
        newArenaCards.push(null);
      }
      
      newArenaCards[targetSlot] = newCard;

      return {
        playerArenaCards: newArenaCards,
      };
    });
  },

  playCardInSlot: (cardToPlay, slotIndex) => {
    set((state) => {
      if (state.playerArenaCards.length >= 5) {
        return state;
      }

      const newCard: CardWithDrawnState = {
        id: cardToPlay.id,
        frontCardImage: cardToPlay.frontCardImage,
        backCardImage: cardToPlay.backCardImage,
        attack: cardToPlay.attack,
        life: cardToPlay.life,
        cost: cardToPlay.cost,
        isNew: true,
        currentLife: cardToPlay.life,
      };

      // Create a new array with the card in the specific slot
      const newArenaCards = [...state.playerArenaCards];
      
      // Ensure the array is long enough
      while (newArenaCards.length <= slotIndex) {
        newArenaCards.push(null);
      }
      
      newArenaCards[slotIndex] = newCard;

      return {
        playerArenaCards: newArenaCards,
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

      const newCard: CardWithDrawnState = {
        id: cardToPlay.id,
        frontCardImage: cardToPlay.frontCardImage,
        backCardImage: cardToPlay.backCardImage,
        attack: cardToPlay.attack,
        life: cardToPlay.life,
        cost: cardToPlay.cost,
        isNew: true,
        currentLife: cardToPlay.life,
      };

      // Find the first empty slot (null or undefined)
      let targetSlot = 0;
      for (let i = 0; i < 5; i++) {
        if (!state.enemyArenaCards[i]) {
          targetSlot = i;
          break;
        }
      }

      // Create a new array with the card in the first empty slot
      const newArenaCards = [...state.enemyArenaCards];
      
      // Ensure the array is long enough
      while (newArenaCards.length <= targetSlot) {
        newArenaCards.push(null);
      }
      
      newArenaCards[targetSlot] = newCard;

      return {
        enemyArenaCards: newArenaCards,
      };
    });
  },

  removeCard: (cardId, isPlayer) => {
    set((state) => {
      if (isPlayer) {
        // Find the index of the card to remove
        const cardIndex = state.playerArenaCards.findIndex(
          (card) => card?.id === cardId
        );
        
        if (cardIndex === -1) return state;

        // Create new array with the removed card set to null (keeping position)
        const newCards = [...state.playerArenaCards];
        newCards[cardIndex] = null;

        return {
          playerArenaCards: newCards,
        };
      } else {
        // Find the index of the card to remove
        const cardIndex = state.enemyArenaCards.findIndex(
          (card) => card?.id === cardId
        );
        
        if (cardIndex === -1) return state;

        // Create new array with the removed card set to null (keeping position)
        const newCards = [...state.enemyArenaCards];
        newCards[cardIndex] = null;

        return {
          enemyArenaCards: newCards,
        };
      }
    });
  },

  updateCardLife: (cardId, newLife, isPlayer) => {
    set((state) => {
      if (isPlayer) {
        const updatedCards = state.playerArenaCards.map((card) =>
          card?.id === cardId ? { ...card, currentLife: newLife } : card
        );
        return { playerArenaCards: updatedCards };
      } else {
        const updatedCards = state.enemyArenaCards.map((card) =>
          card?.id === cardId ? { ...card, currentLife: newLife } : card
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
