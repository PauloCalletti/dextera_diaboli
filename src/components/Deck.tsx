import { Card } from "./Card";
import { useMemo, useState } from "react";
import { FlipButton } from "./FlipButton";
import { useTurnStore } from "../store/useTurnStore";

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
  const { isPlayerTurn, currentPhase } = useTurnStore();

  // Calculate card scale based on number of cards
  const cardScale = useMemo(() => {
    const cardHeight = 384; // h-96 = 384px
    const containerHeight = 150;
    // Adjust scale to be smaller in production
    return Math.min((containerHeight * 2) / cardHeight, 0.65);
  }, []);

  // Calculate the spacing between cards based on available width
  const cardSpacing = useMemo(() => {
    const cardWidth = 256; // w-64 = 256px
    const scaledCardWidth = cardWidth * cardScale;
    const containerWidth = window.innerWidth * 0.5; // 50vw
    const minSpacing = scaledCardWidth * 0.18; // Increased from 0.15 to 0.25 (25% of card width visible)

    // Calculate how much space we need vs how much we have
    const totalMinWidth = scaledCardWidth + minSpacing * (cards.length - 1);
    const availableWidth = containerWidth - 40; // Leave 20px padding on each side

    if (totalMinWidth <= availableWidth) {
      return minSpacing;
    } else {
      const overlap = (totalMinWidth - availableWidth) / (cards.length - 1);
      return Math.max(minSpacing, scaledCardWidth - overlap);
    }
  }, [cardScale, cards.length]);

  const handleFlipAllCards = () => {
    setFlipAllCards(!flipAllCards);
  };

  // Determine if cards should be draggable
  const isDraggable = verticalPosition === "bottom" && isPlayerTurn && currentPhase === "play";

  return (
    <div
      className={`absolute h-[150px] left-[25%] w-[50vw] z-10 ${
        verticalPosition === "top" ? "top-5" : "bottom-0"
      }`}
    >
      <div className="relative mx-auto h-full">
        <div className="flex justify-center h-full">
          <div
            className="relative flex items-end justify-center hand-container"
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
                    bottom: 0,
                    zIndex: isHovered ? 50 : cardIndex,
                    transition: "all 0.3s ease-in-out",
                    transform: `scale(${cardScale}) ${
                      isHovered
                        ? "translateY(0)"
                        : isNearHovered
                        ? "translateX(" +
                          (hoveredIndex < cardIndex ? "20px" : "-20px") +
                          ")"
                        : `translateY(${
                            verticalPosition === "top" ? "0%" : "50%"
                          })`
                    }`,
                    transformOrigin: "bottom center",
                  }}
                  onMouseEnter={() => {
                    if (verticalPosition === "top") {
                      return;
                    }
                    setHoveredIndex(cardIndex);
                  }}
                >
                  <Card
                    frontCardImage={card.frontCardImage}
                    backCardImage={card.backCardImage}
                    cardId={card.id}
                    attackPower={card.attack}
                    life={card.life}
                    cost={card.cost}
                    isNew={card.isNew}
                    isEnemy={verticalPosition === "top"}
                    isDraggable={isDraggable}
                    flipped={
                      verticalPosition === "top"
                        ? false
                        : flipAllCards === false
                        ? undefined
                        : true
                    }
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
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          position: relative;
          overflow: visible;
        }
        .card-wrapper {
          position: absolute;
          will-change: transform;
        }
      `}</style>
      {cards.length > 0 && (
        <div
          className={`absolute ${
            verticalPosition === "top" ? "top-[10px]" : "bottom-[10px]"
          }`}
        >
          <FlipButton onClick={handleFlipAllCards} cardCount={cards.length} />
        </div>
      )}
    </div>
  );
};
