import { Card } from "./Card";
import { usePileStore } from "../store/usePileStore";
import { useState } from "react";

export const Pile = () => {
  const { pileCards, drawCard } = usePileStore();
  const [isDrawing, setIsDrawing] = useState(false);

  if (pileCards.length === 0) {
    return null;
  }

  const handleDrawCard = () => {
    setIsDrawing(true);
    setTimeout(() => {
      drawCard();
      setIsDrawing(false);
    }, 300);
  };

  // Only show the top card of the pile
  const topCard = pileCards[0];

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-8 z-10">
      <div
        className={`relative cursor-pointer transition-all duration-300 ${
          isDrawing ? "opacity-0 transform -translate-y-8" : "hover:scale-105"
        }`}
        onClick={handleDrawCard}
      >
        {/* Show multiple cards stacked if there are more than one */}
        {pileCards.length > 1 && (
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

          {pileCards.length > 0 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-800">
              {pileCards.length} cartas restantes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
