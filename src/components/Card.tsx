import { useEffect, useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import flipSound from "../assets/audio/card-flip.mp3";
import selectSound from "../assets/audio/card-select.mp3";
import { useCardStore } from "../store/useCardStore";
import { useAudioStore } from "../store/useAudioStore";
import { usePileStore } from "../store/usePileStore";
import { useBattleStore } from "../store/useBattleStore";
import { useArenaStore } from "../store/useArenaStore";

interface CardProps {
  frontCardImage: string;
  backCardImage: string;
  cardId: string;
  attackPower: number;
  life: number;
  currentLife?: number;
  cost: number;
  isNew?: boolean;
  flipped?: boolean;
  isInArena?: boolean;
  isEnemy?: boolean;
  isDraggable?: boolean;
}

export const Card = ({
  frontCardImage,
  backCardImage,
  cardId,
  attackPower,
  life,
  currentLife,
  cost,
  isNew = false,
  flipped = false,
  isInArena = false,
  isEnemy = false,
  isDraggable = false,
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(flipped);
  const [isShowingFrontPart, setIsShowingFrontPart] = useState(true);
  const [isShowingCardInfo, setIsShowingCardInfo] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(!isNew);
  const [showSparkle, setShowSparkle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectAudioRef = useRef<HTMLAudioElement | null>(null);
  const { setExpandedCard } = useCardStore();
  const { effectsVolume } = useAudioStore();
  const { playCardFromHand } = usePileStore();
  const {
    attackingCards,
    blockingPairs,
    combatPhase,
    isPlayerTurn,
    canAttack,
    declareAttacker,
    declareBlocker,
  } = useBattleStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cardId,
      disabled: !isDraggable || isEnemy || isInArena,
    });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined;

  useEffect(() => {
    audioRef.current = new Audio(flipSound);
    selectAudioRef.current = new Audio(selectSound);

    if (audioRef.current) {
      audioRef.current.volume = effectsVolume;
    }
    if (selectAudioRef.current) {
      selectAudioRef.current.volume = effectsVolume;
    }

    if (isNew && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (selectAudioRef.current) {
        selectAudioRef.current.pause();
        selectAudioRef.current = null;
      }
    };
  }, [effectsVolume, isNew, hasAnimated]);

  useEffect(() => {
    if (showSparkle) {
      const timer = setTimeout(() => {
        setShowSparkle(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSparkle]);

  const playSelectSound = () => {
    if (selectAudioRef.current) {
      selectAudioRef.current.currentTime = 0;
      selectAudioRef.current.play().catch((error) => {
        console.log("Select audio playback failed:", error);
      });
    }
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowingFrontPart(!isFlipped);
      playSound();
    }, 125);

    return () => clearTimeout(timeout);
  }, [isFlipped]);

  useEffect(() => {
    if (!isFlipped) {
      const timeout = setTimeout(() => {
        setIsShowingCardInfo(!isShowingCardInfo);
      }, 400);

      return () => clearTimeout(timeout);
    } else {
      setIsShowingCardInfo(false);
    }
  }, [isFlipped]);

  useEffect(() => {
    if (flipped !== undefined) {
      setIsFlipped(!flipped);
    }
  }, [flipped]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedCard(cardId);
  };

  const handleClick = () => {
    if (!isInArena && !isEnemy) {
      playCardFromHand(cardId);
      return;
    }

    if (!isPlayerTurn) return;

    if (isInArena && combatPhase !== "none") {
      if (combatPhase === "declare_attackers" && !isEnemy && canAttack) {
        declareAttacker(cardId);
        playSelectSound();
        setShowSparkle(true);
      } else if (combatPhase === "declare_blockers") {
        if (isEnemy) {
          // Clicking on enemy card to block it
          // Find a player card that can block this enemy card
          const arenaStore = useArenaStore.getState();
          const playerCards = arenaStore.playerArenaCards;
          
          // Find a player card that isn't already blocking
          const availableBlocker = playerCards.find((playerCard) => {
            return !blockingPairs.some((pair) => pair.blockerId === playerCard.id);
          });
          
          if (availableBlocker) {
            declareBlocker(cardId, availableBlocker.id);
            playSelectSound();
            setShowSparkle(true);
          }
        } else {
          // Clicking on player card to assign it as blocker
          // Find an attacking card that isn't already blocked
          const unblockedAttacker = attackingCards.find((attackerId) => {
            return !blockingPairs.some((pair) => pair.attackerId === attackerId);
          });
          
          if (unblockedAttacker) {
            declareBlocker(unblockedAttacker, cardId);
            playSelectSound();
            setShowSparkle(true);
          }
        }
      }
    }
  };

  const isAttacking = attackingCards.includes(cardId);
  const isBlocking = blockingPairs.some((pair) => pair.blockerId === cardId);
  const animationClass = isNew && !hasAnimated ? "animate-draw" : "";

  const handleFlip = (nextState: boolean) => {
    if (flipped !== true && !isEnemy && !isDragging) {
      setIsFlipped(nextState);
    }
  };

  useEffect(() => {
    if (isDragging) {
      setIsFlipped(false);
    }
  }, [isDragging]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative w-64 h-96 cursor-pointer perspective-1000 ${animationClass} 
          ${isAttacking ? "ring-4 ring-yellow-500" : ""} 
          ${isBlocking ? "ring-4 ring-blue-500" : ""} 
          ${showSparkle ? "animate-sparkle" : ""}
          ${isDraggable ? "cursor-grab active:cursor-grabbing" : ""}
          ${isDragging ? "z-50" : ""}`}
        onMouseEnter={() => handleFlip(false)}
        onMouseLeave={() => handleFlip(true)}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div
            className={`absolute w-full h-full backface-hidden bg-gradient-to-br rounded-xl shadow-lg transition-opacity duration-300 ${
              isShowingFrontPart ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={frontCardImage}
              alt="Front of card"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className={`absolute w-full h-full backface-hidden bg-gradient-to-br rounded-xl shadow-lg [transform:rotateY(180deg)] transition-opacity duration-300 ${
              !isShowingFrontPart ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={backCardImage}
              alt="Back of card"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div
          className={`absolute bottom-5 left-2 transition-all duration-300 ${
            isShowingCardInfo ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 [filter:drop-shadow(0_0_15px_rgba(239,68,68,0.9))_drop-shadow(0_0_30px_rgba(239,68,68,0.9))] animate-pulse">
              <span className="text-3xl text-red-500 opacity-0">
                {attackPower}
              </span>
            </div>
            <span className="text-3xl text-red-500 relative [text-shadow:0_0_10px_rgba(239,68,68,0.9)]">
              {attackPower}
            </span>
          </div>
        </div>

        <div
          className={`absolute bottom-5 right-2 transition-all duration-300 ${
            isShowingCardInfo ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 [filter:drop-shadow(0_0_15px_rgba(34,197,94,0.9))_drop-shadow(0_0_30px_rgba(34,197,94,0.9))] animate-pulse">
              <span className="text-3xl text-green-500 opacity-0">
                {currentLife !== undefined ? currentLife : life}
              </span>
            </div>
            <span
              className={`text-3xl relative [text-shadow:0_0_10px_rgba(34,197,94,0.9)] ${
                currentLife !== undefined && currentLife < life
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {currentLife !== undefined ? currentLife : life}
            </span>
          </div>
        </div>

        <div
          className={`absolute top-0 right-2 transition-all duration-300 ${
            isShowingCardInfo ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 [filter:drop-shadow(0_0_15px_rgba(234,179,8,0.9))_drop-shadow(0_0_30px_rgba(234,179,8,0.9))] animate-pulse">
              <span className="text-3xl text-yellow-500 opacity-0">{cost}</span>
            </div>
            <span className="text-3xl text-yellow-500 relative [text-shadow:0_0_10px_rgba(234,179,8,0.9)]">
              {cost}
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes draw {
          0% {
            transform: translate(0, -100px);
            opacity: 0;
          }
          50% {
            transform: translate(0, -50px);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0);
            opacity: 1;
          }
        }

        @keyframes sparkle {
          0% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 0, 0.8));
          }
          100% {
            filter: brightness(1);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};
