type CardData = {
  id: string;
  frontCardImage: string;
  backCardImage: string;
  attack: number;
  life: number;
  cost: number;
};

const baseCards: CardData[] = [
  {
    id: "maguila",
    frontCardImage: "/cards-assets/maguila.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 8,
    life: 12,
    cost: 7,
  },
  {
    id: "meia-noite",
    frontCardImage: "/cards-assets/meia-noite.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 12,
    life: 8,
    cost: 8,
  },
  {
    id: "kungf-u",
    frontCardImage: "/cards-assets/kungf-u.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 6,
    life: 6,
    cost: 4,
  },
  {
    id: "zumbi-dos-palmares",
    frontCardImage: "/cards-assets/zumbi-dos-palmares.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 15,
    life: 15,
    cost: 10,
  },
  {
    id: "falso-querubim",
    frontCardImage: "/cards-assets/falso-querubim.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 7,
    life: 5,
    cost: 5,
  },
  {
    id: "fumador-de-almas",
    frontCardImage: "/cards-assets/fumador-de-almas.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 4,
    life: 8,
    cost: 6,
  },
  {
    id: "homem-com-forca-de-burro",
    frontCardImage: "/cards-assets/homem-com-forca-de-burro.png",
    backCardImage: "/cards-assets/red-back-card.png",
    attack: 10,
    life: 10,
    cost: 7,
  },
];

// Create variations maintaining the core stats
export const mockCards: CardData[] = Array.from({ length: 50 }, (_, index) => {
  const baseCard = baseCards[index % baseCards.length];
  const variation = Math.floor(index / baseCards.length) + 1;
  
  if (variation === 1) return baseCard; // First version is the original card
  
  // Create evolved versions with enhanced stats
  return {
    ...baseCard,
    id: `${baseCard.id}-${variation}`,
    attack: Math.min(20, Math.floor(baseCard.attack * (1 + variation * 0.2))),
    life: Math.min(20, Math.floor(baseCard.life * (1 + variation * 0.15))),
    cost: Math.min(10, baseCard.cost + Math.floor(variation / 2)),
  };
});
