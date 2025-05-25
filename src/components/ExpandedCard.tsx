import { memo } from "react";

interface ExpandedCardProps {
  frontCardImage?: string;
  handleCloseExpanded: () => void;
  attack: number;
  life: number;
  cost: number;
}

const ExpandedCard = memo(
  ({
    frontCardImage,
    handleCloseExpanded,
    attack,
    life,
    cost,
  }: ExpandedCardProps) => {
    return (
      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
        onClick={handleCloseExpanded}
      >
        <div className="relative w-[600px] h-[900px] cursor-pointer perspective-1000 transition-all duration-300 ease-in-out hover:scale-[1.02] animate-jiggle">
          <div className="relative w-full h-full">
            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br rounded-xl shadow-lg transition-opacity duration-300">
              {frontCardImage && (
                <img
                  src={frontCardImage}
                  alt="Front of card"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              )}
            </div>
          </div>

          <div className="absolute bottom-10 left-4">
            <div className="relative">
              <div className="absolute inset-0 [filter:drop-shadow(0_0_15px_rgba(239,68,68,0.9))_drop-shadow(0_0_30px_rgba(239,68,68,0.9))] animate-pulse">
                <span className="text-5xl text-red-500 opacity-0">
                  {attack}
                </span>
              </div>
              <span className="text-5xl text-red-500 relative [text-shadow:0_0_10px_rgba(239,68,68,0.9)]">
                {attack}
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 right-4">
            <div className="relative">
              <div className="absolute inset-0 [filter:drop-shadow(0_0_15px_rgba(34,197,94,0.9))_drop-shadow(0_0_30px_rgba(34,197,94,0.9))] animate-pulse">
                <span className="text-5xl text-green-500 opacity-0">
                  {life}
                </span>
              </div>
              <span className="text-5xl text-green-500 relative [text-shadow:0_0_10px_rgba(34,197,94,0.9)]">
                {life}
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="absolute inset-0 [filter:drop-shadow(0_0_15px_rgba(234,179,8,0.9))_drop-shadow(0_0_30px_rgba(234,179,8,0.9))] animate-pulse">
                <span className="text-5xl text-yellow-500 opacity-0">
                  {cost}
                </span>
              </div>
              <span className="text-5xl text-yellow-500 relative [text-shadow:0_0_10px_rgba(234,179,8,0.9)]">
                {cost}
              </span>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes jiggle {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-0.5deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(0.5deg); }
            100% { transform: rotate(0deg); }
          }
          .animate-jiggle {
            animation: jiggle 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }
);

ExpandedCard.displayName = "ExpandedCard";

export { ExpandedCard };
