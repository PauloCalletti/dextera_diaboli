import { useLifeStore } from "../store/useLifeStore";
import { useEffect, useRef } from "react";
import deathSound from "../assets/audio/Death.mp3";

interface GameOverProps {
  onRestart: () => void;
}

export const GameOver = ({ onRestart }: GameOverProps) => {
  const { getWinner } = useLifeStore();
  const winner = getWinner();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-4 text-red-500">
          {winner === 'player' ? 'Vitória!' : 'Derrota!'}
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          {winner === 'player' 
            ? 'Você derrotou seu oponente!' 
            : 'Seu oponente derrotou você!'}
        </p>
        <button
          onClick={onRestart}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Jogar Novamente
        </button>
        <audio ref={audioRef} src={deathSound} />
      </div>
    </div>
  );
}; 