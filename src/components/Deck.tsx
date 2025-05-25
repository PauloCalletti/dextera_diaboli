import { Card } from "./Card";

interface DeckProps {
  cards: Array<{
    frontCardImage: string;
    backCardImage: string;
    id: string;
    attack: number;
    life: number;
    cost: number;
  }>;
  verticalPosition?: "top" | "bottom";
}

export const Deck = ({ cards, verticalPosition = "bottom" }: DeckProps) => {
  const maxCardsPerRow = 5;
  const cardsToShow = cards.slice(0, maxCardsPerRow);

  return (
    <div
      className={`overflow-x-auto absolute left-1/2 -translate-x-1/2 ${
        verticalPosition === "top" ? "top-5" : "bottom-5"
      }`}
    >
      <div className="relative min-w-max">
        <div className="grid grid-cols-5 gap-4">
          {cardsToShow.map((card, cardIndex) => (
            <Card
              key={cardIndex}
              frontCardImage={card.frontCardImage}
              backCardImage={card.backCardImage}
              cardId={card.id}
              attack={card.attack}
              life={card.life}
              cost={card.cost}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
