import { usePileStore } from "../store/usePileStore";
import { useState } from "react";

interface PileProps {
  isEnemy?: boolean;
}

export const Pile = ({ isEnemy = false }: PileProps) => {
  const { pileCards, enemyPileCards } = usePileStore();
  const [isDrawing] = useState(false);

  const cards = isEnemy ? enemyPileCards : pileCards;

  if (cards.length === 0) {
    return null;
  }

  // Only show the top card of the pile
  const topCard = cards[0];

  return (
    <div
      className={`fixed ${isEnemy ? "top-8" : "bottom-8"} ${
        isEnemy ? "right-[225px]" : "left-[150px]"
      } z-10`}
    >
      <div
        className={`relative transition-all duration-300 ${
          isDrawing ? "opacity-0 transform -translate-y-8" : ""
        }`}
      >
        {/* Show multiple cards stacked if there are more than one */}
        {cards.length > 1 && (
          <>
            <div
              className="absolute -bottom-1 -right-1 w-40 h-61"
              style={{ transform: "rotate(2deg)" }}
            >
              <img
                src={topCard.backCardImage}
                alt="Stack card"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-40 h-61"
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
        <div className="relative w-40 h-61">
          <img
            src={topCard.backCardImage}
            alt="Top card"
            className="w-full h-full object-cover rounded-xl"
          />

          {cards.length > 0 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-bold text-gray-800">
              {cards.length} cartas restantes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
