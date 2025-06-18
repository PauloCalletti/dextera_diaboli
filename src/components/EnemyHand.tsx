import { usePileStore } from "../store/usePileStore";
import { useMemo } from "react";

export const EnemyHand = () => {
  const { enemyHand } = usePileStore();

  if (enemyHand.length === 0) {
    return null;
  }

  // Calculate card scale based on number of cards
  const cardScale = useMemo(() => {
    return 0.65; // Same scale as player's hand
  }, []);

  // Calculate the spacing between cards based on available width
  const cardSpacing = useMemo(() => {
    const cardWidth = 256; // w-64 = 256px
    const scaledCardWidth = cardWidth * cardScale;
    const screenWidth = window.innerWidth;
    const maxWidth = screenWidth * 0.3; // Use 30% of screen width for opponent's hand
    const minSpacing = scaledCardWidth * 0.1; // Minimum 10% of card width visible

    // Calculate how much space we need vs how much we have
    const totalMinWidth = scaledCardWidth + minSpacing * (enemyHand.length - 1);
    const availableWidth = Math.min(maxWidth, screenWidth - 40);

    if (totalMinWidth <= availableWidth) {
      return minSpacing;
    } else {
      const overlap = (totalMinWidth - availableWidth) / (enemyHand.length - 1);
      return Math.max(minSpacing, scaledCardWidth - overlap);
    }
  }, [cardScale, enemyHand.length]);

  return (
    <div className="fixed top-1/4 right-5 z-10">
      <div className="relative">
        <div className="flex justify-end">
          <div className="relative flex items-center">
            {enemyHand.map((card, cardIndex) => {
              const leftPosition =
                cardIndex * (256 * cardScale - (256 * cardScale - cardSpacing));

              return (
                <div
                  key={card.id}
                  className="absolute"
                  style={{
                    right: `${leftPosition}px`,
                    zIndex: cardIndex,
                    transform: `scale(${cardScale})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div className="w-64 h-96">
                    <img
                      src={card.backCardImage}
                      alt="Card back"
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        .hand-container {
          padding: 10px;
          min-height: ${450 * cardScale}px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          position: relative;
        }
      `}</style>
    </div>
  );
};
