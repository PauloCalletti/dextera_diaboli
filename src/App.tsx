import "./App.css";
import { Deck } from "./components/Deck";
import { ExpandedCard } from "./components/ExpandedCard";
import { VolumeControl } from "./components/VolumeControl";
import { TurnControl } from "./components/TurnControl";
import { Pile } from "./components/Pile";
import { mockCards } from "./mocks/cards";
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
import { EnemyHand } from "./components/EnemyHand";
import { CharacterSelection } from "./components/CharacterSelection";

type GameState = "menu" | "character-selection" | "arena";

function App() {
  const { expandedCard, setExpandedCard } = useCardStore();
  const { musicVolume } = useAudioStore();
  const { playerHand } = usePileStore();
  const { playerArenaCards, enemyArenaCards } = useArenaStore();
  const { resetLife, isGameOver } = useLifeStore();
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const filteredExpandedCard = mockCards.find(
    (card) => card.id === expandedCard
  );

  const startGame = () => {
    setGameState("character-selection");
  };

  const handleCharacterSelected = (characterId: string) => {
    setSelectedCharacter(characterId);
    setGameState("arena");
    resetLife(); // Reset life points when starting a new game
    usePileStore.getState().initializePiles(); // Initialize both player and enemy piles
    
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
    <div>
      <VolumeControl />
      <TurnControl />
      <Essence />
      <Pile isEnemy={false} />
      <Pile isEnemy={true} />
      <Deck cards={playerHand} verticalPosition="bottom" />
      <EnemyHand />
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

      <Arena playerCards={playerArenaCards} enemyCards={enemyArenaCards} />

      {isGameOver() && <GameOver onRestart={handleRestart} />}
    </div>
  );
}

export default App;
