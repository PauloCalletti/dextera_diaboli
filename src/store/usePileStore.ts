import { create } from "zustand";
import { getDeck } from "../mocks/cards";
import type { DeckId } from "../mocks/cards";
import { useArenaStore } from "./useArenaStore";
import { useEssenceStore } from "./useEssenceStore";

interface PileState {
  pileCards: any[];
  enemyPileCards: any[];
  playerHand: any[];
  enemyHand: any[];
  drawCard: () => void;
  drawEnemyCard: () => void;
  playCardFromHand: (cardId: string) => void;
  removeCardFromHand: (cardId: string) => void;
  removeEnemyCard: (cardId: string) => void;
  initializePiles: (playerDeckId: DeckId, enemyDeckId: DeckId) => void;
}

export const usePileStore = create<PileState>((set, get) => ({
  pileCards: [],
  enemyPileCards: [],
  playerHand: [],
  enemyHand: [],

  initializePiles: (playerDeckId: DeckId, enemyDeckId: DeckId) => {
    // Get all unique cards for each deck
    const playerDeck = getDeck(playerDeckId).sort(() => Math.random() - 0.5);
    const enemyDeck = getDeck(enemyDeckId).sort(() => Math.random() - 0.5);

    // Give each player 5 initial cards in hand
    const playerInitialHand = playerDeck.slice(0, 5).map((card) => ({ ...card, isNew: true }));
    const enemyInitialHand = enemyDeck.slice(0, 5).map((card) => ({ ...card, isNew: true }));

    // The rest go to their respective piles
    const playerPile = playerDeck.slice(5);
    const enemyPile = enemyDeck.slice(5);

    set({
      pileCards: playerPile,
      enemyPileCards: enemyPile,
      playerHand: playerInitialHand,
      enemyHand: enemyInitialHand,
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
    const cardIndex = state.playerHand.findIndex((card) => card.id === cardId);

    if (cardIndex === -1) return;

    // Get the card to be played
    const cardToPlay = state.playerHand[cardIndex];

    // Get the essence store and check if we have enough essence
    const essenceStore = useEssenceStore.getState();
    if (!essenceStore.spendEssence(cardToPlay.cost)) {
      return;
    }

    // Get the arena store
    const arenaStore = useArenaStore.getState();

    // Check if we can play the card (arena not full)
    if (arenaStore.playerArenaCards.length >= 5) return;

    // Remove card from hand
    set((state) => ({
      playerHand: state.playerHand.filter((card) => card.id !== cardId),
    }));

    // Add card to arena (default behavior)
    arenaStore.playCard(cardToPlay);
  },

  removeCardFromHand: (cardId: string) => {
    set((state) => ({
      playerHand: state.playerHand.filter((card) => card.id !== cardId),
    }));
  },

  removeEnemyCard: (cardId: string) => {
    set((state) => ({
      enemyHand: state.enemyHand.filter((card) => card.id !== cardId),
    }));
  },
}));
