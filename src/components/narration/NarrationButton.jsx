import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNarration } from "./useNarration";
import NarrationControls from "./NarrationControls";

export default function NarrationButton({ 
  textToNarrate, 
  className = "", 
  variant = "floating",
  onHighlight = null 
}) {
  const {
    isNarrating,
    isPaused,
    startNarration,
    stopNarration,
    pauseNarration,
    resumeNarration
  } = useNarration();
  
  const [showControls, setShowControls] = useState(false);

  const handleNarrate = () => {
    if (isNarrating) {
      if (isPaused) {
        resumeNarration();
      } else {
        pauseNarration();
      }
    } else {
      const text = typeof textToNarrate === 'function' ? textToNarrate() : textToNarrate;
      startNarration(text, onHighlight);
    }
  };

  const handleStop = (e) => {
    e.stopPropagation();
    stopNarration();
  };

  if (variant === "floating") {
    return (
      <>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`fixed bottom-24 right-6 z-50 md:bottom-6 ${className}`}
        >
          <div className="flex flex-col items-end gap-2">
            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowControls(!showControls)}
              className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              <span>⚙️</span>
            </motion.button>

            {/* Main Narration Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button
                onClick={handleNarrate}
                disabled={!textToNarrate?.trim() && typeof textToNarrate !== 'function'} // Disable if text is empty and not a function
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 shadow-2xl ${
                  isNarrating
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-pink-700"
                } ${!textToNarrate?.trim() && typeof textToNarrate !== 'function' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-2xl">
                  {isNarrating ? (isPaused ? '▶️' : '⏸️') : '🔊'}
                </span>
              </button>

              {/* Stop Button (when narrating) */}
              <AnimatePresence>
                {isNarrating && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={handleStop}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-200"
                  >
                    <span>🔇</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Pulsing ring when narrating */}
              {isNarrating && !isPaused && (
                <motion.div
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Narration Controls Modal */}
        <AnimatePresence>
          {showControls && (
            <NarrationControls
              onClose={() => setShowControls(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline variant
  return (
    <Button
      onClick={handleNarrate}
      disabled={!textToNarrate?.trim() && typeof textToNarrate !== 'function'}
      variant="outline"
      className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${className}`}
    >
      <span className="mr-2">
        {isNarrating ? (isPaused ? '▶️' : '⏸️') : '🔊'}
      </span>
      {isNarrating ? (isPaused ? "Resume" : "Pause") : "Narrate"}
    </Button>
  );
}