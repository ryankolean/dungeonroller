
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import NameStep from "./creation-steps/NameStep";
import RaceClassStep from "./creation-steps/RaceClassStep";
import AbilityScoresStep from "./creation-steps/AbilityScoresStep";
import BackgroundStep from "./creation-steps/BackgroundStep";
import EquipmentStep from "./creation-steps/EquipmentStep";
import SummaryStep from "./creation-steps/SummaryStep";

const STEPS = [
  { id: 'name', title: 'Character Name', component: NameStep },
  { id: 'race-class', title: 'Race & Class', component: RaceClassStep },
  { id: 'abilities', title: 'Ability Scores', component: AbilityScoresStep },
  { id: 'background', title: 'Background', component: BackgroundStep },
  { id: 'equipment', title: 'Equipment', component: EquipmentStep },
  { id: 'summary', title: 'Review & Confirm', component: SummaryStep }
];

export default function CharacterCreation({ onCreateCharacter, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [character, setCharacter] = useState({
    name: "",
    race: "",
    class: "",
    background: "",
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    equipment: []
  });

  const CurrentStepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1); // Corrected from currentStep + 1 to currentStep - 1
    }
  };

  const handleCreateCharacter = async () => {
    if (!character.name || !character.race || !character.class) return;

    setIsCreating(true);
    
    const characterData = {
      ...character,
      level: 1,
      experience_points: 0,
      hit_points: 10 + Math.floor((character.constitution - 10) / 2),
      max_hit_points: 10 + Math.floor((character.constitution - 10) / 2),
    };

    // Simulate creation time
    setTimeout(async () => {
      await onCreateCharacter(characterData);
      setIsCreating(false);
    }, 1500);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return character.name.trim() !== "";
      case 1: return character.race && character.class;
      case 2: return true; // Ability scores always have default values
      case 3: return true; // Background is optional
      case 4: return true; // Equipment is optional
      case 5: return character.name && character.race && character.class;
      default: return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="parchment max-w-6xl mx-auto p-4 sm:p-8 md:p-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b-4 border-double border-amber-800/30 pb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-xl">⬅️</span>
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Create Character</h2>
            <p className="text-white/70 text-sm sm:text-base">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-2">
          {STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`text-[10px] sm:text-xs font-medium ${
                index <= currentStep ? 'text-white' : 'text-white/40'
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[350px] sm:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              character={character}
              setCharacter={setCharacter}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-2 border-amber-800/30">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className="btn-scroll w-full sm:w-auto px-12 h-14 text-lg flex items-center justify-center gap-2"
        >
          <span className="text-xl">⬅️</span>
          Previous
        </button>

        <div className="text-center text-amber-900/60 text-lg hidden sm:block" style={{ fontFamily: 'var(--font-accent)' }}>
          {currentStep + 1} / {STEPS.length}
        </div>

        {isLastStep ? (
          <button
            onClick={handleCreateCharacter}
            disabled={isCreating || !canProceed()}
            className="btn-scroll-danger w-full sm:w-auto px-8 h-16 text-lg flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <span className="animate-spin text-xl">🔄</span>
                Creating Character...
              </>
            ) : (
              <>
                <span className="text-xl">⚔️</span>
                Create Character
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-scroll w-full sm:w-auto px-12 h-14 text-lg flex items-center justify-center gap-2"
          >
            Next
            <span className="text-xl">➡️</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
