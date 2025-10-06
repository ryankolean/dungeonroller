import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function CombatCharacterCard({ character, currentHP, conditions = [], isActive }) {
  const hpPercentage = (currentHP / character.max_hit_points) * 100;
  
  const getHPColor = () => {
    if (hpPercentage >= 75) return "bg-green-500";
    if (hpPercentage >= 50) return "bg-yellow-500";
    if (hpPercentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const conditionIcons = {
    'hidden': '👻',
    'dodging': '🛡️',
    'disengaged': '🏃',
    'prone': '🔻',
    'frightened': '😨',
    'poisoned': '🤢',
    'stunned': '💫',
    'paralyzed': '🥶',
    'unconscious': '😵'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-2 rounded-xl p-6 ${
        isActive ? 'border-green-500 shadow-lg shadow-green-500/50' : 'border-blue-500/50'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {character.name}
          </h3>
          <div className="flex gap-2">
            <Badge className="bg-green-600/30 text-green-200 border-green-500/50">
              {character.race}
            </Badge>
            <Badge className="bg-red-600/30 text-red-200 border-red-500/50">
              {character.class}
            </Badge>
            <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/50">
              Lvl {character.level}
            </Badge>
          </div>
        </div>
        <div className="text-6xl">
          ⚔️
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-white/70 mb-2">
          <span>Hit Points</span>
          <span className="font-bold">{currentHP} / {character.max_hit_points}</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-6 border border-gray-600">
          <motion.div 
            initial={{ width: `${hpPercentage}%` }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`${getHPColor()} h-full rounded-full flex items-center justify-end px-2`}
          >
            <span className="text-xs font-bold text-white">{Math.round(hpPercentage)}%</span>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-black/30 rounded p-2 text-center">
          <div className="text-xs text-white/60">AC</div>
          <div className="text-lg font-bold text-white">
            {10 + Math.floor((character.dexterity - 10) / 2)}
          </div>
        </div>
        <div className="bg-black/30 rounded p-2 text-center">
          <div className="text-xs text-white/60">STR</div>
          <div className="text-lg font-bold text-white">
            {character.strength} ({Math.floor((character.strength - 10) / 2) >= 0 ? '+' : ''}{Math.floor((character.strength - 10) / 2)})
          </div>
        </div>
        <div className="bg-black/30 rounded p-2 text-center">
          <div className="text-xs text-white/60">DEX</div>
          <div className="text-lg font-bold text-white">
            {character.dexterity} ({Math.floor((character.dexterity - 10) / 2) >= 0 ? '+' : ''}{Math.floor((character.dexterity - 10) / 2)})
          </div>
        </div>
      </div>

      {/* Conditions */}
      {conditions.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-white/60 mb-2">Active Conditions:</div>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition, i) => (
              <Badge key={i} className="bg-yellow-600/30 text-yellow-200 border-yellow-500/50">
                {conditionIcons[condition] || '●'} {condition}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {isActive && (
        <div className="mt-4 text-center">
          <Badge className="bg-green-600/50 text-green-100 border-green-400 text-sm animate-pulse">
            ⚡ YOUR TURN ⚡
          </Badge>
        </div>
      )}
    </motion.div>
  );
}