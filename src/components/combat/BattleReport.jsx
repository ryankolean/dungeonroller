import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BattleReport({ character, outcome, rounds, damageDealt, damageTaken, enemies, onContinue }) {
  const isVictory = outcome === 'victory';
  const isFled = outcome === 'fled';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className={`max-w-2xl w-full rounded-2xl border-4 p-8 ${
        isVictory 
          ? 'bg-gradient-to-br from-green-900/40 to-yellow-900/40 border-yellow-500' 
          : isFled
          ? 'bg-gradient-to-br from-blue-900/40 to-gray-900/40 border-blue-500'
          : 'bg-gradient-to-br from-red-900/40 to-gray-900/40 border-red-500'
      }`}>
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">
            {isVictory ? '🏆' : isFled ? '🏃' : '💀'}
          </div>
          <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {isVictory ? 'Victory!' : isFled ? 'Escaped!' : 'Defeat...'}
          </h2>
          <p className="text-white/70 text-lg">
            {isVictory 
              ? 'Your valor has triumphed over adversity!' 
              : isFled
              ? 'You live to fight another day!'
              : 'Your journey ends here...'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-3">Battle Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <div className="text-white/60 text-sm">Combat Rounds</div>
                <div className="text-2xl font-bold">{rounds}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Enemies Faced</div>
                <div className="text-2xl font-bold">{enemies.length}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Damage Dealt</div>
                <div className="text-2xl font-bold text-red-400">{damageDealt}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Damage Taken</div>
                <div className="text-2xl font-bold text-yellow-400">{damageTaken}</div>
              </div>
            </div>
          </div>

          {isVictory && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-yellow-300 mb-2">⭐ Rewards</h3>
              <div className="text-white/90">
                <div>💰 Experience Gained: {damageDealt * 10} XP</div>
                <div>🏅 Gold Found: {Math.floor(damageDealt / 2)} GP</div>
              </div>
            </div>
          )}

          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-2">Enemies Encountered</h3>
            <div className="space-y-2">
              {enemies.map((enemy, index) => (
                <div key={index} className="flex items-center justify-between text-white/80">
                  <span>{enemy.name}</span>
                  <Badge className="bg-red-600/30 text-red-200">
                    CR {enemy.level}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onContinue}
            className={`px-12 py-6 text-xl font-bold ${
              isVictory || isFled
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVictory || isFled ? 'Continue Adventure' : 'Accept Fate'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}