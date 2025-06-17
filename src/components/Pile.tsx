import { Card } from "./Card";
import { usePileStore } from "../store/usePileStore";
import { useState } from "react";

interface PileProps {
  isEnemy?: boolean;
}

export const Pile = ({ isEnemy = false }: PileProps) => {
  const { pileCards, enemyPileCards, drawCard, drawEnemyCard } = usePileStore();
  const [isDrawing, setIsDrawing] = useState(false);

  const cards = isEnemy ? enemyPileCards : pileCards;
  const drawFunction = isEnemy ? drawEnemyCard : drawCard;

  if (cards.length === 0) {
    return null;
  }

  const handleDrawCard = () => {
    if (isEnemy) return; // Only player can draw cards by clicking
    setIsDrawing(true);
    setTimeout(() => {
      drawFunction();
      setIsDrawing(false);
    }, 300);
  };

  // Only show the top card of the pile
  const topCard = cards[0];

  return (
    <div className={`fixed top-1/2 -translate-y-1/2 ${isEnemy ? 'right-8' : 'left-8'} z-10`}>
      <div
        className={`relative transition-all duration-300 ${
          isDrawing ? "opacity-0 transform -translate-y-8" : !isEnemy ? "hover:scale-105 cursor-pointer" : ""
        }`}
        onClick={handleDrawCard}
      >
        {/* Show multiple cards stacked if there are more than one */}
        {cards.length > 1 && (
          <>
            <div
              className="absolute -bottom-1 -right-1 w-48 h-72"
              style={{ transform: "rotate(2deg)" }}
            >
              <img
                src={topCard.backCardImage}
                alt="Stack card"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-48 h-72"
              style={{ transform: "rotate(1deg)" }}
            >
              <img
                src={topCard.backCardImage}
                alt="Stack card"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </>
        )}

        {/* Top card - always face down */}
        <div className="relative w-48 h-72">
          <img
            src={topCard.backCardImage}
            alt="Top card"
            className="w-full h-full object-cover rounded-xl"
          />

          {cards.length > 0 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-800">
              {cards.length} cartas restantes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
