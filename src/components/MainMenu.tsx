import loopingVideo from "../assets/menu/looping.mp4";
import startVideo from "../assets/menu/start.mp4";
import { useEffect, useRef, useState } from "react";
import { Lore } from "./Lore";

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startVideoRef = useRef<HTMLVideoElement>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLore, setShowLore] = useState(false);
  const [shouldRestartVideo, setShouldRestartVideo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Erro ao iniciar o vídeo:", error);
          document.addEventListener('click', async () => {
            try {
              await video.play();
            } catch (e) {
              console.log("Erro ao iniciar o vídeo após interação:", e);
            }
          }, { once: true });
        }
      };

      playVideo();
    }
  }, []);

  // Efeito para reiniciar o vídeo quando voltar do Lore
  useEffect(() => {
    if (shouldRestartVideo) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
        
        setTimeout(async () => {
          try {
            await video.play();
          } catch (error) {
            console.log("Erro ao reiniciar o vídeo:", error);
          }
        }, 100);
      }
      setShouldRestartVideo(false);
    }
  }, [shouldRestartVideo]);

  // Efeito para mostrar o menu com fade in
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMenu(true);
    }, 500);

    return () => clearTimeout(timer);
    
  }, []);

  const handleStartGame = async () => {
    setIsStarting(true);
    const startVid = startVideoRef.current;
    
    if (startVid) {
      try {
        await startVid.play();
        startVid.onended = () => {
          onStartGame();
        };
      } catch (error) {
        console.log("Erro ao reproduzir vídeo de start:", error);
        onStartGame();
      }
    } else {
      onStartGame();
    }
  };

  const handleLoreClick = () => {
    setShowLore(true);
  };

  const handleBackToMenu = () => {
    setShowLore(false);
    setShouldRestartVideo(true);
  };

  if (showLore) {
    return <Lore onBackToMenu={handleBackToMenu} />;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <source src={loopingVideo} type="video/mp4" />
        </video>

        {/* Video de Start (inicialmente oculto) */}
        <video
          ref={startVideoRef}
          playsInline
          className={`absolute min-w-full min-h-full object-cover transition-opacity duration-1000 ${
            isStarting ? 'opacity-100 z-10' : 'opacity-0 -z-10'
          }`}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <source src={startVideo} type="video/mp4" />
        </video>

        {/* Overlay escuro para melhorar a legibilidade */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Conteúdo do Menu */}
      <div className={`relative h-full flex flex-col items-center justify-center transition-opacity duration-1000 ${
        showMenu ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-center space-y-16">
          {/* Título com animação */}
          <h1 
            className="text-7xl font-cinzel text-white mb-8 animate-float"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)',
            }}
          >
            Dextera Diaboli
          </h1>
          
          {/* Menu Items */}
          <div className="flex flex-col items-center space-y-8">
            <span 
              onClick={handleStartGame}
              className="text-4xl font-cinzel text-white cursor-pointer hover:text-purple-300 transition-colors duration-300 select-none"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
                outline: 'none',
                userSelect: 'none',
              }}
            >
              Start Game
            </span>
            
            <span 
              className="text-4xl font-cinzel text-white cursor-pointer hover:text-purple-300 transition-colors duration-300 select-none"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
                outline: 'none',
                userSelect: 'none',
              }}
            >
              Options
            </span>
            
            <span 
              onClick={handleLoreClick}
              className="text-4xl font-cinzel text-white cursor-pointer hover:text-purple-300 transition-colors duration-300 select-none"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
                outline: 'none',
                userSelect: 'none',
              }}
            >
              Lore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
