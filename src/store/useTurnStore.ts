import { create } from 'zustand';

type Phase = 'play' | 'combat' | 'end';

interface TurnState {
  currentPhase: Phase;
  setPhase: (phase: Phase) => void;
  nextPhase: () => void;
  isPlayerTurn: boolean;
  setPlayerTurn: (isPlayerTurn: boolean) => void;
}

export const useTurnStore = create<TurnState>((set) => ({
  currentPhase: 'play',
  isPlayerTurn: true,

  setPhase: (phase) => set({ currentPhase: phase }),
  
  nextPhase: () => set((state) => {
    const phases: Phase[] = ['play', 'combat', 'end'];
    const currentIndex = phases.indexOf(state.currentPhase);
    
    if (currentIndex === phases.length - 1) {
      // If we're at the end phase, switch to opponent's turn
      return {
        currentPhase: 'play',
        isPlayerTurn: false
      };
    }
    
    // Otherwise, move to next phase
    return {
      currentPhase: phases[currentIndex + 1]
    };
  }),

  setPlayerTurn: (isPlayerTurn) => set({ isPlayerTurn })
})); 