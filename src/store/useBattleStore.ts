import { create } from "zustand";
import { useArenaStore } from "./useArenaStore";
import { useLifeStore } from "./useLifeStore";
import { useAIStore } from "./useAIStore";
import { useTurnStore } from "./useTurnStore";

interface BattleState {
  attackingCards: string[];
  blockingPairs: { attackerId: string; blockerId: string }[];
  combatPhase: "none" | "declare_attackers" | "declare_blockers" | "damage";
  isPlayerTurn: boolean;
  canAttack: boolean;
  declareAttacker: (cardId: string) => void;
  declareBlocker: (attackerId: string, blockerId: string) => void;
  resolveCombat: () => void;
  endTurn: () => void;
  startTurn: () => void;
  setState: (state: Partial<BattleState>) => void;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  attackingCards: [],
  blockingPairs: [],
  combatPhase: "none",
  isPlayerTurn: true,
  canAttack: true,

  setState: (newState) => set(newState),

  declareAttacker: (cardId) => {
    const lifeStore = useLifeStore.getState();
    if (lifeStore.isGameOver()) return;

    set((state) => {
      if (state.combatPhase !== "declare_attackers") return state;

      const isAlreadyAttacking = state.attackingCards.includes(cardId);
      const newAttackingCards = isAlreadyAttacking
        ? state.attackingCards.filter((id) => id !== cardId)
        : [...state.attackingCards, cardId];

      return {
        ...state,
        attackingCards: newAttackingCards,
      };
    });
  },

  declareBlocker: (attackerId, blockerId) => {
    const lifeStore = useLifeStore.getState();
    if (lifeStore.isGameOver()) return;

    set((state) => {
      if (state.combatPhase !== "declare_blockers") return state;

      // Remove any existing block by this blocker
      const filteredPairs = state.blockingPairs.filter(
        (pair) => pair.blockerId !== blockerId
      );

      // Add the new blocking pair if it's not a deselection
      const isDeselecting = state.blockingPairs.some(
        (pair) => pair.attackerId === attackerId && pair.blockerId === blockerId
      );

      if (!isDeselecting) {
        filteredPairs.push({ attackerId, blockerId });
      }

      return {
        ...state,
        blockingPairs: filteredPairs,
      };
    });
  },

  resolveCombat: () => {
    const state = get();
    const arenaStore = useArenaStore.getState();
    const lifeStore = useLifeStore.getState();

    if (lifeStore.isGameOver()) return;

    // Process each attacking card
    state.attackingCards.forEach((attackerId) => {
      const attackingCard = [
        ...arenaStore.playerArenaCards,
        ...arenaStore.enemyArenaCards,
      ].find((card) => card.id === attackerId);

      if (!attackingCard) return;

      // Find the defending card in the same slot
      const attackerIndex = state.isPlayerTurn
        ? arenaStore.playerArenaCards.findIndex(
            (card) => card.id === attackerId
          )
        : arenaStore.enemyArenaCards.findIndex(
            (card) => card.id === attackerId
          );

      if (attackerIndex === -1) return;

      const defendingCard = state.isPlayerTurn
        ? arenaStore.enemyArenaCards[attackerIndex]
        : arenaStore.playerArenaCards[attackerIndex];

      if (defendingCard) {
        // Handle combat between cards
        const attackerDamage = attackingCard.attack;
        const defenderDamage = defendingCard.attack;
        const defenderCurrentLife =
          defendingCard.currentLife ?? defendingCard.life;
        const attackerCurrentLife =
          attackingCard.currentLife ?? attackingCard.life;

        // Deal damage to defender
        if (attackerDamage >= defenderCurrentLife) {
          // Defender is destroyed
          arenaStore.removeCard(defendingCard.id, !state.isPlayerTurn);
        } else {
          // Defender survives but takes damage
          arenaStore.updateCardLife(
            defendingCard.id,
            defenderCurrentLife - attackerDamage,
            !state.isPlayerTurn
          );
        }

        // Deal damage to attacker
        if (defenderDamage >= attackerCurrentLife) {
          // Attacker is destroyed
          arenaStore.removeCard(attackerId, state.isPlayerTurn);
        } else {
          // Attacker survives but takes damage
          arenaStore.updateCardLife(
            attackerId,
            attackerCurrentLife - defenderDamage,
            state.isPlayerTurn
          );
        }
      } else {
        // No defending card, damage goes to player
        if (state.isPlayerTurn) {
          lifeStore.damageEnemy(attackingCard.attack);
        } else {
          lifeStore.damagePlayer(attackingCard.attack);
        }
      }
    });

    // Reset combat state
    set({
      attackingCards: [],
      blockingPairs: [],
      combatPhase: "none",
      canAttack: false,
    });
  },

  endTurn: () => {
    const lifeStore = useLifeStore.getState();
    if (lifeStore.isGameOver()) return;

    set({
      isPlayerTurn: false,
      attackingCards: [],
      blockingPairs: [],
      combatPhase: "none",
      canAttack: false,
    });

    // Trigger AI decision making
    const aiStore = useAIStore.getState();
    aiStore.makeDecision();
  },

  startTurn: () => {
    const lifeStore = useLifeStore.getState();
    if (lifeStore.isGameOver()) return;

    set({
      isPlayerTurn: true,
      canAttack: true,
      combatPhase: "none",
      attackingCards: [],
      blockingPairs: [],
    });

    // Trigger turn store to handle card drawing
    const turnStore = useTurnStore.getState();
    turnStore.setPlayerTurn(true);
  },
}));
