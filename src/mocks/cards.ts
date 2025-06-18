export type DeckId = "mercador" | "necromante" | "mago";

type CardData = {
  id: string;
  frontCardImage: string;
  backCardImage: string;
  attack: number;
  life: number;
  cost: number;
  deck: DeckId;
};

const baseCards: CardData[] = [
  // MAGO
  {
    id: "maguila",
    frontCardImage: "/cards-assets/mercador/maguila.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 8,
    life: 12,
    cost: 7,
    deck: "mercador",
  },
  {
    id: "mago-errrante",
    frontCardImage: "/cards-assets/mago/mago-errrante.png",
    backCardImage: "/cards-assets/blue-back-card.png",
    attack: 5,
    life: 5,
    cost: 3,
    deck: "mago",
  },
  {
    id: "montanha",
    frontCardImage: "/cards-assets/mago/montanha.png",
    backCardImage: "/cards-assets/blue-back-card.png",
    attack: 5,
    life: 5,
    cost: 3,
    deck: "mago",
  },
  {
    id: "predador",
    frontCardImage: "/cards-assets/mago/predador.png",
    backCardImage: "/cards-assets/blue-back-card.png",
    attack: 5,
    life: 5,
    cost: 3,
    deck: "mago",
  },
  // NECROMANTE
  {
    id: "meia-noite",
    frontCardImage: "/cards-assets/necromante/meia-noite.png",
    backCardImage: "/cards-assets/green-back-card.png",
    attack: 12,
    life: 8,
    cost: 8,
    deck: "necromante",
  },
  {
    id: "cavaleiro-eterno",
    frontCardImage: "/cards-assets/necromante/cavaleiro-eterno.png",
    backCardImage: "/cards-assets/green-back-card.png",
    attack: 5,
    life: 5,
    cost: 3,
    deck: "necromante",
  },
  // MERCADOR
  {
    id: "kungf-u",
    frontCardImage: "/cards-assets/mercador/kungf-u.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 6,
    life: 6,
    cost: 4,
    deck: "mercador",
  },
  {
    id: "zumbi-dos-palmares",
    frontCardImage: "/cards-assets/mercador/zumbi-dos-palmares.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 15,
    life: 15,
    cost: 10,
    deck: "mercador",
  },
  {
    id: "falso-querubim",
    frontCardImage: "/cards-assets/mercador/falso-querubim.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 7,
    life: 5,
    cost: 5,
    deck: "mercador",
  },
  {
    id: "fumador-de-almas",
    frontCardImage: "/cards-assets/mercador/fumador-de-almas.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 4,
    life: 8,
    cost: 6,
    deck: "mercador",
  },
  {
    id: "homem-com-forca-de-burro",
    frontCardImage: "/cards-assets/mercador/homem-com-forca-de-burro.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 10,
    life: 10,
    cost: 7,
    deck: "mercador",
  },
];

// Each player should have a hand/pile of 20 cards, repeating baseCards as needed
export function getDeck(deck: DeckId): CardData[] {
  const cards = baseCards.filter(card => card.deck === deck);
  return Array.from({ length: 20 }, (_, i) => cards[i % cards.length]);
}

export { baseCards };
