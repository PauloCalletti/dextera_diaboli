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
  makeBlockingDecision: () => Promise<void>;
}

export const useAIStore = create<AIState>((set) => ({
  isThinking: false,

  makeBlockingDecision: async () => {
    set({ isThinking: true });

    const arenaStore = useArenaStore.getState();
    const battleStore = useBattleStore.getState();
    const lifeStore = useLifeStore.getState();

    // Wait a bit to make it feel more natural
    await new Promise((resolve) => setTimeout(resolve, 800));

    const playerCards = arenaStore.playerArenaCards.filter(card => card !== null);
    const enemyCards = arenaStore.enemyArenaCards.filter(card => card !== null);
    const attackingCards = battleStore.attackingCards;
    const blockingPairs = battleStore.blockingPairs;

    // Find unblocked attackers
    const unblockedAttackers = attackingCards.filter((attackerId) => {
      return !blockingPairs.some((pair) => pair.attackerId === attackerId);
    });

    // Find available blockers (enemy cards not already blocking)
    const availableBlockers = enemyCards.filter((enemyCard) => {
      return enemyCard && !blockingPairs.some((pair) => pair.blockerId === enemyCard.id);
    });

    // Strategic blocking decisions
    for (const attackerId of unblockedAttackers) {
      const attackingCard = playerCards.find((card) => card?.id === attackerId);
      if (!attackingCard) continue;

      // Find the best blocker for this attacker
      let bestBlocker = null;
      let bestScore = -1;

      for (const blocker of availableBlockers) {
        if (!blocker) continue;
        
        const blockerLife = blocker.currentLife ?? blocker.life;
        const attackerLife = attackingCard.currentLife ?? attackingCard.life;

        // Calculate blocking score
        let score = 0;

        // Prefer blocking if we can kill the attacker
        if (blocker.attack >= attackerLife) {
          score += 100;
        }

        // Prefer blocking if we survive the attack
        if (attackingCard.attack < blockerLife) {
          score += 50;
        }

        // Prefer blocking high-value attackers
        score += attackingCard.attack * 2;

        // Prefer using weaker blockers for strong attackers
        if (blocker.attack < attackingCard.attack) {
          score += 25;
        }

        // Avoid blocking if we would die and they would survive
        if (attackingCard.attack >= blockerLife && blocker.attack < attackerLife) {
          score -= 50;
        }

        // Consider life total - don't block if we're winning
        if (lifeStore.enemyLife > lifeStore.playerLife + 5) {
          score -= 20;
        }

        if (score > bestScore) {
          bestScore = score;
          bestBlocker = blocker;
        }
      }

      // Block if the score is positive
      if (bestBlocker && bestScore > 0) {
        battleStore.declareBlocker(attackerId, bestBlocker.id);
        // Remove the blocker from available list
        const blockerIndex = availableBlockers.indexOf(bestBlocker);
        if (blockerIndex > -1) {
          availableBlockers.splice(blockerIndex, 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    set({ isThinking: false });
  },

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
    
    // Count actual cards in arena (excluding null values)
    const actualEnemyCards = arenaStore.enemyArenaCards.filter(card => card !== null);
    
    // Track which cards were just played this turn
    const cardsPlayedThisTurn: string[] = [];
    
    if (playableCards.length > 0 && actualEnemyCards.length < 5) {
      // Sort cards by strategic value (attack + life) / cost ratio
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
          cardsToPlay.length < 5 - actualEnemyCards.length
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
        cardsPlayedThisTurn.push(card.id);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay between card plays
      }
    }

    // Wait a bit before combat
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Phase 2: Combat
    // Get actual cards (excluding null values)
    const actualEnemyCardsForCombat = arenaStore.enemyArenaCards.filter(card => card !== null);
    const actualPlayerCards = arenaStore.playerArenaCards.filter(card => card !== null);
    
    if (actualEnemyCardsForCombat.length > 0) {
      // Set combat phase to declare attackers
      battleStore.setState({ combatPhase: "declare_attackers" });
      turnStore.setPhase("combat");

      // Wait a bit before attacking
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Analyze the board state
      const playerLife = lifeStore.playerLife;

      // Sort enemy cards by attack power (highest first)
      const sortedEnemyCards = [...actualEnemyCardsForCombat].sort(
        (a, b) => b.attack - a.attack
      );

      // Enhanced combat strategy that considers newly played cards
      if (playerLife <= 15) {
        // If player has low life, try to finish them off
        // Attack with all cards to try to finish the player
        sortedEnemyCards.forEach((card) => {
          battleStore.declareAttacker(card.id);
        });
      } else {
        // Normal combat strategy with consideration for newly played cards
        for (const enemyCard of sortedEnemyCards) {
          const enemyCardIndex = arenaStore.enemyArenaCards.findIndex(
            (card) => card?.id === enemyCard.id
          );
          const defendingCard = arenaStore.playerArenaCards[enemyCardIndex];
          const isNewlyPlayed = cardsPlayedThisTurn.includes(enemyCard.id);

          if (defendingCard) {
            // There's a defending card in the same slot
            const enemyCardLife = enemyCard.currentLife ?? enemyCard.life;
            const defendingCardLife = defendingCard.currentLife ?? defendingCard.life;

            // Enhanced attack conditions considering newly played cards
            // Attack if we can kill their card and survive
            if (enemyCard.attack >= defendingCardLife && defendingCard.attack < enemyCardLife) {
              battleStore.declareAttacker(enemyCard.id);
            }
            // Attack if it's an even trade and we have advantage
            else if (enemyCard.attack >= defendingCardLife && defendingCard.attack >= enemyCardLife) {
              // Attack if we have more cards or if the defending card is strong
              if (actualEnemyCardsForCombat.length > actualPlayerCards.length || defendingCard.attack >= 4) {
                battleStore.declareAttacker(enemyCard.id);
              }
            }
            // Attack if we have significantly more attack power
            else if (enemyCard.attack > defendingCard.attack + 2) {
              battleStore.declareAttacker(enemyCard.id);
            }
            // Attack if we have card advantage and it's not a terrible trade
            else if (actualEnemyCardsForCombat.length > actualPlayerCards.length && enemyCard.attack >= 3) {
              battleStore.declareAttacker(enemyCard.id);
            }
            // Special consideration for newly played cards - be more aggressive
            else if (isNewlyPlayed && enemyCard.attack >= 3) {
              // Attack with newly played cards if they have decent attack and we're not at a huge disadvantage
              if (enemyCard.attack >= defendingCard.attack || actualEnemyCardsForCombat.length > actualPlayerCards.length) {
                battleStore.declareAttacker(enemyCard.id);
              }
            }
            // Don't attack if we would die and they would survive significantly
            else if (defendingCard.attack >= enemyCardLife && enemyCard.attack < defendingCardLife - 2) {
              continue;
            }
          } else {
            // No defending card, go face - enhanced strategy for newly played cards
            if (enemyCard.attack >= 2) {
              // Be more aggressive with newly played cards when going face
              if (isNewlyPlayed && enemyCard.attack >= 3) {
                battleStore.declareAttacker(enemyCard.id);
              } else if (!isNewlyPlayed) {
                // Regular cards can attack with lower attack values
                battleStore.declareAttacker(enemyCard.id);
              }
            }
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

