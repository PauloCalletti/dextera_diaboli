import loreVideo from "../assets/Menu/LORE.mp4";
import { useEffect, useRef, useState } from "react";

interface LoreProps {
  onBackToMenu: () => void;
}

export const Lore = ({ onBackToMenu }: LoreProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showMessage, setShowMessage] = useState(true);
  const [messageConfirmed, setMessageConfirmed] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Erro ao iniciar o vídeo de lore:", error);
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

  // Função para esconder a mensagem com fade
  const hideMessageWithFade = () => {
    setIsFading(true);
    setTimeout(() => {
      setShowMessage(false);
      setIsFading(false);
    }, 500); // Duração do fade
  };

  // Função para mostrar a mensagem e configurar timer para esconder
  const showMessageWithTimer = () => {
    setShowMessage(true);
    setMessageConfirmed(false);
    setIsFading(false);
    
    // Limpar timer anterior se existir
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
    }
    
    // Configurar novo timer para esconder após 5 segundos
    fadeTimerRef.current = setTimeout(() => {
      hideMessageWithFade();
    }, 5000);
  };

  // Esconder a mensagem após 3 segundos do início com fade
  useEffect(() => {
    const timer = setTimeout(() => {
      hideMessageWithFade();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        
        if (!showMessage) {
          // Primeira vez que aperta espaço - mostra a mensagem com timer
          showMessageWithTimer();
        } else if (!messageConfirmed) {
          // Segunda vez que aperta espaço - confirma e volta
          setMessageConfirmed(true);
          // Limpar timer se existir
          if (fadeTimerRef.current) {
            clearTimeout(fadeTimerRef.current);
          }
          onBackToMenu();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Limpar timer ao desmontar componente
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, [showMessage, messageConfirmed, onBackToMenu]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          className="absolute min-w-full min-h-full object-cover"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <source src={loreVideo} type="video/mp4" />
        </video>

        {/* Overlay escuro para melhorar a legibilidade */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Instrução para voltar */}
      {showMessage && (
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center transition-opacity duration-500 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}>
          <p className="text-white text-xl font-cinzel mb-2"
             style={{
               textShadow: '0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 0, 0, 0.4)',
             }}>
            {messageConfirmed ? "Voltando..." : "Pressione ESPAÇO para pular"}
          </p>
        </div>
      )}
    </div>
  );
}; 