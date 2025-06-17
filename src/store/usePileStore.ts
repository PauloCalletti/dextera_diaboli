import { create } from "zustand";
import { mockCards } from "../mocks/cards";
import { useArenaStore } from "./useArenaStore";
import { useEssenceStore } from "./useEssenceStore";

type CardWithDrawnState = (typeof mockCards)[0] & { isNew?: boolean };

interface PileState {
  pileCards: any[];
  enemyPileCards: any[];
  playerHand: any[];
  enemyHand: any[];
  drawCard: () => void;
  drawEnemyCard: () => void;
  playCardFromHand: (cardId: string) => void;
  initializePiles: () => void;
}

export const usePileStore = create<PileState>((set, get) => ({
  pileCards: [],
  enemyPileCards: [],
  playerHand: [],
  enemyHand: [],

  initializePiles: () => {
    // Shuffle the mock cards
    const shuffledCards = [...mockCards].sort(() => Math.random() - 0.5);
    
    // Give each player 5 initial cards
    const playerInitialHand = shuffledCards.slice(0, 5).map(card => ({ ...card, isNew: true }));
    const enemyInitialHand = shuffledCards.slice(5, 10).map(card => ({ ...card, isNew: true }));
    
    // Rest of the cards go to the piles
    const playerPile = shuffledCards.slice(10, Math.floor(shuffledCards.length / 2));
    const enemyPile = shuffledCards.slice(Math.floor(shuffledCards.length / 2));

    set({
      pileCards: playerPile,
      enemyPileCards: enemyPile,
      playerHand: playerInitialHand,
      enemyHand: enemyInitialHand
    });
  },

  drawCard: () => {
    set((state) => {
      if (state.pileCards.length === 0) return state;

      const [drawnCard, ...remainingCards] = state.pileCards;
      return {
        pileCards: remainingCards,
        playerHand: [...state.playerHand, { ...drawnCard, isNew: true }],
      };
    });
  },

  drawEnemyCard: () => {
    set((state) => {
      if (state.enemyPileCards.length === 0) return state;

      const [drawnCard, ...remainingCards] = state.enemyPileCards;
      return {
        enemyPileCards: remainingCards,
        enemyHand: [...state.enemyHand, { ...drawnCard, isNew: true }],
      };
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
}));
