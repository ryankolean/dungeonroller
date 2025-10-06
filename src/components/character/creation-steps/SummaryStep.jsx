import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, User, Crown, Sword, Zap, BookOpen, Shield } from "lucide-react";

export default function SummaryStep({ character }) {
  const getModifier = (score) => Math.floor((score - 10) / 2);
  const getModifierText = (score) => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Review Your Character</h3>
        <p className="text-white/70">Make sure everything looks correct before creating your hardcore character.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 rounded-lg p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-purple-400" />
            <h4 className="text-xl font-bold text-white">Character Identity</h4>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{character.name}</h2>
            <div className="flex justify-center gap-2">
              <Badge className="bg-green-700/30 text-green-300 text-base">
                {character.race}
              </Badge>
              <Badge className="bg-red-700/30 text-red-300 text-base">
                {character.class}
              </Badge>
              <Badge className="bg-red-600/70 text-red-100 text-base">
                HARDCORE
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Ability Scores */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 rounded-lg p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-purple-400" />
            <h4 className="text-xl font-bold text-white">Ability Scores</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries({
              strength: "STR",
              dexterity: "DEX",
              constitution: "CON",
              intelligence: "INT",
              wisdom: "WIS",
              charisma: "CHA"
            }).map(([stat, abbr]) => (
              <div key={stat} className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                <div className="text-white/70 text-sm uppercase tracking-wider">{abbr}</div>
                <div className="text-2xl font-bold text-white">{character[stat]}</div>
                <div className="text-lg text-white/60">{getModifierText(character[stat])}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Background */}
        {character.background && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 rounded-lg p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h4 className="text-xl font-bold text-white">Background</h4>
            </div>
            <p className="text-white/80 leading-relaxed whitespace-pre-line">
              {character.background.substring(0, 200)}...
            </p>
          </motion.div>
        )}

        {/* Equipment */}
        {character.equipment.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 rounded-lg p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <h4 className="text-xl font-bold text-white">Starting Equipment</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {character.equipment.map((item) => (
                <Badge key={item} className="bg-amber-700/30 text-amber-200 text-sm">
                  {item}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Final Warning */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-6 text-center"
        >
          <div className="text-3xl mb-3">💀</div>
          <h4 className="text-xl font-bold text-red-300 mb-2">FINAL HARDCORE WARNING</h4>
          <p className="text-red-200/90">
            Once created, <strong>{character.name}</strong> will be in permanent hardcore mode. 
            If they die during any adventure, they will be immediately and irreversibly deleted. 
            There are no second chances, resurrections, or recoveries.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}