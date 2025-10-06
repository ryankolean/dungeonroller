import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function RaceClassStep({ character, setCharacter }) {
  const races = [
    { 
      name: "Human", 
      icon: "🧑", 
      description: "Versatile and ambitious, humans excel in any path they choose.",
      bonuses: "+1 to all abilities",
      traits: ["Extra skill proficiency", "Bonus feat"]
    },
    { 
      name: "Elf", 
      icon: "🧝", 
      description: "Graceful and long-lived, with keen senses and magical affinity.",
      bonuses: "+2 Dexterity, +1 Intelligence",
      traits: ["Darkvision", "Keen senses", "Magic resistance"]
    },
    { 
      name: "Dwarf", 
      icon: "🧔", 
      description: "Hardy mountain folk known for their craftsmanship and resilience.",
      bonuses: "+2 Constitution, +1 Strength",
      traits: ["Damage resistance", "Tool proficiency", "Mountain strength"]
    },
    { 
      name: "Halfling", 
      icon: "🧙‍♂️", 
      description: "Small but brave, with natural luck and nimble fingers.",
      bonuses: "+2 Dexterity, +1 Charisma",
      traits: ["Lucky", "Brave", "Nimble escape"]
    },
    { 
      name: "Dragonborn", 
      icon: "🐲", 
      description: "Proud descendants of dragons with elemental breath weapons.",
      bonuses: "+2 Strength, +1 Charisma",
      traits: ["Breath weapon", "Damage resistance", "Draconic ancestry"]
    }
  ];

  const classes = [
    { 
      name: "Fighter", 
      icon: "⚔️", 
      description: "Master of weapons and armor, excelling in direct combat.",
      primaryStat: "Strength or Dexterity",
      role: "Tank/Damage Dealer",
      complexity: "Beginner"
    },
    { 
      name: "Wizard", 
      icon: "🧙‍♂️", 
      description: "Scholar of arcane magic with powerful spells and vast knowledge.",
      primaryStat: "Intelligence",
      role: "Spell Caster",
      complexity: "Advanced"
    },
    { 
      name: "Rogue", 
      icon: "🗡️", 
      description: "Stealthy expert in skills, sneak attacks, and avoiding danger.",
      primaryStat: "Dexterity",
      role: "Skill Expert/Damage",
      complexity: "Intermediate"
    },
    { 
      name: "Cleric", 
      icon: "✨", 
      description: "Divine spellcaster who can heal allies and turn undead.",
      primaryStat: "Wisdom",
      role: "Healer/Support",
      complexity: "Intermediate"
    },
    { 
      name: "Ranger", 
      icon: "🏹", 
      description: "Nature's guardian with tracking skills and ranged combat prowess.",
      primaryStat: "Dexterity or Wisdom",
      role: "Scout/Ranged",
      complexity: "Intermediate"
    }
  ];

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "Beginner": return "bg-green-600/20 text-green-400 border-green-500/50";
      case "Intermediate": return "bg-yellow-600/20 text-yellow-400 border-yellow-500/50";
      case "Advanced": return "bg-red-600/20 text-red-400 border-red-500/50";
      default: return "bg-gray-600/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-8">
      {/* Race Selection */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Choose Your Race
          </h3>
          <p className="text-white/70">Your character's ancestry affects their abilities and traits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {races.map((race, index) => (
            <motion.div
              key={race.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setCharacter(prev => ({ ...prev, race: race.name }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                character.race === race.name
                  ? 'bg-amber-600/20 border-amber-500/50 transform scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15 hover:scale-102'
              }`}
              whileHover={{ y: -2 }}
            >
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{race.icon}</div>
                <h4 className="text-lg font-bold text-white">{race.name}</h4>
              </div>
              
              <p className="text-white/70 text-sm mb-3 text-center">{race.description}</p>
              
              <div className="space-y-2">
                <div className="bg-white/10 rounded p-2">
                  <p className="text-xs text-white/60 uppercase">Ability Bonuses</p>
                  <p className="text-sm text-white">{race.bonuses}</p>
                </div>
                
                <div className="bg-white/10 rounded p-2">
                  <p className="text-xs text-white/60 uppercase">Racial Traits</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {race.traits.map((trait, i) => (
                      <Badge key={i} className="text-xs bg-blue-600/20 text-blue-300 border-blue-500/50">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Class Selection */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Choose Your Class
          </h3>
          <p className="text-white/70">Your class determines your abilities, skills, and role in adventures.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls, index) => (
            <motion.div
              key={cls.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setCharacter(prev => ({ ...prev, class: cls.name }))}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                character.class === cls.name
                  ? 'bg-amber-600/20 border-amber-500/50 transform scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15 hover:scale-102'
              }`}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{cls.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold text-white">{cls.name}</h4>
                    <Badge className={`text-xs ${getComplexityColor(cls.complexity)}`}>
                      {cls.complexity}
                    </Badge>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3">{cls.description}</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-white/10 rounded p-2">
                      <p className="text-xs text-white/60 uppercase">Primary Ability</p>
                      <p className="text-sm text-white">{cls.primaryStat}</p>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <p className="text-xs text-white/60 uppercase">Role</p>
                      <p className="text-sm text-white">{cls.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {(character.race || character.class) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-600/20 border border-amber-500/40 rounded-lg p-4"
        >
          <h4 className="text-white font-medium mb-2">Your Character</h4>
          <div className="flex items-center gap-4">
            {character.race && (
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                {character.race}
              </Badge>
            )}
            {character.class && (
              <Badge className="bg-green-600/20 text-green-300 border-green-500/50">
                {character.class}
              </Badge>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}