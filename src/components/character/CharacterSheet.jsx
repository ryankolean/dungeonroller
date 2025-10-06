
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import XPProgressBar from "./XPProgressBar";

export default function CharacterSheet({ character, onUpdateCharacter }) {
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);
  const [backgroundExpanded, setBackgroundExpanded] = useState(false);

  const getModifier = (score) => Math.floor((score - 10) / 2);
  const getModifierText = (score) => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const hpPercentage = (character.hit_points / character.max_hit_points) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="parchment p-4 sm:p-8"
    >
      <div className="mb-8 border-b-4 pb-4 border-double border-amber-800/30">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-amber-900/90 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{character.name}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-amber-800/70 text-amber-50 text-sm sm:text-base" style={{ fontFamily: 'var(--font-body)'}}>
              Level {character.level}
            </Badge>
            <Badge className="bg-green-800/70 text-green-50 text-sm sm:text-base" style={{ fontFamily: 'var(--font-body)'}}>
              {character.race}
            </Badge>
            <Badge className="bg-red-800/70 text-red-50 text-sm sm:text-base" style={{ fontFamily: 'var(--font-body)'}}>
              {character.class}
            </Badge>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mb-4">
            <XPProgressBar character={character} showDetailed={true} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-amber-800/10 rounded p-4 border border-amber-800/20">
          <div className="flex items-center gap-3 mb-2 text-lg sm:text-xl text-amber-900/90">
            <span className="text-2xl text-red-700">❤️</span>
            <span>Hit Points</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-900/90 mb-2">
            {character.hit_points} / {character.max_hit_points}
          </div>
          <div className="w-full bg-amber-800/20 rounded-full h-4 border border-amber-800/30">
            <div className="bg-red-600 h-full rounded-full" style={{ width: `${hpPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="bg-amber-800/10 rounded p-4 border border-amber-800/20">
          <div className="flex items-center gap-3 mb-2 text-lg sm:text-xl text-amber-900/90">
            <span className="text-2xl text-yellow-500">⚡️</span>
            <span>Experience</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-900/90">
            {character.total_xp_earned} XP
          </div>
          <div className="text-sm text-amber-900/70 mt-1">
            Total earned across all adventures
          </div>
        </div>
      </div>

      {/* Milestones */}
      {character.milestones_unlocked && character.milestones_unlocked.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl sm:text-3xl text-amber-900/90 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="text-2xl">🏆</span>
            Achievements
          </h3>
          <div className="flex flex-wrap gap-2">
            {character.milestones_unlocked.map((milestone, index) => (
              <Badge key={index} className="bg-yellow-800/20 text-yellow-900 border-yellow-500 text-sm">
                {milestone.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl text-amber-900/90 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <span className="text-2xl">🛡️</span>
          Ability Scores
        </h3>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {Object.entries({
            strength: "STR", dexterity: "DEX", constitution: "CON",
            intelligence: "INT", wisdom: "WIS", charisma: "CHA"
          }).map(([stat, abbr]) => (
            <div key={stat} className="bg-amber-800/10 rounded-lg p-3 sm:p-4 text-center border-2 border-amber-800/30">
              <div className="text-lg sm:text-xl text-amber-900/80 mb-1" style={{ fontFamily: 'var(--font-accent)' }}>{abbr}</div>
              <div className="text-2xl sm:text-4xl font-bold text-amber-900 mb-1">{character[stat]}</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-900/70">{getModifierText(character[stat])}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Section */}
      <div className="mb-6">
        <button
          onClick={() => setEquipmentExpanded(!equipmentExpanded)}
          className="w-full bg-amber-800/10 rounded-t-lg p-4 sm:p-6 border border-amber-800/20 flex items-center justify-between hover:bg-amber-800/15 transition-colors"
        >
          <h4 className="text-xl sm:text-2xl text-amber-900/90 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="text-2xl">⚔️</span>
            Equipment
          </h4>
          <span className="text-2xl text-amber-900/70 transition-transform duration-200" style={{
            transform: equipmentExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            🔽
          </span>
        </button>
        
        <motion.div
          initial={false}
          animate={{
            height: equipmentExpanded ? "auto" : 0,
            opacity: equipmentExpanded ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-amber-800/5 rounded-b-lg p-4 sm:p-6 border-l border-r border-b border-amber-800/20">
            <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-amber-900/80">
              {character.equipment && character.equipment.length > 0 ? (
                character.equipment.map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))
              ) : (
                <li className="italic">No equipment listed</li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Background Section */}
      <div className="mb-6">
        <button
          onClick={() => setBackgroundExpanded(!backgroundExpanded)}
          className="w-full bg-amber-800/10 rounded-t-lg p-4 sm:p-6 border border-amber-800/20 flex items-center justify-between hover:bg-amber-800/15 transition-colors"
        >
          <h4 className="text-xl sm:text-2xl text-amber-900/90 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="text-2xl">📜</span>
            Background
          </h4>
          <span className="text-2xl text-amber-900/70 transition-transform duration-200" style={{
            transform: backgroundExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            🔽
          </span>
        </button>
        
        <motion.div
          initial={false}
          animate={{
            height: backgroundExpanded ? "auto" : 0,
            opacity: backgroundExpanded ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-amber-800/5 rounded-b-lg p-4 sm:p-6 border-l border-r border-b border-amber-800/20">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-amber-900/80 leading-relaxed whitespace-pre-line"
            >
              {character.background || "No background story yet..."}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
