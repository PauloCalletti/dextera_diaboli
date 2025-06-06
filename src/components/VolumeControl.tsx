import { useState } from "react";
import { useAudioStore } from "../store/useAudioStore";

export const VolumeControl = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { musicVolume, effectsVolume, setMusicVolume, setEffectsVolume } = useAudioStore();

  return (
    <div 
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsExpanded(true)}
    >
      <div className="relative">
        {/* Main Volume Icon */}
        <button 
          className={`w-16 h-16 bg-black rounded-full flex items-center justify-center transition-all duration-300 border border-gray-700
            ${isExpanded ? 'opacity-50' : 'opacity-100 hover:bg-gray-900'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>

        {/* Expanded Controls */}
        <div 
          className={`absolute right-16 top-1/2 -translate-y-1/2 bg-black border border-gray-700 rounded-lg p-6 transition-all duration-300
            ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="space-y-6 w-48">
            {/* Music Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white text-sm">
                <span>Music</span>
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                  [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
              />
            </div>

            {/* Effects Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white text-sm">
                <span>Effects</span>
                <span>{Math.round(effectsVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={effectsVolume}
                onChange={(e) => setEffectsVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                  [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 