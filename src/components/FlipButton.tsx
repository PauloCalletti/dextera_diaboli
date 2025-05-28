import React from "react";

interface FlipButtonProps {
  onClick: () => void;
  cardCount?: number;
}

export const FlipButton: React.FC<FlipButtonProps> = ({
  onClick,
  cardCount,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#4a4a4a",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {cardCount !== undefined && cardCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-white/90 px-2 py-0.5 rounded-full text-sm font-bold text-gray-800">
          {cardCount}
        </div>
      )}
    </div>
  );
};
