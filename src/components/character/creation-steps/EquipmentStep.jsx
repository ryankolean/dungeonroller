import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function EquipmentStep({ character, setCharacter }) {
  const [selectedCategory, setSelectedCategory] = useState('weapons');

  const equipmentByClass = {
    Fighter: {
      weapons: [
        { name: "Longsword", description: "Versatile one-handed sword, +1 to attack rolls", recommended: true },
        { name: "Greatsword", description: "Powerful two-handed weapon, +2 damage but slower attacks" },
        { name: "Sword and Shield", description: "Balanced offense and defense, +1 AC when equipped" },
        { name: "Crossbow", description: "Ranged weapon for tactical combat, ignores some armor" }
      ],
      armor: [
        { name: "Chain Mail", description: "Medium armor providing good protection, AC 16", recommended: true },
        { name: "Plate Armor", description: "Heavy armor for maximum defense, AC 18 but disadvantage on stealth" },
        { name: "Leather Armor", description: "Light armor for mobility, AC 12 but allows better movement" }
      ],
      tools: [
        { name: "Explorer's Pack", description: "Basic adventuring supplies: rope, rations, torches" },
        { name: "Healing Potions (2)", description: "Restores 2d4+2 hit points when consumed" },
        { name: "Whetstone", description: "Keep weapons sharp for maintained damage bonus" }
      ]
    },
    Wizard: {
      weapons: [
        { name: "Quarterstaff", description: "Simple weapon for emergency combat, can be used two-handed", recommended: true },
        { name: "Dagger", description: "Light, throwable weapon that can be concealed" },
        { name: "Light Crossbow", description: "Ranged option when spells aren't suitable" }
      ],
      armor: [
        { name: "Robes", description: "Magical robes that don't restrict spellcasting, AC 10 + Dex", recommended: true },
        { name: "Padded Armor", description: "Light protection that still allows full spellcasting" }
      ],
      tools: [
        { name: "Spellbook", description: "Contains your known spells and formulas for learning new ones" },
        { name: "Component Pouch", description: "Material components needed for many spells", recommended: true },
        { name: "Scholar's Pack", description: "Books, ink, parchment for magical research" },
        { name: "Arcane Focus", description: "Crystal or wand that helps focus magical energy" }
      ]
    },
    Rogue: {
      weapons: [
        { name: "Shortsword", description: "Fast, agile weapon perfect for sneak attacks", recommended: true },
        { name: "Daggers (2)", description: "Throwable backup weapons, perfect for surprise attacks" },
        { name: "Shortbow", description: "Silent ranged weapon for stealthy eliminations" }
      ],
      armor: [
        { name: "Leather Armor", description: "Light protection that doesn't hinder stealth, AC 11 + Dex", recommended: true },
        { name: "Studded Leather", description: "Slightly better protection while maintaining stealth, AC 12 + Dex" }
      ],
      tools: [
        { name: "Thieves' Tools", description: "Lockpicks and tools for disabling traps and opening locks", recommended: true },
        { name: "Burglar's Pack", description: "Rope, caltrops, crowbar for infiltration missions" },
        { name: "Poison Vials (3)", description: "Coat weapons for extra damage on successful hits" }
      ]
    }
    // Add more classes as needed
  };

  const defaultEquipment = {
    weapons: [
      { name: "Club", description: "Basic weapon available to all classes" },
      { name: "Dagger", description: "Light, versatile weapon for any adventurer" }
    ],
    armor: [
      { name: "Traveler's Clothes", description: "Basic clothing with no armor value but comfortable" }
    ],
    tools: [
      { name: "Adventurer's Pack", description: "Basic supplies for any journey" }
    ]
  };

  const currentEquipment = equipmentByClass[character.class] || defaultEquipment;
  const categories = Object.keys(currentEquipment);

  const toggleEquipment = (item) => {
    const currentEquipment = character.equipment || [];
    const isSelected = currentEquipment.includes(item.name);
    
    if (isSelected) {
      setCharacter(prev => ({
        ...prev,
        equipment: currentEquipment.filter(eq => eq !== item.name)
      }));
    } else {
      setCharacter(prev => ({
        ...prev,
        equipment: [...currentEquipment, item.name]
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Choose Your Equipment
        </h3>
        <p className="text-white/70 text-lg">
          Select starting gear for your {character.class}. Recommended items are marked for your class.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-amber-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentEquipment[selectedCategory]?.map((item, index) => {
          const isSelected = (character.equipment || []).includes(item.name);
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-amber-600/20 border-amber-500/50'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
              onClick={() => toggleEquipment(item)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-bold text-white">{item.name}</h4>
                <div className="flex gap-2">
                  {item.recommended && (
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/50 text-xs">
                      Recommended
                    </Badge>
                  )}
                  {isSelected && (
                    <Badge className="bg-amber-600/20 text-amber-400 border-amber-500/50 text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-white/70 text-sm mb-3">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50 uppercase tracking-wide">
                  {selectedCategory.slice(0, -1)}
                </span>
                <div className="w-6 h-6 rounded border-2 border-white/30 flex items-center justify-center">
                  {isSelected && <span className="text-amber-400">✓</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 mt-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚔️</span>
          <div>
            <p className="text-white font-medium">Equipment Tip</p>
            <p className="text-white/70 text-sm">
              Your {character.class} works best with the recommended items, but feel free to customize your loadout for your preferred playstyle.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Equipment Summary */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3">Selected Equipment ({(character.equipment || []).length} items)</h4>
        <div className="flex flex-wrap gap-2">
          {(character.equipment || []).map((item, index) => (
            <Badge key={index} className="bg-amber-600/20 text-amber-300 border-amber-500/50">
              {item}
            </Badge>
          ))}
        </div>
        {(character.equipment || []).length === 0 && (
          <p className="text-white/50 italic">No equipment selected yet</p>
        )}
      </div>
    </div>
  );
}