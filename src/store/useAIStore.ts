import { create } from "zustand";
import { usePileStore } from "./usePileStore";
import { useArenaStore } from "./useArenaStore";
import { useBattleStore } from "./useBattleStore";
import { useEssenceStore } from "./useEssenceStore";
import { useLifeStore } from "./useLifeStore";
import { useTurnStore } from "./useTurnStore";

interface AIState {
  isThinking: boolean;
  makeDecision: () => Promise<void>;
}

export const useAIStore = create<AIState>((set, get) => ({
  isThinking: false,

  makeDecision: async () => {
    set({ isThinking: true });

    // Get current game state
    const pileStore = usePileStore.getState();
    const arenaStore = useArenaStore.getState();
    const battleStore = useBattleStore.getState();
    const essenceStore = useEssenceStore.getState();
    const lifeStore = useLifeStore.getState();
    const turnStore = useTurnStore.getState();

    // Wait a bit to make it feel more natural
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Draw a card at the start of turn
    pileStore.drawEnemyCard();

    // Phase 1: Play cards
    const playableCards = pileStore.enemyHand.filter(
      (card) => card.cost <= essenceStore.enemyEssence
    );
    if (playableCards.length > 0 && arenaStore.enemyArenaCards.length < 5) {
      // Sort cards by value (attack + life) / cost ratio
      const sortedCards = [...playableCards].sort((a, b) => {
        const valueA = (a.attack + a.life) / a.cost;
        const valueB = (b.attack + b.life) / b.cost;
        return valueB - valueA;
      });

      // Calculate how many cards we can play based on total essence
      let remainingEssence = essenceStore.enemyEssence;
      let cardsToPlay = [];

      for (const card of sortedCards) {
        if (
          card.cost <= remainingEssence &&
          cardsToPlay.length < 5 - arenaStore.enemyArenaCards.length
        ) {
          cardsToPlay.push(card);
          remainingEssence -= card.cost;
        }
      }

      // Play the selected cards
      for (const card of cardsToPlay) {
        essenceStore.spendEnemyEssence(card.cost);
        arenaStore.playEnemyCard(card.id);
        pileStore.removeEnemyCard(card.id);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay between card plays
      }
    }

    // Wait a bit before combat
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Phase 2: Combat
    if (arenaStore.enemyArenaCards.length > 0) {
      // Set combat phase
      battleStore.setState({ combatPhase: "declare_attackers" });
      turnStore.setPhase("combat");

      // Wait a bit before attacking
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Analyze the board state
      const playerCards = arenaStore.playerArenaCards;
      const enemyCards = arenaStore.enemyArenaCards;
      const playerLife = lifeStore.playerLife;

      // Sort enemy cards by attack power (highest first)
      const sortedEnemyCards = [...enemyCards].sort(
        (a, b) => b.attack - a.attack
      );

      // Strategy: If player has low life, try to finish them off
      if (playerLife <= 10) {
        // Attack with all cards to try to finish the player
        sortedEnemyCards.forEach((card) => {
          battleStore.declareAttacker(card.id);
        });
      } else {
        // Normal combat strategy
        for (const enemyCard of sortedEnemyCards) {
          const enemyCardIndex = arenaStore.enemyArenaCards.findIndex(
            (card) => card.id === enemyCard.id
          );
          const defendingCard = playerCards[enemyCardIndex];

          if (defendingCard) {
            // If we can kill the defending card, do it
            if (
              enemyCard.attack >=
              (defendingCard.currentLife ?? defendingCard.life)
            ) {
              battleStore.declareAttacker(enemyCard.id);
            }
            // If our card would die in combat, don't attack
            else if (
              defendingCard.attack >= (enemyCard.currentLife ?? enemyCard.life)
            ) {
              continue;
            }
            // If we can trade favorably (our card survives), do it
            else if (enemyCard.attack > defendingCard.attack) {
              battleStore.declareAttacker(enemyCard.id);
            }
          } else if (enemyCard.attack >= 3) {
            // If there's no defending card and our card has decent attack, go face
            battleStore.declareAttacker(enemyCard.id);
          }
        }
      }

      // Wait for player to block
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Resolve combat
      battleStore.resolveCombat();
    }

    // Phase 3: End turn
    turnStore.setPhase("end");
    essenceStore.increaseEnemyMaxEssence();

    // Start player's turn and draw a card
    turnStore.setPlayerTurn(true);
    battleStore.setState({
      isPlayerTurn: true,
      canAttack: true,
      combatPhase: "none",
    });
    turnStore.setPhase("play");

    set({ isThinking: false });
  },
}));
