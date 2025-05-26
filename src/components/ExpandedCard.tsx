import { memo } from "react";

interface ExpandedCardProps {
  frontCardImage?: string;
  attack: number;
  life: number;
  cost: number;
  handleCloseExpanded: () => void;
}

export const ExpandedCard = memo(
  ({
    frontCardImage,
    attack,
    life,
    cost,
    handleCloseExpanded,
  }: ExpandedCardProps) => {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleCloseExpanded}
      >
        <div
          className="relative w-[512px] h-[768px] cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={frontCardImage}
            alt="Expanded card"
            className="w-full h-full object-cover rounded-2xl"
          />

          <div className="absolute bottom-8 left-4">
            <div className="relative">
              <div className="absolute inset-0 [filter:drop-shadow(0_0_30px_rgba(239,68,68,0.9))_drop-shadow(0_0_60px_rgba(239,68,68,0.9))] animate-pulse">
                <span className="text-6xl text-red-500 opacity-0">{attack}</span>
              </div>
              <span className="text-6xl text-red-500 relative [text-shadow:0_0_20px_rgba(239,68,68,0.9)]">
                {attack}
              </span>
            </div>
          </div>

          <div className="absolute bottom-8 right-4">
            <div className="relative">
              <div className="absolute inset-0 [filter:drop-shadow(0_0_30px_rgba(34,197,94,0.9))_drop-shadow(0_0_60px_rgba(34,197,94,0.9))] animate-pulse">
                <span className="text-6xl text-green-500 opacity-0">{life}</span>
              </div>
              <span className="text-6xl text-green-500 relative [text-shadow:0_0_20px_rgba(34,197,94,0.9)]">
                {life}
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="absolute inset-0 [filter:drop-shadow(0_0_30px_rgba(234,179,8,0.9))_drop-shadow(0_0_60px_rgba(234,179,8,0.9))] animate-pulse">
                <span className="text-6xl text-yellow-500 opacity-0">{cost}</span>
              </div>
              <span className="text-6xl text-yellow-500 relative [text-shadow:0_0_20px_rgba(234,179,8,0.9)]">
                {cost}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ExpandedCard.displayName = "ExpandedCard";
