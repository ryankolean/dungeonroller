import React, { useState, useEffect, useCallback } from "react";
import { Character } from "@/api/entities";
import { Adventure } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import AdventureInterface from "../components/adventure/AdventureInterface";

export default function AdventurePage() {
    const [character, setCharacter] = useState(null);
    const [currentAdventure, setCurrentAdventure] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const characterId = new URLSearchParams(location.search).get("characterId");

    const loadData = useCallback(async () => {
        if (!characterId) {
            navigate(createPageUrl("QuestSelection"));
            return;
        }
        setLoading(true);
        try {
            const [char, adventures] = await Promise.all([
                Character.get(characterId),
                Adventure.filter({ character_id: characterId })
            ]);
            
            if (!char) throw new Error("Character not found");

            setCharacter(char);

            if (adventures.length > 0) {
                setCurrentAdventure(adventures[0]);
            } else {
                // If no adventure exists, they should not be on this page. Redirect.
                navigate(createPageUrl(`QuestStart?characterId=${characterId}`));
                return;
            }
        } catch (error) {
            console.error("Error loading adventure data:", error);
            navigate(createPageUrl("QuestSelection"));
        } finally {
            setLoading(false);
        }
    }, [characterId, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAdventureUpdate = async (updates) => {
        if (!currentAdventure) return;
        const updatedAdventure = { ...currentAdventure, ...updates };
        await Adventure.update(currentAdventure.id, updates);
        setCurrentAdventure(updatedAdventure);
    };

    const handleCharacterDeath = async () => {
        try {
            await Character.delete(characterId);
            // After death, go back to the character selection screen
            navigate(createPageUrl("QuestSelection"));
        } catch (error) {
            console.error("Error deleting character:", error);
        }
    };

    if (loading || !character || !currentAdventure) {
        return (
            <div className="min-h-screen p-4 sm:p-6 w-full flex items-center justify-center">
                <p className="text-amber-100 text-lg">Loading your adventure...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen p-4 sm:p-6 w-full">
            <div className="max-w-7xl mx-auto flex flex-col h-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="dynamic-title text-amber-100 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>The Unfolding Tale of {character.name}</h1>
                    <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'var(--font-accent)' }}>Embark on epic quests and write your legend</p>
                </motion.div>
    
                <div className="flex-grow" data-adventure-content>
                    <AdventureInterface
                        key={currentAdventure.id} // Re-mount when adventure changes
                        character={character}
                        adventure={currentAdventure}
                        onAdventureUpdate={handleAdventureUpdate}
                        onCharacterDeath={handleCharacterDeath}
                    />
                </div>
            </div>
        </div>
    );
}