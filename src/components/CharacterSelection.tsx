import { useState, useEffect } from "react";
import { useAudioStore } from "../store/useAudioStore";
import themeSound from "../assets/audio/theme.mp3";

interface CharacterSelectionProps {
  onCharacterSelected: (characterId: string) => void;
}

interface Character {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export const CharacterSelection = ({ onCharacterSelected }: CharacterSelectionProps) => {
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const { musicVolume } = useAudioStore();

  const characters: Character[] = [
    {
      id: "mercador",
      title: "Mercador",
      subtitle: "Tudo tem um preço — até mesmo a salvação.",
      description:
        "Ardiloso, cínico e envolto em charme sujo, o mercador domina a arte da barganha infernal. Traficante de relíquias malditas e contratos duvidosos, ele transforma cada troca em um jogo de poder. Nem santo nem pecador — ele é apenas negócios.",
      image: `${import.meta.env.BASE_URL}cards-assets/mercador.png`,
    },
    {
      id: "necromante",
      title: "Necromante",
      subtitle: "Senhores da morte, filhos da perdição.",
      description:
        "O necromante não teme o fim — ele o manipula. Cada alma coletada é uma moeda de poder, e cada cadáver, um instrumento. Invocam horrores do além e drenam a essência dos vivos para alimentar sua fome por almas. Onde ele pisa, a terra apodrece e a esperança morre.",
      image: `${import.meta.env.BASE_URL}cards-assets/necromante.png`,
    },
    {
      id: "mago",
      title: "Mago",
      subtitle: "Mestres do arcano, guardiões do impossível.",
      description:
        "Vivem entre tomos esquecidos e bibliotecas ocultas, onde os segredos do universo são lidos e reescritos. O mago domina forças elementais e distorce a realidade com feitiços complexos e poderosos. Cada gesto seu carrega séculos de estudo e precisão letal. Seus olhos brilham como safiras diante do caos que ele próprio conjura.",
      image: `${import.meta.env.BASE_URL}cards-assets/mago.png`,
    },
  ];

  // Iniciar o tema quando o componente montar
  useEffect(() => {
    const themeAudio = new Audio(themeSound);
    themeAudio.volume = musicVolume;
    themeAudio.loop = true;
    
    const playTheme = async () => {
      try {
        await themeAudio.play();
      } catch (error) {
        console.log("Erro ao tocar tema:", error);
      }
    };

    playTheme();

    return () => {
      themeAudio.pause();
      themeAudio.currentTime = 0;
    };
  }, [musicVolume]);

  const handleCharacterClick = (characterId: string) => {
    setSelectedCharacter(characterId);
    // Pequeno delay para mostrar a seleção antes de prosseguir
    setTimeout(() => {
      onCharacterSelected(characterId);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="min-h-screen bg-black flex">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`relative flex-1 cursor-pointer transition-all duration-500 ease-in-out select-none ${
              hoveredCharacter === null
                ? "opacity-100"
                : hoveredCharacter === character.id
                  ? "opacity-100 flex-[1.2]"
                  : "opacity-30 flex-[0.8]"
            } ${
              selectedCharacter === character.id ? "ring-4 ring-purple-500 ring-opacity-50" : ""
            }`}
            style={{ outline: 'none', userSelect: 'none' }}
            onMouseEnter={() => setHoveredCharacter(character.id)}
            onMouseLeave={() => setHoveredCharacter(null)}
            onClick={() => handleCharacterClick(character.id)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={character.image}
                alt={character.title}
                className={`w-full h-full object-cover ${character.id === 'mago' ? 'md:translate-y-10 translate-y-4' : ''}`}
                style={character.id === 'mago' ? { transition: 'transform 0.3s' } : {}}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent`} />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className={`space-y-2 transition-all duration-300 ${hoveredCharacter === character.id ? "self-start mt-4" : "self-end"}`}>
                  <h1 className="text-4xl md:text-6xl font-cinzel font-bold tracking-wider">
                    {character.title}
                  </h1>
                  <p className="text-lg md:text-xl font-cinzel font-medium text-gray-200 italic">
                    {character.subtitle}
                  </p>
                </div>

                <div
                  className={`transition-all duration-300 flex-1 flex items-center justify-center ${
                    hoveredCharacter === character.id ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
                  } overflow-hidden`}
                >
                  <p className="text-sm md:text-base leading-relaxed text-gray-300 max-w-md font-cinzel text-center">
                    {character.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                hoveredCharacter === character.id ? "opacity-0" : "opacity-20"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Instruções */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
        <p className="font-cinzel text-lg">Selecione um personagem para começar</p>
      </div>
    </div>
  );
}; 