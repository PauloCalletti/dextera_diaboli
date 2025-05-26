import { useEffect, useState, useRef } from "react";
import flipSound from "../assets/audio/card-flip.mp3";
import { useCardStore } from "../store/useCardStore";
import { useAudioStore } from "../store/useAudioStore";

interface CardProps {
  frontCardImage: string;
  backCardImage: string;
  cardId: string;
  attack: number;
  life: number;
  cost: number;
  isNew?: boolean;
}

export const Card = ({
  frontCardImage,
  backCardImage,
  cardId,
  attack,
  life,
  cost,
  isNew = false,
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(true);
  const [isShowingFrontPart, setIsShowingFrontPart] = useState(true);
  const [isShowingCardInfo, setIsShowingCardInfo] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(!isNew);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setExpandedCard } = useCardStore();
  const { volume } = useAudioStore();

  useEffect(() => {
    audioRef.current = new Audio(flipSound);
    audioRef.current.volume = volume;

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
    };
  }, [volume, isNew, hasAnimated]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowingFrontPart(!isFlipped);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.log("Audio playback failed:", error);
        });
      }
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedCard(cardId);
    setIsFlipped(true);
  };

  const animationClass = isNew && !hasAnimated
    ? "animate-draw"
    : "";

  return (
    <>
      <div
        className={`relative w-64 h-96 cursor-pointer perspective-1000 ${animationClass}`}
        onMouseEnter={() => setIsFlipped(false)}
        onMouseLeave={() => setIsFlipped(true)}
        onContextMenu={handleContextMenu}
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
              <span className="text-3xl text-red-500 opacity-0">{attack}</span>
            </div>
            <span className="text-3xl text-red-500 relative [text-shadow:0_0_10px_rgba(239,68,68,0.9)]">
              {attack}
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
              <span className="text-3xl text-green-500 opacity-0">{life}</span>
            </div>
            <span className="text-3xl text-green-500 relative [text-shadow:0_0_10px_rgba(34,197,94,0.9)]">
              {life}
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
        .animate-draw {
          animation: draw 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};
