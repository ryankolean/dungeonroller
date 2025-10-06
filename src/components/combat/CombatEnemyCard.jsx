import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function CombatEnemyCard({ enemy, conditions = [], onTarget, isTargetable }) {
  const hpPercentage = (enemy.hp / enemy.max_hit_points) * 100;
  
  const getHPColor = () => {
    if (hpPercentage >= 75) return "bg-green-500";
    if (hpPercentage >= 50) return "bg-yellow-500";
    if (hpPercentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const typeEmoji = {
    'beast': '🐺',
    'humanoid': '🧟',
    'undead': '💀',
    'dragon': '🐉',
    'aberration': '👾',
    'construct': '🤖',
    'elemental': '🔥'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={isTargetable ? { scale: 1.02, boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)" } : {}}
      onClick={isTargetable ? onTarget : undefined}
      className={`bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-sm border-2 rounded-xl p-6 transition-all ${
        isTargetable ? 'cursor-pointer border-red-500/50 hover:border-red-400' : 'border-gray-600/50 opacity-50'
      } ${enemy.hp === 0 ? 'grayscale' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {enemy.name}
            {enemy.hp === 0 && ' ☠️'}
          </h3>
          <div className="flex gap-2">
            <Badge className="bg-red-600/30 text-red-200 border-red-500/50">
              {enemy.type}
            </Badge>
            <Badge className="bg-orange-600/30 text-orange-200 border-orange-500/50">
              CR {enemy.level}
            </Badge>
          </div>
        </div>
        <div className="text-6xl">
          {typeEmoji[enemy.type] || '👹'}
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-white/70 mb-2">
          <span>Hit Points</span>
          <span className="font-bold">{enemy.hp} / {enemy.max_hit_points}</span>
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
          <div className="text-lg font-bold text-white">{enemy.armor_class}</div>
        </div>
        <div className="bg-black/30 rounded p-2 text-center">
          <div className="text-xs text-white/60">Attack</div>
          <div className="text-lg font-bold text-white">+{enemy.attack_bonus}</div>
        </div>
        <div className="bg-black/30 rounded p-2 text-center">
          <div className="text-xs text-white/60">Damage</div>
          <div className="text-sm font-bold text-white">{enemy.damage_dice}</div>
        </div>
      </div>

      {/* Conditions */}
      {conditions.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-white/60 mb-2">Conditions:</div>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition, i) => (
              <Badge key={i} className="bg-amber-600/30 text-amber-200 border-amber-500/50 text-xs">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {isTargetable && enemy.hp > 0 && (
        <div className="mt-4 text-center">
          <div className="text-sm text-red-300 font-medium animate-pulse">
            Click to Attack
          </div>
        </div>
      )}
    </motion.div>
  );
}