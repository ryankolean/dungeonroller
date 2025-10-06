import React from "react";
import { motion } from "framer-motion";

const DICE_TYPES = [
  { type: "d4", sides: 4, color: "from-red-500 to-red-600" },
  { type: "d6", sides: 6, color: "from-orange-500 to-orange-600" },
  { type: "d8", sides: 8, color: "from-yellow-500 to-yellow-600" },
  { type: "d10", sides: 10, color: "from-green-500 to-green-600" },
  { type: "d12", sides: 12, color: "from-blue-500 to-blue-600" },
  { type: "d20", sides: 20, color: "from-emerald-500 to-emerald-600" },
  { type: "d100", sides: 100, color: "from-orange-500 to-orange-600" }
];

export default function DiceSelector({ selectedDice, onSelectDice }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6 text-center">Choose Your Dice</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {DICE_TYPES.map((dice, index) => (
          <motion.button
            key={dice.type}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDice(dice.type)}
            className={`aspect-square rounded-xl border-2 transition-all duration-300 ${
              selectedDice === dice.type
                ? `bg-gradient-to-br ${dice.color} border-white/50 shadow-lg scale-105`
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full p-2">
              <span className="text-lg font-bold text-white mb-1">{dice.type.toUpperCase()}</span>
              <span className="text-xs text-white/70">{dice.sides} sides</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}