import React from "react";
import { motion } from "framer-motion";

export default function DiceRollAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        animate={{
          rotate: [0, 360, 720, 1080],
          scale: [1, 1.2, 1, 1.2, 1]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
        className="text-9xl"
      >
        🎲
      </motion.div>
    </motion.div>
  );
}