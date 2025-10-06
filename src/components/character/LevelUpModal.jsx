import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, Award, Zap } from "lucide-react";

export default function LevelUpModal({ character, rewards, onClose, onAllocatePoints }) {
  const [selectedStats, setSelectedStats] = useState({});
  const [pointsRemaining, setPointsRemaining] = useState(rewards.abilityPoints);

  const stats = [
    { key: 'strength', name: 'Strength', icon: '💪', current: character.strength },
    { key: 'dexterity', name: 'Dexterity', icon: '🎯', current: character.dexterity },
    { key: 'constitution', name: 'Constitution', icon: '❤️', current: character.constitution },
    { key: 'intelligence', name: 'Intelligence', icon: '🧠', current: character.intelligence },
    { key: 'wisdom', name: 'Wisdom', icon: '🦉', current: character.wisdom },
    { key: 'charisma', name: 'Charisma', icon: '✨', current: character.charisma }
  ];

  const handleStatIncrease = (statKey) => {
    if (pointsRemaining <= 0) return;
    
    setSelectedStats(prev => ({
      ...prev,
      [statKey]: (prev[statKey] || 0) + 1
    }));
    setPointsRemaining(prev => prev - 1);
  };

  const handleStatDecrease = (statKey) => {
    if (!selectedStats[statKey] || selectedStats[statKey] === 0) return;
    
    setSelectedStats(prev => ({
      ...prev,
      [statKey]: prev[statKey] - 1
    }));
    setPointsRemaining(prev => prev + 1);
  };

  const handleConfirm = () => {
    onAllocatePoints(selectedStats);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-amber-900/90 to-pink-900/90 border-4 border-yellow-500 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-block mb-4"
            >
              <div className="text-8xl">🎉</div>
            </motion.div>
            
            <h2 className="text-5xl font-bold text-yellow-300 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              LEVEL UP!
            </h2>
            <p className="text-2xl text-white">
              {character.name} reached Level {rewards.newLevel}!
            </p>
          </div>

          {/* Rewards Summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white">{rewards.abilityPoints}</div>
              <div className="text-white/70">Ability Points</div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{rewards.skillPoints}</div>
              <div className="text-white/70">Skill Points</div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-2xl font-bold text-white">+{rewards.hpIncrease}</div>
              <div className="text-white/70">Max HP</div>
            </div>
            
            {rewards.milestone && (
              <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-500 rounded-lg p-4 text-center col-span-2">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-lg font-bold text-yellow-200">{rewards.milestone.title}</div>
                <div className="text-sm text-white/80">{rewards.milestone.description}</div>
                <div className="text-xs text-white/60 mt-2">{rewards.milestone.bonus}</div>
              </div>
            )}
          </div>

          {/* Stat Allocation */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
              <span>Allocate Ability Points</span>
              <Badge className="bg-green-600/50 text-green-100 text-lg">
                {pointsRemaining} Points Remaining
              </Badge>
            </h3>
            
            <div className="space-y-3">
              {stats.map((stat) => {
                const allocated = selectedStats[stat.key] || 0;
                const newValue = stat.current + allocated;
                
                return (
                  <div
                    key={stat.key}
                    className="bg-black/30 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{stat.icon}</span>
                      <div>
                        <div className="text-white font-medium">{stat.name}</div>
                        <div className="text-white/60 text-sm">
                          {stat.current} → {newValue}
                          {allocated > 0 && (
                            <span className="text-green-400 ml-1">(+{allocated})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleStatDecrease(stat.key)}
                        disabled={!allocated || allocated === 0}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10"
                      >
                        -
                      </Button>
                      <span className="text-xl font-bold text-white w-8 text-center">
                        {allocated}
                      </span>
                      <Button
                        onClick={() => handleStatIncrease(stat.key)}
                        disabled={pointsRemaining <= 0 || newValue >= 20}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleConfirm}
              disabled={pointsRemaining > 0}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 text-lg"
            >
              {pointsRemaining > 0 ? `Allocate ${pointsRemaining} More Points` : 'Confirm & Continue'}
            </Button>
          </div>

          {pointsRemaining === 0 && (
            <div className="mt-4 text-center text-sm text-white/60">
              You can reallocate points later in your character sheet
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}