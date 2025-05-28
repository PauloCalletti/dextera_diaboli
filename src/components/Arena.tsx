import { Card } from "./Card";
import { useMemo } from "react";

interface ArenaProps {
  playerCards: Array<{
    frontCardImage: string;
    backCardImage: string;
    id: string;
    attack: number;
    life: number;
    cost: number;
  }>;
  enemyCards: Array<{
    frontCardImage: string;
    backCardImage: string;
    id: string;
    attack: number;
    life: number;
    cost: number;
  }>;
}

export const Arena = ({ playerCards, enemyCards }: ArenaProps) => {
  // Calculate card scale based on number of cards
  const cardScale = useMemo(() => {
    const totalCards = playerCards.length + enemyCards.length;
    if (totalCards <= 5) return 0.8;
    if (totalCards <= 8) return 0.7;
    return 0.6;
  }, [playerCards.length, enemyCards.length]);

  // Function to chunk array into groups of 5
  const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Split cards into rows of 5
  const enemyCardRows = chunkArray(enemyCards, 5);
  const playerCardRows = chunkArray(playerCards, 5);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-0">
      <div className="relative mx-auto" style={{ maxWidth: "80vw" }}>
        {/* Enemy side */}
        <div className="flex flex-col mb-8">
          {enemyCardRows.map((row, rowIndex) => (
            <div key={`enemy-row-${rowIndex}`} className="flex justify-center ">
              {row.map((card, index) => (
                <div
                  key={card.id}
                  style={{
                    transform: `scale(${cardScale})`,
                    transformOrigin: "bottom center",
                  }}
                >
                  <Card
                    frontCardImage={card.frontCardImage}
                    backCardImage={card.backCardImage}
                    cardId={card.id}
                    attack={card.attack}
                    life={card.life}
                    cost={card.cost}
                    flipped={true}
                    isInArena={true}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Player side */}
        <div className="flex flex-col ">
          {playerCardRows.map((row, rowIndex) => (
            <div
              key={`player-row-${rowIndex}`}
              className="flex justify-center "
            >
              {row.map((card, index) => (
                <div
                  key={card.id}
                  style={{
                    transform: `scale(${cardScale})`,
                    transformOrigin: "top center",
                  }}
                >
                  <Card
                    frontCardImage={card.frontCardImage}
                    backCardImage={card.backCardImage}
                    cardId={card.id}
                    attack={card.attack}
                    life={card.life}
                    cost={card.cost}
                    isInArena={true}
                    flipped={true}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
