
import React, { useState, useEffect, useCallback } from "react";
import { Character } from "@/api/entities";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

import CharacterCreation from "../components/character/CharacterCreation";
import CharacterSheet from "../components/character/CharacterSheet";
import CharacterList from "../components/character/CharacterList";

export default function CharacterPage() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showCreation, setShowCreation] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const userCharacters = await Character.filter({ created_by: currentUser.email }, "-created_date");
      setCharacters(userCharacters);
      
      if (userCharacters.length > 0 && !selectedCharacter) {
        setSelectedCharacter(userCharacters[0]);
      } else if (userCharacters.length === 0) {
        setShowCreation(true);
      }
    } catch (error) {
      console.error("Error loading character data:", error);
    } finally {
        setLoading(false);
    }
  }, [selectedCharacter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateCharacter = async (characterData) => {
    const newCharacter = await Character.create(characterData);
    setCharacters([newCharacter, ...characters]);
    setSelectedCharacter(newCharacter);
    setShowCreation(false);
  };

  const handleUpdateCharacter = async (characterId, updates) => {
    await Character.update(characterId, updates);
    await loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="dynamic-title text-amber-100 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Heroes of Legend
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl text-amber-200/80" style={{ fontFamily: 'var(--font-accent)' }}>
            Forge your destiny and shape your legend
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showCreation ? (
            <CharacterCreation
              onCreateCharacter={handleCreateCharacter}
              onCancel={() => setShowCreation(false)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" data-character-content>
              {/* Character List */}
              <div className="lg:col-span-4">
                <CharacterList
                  characters={characters}
                  selectedCharacter={selectedCharacter}
                  onSelectCharacter={setSelectedCharacter}
                  onCreateNew={() => setShowCreation(true)}
                />
              </div>

              {/* Character Details */}
              <div className="lg:col-span-8">
                {selectedCharacter ? (
                  <CharacterSheet
                    character={selectedCharacter}
                    onUpdateCharacter={handleUpdateCharacter}
                  />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="parchment p-8 sm:p-12 text-center"
                  >
                    <div className="text-5xl sm:text-6xl mb-6">🏰</div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      Your Tale Awaits
                    </h3>
                    <p className="text-base sm:text-lg text-amber-800/80 mb-6">
                      Every legend begins with a single step. Create your first hero to embark upon epic adventures!
                    </p>
                    <button
                      onClick={() => setShowCreation(true)}
                      className="btn-scroll px-8 py-4 text-base sm:text-lg"
                    >
                      Forge a Hero
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
