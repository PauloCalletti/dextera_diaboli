import { Card } from "./Card";
import { useMemo, useState } from "react";

interface DeckProps {
  cards: Array<{
    frontCardImage: string;
    backCardImage: string;
    id: string;
    attack: number;
    life: number;
    cost: number;
    isNew?: boolean;
  }>;
  verticalPosition?: "top" | "bottom";
}

export const Deck = ({ cards, verticalPosition = "bottom" }: DeckProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate card scale based on number of cards
  const cardScale = useMemo(() => {
    if (cards.length <= 5) return 1;
    if (cards.length <= 8) return 0.85;
    if (cards.length <= 12) return 0.7;
    return 0.6;
  }, [cards.length]);

  // Calculate the spacing between cards based on available width
  const cardSpacing = useMemo(() => {
    const cardWidth = 256; // w-64 = 256px
    const scaledCardWidth = cardWidth * cardScale;
    const screenWidth = window.innerWidth;
    const maxWidth = screenWidth * 0.9; // Use 90% of screen width
    const minSpacing = scaledCardWidth * 0.15; // Minimum 15% of card width visible

    // Calculate how much space we need vs how much we have
    const totalMinWidth = scaledCardWidth + (minSpacing * (cards.length - 1));
    const availableWidth = Math.min(maxWidth, screenWidth - 40); // Leave 20px padding on each side

    if (totalMinWidth <= availableWidth) {
      // We have enough space for minimum spacing
      return minSpacing;
    } else {
      // Calculate required overlap to fit within available width
      const overlap = (totalMinWidth - availableWidth) / (cards.length - 1);
      return Math.max(minSpacing, scaledCardWidth - overlap);
    }
  }, [cardScale, cards.length]);

  return (
    <div
      className={`fixed w-full ${
        verticalPosition === "top" ? "top-5" : "bottom-5"
      }`}
    >
      <div className="relative mx-auto" style={{ maxWidth: '90vw' }}>
        <div className="flex justify-center">
          <div 
            className="relative flex items-center hand-container"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {cards.map((card, cardIndex) => {
              const isHovered = hoveredIndex === cardIndex;
              const isNearHovered = hoveredIndex !== null && 
                Math.abs(hoveredIndex - cardIndex) <= 1;

              const leftPosition = cardIndex * (256 * cardScale - (256 * cardScale - cardSpacing));

              return (
                <div
                  key={cardIndex}
                  className="absolute card-wrapper"
                  style={{
                    left: `${leftPosition}px`,
                    zIndex: isHovered ? 50 : cardIndex,
                    transition: 'all 0.3s ease-in-out',
                    transform: `scale(${cardScale}) ${
                      isHovered 
                        ? 'translateY(-40px)' 
                        : isNearHovered 
                          ? 'translateX(' + (hoveredIndex < cardIndex ? '20px' : '-20px') + ')' 
                          : ''
                    }`,
                    transformOrigin: 'bottom center',
                  }}
                  onMouseEnter={() => setHoveredIndex(cardIndex)}
                >
                  <Card
                    frontCardImage={card.frontCardImage}
                    backCardImage={card.backCardImage}
                    cardId={card.id}
                    attack={card.attack}
                    life={card.life}
                    cost={card.cost}
                    isNew={card.isNew}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {cards.length > 0 && (
          <div className="absolute -top-8 left-0 bg-white/10 px-3 py-1 rounded-full text-white text-sm">
            {cards.length} cards in hand
          </div>
        )}
      </div>
      <style>{`
        .hand-container {
          padding: 20px;
          min-height: ${450 * cardScale}px;
          width: 100%;
          display: flex;
          justify-content: center;
          position: relative;
        }
        .card-wrapper {
          position: absolute;
        }
      `}</style>
    </div>
  );
};
