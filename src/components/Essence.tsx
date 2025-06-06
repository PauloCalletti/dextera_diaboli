import { useEssenceStore } from "../store/useEssenceStore";
import { useState, useEffect } from "react";

export const Essence = () => {
  const { essence, maxEssence, addEssence } = useEssenceStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddEssence = () => {
    addEssence();
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="fixed top-5 right-5 flex items-center gap-3">
      <div 
        className={`bg-purple-900/80 px-4 py-2 rounded-full text-white font-bold text-lg flex items-center gap-2 transition-transform duration-300 ${
          isAnimating ? 'scale-110' : ''
        }`}
      >
        <span className="text-purple-300">Essence:</span>
        <span className="text-purple-100">{essence}/{maxEssence}</span>
      </div>
      <button
        onClick={handleAddEssence}
        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 px-4 py-2 rounded-full text-white font-bold transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
      >
        <span className="text-xl">+</span>
        <span className="hidden sm:inline">Add Essence</span>
      </button>
    </div>
  );
}; 