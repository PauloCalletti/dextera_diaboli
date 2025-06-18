import "./App.css";
import { Deck } from "./components/Deck";
import { ExpandedCard } from "./components/ExpandedCard";
import { TurnControl } from "./components/TurnControl";
import { Pile } from "./components/Pile";
import { baseCards } from "./mocks/cards";
import { useCardStore } from "./store/useCardStore";
import { useAudioStore } from "./store/useAudioStore";
import { usePileStore } from "./store/usePileStore";
import { useArenaStore } from "./store/useArenaStore";
import { useEffect, useRef, useState } from "react";
import themeSound from "./assets/audio/battletheme.mp3";
import { Essence } from "./components/Essence";
import { Arena } from "./components/Arena";
import DiabolicalLifeCounter from "./components/LifeCounter";
import { MainMenu } from "./components/MainMenu";
import { useLifeStore } from "./store/useLifeStore";
import { GameOver } from "./components/GameOver";
import { CharacterSelection } from "./components/CharacterSelection";
import backgroundImage from "./assets/img/board-background.png";
import { useEssenceStore } from "./store/useEssenceStore";
import { useBattleStore } from "./store/useBattleStore";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import type { DeckId } from "./mocks/cards";

type GameState = "menu" | "character-selection" | "arena";

function App() {
  const { expandedCard, setExpandedCard } = useCardStore();
  const { musicVolume } = useAudioStore();
  const { playerHand, enemyHand } = usePileStore();
  const { playerArenaCards, enemyArenaCards } = useArenaStore();
  const { resetLife, isGameOver } = useLifeStore();
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [overSlotId, setOverSlotId] = useState<string | null>(null);
  const [enemyDeck, setEnemyDeck] = useState<DeckId | null>(null);

  const filteredExpandedCard = baseCards.find(
    (card) => card.id === expandedCard
  );

  const allDecks: DeckId[] = ["mercador", "necromante", "mago"];

  const startGame = () => {
    setGameState("character-selection");
  };

  const handleCharacterSelected = (characterId: string) => {
    setSelectedCharacter(characterId);
    setGameState("arena");
    resetLife();
    // Pick a random deck for the enemy that is not the player's choice
    const enemyDeckOptions = allDecks.filter(deck => deck !== characterId);
    const enemyDeckId = enemyDeckOptions[Math.floor(Math.random() * enemyDeckOptions.length)];
    setEnemyDeck(enemyDeckId);
    usePileStore.getState().initializePiles(characterId as DeckId, enemyDeckId);

    // Start theme when entering arena
    if (themeAudioRef.current) {
      themeAudioRef.current.play().catch((error) => {
        console.log("Theme audio playback failed:", error);
      });
    }
  };

  const handleRestart = () => {
    resetLife();
    setGameState("menu");
    setSelectedCharacter(null);
    useCardStore.getState().setExpandedCard(null);
    // On restart, re-initialize piles with the last selected decks if available
    if (selectedCharacter && enemyDeck) {
      usePileStore.getState().initializePiles(selectedCharacter as DeckId, enemyDeck);
    }
    useArenaStore.getState().resetArena();
    useEssenceStore.getState().resetEssence();
    useBattleStore.getState().setState({
      attackingCards: [],
      blockingPairs: [],
      combatPhase: "none",
      isPlayerTurn: true,
      canAttack: true,
    });
  };

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setOverSlotId(over.id as string);
    } else {
      setOverSlotId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setOverSlotId(null);

    if (!over) return;

    const cardId = active.id as string;
    const targetSlot = over.id as string;

    // Check if the card is in the player's hand
    const cardInHand = playerHand.find((card) => card.id === cardId);
    if (!cardInHand) return;

    // Get the essence store and check if we have enough essence
    const essenceStore = useEssenceStore.getState();
    if (!essenceStore.spendEssence(cardInHand.cost)) {
      return; // Not enough essence, can't play the card
    }

    // Get the arena store
    const arenaStore = useArenaStore.getState();

    // Check if we can play the card (arena not full)
    if (arenaStore.playerArenaCards.length >= 5) return;

    // Play the card to the specified slot
    arenaStore.playCard(cardId);
  };

  useEffect(() => {
    themeAudioRef.current = new Audio(themeSound);
    themeAudioRef.current.volume = musicVolume;
    themeAudioRef.current.loop = true;

    return () => {
      if (themeAudioRef.current) {
        themeAudioRef.current.pause();
        themeAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (themeAudioRef.current) {
      themeAudioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  if (gameState === "menu") {
    return <MainMenu onStartGame={startGame} />;
  }

  if (gameState === "character-selection") {
    return <CharacterSelection onCharacterSelected={handleCharacterSelected} />;
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div
          style={{
            position: "absolute",
            background: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.8,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            background: `black`,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.4,
          }}
        ></div>
        {/* <VolumeControl /> */}
        <Essence />
        <Pile isEnemy={false} />
        <Pile isEnemy={true} />
        <Deck cards={playerHand} verticalPosition="bottom" />
        <Deck cards={enemyHand} verticalPosition="top" />
        <TurnControl />
        <DiabolicalLifeCounter isEnemy={false} />
        <DiabolicalLifeCounter isEnemy={true} />

        {expandedCard && (
          <ExpandedCard
            frontCardImage={filteredExpandedCard?.frontCardImage}
            attack={filteredExpandedCard?.attack ?? 0}
            life={filteredExpandedCard?.life ?? 0}
            cost={filteredExpandedCard?.cost ?? 0}
            handleCloseExpanded={() => {
              setExpandedCard(null);
            }}
          />
        )}

        <Arena
          playerCards={playerArenaCards}
          enemyCards={enemyArenaCards}
          activeDragId={activeDragId}
          overSlotId={overSlotId}
        />

        {isGameOver() && <GameOver onRestart={handleRestart} />}
      </div>
    </DndContext>
  );
}

export default App;
