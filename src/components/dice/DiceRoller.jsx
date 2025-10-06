import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function DiceRoller({ 
  selectedDice, 
  modifier, 
  onModifierChange, 
  onRoll, 
  isRolling, 
  lastRoll, 
  selectedCharacter 
}) {
  const diceMax = parseInt(selectedDice.substring(1));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="parchment p-6 sm:p-8 text-center"
    >
      <div className="mb-6 sm:mb-8">
        <h3 className="text-3xl sm:text-4xl text-amber-900/90 mb-2">
          {isRolling ? "Rolling..." : `Roll a ${selectedDice.toUpperCase()}`}
        </h3>
        {selectedCharacter && (
          <Badge className="bg-amber-800/70 text-amber-50 text-sm sm:text-base" style={{fontFamily: 'var(--font-body)'}}>
            Rolling as {selectedCharacter.name}
          </Badge>
        )}
      </div>

      <div className="mb-6 sm:mb-8 flex justify-center items-center h-32 sm:h-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={isRolling ? "rolling" : selectedDice}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="relative"
          >
            {isRolling ? (
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 sm:w-36 sm:h-36 mx-auto bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593005510329-8a4216773f2d?q=80&w=2070')"}}
              />
            ) : (
              <div 
                className="w-28 h-28 sm:w-36 sm:h-36 mx-auto flex items-center justify-center bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593005510329-8a4216773f2d?q=80&w=2070')"}}
              >
                <span className="text-4xl sm:text-5xl font-bold text-amber-50/80" style={{fontFamily: 'var(--font-heading)', textShadow: '2px 2px 4px #000'}}>
                  {selectedDice.substring(1)}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-6 sm:mb-8">
        <Label className="text-lg sm:text-xl text-amber-900/90 mb-3 block">Modifier</Label>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <button 
            className="btn-scroll w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl"
            onClick={() => onModifierChange(modifier - 1)}
          >-</button>
          <div className="bg-amber-800/10 rounded-lg p-3 w-20 h-12 sm:w-24 sm:h-16 flex items-center justify-center border-2 border-amber-800/30">
            <span className="text-2xl sm:text-3xl font-bold text-amber-900/90">
              {modifier >= 0 ? '+' : ''}{modifier}
            </span>
          </div>
          <button 
            className="btn-scroll w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl"
            onClick={() => onModifierChange(modifier + 1)}
          >+</button>
        </div>
      </div>

      <button onClick={onRoll} disabled={isRolling} className="btn-scroll w-full max-w-xs h-16 sm:h-20 text-xl sm:text-2xl mb-8">
        {isRolling ? "Rolling..." : "Roll!"}
      </button>
      
      <AnimatePresence>
        {lastRoll && !isRolling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-800/10 p-4 sm:p-6 rounded-lg border-2 border-amber-800/30"
          >
             <h4 className="text-xl sm:text-2xl text-amber-900/90 mb-2">
                {lastRoll.is_critical ? (lastRoll.result === diceMax ? "Critical Success!" : "Critical Failure!") : "Result"}
             </h4>
            <div className="text-5xl sm:text-6xl font-bold text-amber-900 mb-2">{lastRoll.total}</div>
            {lastRoll.modifier !== 0 && (
              <div className="text-base sm:text-lg text-amber-900/70">
                ({lastRoll.result} {lastRoll.modifier >= 0 ? '+' : ''}{lastRoll.modifier})
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}