import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getXPProgress } from "@/components/utils/experienceSystem";

export default function XPProgressBar({ character, showDetailed = false }) {
  const progress = getXPProgress(character);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-600/30 text-amber-200 border-amber-500/50 text-lg">
            Level {character.level}
          </Badge>
          {showDetailed && (
            <span className="text-white/70 text-sm">
              {character.current_xp} / {character.xp_to_next_level} XP
            </span>
          )}
        </div>
        {!showDetailed && (
          <span className="text-white/70 text-sm font-medium">
            {progress}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-700/50 rounded-full h-4 border border-amber-500/30 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 relative"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>
      
      {showDetailed && (
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Total XP Earned: {character.total_xp_earned}</span>
          {character.ability_points > 0 && (
            <Badge className="bg-green-600/30 text-green-200 text-xs">
              {character.ability_points} Points Available
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}