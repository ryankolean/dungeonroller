import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function XPNotification({ xpGained, reason, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.8 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 border-2 border-yellow-400 rounded-xl p-4 shadow-2xl flex items-center gap-3 min-w-[300px]">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </motion.div>
          
          <div className="flex-1">
            <div className="text-2xl font-bold text-white">
              +{xpGained} XP
            </div>
            <div className="text-sm text-white/80">
              {reason}
            </div>
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-3xl"
          >
            ⭐
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}