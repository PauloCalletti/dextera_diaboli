"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Sword, Play, SkipForward } from "lucide-react"
import { useBattleStore } from "../store/useBattleStore"
import { useAudioStore } from "../store/useAudioStore"
import { useTurnStore } from "../store/useTurnStore"
import { useEssenceStore } from "../store/useEssenceStore"

export const TurnControl = () => {
  const { isPlayerTurn, endTurn, combatPhase, resolveCombat } = useBattleStore()
  const { playTurnEndSound } = useAudioStore()
  const { currentPhase, setPhase, nextPhase } = useTurnStore()
  const { increaseMaxEssence } = useEssenceStore()

  const phases = [
    { id: "play", icon: Play, color: "bg-blue-500" },
    { id: "combat", icon: Sword, color: "bg-red-500" },
    { id: "end", icon: SkipForward, color: "bg-green-500" },
  ]

  const handlePass = () => {
    if (!isPlayerTurn) return

    // Play sound on every phase change
    playTurnEndSound()

    if (currentPhase === "play") {
      setPhase("combat")
      useBattleStore.setState({ combatPhase: "declare_attackers" })
    } else if (currentPhase === "combat") {
      resolveCombat() // Resolve combat before moving to end phase
      setPhase("end")
      useBattleStore.setState({ combatPhase: "none" })
    } else if (currentPhase === "end") {
      increaseMaxEssence() // Increase max essence at end of turn
      endTurn()
      setPhase("play")
    }
  }

  const currentPhaseIndex = phases.findIndex((phase) => phase.id === currentPhase)

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center">
      {/* Combat phase indicator */}
      {combatPhase !== "none" && (
        <div className="mb-4 px-4 py-2 bg-gray-800 text-white rounded text-sm animate-fade-in">
          {combatPhase === "declare_attackers" && "Select attacking cards"}
          {combatPhase === "declare_blockers" && "Select blocking cards"}
          {combatPhase === "damage" && "Resolving combat..."}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Circular Phase Indicator */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gray-200">
            <div
              className="absolute inset-0 rounded-full transition-all duration-500 ease-in-out"
              style={{
                background: `conic-gradient(${phases[currentPhaseIndex].color.replace("bg-", "")} ${(currentPhaseIndex + 1) * 120}deg, #e5e7eb 0deg)`,
              }}
            />
          </div>

          {/* Current Phase Icon */}
          <div
            className={`absolute inset-2 rounded-full ${phases[currentPhaseIndex].color} flex items-center justify-center shadow-lg`}
          >
            {(() => {
              const Icon = phases[currentPhaseIndex].icon
              return <Icon className="w-8 h-8 text-white" />
            })()}
          </div>

          {/* Phase Dots */}
          <div className="absolute inset-0">
            {phases.map((phase, index) => {
              const angle = index * 120 - 90 // Start from top
              const x = 50 + 40 * Math.cos((angle * Math.PI) / 180)
              const y = 50 + 40 * Math.sin((angle * Math.PI) / 180)

              return (
                <div
                  key={phase.id}
                  className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentPhaseIndex ? phase.color : "bg-gray-300"
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Pass Button */}
        <Button
          onClick={handlePass}
          className="rounded-full w-48 h-16 shadow-lg hover:scale-105 transition-transform flex items-center justify-between px-6"
          variant={currentPhase === "end" ? "destructive" : "default"}
          disabled={!isPlayerTurn}
        >
          <span className="font-medium capitalize">
            {currentPhase === "play" ? "Play Phase" : currentPhase === "combat" ? "Combat Phase" : "End Phase"}
          </span>
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
