import { useEssenceStore } from "../store/useEssenceStore";
import { useState, useEffect } from "react";

export const Essence = () => {
  const { essence, maxEssence } = useEssenceStore();
  const [isAnimating, setIsAnimating] = useState(false);

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
    </div>
  );
}; 