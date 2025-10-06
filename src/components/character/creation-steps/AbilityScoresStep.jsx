import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AbilityScoresStep({ character, setCharacter }) {
  const [rollingAbility, setRollingAbility] = useState(null);

  const rollAbilityScore = (ability) => {
    setRollingAbility(ability);
    
    // Simulate dice rolling with animation
    setTimeout(() => {
      // Roll 4d6, drop lowest
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      const total = rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
      
      setCharacter(prev => ({
        ...prev,
        [ability]: total
      }));
      
      setRollingAbility(null);
    }, 1500);
  };

  const getModifier = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const abilities = [
    { key: 'strength', name: 'Strength', description: 'Physical power, affects melee damage and carrying capacity' },
    { key: 'dexterity', name: 'Dexterity', description: 'Agility and reflexes, affects armor class and ranged attacks' },
    { key: 'constitution', name: 'Constitution', description: 'Health and stamina, affects hit points and endurance' },
    { key: 'intelligence', name: 'Intelligence', description: 'Reasoning and memory, affects spell power for wizards' },
    { key: 'wisdom', name: 'Wisdom', description: 'Awareness and insight, affects perception and divine magic' },
    { key: 'charisma', name: 'Charisma', description: 'Force of personality, affects social interactions and some magic' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Roll Your Ability Scores
        </h3>
        <p className="text-white/70 text-lg">
          Roll 4d6, drop the lowest for each ability. These determine your character's natural talents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {abilities.map((ability) => (
          <motion.div
            key={ability.key}
            className="bg-white/10 rounded-xl p-6 border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-white">{ability.name}</h4>
                <p className="text-white/60 text-sm">{ability.description}</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {rollingAbility === ability.key ? (
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      🎲
                    </motion.span>
                  ) : (
                    character[ability.key]
                  )}
                </div>
                <div className="text-white/70">
                  {getModifier(character[ability.key])}
                </div>
              </div>
            </div>

            <Button
              onClick={() => rollAbilityScore(ability.key)}
              disabled={rollingAbility === ability.key}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {rollingAbility === ability.key ? "Rolling..." : "Roll 4d6"}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4 mt-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-white font-medium">Rolling Tip</p>
            <p className="text-white/70 text-sm">
              Higher scores are better! 8-10 is below average, 11-13 is average, 14-15 is good, 16-17 is great, and 18 is exceptional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}