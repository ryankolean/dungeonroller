import React, { useState, useEffect, useCallback } from "react";
import { Character } from "@/api/entities";
import { Adventure } from "@/api/entities";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function QuestStartPage() {
  const [character, setCharacter] = useState(null);
  const [adventure, setAdventure] = useState(null);
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
      const char = await Character.get(characterId);
      setCharacter(char);
      const adventures = await Adventure.filter({ character_id: char.id });
      if (adventures.length > 0) {
        setAdventure(adventures[0]);
      } else {
        setAdventure(null);
      }
    } catch (error) {
      console.error("Error loading quest start data:", error);
      navigate(createPageUrl("QuestSelection"));
    } finally {
      setLoading(false);
    }
  }, [characterId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartNewQuest = async () => {
    if (!character) return;
    setLoading(true);

    try {
      const rootNode = {
          id: 'start',
          depth: 0,
          content: {
              scene_description: `The story of ${character.name}, the ${character.race} ${character.class}, is about to begin. An old map, a mysterious whisper, or a sudden danger pulls them from a life of obscurity into the annals of legend. The path ahead is shrouded in mystery.`,
              encounter_type: "hook",
              details: "This is the starting point of the adventure."
          },
          choices: []
      };

      const seed = `${character.name} the ${character.race} ${character.class} embarks on an epic adventure`;
      const newAdventure = await Adventure.create({
          character_id: character.id,
          seed: seed,
          path_log: [rootNode],
          nodes_cache: [],
          status: 'active'
      });

      navigate(createPageUrl(`Adventure?characterId=${character.id}`));
    } catch (error) {
      console.error("Error starting new quest:", error);
      setLoading(false);
    }
  };

  const handleContinueQuest = () => {
    navigate(createPageUrl(`Adventure?characterId=${character.id}`));
  };

  const handleAbandonQuest = async () => {
    if (!adventure || !window.confirm("Are you sure you want to abandon this quest? All progress will be lost permanently.")) return;
    setLoading(true);
    try {
        await Adventure.delete(adventure.id);
        setAdventure(null);
    } catch (error) {
        console.error("Error abandoning quest:", error);
    } finally {
        setLoading(false);
    }
  };

  if (loading || !character) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-amber-100 text-lg">Loading quest details...</p>
      </div>
    );
  }

  // Get safe path log length
  const pathLogLength = adventure?.path_log?.length || 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="parchment max-w-4xl w-full mx-auto p-8 sm:p-12 text-center"
      >
        <h1 className="dynamic-title text-amber-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {adventure ? `Welcome Back, ${character.name}` : `Begin Your Adventure, ${character.name}`}
        </h1>
        <div className="flex justify-center flex-wrap gap-2 mb-8">
            <Badge className="bg-green-800/70 text-green-50 text-base">{character.race}</Badge>
            <Badge className="bg-red-800/70 text-red-50 text-base">{character.class}</Badge>
            <Badge className="bg-blue-800/70 text-blue-50 text-base">Level {character.level}</Badge>
        </div>

        {adventure ? (
          <div>
            <p className="text-lg text-amber-800/80 mb-8">Your journey awaits. You have explored {pathLogLength} locations. Continue where you left off or abandon your quest to start anew.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleContinueQuest} className="btn-scroll px-10 py-4 text-lg">Continue Quest</button>
                <button onClick={handleAbandonQuest} className="btn-scroll-danger px-10 py-4 text-lg">Abandon Current Quest</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg text-amber-800/80 mb-8">A new saga is ready to be written. The world holds its breath, waiting for your first step. Will you answer the call?</p>
            {/* Future: Add difficulty/type options here */}
            <button onClick={handleStartNewQuest} className="btn-scroll px-12 py-5 text-xl">Start New Quest</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}