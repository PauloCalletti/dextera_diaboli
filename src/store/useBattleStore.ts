import { create } from "zustand";
import { useArenaStore } from "./useArenaStore";
import { useLifeStore } from "./useLifeStore";
import { useAIStore } from "./useAIStore";
import { useTurnStore } from "./useTurnStore";
import { useAudioStore } from "./useAudioStore";

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
    const audioStore = useAudioStore.getState();

    if (lifeStore.isGameOver()) return;

    // Process each attacking card
    state.attackingCards.forEach((attackerId) => {
      // Find the attacking card in the correct arena
      let attackingCard = null;
      if (state.isPlayerTurn) {
        attackingCard = arenaStore.playerArenaCards.find((card) => card?.id === attackerId);
      } else {
        attackingCard = arenaStore.enemyArenaCards.find((card) => card?.id === attackerId);
      }

      if (!attackingCard) return;

      // Check if this attacker is being blocked
      const blockingPair = state.blockingPairs.find(
        (pair) => pair.attackerId === attackerId
      );

      if (blockingPair) {
        // Handle blocked combat
        const blockerCard = [
          ...arenaStore.playerArenaCards,
          ...arenaStore.enemyArenaCards,
        ].find((card) => card?.id === blockingPair.blockerId);

        if (blockerCard) {
          const attackerDamage = attackingCard.attack;
          const blockerDamage = blockerCard.attack;
          const blockerCurrentLife = blockerCard.currentLife ?? blockerCard.life;
          const attackerCurrentLife = attackingCard.currentLife ?? attackingCard.life;

          // Deal damage to blocker
          if (attackerDamage >= blockerCurrentLife) {
            // Blocker is destroyed
            arenaStore.removeCard(blockerCard.id, !state.isPlayerTurn);
          } else {
            // Blocker survives but takes damage
            arenaStore.updateCardLife(
              blockerCard.id,
              blockerCurrentLife - attackerDamage,
              !state.isPlayerTurn
            );
          }

          // Deal damage to attacker
          if (blockerDamage >= attackerCurrentLife) {
            // Attacker is destroyed
            arenaStore.removeCard(attackerId, state.isPlayerTurn);
          } else {
            // Attacker survives but takes damage
            arenaStore.updateCardLife(
              attackerId,
              attackerCurrentLife - blockerDamage,
              state.isPlayerTurn
            );
          }
        }
      } else {
        // No blocker, check for defending card in same slot
        const attackerIndex = state.isPlayerTurn
          ? arenaStore.playerArenaCards.findIndex(
              (card) => card?.id === attackerId
            )
          : arenaStore.enemyArenaCards.findIndex(
              (card) => card?.id === attackerId
            );

        if (attackerIndex === -1) return;

        const defendingCard = state.isPlayerTurn
          ? arenaStore.enemyArenaCards[attackerIndex]
          : arenaStore.playerArenaCards[attackerIndex];

        if (defendingCard) {
          // Handle combat between cards in same slot
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
            audioStore.playDemageSound();
            lifeStore.damageEnemy(attackingCard.attack);
          } else {
            audioStore.playDemageSound();
            lifeStore.damagePlayer(attackingCard.attack);
          }
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
