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
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mercador/maguila.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/red-back-card.png`,
    attack: 8,
    life: 12,
    cost: 7,
    deck: "mercador",
  },
  {
    id: "mago-errrante",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mago/mago-errrante.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/blue-back-card.png`,
    attack: 5,
    life: 5,
    cost: 3,
    deck: "mago",
  },
  {
    id: "montanha",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mago/montanha.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/blue-back-card.png`,
    attack: 5,
    life: 5,
    cost: 3,
    deck: "mago",
  },
  {
    id: "predador",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mago/predador.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/blue-back-card.png`,
    attack: 5,
    life: 5,
    cost: 3,
    deck: "mago",
  },
  // NECROMANTE
  {
    id: "meia-noite",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/necromante/meia-noite.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/green-back-card.png`,
    attack: 12,
    life: 8,
    cost: 8,
    deck: "necromante",
  },
  {
    id: "cavaleiro-eterno",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/necromante/cavaleiro-eterno.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/green-back-card.png`,
    attack: 5,
    life: 5,
    cost: 3,
    deck: "necromante",
  },
  // MERCADOR
  {
    id: "kungf-u",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mercador/kungf-u.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/red-back-card.png`,
    attack: 6,
    life: 6,
    cost: 4,
    deck: "mercador",
  },
  {
    id: "zumbi-dos-palmares",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mercador/zumbi-dos-palmares.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/red-back-card.png`,
    attack: 15,
    life: 15,
    cost: 10,
    deck: "mercador",
  },
  {
    id: "falso-querubim",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mercador/falso-querubim.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/red-back-card.png`,
    attack: 7,
    life: 5,
    cost: 5,
    deck: "mercador",
  },
  {
    id: "fumador-de-almas",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mercador/fumador-de-almas.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/red-back-card.png`,
    attack: 4,
    life: 8,
    cost: 6,
    deck: "mercador",
  },
  {
    id: "homem-com-forca-de-burro",
    frontCardImage: `${import.meta.env.BASE_URL}cards-assets/mercador/homem-com-forca-de-burro.png`,
    backCardImage: `${import.meta.env.BASE_URL}cards-assets/red-back-card.png`,
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
