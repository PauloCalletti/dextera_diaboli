"use client"

import { useLifeStore } from "../store/useLifeStore"

interface DiabolicalLifeCounterProps {
  isEnemy?: boolean;
}

export default function DiabolicalLifeCounter({
  isEnemy = false,
}: DiabolicalLifeCounterProps) {
  const { playerLife, enemyLife } = useLifeStore();
  const life = isEnemy ? enemyLife : playerLife;

  return (
    <div 
      className={`fixed ${isEnemy ? 'top-0' : 'bottom-0'} left-1/2 -translate-x-1/2 ${isEnemy ? 'translate-y-[20px]' : 'translate-y-[-20px]'} flex items-center justify-center`}
    >
      {/* Simple Circle */}
      <div className="relative w-32 h-32">
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-red-600 bg-red-950" />

        {/* Pentagram extending beyond border */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="140"
            height="140"
            viewBox="0 0 100 100"
            className="stroke-red-400 absolute"
            style={{
              filter: "drop-shadow(0 0 10px currentColor)",
            }}
          >
            <path
              d="M50 90 L38.2 61.8 L10 61.8 L31.9 45.1 L20.6 17.1 L50 33.8 L79.4 17.1 L68.1 45.1 L90 61.8 L61.8 61.8 Z"
              fill="none"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Life Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-6xl font-bold select-none ${
              life <= 5 ? 'text-red-500 animate-pulse' : 'text-red-200'
            }`}
            style={{
              fontFamily: "serif",
              zIndex: 10,
              textShadow: "0 0 10px rgba(220, 38, 38, 0.5)",
            }}
          >
            {life}
          </span>
        </div>
      </div>
    </div>
  )
}
