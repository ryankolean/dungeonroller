
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CharacterList({ characters, selectedCharacter, onSelectCharacter, onCreateNew }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="parchment p-4 sm:p-6 h-full"
    >
      <div 
        className="flex items-center justify-between mb-6 border-b-2 border-amber-800/20 pb-4 sticky top-0 z-10"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1615800098779-79a835eda3f6?q=80&w=1974')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h3 className="text-xl sm:text-2xl text-amber-900/90 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Your Heroes
        </h3>
        <button onClick={onCreateNew} className="btn-scroll w-24 h-12 text-sm sm:w-28 sm:h-12 sm:text-sm">
          <span className="text-lg inline-block mr-1">+</span>
          New
        </button>
      </div>

      <div className="space-y-3">
        {characters.map((character) => (
          <button
            key={character.id}
            onClick={() => onSelectCharacter(character)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
              selectedCharacter?.id === character.id
                ? "bg-amber-800/20 border-amber-800/40"
                : "bg-amber-800/5 border-amber-800/20 hover:bg-amber-800/10"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg sm:text-xl text-amber-900/90" style={{fontFamily: 'var(--font-heading)'}}>{character.name}</h4>
              <Badge className="bg-amber-800/70 text-amber-50 text-xs sm:text-base" style={{fontFamily: 'var(--font-body)'}}>
                Lvl {character.level}
              </Badge>
            </div>
            <div className="flex gap-2 text-sm sm:text-base text-amber-900/70">
              <span>{character.race}</span>
              <span>•</span>
              <span>{character.class}</span>
            </div>
          </button>
        ))}
      </div>

      {characters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base sm:text-lg text-amber-900/70 mb-4">Your epic saga awaits a hero.</p>
          <button onClick={onCreateNew} className="btn-scroll w-52 h-16 text-base">
            Forge a Character
          </button>
        </div>
      )}
    </motion.div>
  );
}
