import { create } from "zustand";
import { useArenaStore } from "./useArenaStore";

interface BattleState {
  attackingCards: string[];
  blockingPairs: { attackerId: string; blockerId: string }[];
  combatPhase: 'none' | 'declare_attackers' | 'declare_blockers' | 'damage';
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
  combatPhase: 'none',
  isPlayerTurn: true,
  canAttack: true,

  setState: (newState) => set(newState),

  declareAttacker: (cardId) => {
    set((state) => {
      if (state.combatPhase !== 'declare_attackers') return state;

      const isAlreadyAttacking = state.attackingCards.includes(cardId);
      const newAttackingCards = isAlreadyAttacking
        ? state.attackingCards.filter(id => id !== cardId)
        : [...state.attackingCards, cardId];

      return {
        ...state,
        attackingCards: newAttackingCards
      };
    });
  },

  declareBlocker: (attackerId, blockerId) => {
    set((state) => {
      if (state.combatPhase !== 'declare_blockers') return state;

      // Remove any existing block by this blocker
      const filteredPairs = state.blockingPairs.filter(pair => pair.blockerId !== blockerId);
      
      // Add the new blocking pair if it's not a deselection
      const isDeselecting = state.blockingPairs.some(
        pair => pair.attackerId === attackerId && pair.blockerId === blockerId
      );

      if (!isDeselecting) {
        filteredPairs.push({ attackerId, blockerId });
      }

      return {
        ...state,
        blockingPairs: filteredPairs
      };
    });
  },

  resolveCombat: () => {
    const state = get();
    const arenaStore = useArenaStore.getState();
    
    // Process each attacking card
    state.attackingCards.forEach(attackerId => {
      const blockingPair = state.blockingPairs.find(pair => pair.attackerId === attackerId);
      const attackingCard = [...arenaStore.playerArenaCards, ...arenaStore.enemyArenaCards]
        .find(card => card.id === attackerId);

      if (!attackingCard) return;

      if (blockingPair) {
        // Handle blocked attack
        const blockingCard = [...arenaStore.playerArenaCards, ...arenaStore.enemyArenaCards]
          .find(card => card.id === blockingPair.blockerId);

        if (!blockingCard) return;

        // Calculate combat damage
        const attackerDamage = attackingCard.attack;
        const blockerDamage = blockingCard.attack;

        // Deal damage to blocker
        const blockerCurrentLife = blockingCard.currentLife !== undefined ? blockingCard.currentLife : blockingCard.life;
        const newBlockerLife = blockerCurrentLife - attackerDamage;

        // Deal damage to attacker
        const attackerCurrentLife = attackingCard.currentLife !== undefined ? attackingCard.currentLife : attackingCard.life;
        const newAttackerLife = attackerCurrentLife - blockerDamage;

        // Update or remove cards based on damage
        if (newBlockerLife <= 0) {
          arenaStore.removeCard(blockingPair.blockerId, !state.isPlayerTurn);
        } else {
          arenaStore.updateCardLife(blockingPair.blockerId, newBlockerLife, !state.isPlayerTurn);
        }

        if (newAttackerLife <= 0) {
          arenaStore.removeCard(attackerId, state.isPlayerTurn);
        } else {
          arenaStore.updateCardLife(attackerId, newAttackerLife, state.isPlayerTurn);
        }
      } else {
        // Handle unblocked attack - deal damage to opponent
        // TODO: Implement player life points system
        console.log(`Direct damage: ${attackingCard.attack}`);
      }
    });

    // Reset combat state
    set({
      attackingCards: [],
      blockingPairs: [],
      combatPhase: 'none',
      canAttack: false
    });
  },

  endTurn: () => {
    set({ 
      isPlayerTurn: false,
      attackingCards: [],
      blockingPairs: [],
      combatPhase: 'none',
      canAttack: false
    });

    // TODO: Implement enemy turn logic
    setTimeout(() => {
      set({ 
        isPlayerTurn: true,
        canAttack: true,
        combatPhase: 'none'
      });
    }, 2000);
  },

  startTurn: () => {
    set({ 
      isPlayerTurn: true,
      canAttack: true,
      combatPhase: 'none',
      attackingCards: [],
      blockingPairs: []
    });
  },
})); 