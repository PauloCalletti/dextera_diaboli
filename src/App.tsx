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

function App() {
  const { expandedCard, setExpandedCard } = useCardStore();
  const { musicVolume } = useAudioStore();
  const { playerHand } = usePileStore();
  const { playerArenaCards, enemyArenaCards } = useArenaStore();
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const filteredExpandedCard = mockCards.find(
    (card) => card.id === expandedCard
  );

  const startGame = () => {
    setIsGameStarted(true);
    if (themeAudioRef.current) {
      themeAudioRef.current.play().catch((error) => {
        console.log("Theme audio playback failed:", error);
      });
    }
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
    return (
      <div
        className="start-screen"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
        <button
          onClick={startGame}
          style={{
            padding: "20px 40px",
            fontSize: "24px",
            backgroundColor: "#4a4a4a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div>
      <VolumeControl />
      <TurnControl />
      <Essence />
      <Pile />
      <Deck cards={playerHand} verticalPosition="bottom" />

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
    </div>
  );
}

export default App;
