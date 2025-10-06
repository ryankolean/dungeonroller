import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function CharacterSelector({ characters, selectedCharacter, onSelectCharacter }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-xl">👤</span>
        Select Adventurer
      </h3>

      <div className="space-y-3">
        {characters.map((character) => (
          <motion.button
            key={character.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCharacter(character)}
            className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
              selectedCharacter?.id === character.id
                ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-lg">{character.name}</h4>
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                Level {character.level}
              </Badge>
            </div>
            
            <div className="flex gap-3 text-sm mb-3">
              <span className="text-white/70">{character.race}</span>
              <span className="text-white/50">•</span>
              <span className="text-white/70">{character.class}</span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-red-400">
                ❤️
                <span className="text-white/70">
                  {character.hit_points}/{character.max_hit_points}
                </span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                ⚡️
                <span className="text-white/70">{character.experience_points} XP</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}