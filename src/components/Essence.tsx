import { useEssenceStore } from "../store/useEssenceStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
      <div className="relative">
        {/* Hell Circle Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-900 via-red-800 to-black border-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />

        {/* Fire Animation Layer */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-50"
          animate={{
            background: [
              "radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(0,0,0,0) 70%)",
              "radial-gradient(circle, rgba(255,69,0,0.3) 0%, rgba(0,0,0,0) 70%)",
              "radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(0,0,0,0) 70%)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Essence Content */}
        <motion.div
          className={`relative px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300 ${
            isAnimating ? "scale-110" : ""
          }`}
        >
          <span
            className="text-red-300 font-bold text-lg"
            style={{
              fontFamily: "'MedievalSharp', cursive",
              textShadow: "0 0 10px rgba(220, 38, 38, 0.8)",
            }}
          >
            Essência:
          </span>
          <span
            className="text-red-100 font-bold text-lg"
            style={{
              fontFamily: "'MedievalSharp', cursive",
              textShadow: "0 0 10px rgba(220, 38, 38, 0.8)",
            }}
          >
            {essence}/{maxEssence}
          </span>
        </motion.div>

        {/* Demonic Symbols */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full border-2 border-red-600 rounded-full opacity-30" />
            <div className="w-[90%] h-[90%] border-2 border-red-600 rounded-full opacity-20" />
            <div className="w-[80%] h-[80%] border-2 border-red-600 rounded-full opacity-10" />
          </div>
        </div>
      </div>
    </div>
  );
};
