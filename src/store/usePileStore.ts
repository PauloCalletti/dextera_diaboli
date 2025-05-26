import { create } from "zustand";
import { mockCards } from "../mocks/cards";

type CardWithDrawnState = typeof mockCards[0] & { isNew?: boolean };

interface PileState {
  pileCards: typeof mockCards;
  playerHand: CardWithDrawnState[];
  drawCard: () => void;
}

export const usePileStore = create<PileState>((set) => {
  // Filter out the 'predador' card and draw initial hand
  const filteredCards = mockCards.filter(card => card.id !== 'predador');
  const initialHand = filteredCards.slice(0, 7).map(card => ({ ...card, isNew: true }));
  const initialPile = filteredCards.slice(7);

  return {
    pileCards: initialPile,
    playerHand: initialHand,
    
    drawCard: () => {
      set((state) => {
        if (state.pileCards.length === 0) return state;
        
        // Draw the top card from the pile
        const drawnCard = { ...state.pileCards[0], isNew: true };
        const remainingCards = state.pileCards.slice(1);

        // Clear isNew flag from previously drawn cards
        const updatedHand = state.playerHand.map(card => ({ ...card, isNew: false }));
        
        return {
          pileCards: remainingCards,
          playerHand: [...updatedHand, drawnCard],
        };
      });
    },
  };
}); 