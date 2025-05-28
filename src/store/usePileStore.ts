import { create } from "zustand";
import { mockCards } from "../mocks/cards";
import { useArenaStore } from "./useArenaStore";
import { useEssenceStore } from "./useEssenceStore";

type CardWithDrawnState = (typeof mockCards)[0] & { isNew?: boolean };

interface PileState {
  pileCards: typeof mockCards;
  playerHand: CardWithDrawnState[];
  drawCard: () => void;
  playCardFromHand: (cardId: string) => void;
}

export const usePileStore = create<PileState>((set, get) => {
  // Filter out the 'predador' card and draw initial hand
  const filteredCards = mockCards.filter((card) => card.id !== "predador");
  const initialHand = filteredCards
    .slice(0, 7)
    .map((card) => ({ ...card, isNew: true }));
  const initialPile = filteredCards.slice(7);

  return {
    pileCards: initialPile,
    playerHand: initialHand,

    drawCard: () => {
      const state = get();
      if (state.pileCards.length === 0) return;

      // Get the top card and check its cost
      const topCard = state.pileCards[0];

      // Draw the top card from the pile
      const drawnCard = { ...topCard, isNew: true };
      const remainingCards = state.pileCards.slice(1);

      // Clear isNew flag from previously drawn cards
      const updatedHand = state.playerHand.map((card) => ({
        ...card,
        isNew: false,
      }));

      set({
        pileCards: remainingCards,
        playerHand: [...updatedHand, drawnCard],
      });
    },

    playCardFromHand: (cardId: string) => {
      const state = get();
      const cardIndex = state.playerHand.findIndex(
        (card) => card.id === cardId
      );

      if (cardIndex === -1) return;

      // Get the card to be played
      const cardToPlay = state.playerHand[cardIndex];

      // Get the essence store and check if we have enough essence
      const essenceStore = useEssenceStore.getState();
      if (!essenceStore.spendEssence(cardToPlay.cost)) {
        return; // Not enough essence, can't play the card
      }

      // Get the arena store
      const arenaStore = useArenaStore.getState();

      // Check if we can play the card (arena not full)
      if (arenaStore.playerArenaCards.length >= 5) return;

      // Remove card from hand and add to arena
      set((state) => ({
        playerHand: state.playerHand.filter((card) => card.id !== cardId),
      }));

      // Add card to arena
      arenaStore.playCard(cardId);
    },
  };
});
