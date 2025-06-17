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
import themeSound from "./assets/audio/theme.mp3";
import { Essence } from "./components/Essence";
import { Arena } from "./components/Arena";
import DiabolicalLifeCounter from "./components/LifeCounter";
import { MainMenu } from "./components/MainMenu";
import { useLifeStore } from "./store/useLifeStore";
import { GameOver } from "./components/GameOver";
import { EnemyHand } from "./components/EnemyHand";

function App() {
  const { expandedCard, setExpandedCard } = useCardStore();
  const { musicVolume } = useAudioStore();
  const { playerHand } = usePileStore();
  const { playerArenaCards, enemyArenaCards } = useArenaStore();
  const { resetLife, isGameOver } = useLifeStore();
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const filteredExpandedCard = mockCards.find(
    (card) => card.id === expandedCard
  );

  const startGame = () => {
    setIsGameStarted(true);
    resetLife(); // Reset life points when starting a new game
    usePileStore.getState().initializePiles(); // Initialize both player and enemy piles
    if (themeAudioRef.current) {
      themeAudioRef.current.play().catch((error) => {
        console.log("Theme audio playback failed:", error);
      });
    }
  };

  const handleRestart = () => {
    resetLife();
    // Reset other game states if needed
    setIsGameStarted(false);
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

  if (!isGameStarted) {
    return <MainMenu onStartGame={startGame} />;
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
