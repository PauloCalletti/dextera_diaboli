import "./App.css";
import { Deck } from "./components/Deck";
import { ExpandedCard } from "./components/ExpandedCard";
import { VolumeController } from "./components/VolumeController";
import { Pile } from "./components/Pile";
import { mockCards } from "./mocks/cards";
import { useCardStore } from "./store/useCardStore";
import { useAudioStore } from "./store/useAudioStore";
import { usePileStore } from "./store/usePileStore";
import { useEffect, useRef } from "react";
import themeSound from "./assets/audio/theme.mp3";
import { Essence } from "./components/Essence";

function App() {
  const { expandedCard, setExpandedCard } = useCardStore();
  const { volume } = useAudioStore();
  const { playerHand } = usePileStore();
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);

  const filteredExpandedCard = mockCards.find(
    (card) => card.id === expandedCard
  );

  useEffect(() => {
    themeAudioRef.current = new Audio(themeSound);
    themeAudioRef.current.volume = volume;
    themeAudioRef.current.loop = true;
    themeAudioRef.current.play().catch((error) => {
      console.log("Theme audio playback failed:", error);
    });

    return () => {
      if (themeAudioRef.current) {
        themeAudioRef.current.pause();
        themeAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (themeAudioRef.current) {
      themeAudioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div>
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
      
      <VolumeController />
    </div>
  );
}

export default App;
