import React from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function RollHistory({ rollHistory, characters, selectedCharacter, onSelectCharacter }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 h-full flex flex-col"
    >
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span className="text-xl">📜</span>
            Roll History
          </h3>
        </div>

        {/* Character Selector */}
        {characters.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <Select
              value={selectedCharacter?.id || ""}
              onValueChange={(value) => {
                const character = characters.find(c => c.id === value);
                onSelectCharacter(character);
              }}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select character" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    {character.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <ScrollArea className="h-96 flex-grow">
        <div className="space-y-3">
          {rollHistory.length > 0 ? (
            rollHistory.map((roll) => (
              <motion.div
                key={roll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  roll.is_critical
                    ? roll.result === 20 || (roll.dice_type === "d20" && roll.result === 20)
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 text-xs">
                      {roll.dice_type.toUpperCase()}
                    </Badge>
                    {roll.is_critical && (
                      <span className="text-yellow-400">⚡️</span>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-white">{roll.total}</span>
                </div>
                
                {roll.modifier !== 0 && (
                  <div className="text-sm text-white/70 mb-2">
                    {roll.result} {roll.modifier >= 0 ? '+' : ''}{roll.modifier}
                  </div>
                )}
                
                <div className="text-xs text-white/50">
                  {format(new Date(roll.created_date), "HH:mm:ss")}
                </div>
                
                {roll.context && (
                  <div className="text-xs text-white/60 mt-1 italic">
                    {roll.context}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl text-white/30 mx-auto mb-4">🎯</span>
              <p className="text-white/60">No rolls yet</p>
              <p className="text-white/40 text-sm">Start rolling to see your history</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}