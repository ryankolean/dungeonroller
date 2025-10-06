import React, { useState, useEffect } from "react";
import { Character } from "@/api/entities";
import { Adventure } from "@/api/entities";
import { User } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const CharacterCard = ({ character, status, hasAdventure }) => {
  const navigate = useNavigate();
  const raceIcons = {
    "Human": "🧑", "Elf": "🧝", "Dwarf": "🧔", "Halfling": "🧙‍♂️", "Dragonborn": "🐲", 
    "Gnome": "🧚‍♂️", "Half-Elf": "🧑‍🧝", "Half-Orc": "🧑‍🔥", "Tiefling": "😈"
  };

  const classIcons = {
    "Fighter": "⚔️", "Wizard": "🧙‍♂️", "Rogue": "🗡️", "Cleric": "✨", "Ranger": "🏹",
    "Barbarian": "🪓", "Bard": "🎵", "Druid": "🌿", "Monk": "👊", "Paladin": "🛡️",
    "Sorcerer": "🔮", "Warlock": "👁️"
  };

  const getHPStatus = () => {
    const hpPercent = (character.hit_points / character.max_hit_points) * 100;
    if (hpPercent >= 75) return { color: "text-green-400", status: "Healthy" };
    if (hpPercent >= 50) return { color: "text-yellow-400", status: "Injured" };
    if (hpPercent >= 25) return { color: "text-orange-400", status: "Wounded" };
    return { color: "text-red-400", status: "Critical" };
  };

  const hpStatus = getHPStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col text-center items-center shadow-2xl"
    >
      {/* Character Avatar */}
      <div className="relative mb-4">
        <div className="text-6xl mb-2 relative">
          {raceIcons[character.race] || '👤'}
          <div className="absolute -bottom-1 -right-1 text-2xl">
            {classIcons[character.class] || '⚔️'}
          </div>
        </div>
        {hasAdventure && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
        )}
      </div>

      {/* Character Info */}
      <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        {character.name}
      </h3>
      
      <p className="text-white/70 mb-3">{character.race} {character.class}</p>
      
      {/* Stats Row */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50 text-sm">
          Level {character.level}
        </Badge>
        <Badge className={`bg-transparent border ${hpStatus.color} text-sm`}>
          HP: {character.hit_points}/{character.max_hit_points}
        </Badge>
        {character.experience_points > 0 && (
          <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 text-sm">
            {character.experience_points} XP
          </Badge>
        )}
      </div>

      {/* Status */}
      <div className={`mb-6 text-sm font-semibold ${
        hasAdventure ? 'text-green-400' : hpStatus.color
      }`}>
        Status: {hasAdventure ? 'On Quest' : hpStatus.status}
      </div>

      {/* Action Button */}
      <motion.button
        onClick={() => navigate(createPageUrl(`QuestStart?characterId=${character.id}`))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-scroll mt-auto w-full py-3 text-lg"
      >
        {hasAdventure ? 'Continue Quest' : 'Begin Adventure'}
      </motion.button>
    </motion.div>
  );
};

export default function QuestSelectionPage() {
  const [characters, setCharacters] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const user = await User.me();
        const [userCharacters, userAdventures] = await Promise.all([
          Character.filter({ created_by: user.email }, "-created_date"),
          Adventure.filter({ created_by: user.email })
        ]);
        setCharacters(userCharacters);
        setAdventures(userAdventures);
      } catch (error) {
        console.error("Error loading selection data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const hasAdventure = (characterId) => {
    return adventures.some(adv => adv.character_id === characterId);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 w-full flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="min-h-screen p-6 w-full flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="parchment max-w-2xl p-8 sm:p-12"
        >
          <div className="text-6xl mb-6">🏰</div>
          <h1 className="dynamic-title text-amber-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Adventure Awaits
          </h1>
          <p className="text-amber-800/80 text-lg mb-8 max-w-md mx-auto">
            Every legend begins with a hero. Create your first character to embark upon epic quests and forge your destiny!
          </p>
          <Link to={createPageUrl("Character")} className="btn-scroll px-8 py-4 text-lg">
            Create Your First Character
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <h1 className="dynamic-title text-amber-100 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Choose Your Hero
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4"></div>
          <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'var(--font-accent)' }}>
            Select an adventurer to begin or continue their epic journey
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          {characters.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CharacterCard 
                character={char} 
                hasAdventure={hasAdventure(char.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link to={createPageUrl("Character")}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-scroll-danger px-8 py-4 text-lg"
            >
              <span className="text-xl mr-2">✨</span>
              Create New Character
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}