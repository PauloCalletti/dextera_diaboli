import { create } from 'zustand';

interface LifeState {
  playerLife: number;
  enemyLife: number;
  initialLife: number;
  damagePlayer: (amount: number) => void;
  damageEnemy: (amount: number) => void;
  resetLife: () => void;
  isGameOver: () => boolean;
  getWinner: () => 'player' | 'enemy' | null;
}

export const useLifeStore = create<LifeState>((set, get) => ({
  playerLife: 20,
  enemyLife: 20,
  initialLife: 20,

  damagePlayer: (amount) => {
    set((state) => ({
      playerLife: Math.max(0, state.playerLife - amount)
    }));
  },

  damageEnemy: (amount) => {
    set((state) => ({
      enemyLife: Math.max(0, state.enemyLife - amount)
    }));
  },

  resetLife: () => {
    set((state) => ({
      playerLife: state.initialLife,
      enemyLife: state.initialLife
    }));
  },

  isGameOver: () => {
    const state = get();
    return state.playerLife <= 0 || state.enemyLife <= 0;
  },

  getWinner: () => {
    const state = get();
    if (state.playerLife <= 0) return 'enemy';
    if (state.enemyLife <= 0) return 'player';
    return null;
  }
})); 