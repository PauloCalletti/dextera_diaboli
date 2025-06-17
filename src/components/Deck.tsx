import { Card } from "./Card";
import { useMemo, useState } from "react";
import { FlipButton } from "./FlipButton";

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
  const [flipAllCards, setFlipAllCards] = useState(false);

  // Calculate card scale based on number of cards
  const cardScale = useMemo(() => {
    return 0.65; // Always use small scale
  }, []);

  // Calculate the spacing between cards based on available width
  const cardSpacing = useMemo(() => {
    const cardWidth = 256; // w-64 = 256px
    const scaledCardWidth = cardWidth * cardScale;
    const screenWidth = window.innerWidth;
    const maxWidth = screenWidth * 0.9; // Use 90% of screen width
    const minSpacing = scaledCardWidth * 0.15; // Minimum 15% of card width visible

    // Calculate how much space we need vs how much we have
    const totalMinWidth = scaledCardWidth + minSpacing * (cards.length - 1);
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

  const handleFlipAllCards = () => {
    setFlipAllCards(!flipAllCards);
  };

  return (
    <div
      className={`fixed w-full ${
        verticalPosition === "top" ? "top-5" : "bottom-20"
      }`}
    >
      <div className="relative mx-auto" style={{ maxWidth: "90vw" }}>
        <div className="flex justify-center">
          <div
            className="relative flex items-center hand-container"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {cards.map((card, cardIndex) => {
              const isHovered = hoveredIndex === cardIndex;
              const isNearHovered =
                hoveredIndex !== null &&
                Math.abs(hoveredIndex - cardIndex) <= 1;

              const leftPosition =
                cardIndex * (256 * cardScale - (256 * cardScale - cardSpacing));

              return (
                <div
                  key={cardIndex}
                  className="absolute card-wrapper"
                  style={{
                    left: `${leftPosition}px`,
                    zIndex: isHovered ? 50 : cardIndex,
                    transition: "all 0.3s ease-in-out",
                    transform: `scale(${cardScale}) ${
                      isHovered
                        ? "translateY(-40px)"
                        : isNearHovered
                        ? "translateX(" +
                          (hoveredIndex < cardIndex ? "20px" : "-20px") +
                          ")"
                        : ""
                    }`,
                    transformOrigin: "bottom center",
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
                    flipped={flipAllCards === false ? undefined : true}
                  />
                </div>
              );
            })}
          </div>
        </div>
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
      {cards.length > 0 && (
        <div className="absolute bottom-[10px]">
          <FlipButton onClick={handleFlipAllCards} cardCount={cards.length} />
        </div>
      )}
    </div>
  );
};
