"use client";

import { Sword, Play, SkipForward } from "lucide-react";
import { useBattleStore } from "../store/useBattleStore";
import { useAudioStore } from "../store/useAudioStore";
import { useTurnStore } from "../store/useTurnStore";
import { useEssenceStore } from "../store/useEssenceStore";
import { useAIStore } from "../store/useAIStore";
import { motion, AnimatePresence } from "framer-motion";

export const TurnControl = () => {
  const { isPlayerTurn, endTurn, resolveCombat } = useBattleStore();
  const { playTurnEndSound } = useAudioStore();
  const { currentPhase, setPhase } = useTurnStore();
  const { increaseMaxEssence } = useEssenceStore();
  const { makeBlockingDecision } = useAIStore();

  const phases = [
    { id: "play", icon: Play, color: "bg-[#FF4500]" }, // Fiery Orange
    { id: "combat", icon: Sword, color: "bg-[#8B0000]" }, // Dark Red
    { id: "end", icon: SkipForward, color: "bg-[#4B0082]" }, // Deep Purple
  ];

  const handlePass = async () => {
    if (!isPlayerTurn) return;

    // Play sound on every phase change
    playTurnEndSound();

    if (currentPhase === "play") {
      setPhase("combat");
      useBattleStore.setState({ combatPhase: "declare_attackers" });
    } else if (currentPhase === "combat") {
      // Check if we're in the attackers phase and need to move to blockers
      const battleStore = useBattleStore.getState();
      if (battleStore.combatPhase === "declare_attackers") {
        // Move to blockers phase
        useBattleStore.setState({ combatPhase: "declare_blockers" });
        
        // If there are attacking cards and it's not the player's turn, let AI block
        if (battleStore.attackingCards.length > 0 && !battleStore.isPlayerTurn) {
          await makeBlockingDecision();
        }
      } else {
        // Resolve combat and move to end phase
        resolveCombat();
        setPhase("end");
        useBattleStore.setState({ combatPhase: "none" });
      }
    } else if (currentPhase === "end") {
      increaseMaxEssence(); // Increase max essence at end of turn
      endTurn(); // This will trigger the AI's turn
      setPhase("play");
    }
  };

  const currentPhaseIndex = phases.findIndex(
    (phase) => phase.id === currentPhase
  );

  return (
    <motion.div
      onClick={handlePass}
      className="fixed right-[50px] bottom-[45%] flex flex-col items-center cursor-pointer z-1"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Circular Phase Indicator Button */}
        <motion.div
          className={`relative w-24 h-24 group rounded-full overflow-hidden ${
            !isPlayerTurn ? "opacity-50" : ""
          }`}
          animate={{
            scale: isPlayerTurn ? [1, 1.02, 1] : 1,
            boxShadow: isPlayerTurn
              ? [
                  "0 0 0 rgba(255,69,0,0)",
                  "0 0 20px rgba(255,69,0,0.3)",
                  "0 0 0 rgba(255,69,0,0)",
                ]
              : "0 0 0 rgba(255,69,0,0)",
          }}
          transition={{
            duration: 2,
            repeat: isPlayerTurn ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-[#1a1a1a]"
            initial={false}
            animate={{
              rotate: currentPhaseIndex * 120,
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
          >
            <div
              className="absolute inset-0 rounded-full transition-all duration-700 ease-in-out will-change-transform"
              style={{
                background: `conic-gradient(${phases[
                  currentPhaseIndex
                ].color.replace("bg-", "")} ${
                  (currentPhaseIndex + 1) * 120
                }deg, #1a1a1a 0deg)`,
              }}
            />
          </motion.div>

          {/* Current Phase Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              className={`absolute inset-2 rounded-full ${phases[currentPhaseIndex].color} flex items-center justify-center shadow-lg`}
              initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                boxShadow: [
                  "0 0 0 rgba(255,69,0,0)",
                  "0 0 15px rgba(255,69,0,0.5)",
                  "0 0 0 rgba(255,69,0,0)",
                ],
              }}
              exit={{ scale: 0.8, opacity: 0, rotate: 180 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 20px rgba(255,69,0,0.7)",
              }}
            >
              {(() => {
                const Icon = phases[currentPhaseIndex].icon;
                return (
                  <motion.div
                    animate={{
                      y: [0, -2, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};
