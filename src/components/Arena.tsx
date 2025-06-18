import { Card } from "./Card";
import { useMemo } from "react";
import { useBattleStore } from "../store/useBattleStore";
import { useDroppable } from "@dnd-kit/core";
import { useArenaStore } from "../store/useArenaStore";
import { usePileStore } from "../store/usePileStore";
import { useEssenceStore } from "../store/useEssenceStore";

interface ArenaProps {
  playerCards: Array<{
    frontCardImage: string;
    backCardImage: string;
    id: string;
    attack: number;
    life: number;
    currentLife?: number;
    cost: number;
  }>;
  enemyCards: Array<{
    frontCardImage: string;
    backCardImage: string;
    id: string;
    attack: number;
    life: number;
    currentLife?: number;
    cost: number;
  }>;
  activeDragId: string | null;
  overSlotId: string | null;
}

const ArenaSlot = ({
  index,
  isPlayer,
  isOver,
  canDrop,
}: {
  index: number;
  isPlayer: boolean;
  isOver: boolean;
  canDrop: boolean;
}) => {
  const { setNodeRef } = useDroppable({
    id: `${isPlayer ? "player" : "enemy"}-slot-${index}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-64 h-96 border-2 rounded-xl transition-all duration-200 ${
        isOver
          ? canDrop
            ? "border-green-500 bg-green-500/20"
            : "border-red-500 bg-red-500/20"
          : "border-red-950/30 bg-red-950/10"
      }`}
    />
  );
};

export const Arena = ({
  playerCards,
  enemyCards,
  activeDragId,
  overSlotId,
}: ArenaProps) => {
  const cardScale = useMemo(() => {
    const totalCards = playerCards.length + enemyCards.length;
    if (totalCards <= 5) return 0.8;
    if (totalCards <= 8) return 0.7;
    return 0.6;
  }, [playerCards.length, enemyCards.length]);

  const createEmptySlots = (count: number) => Array(count).fill(null);
  const { playerHand } = usePileStore();
  const { essence } = useEssenceStore();

  const canDropInSlot = (slotId: string) => {
    if (!activeDragId || !slotId.startsWith("player-slot")) return false;

    const cardInHand = playerHand.find((card) => card.id === activeDragId);
    if (!cardInHand) return false;

    // Check if we have enough essence
    if (cardInHand.cost > essence) return false;

    // Check if the arena is not full
    if (playerCards.length >= 5) return false;

    return true;
  };

  return (
    <div className="absolute right-[10vw] left-[10vw] top-[10vh] bottom-[10vh] z-1">
      {/* Arena Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/50 to-black rounded-3xl overflow-hidden">
        {/* Hellish Floor Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(80,0,0,0.2) 1px, transparent 1px),
                linear-gradient(45deg, rgba(80,0,0,0.15) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(80,0,0,0.15) 25%, transparent 25%)
              `,
              backgroundSize: "30px 30px, 60px 60px, 60px 60px",
            }}
          />
        </div>

        {/* Lava Effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-red-950 via-red-900 to-transparent opacity-15"
          style={{
            animation: "pulse 8s ease-in-out infinite",
          }}
        />

        {/* Arena Center Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-red-950 opacity-20">
          {/* Pentagram */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0L61 35L98 35L68 57L79 92L50 70L21 92L32 57L2 35L39 35Z' fill='rgba(80,0,0,0.4)'/%3E%3C/svg%3E")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Hellish Glow Effects */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-red-950/20 to-transparent" />

        {/* Floating Embers */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-950 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  8 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 8}s`,
                opacity: Math.random() * 0.15 + 0.05,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="relative mx-auto"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Enemy Slots */}
        <div className="flex flex-col absolute top-0 w-full">
          <div className="flex justify-center gap-4 mb-4">
            {createEmptySlots(5).map((_, index) => {
              const slotId = `enemy-slot-${index}`;
              return (
                <div
                  key={slotId}
                  style={{
                    transform: `scale(${cardScale})`,
                    transformOrigin: "bottom center",
                  }}
                >
                  <ArenaSlot
                    index={index}
                    isPlayer={false}
                    isOver={overSlotId === slotId}
                    canDrop={false}
                  />
                  {enemyCards[index] && (
                    <div
                      className="absolute inset-0 transition-all duration-300 hover:scale-105 hover:brightness-125"
                      style={{
                        transform: `scale(${1 / cardScale})`,
                        transformOrigin: "center",
                      }}
                    >
                      <div
                        className="w-full h-full"
                        style={{ transform: `scale(${cardScale})` }}
                      >
                        <Card
                          frontCardImage={enemyCards[index].frontCardImage}
                          backCardImage={enemyCards[index].backCardImage}
                          cardId={enemyCards[index].id}
                          attackPower={enemyCards[index].attack}
                          life={enemyCards[index].life}
                          currentLife={enemyCards[index].currentLife}
                          cost={enemyCards[index].cost}
                          flipped={true}
                          isInArena={true}
                          isEnemy={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Slots */}
        <div className="flex flex-col absolute bottom-0 w-full">
          <div className="flex justify-center gap-4 mt-4">
            {createEmptySlots(5).map((_, index) => {
              const slotId = `player-slot-${index}`;
              const canDrop = canDropInSlot(slotId);
              return (
                <div
                  key={slotId}
                  style={{
                    transform: `scale(${cardScale})`,
                    transformOrigin: "bottom center",
                  }}
                >
                  <ArenaSlot
                    index={index}
                    isPlayer={true}
                    isOver={overSlotId === slotId}
                    canDrop={canDrop}
                  />
                  {playerCards[index] && (
                    <div
                      className="absolute inset-0 transition-all duration-300 hover:scale-105 hover:brightness-125"
                      style={{
                        transform: `scale(${1 / cardScale})`,
                        transformOrigin: "center",
                      }}
                    >
                      <div
                        className="w-full h-full"
                        style={{ transform: `scale(${cardScale})` }}
                      >
                        <Card
                          frontCardImage={playerCards[index].frontCardImage}
                          backCardImage={playerCards[index].backCardImage}
                          cardId={playerCards[index].id}
                          attackPower={playerCards[index].attack}
                          life={playerCards[index].life}
                          currentLife={playerCards[index].currentLife}
                          cost={playerCards[index].cost}
                          flipped={true}
                          isInArena={true}
                          isEnemy={false}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
              opacity: 0.05;
            }
            50% {
              transform: translateY(-20px) translateX(10px);
              opacity: 0.1;
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 0.15;
            }
            50% {
              opacity: 0.2;
            }
          }
        `}
      </style>
    </div>
  );
};
