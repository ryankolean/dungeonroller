import React, { useState } from "react";
import { PublicAdventure } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GENRE_TAGS = [
  "Fantasy", "Horror", "Mystery", "Comedy", "Sci-Fi", "Romance", "Adventure",
  "Political", "Dungeon Crawl", "Roleplay Heavy", "Combat Heavy", "Puzzle"
];

export default function AdventureBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [adventure, setAdventure] = useState({
    title: "",
    description: "",
    difficulty_rating: 3,
    estimated_time: "1hour",
    tags: [],
    recommended_level: 5,
    party_size: "1",
    content_rating: "teen",
    starting_scene: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { id: 'metadata', title: 'Adventure Details' },
    { id: 'settings', title: 'Game Settings' },
    { id: 'story', title: 'Starting Scene' },
    { id: 'review', title: 'Review & Create' }
  ];

  const generateSeedCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleTagToggle = (tag) => {
    setAdventure(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const user = await User.me();
      const seedCode = generateSeedCode();
      
      const newAdventure = await PublicAdventure.create({
        ...adventure,
        seed_code: seedCode,
        author_id: user.id,
        author_name: user.full_name,
        status: 'draft',
        version: '1.0.0',
        story_structure: {
          root_node: {
            id: 'start',
            type: 'story',
            content: adventure.starting_scene,
            choices: []
          }
        },
        starting_node_id: 'start'
      });

      navigate(createPageUrl(`AdventureEditor?id=${newAdventure.id}`));
    } catch (error) {
      console.error("Error creating adventure:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return adventure.title.trim() && adventure.description.trim();
      case 1: return adventure.tags.length > 0;
      case 2: return adventure.starting_scene.trim();
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="dynamic-title text-amber-100 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Create New Adventure
          </h1>
          <p className="text-amber-200/80 text-lg">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`text-xs sm:text-sm font-medium ${
                  index <= currentStep ? 'text-amber-100' : 'text-amber-100/40'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <div className="w-full bg-amber-100/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="parchment p-6 sm:p-10 mb-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* Step 0: Metadata */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-lg font-bold text-amber-900 mb-2">Adventure Title *</label>
                  <Input
                    value={adventure.title}
                    onChange={(e) => setAdventure({ ...adventure, title: e.target.value })}
                    placeholder="The Lost Temple of Doom"
                    className="text-lg medieval-input"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-amber-900 mb-2">Description/Synopsis *</label>
                  <Textarea
                    value={adventure.description}
                    onChange={(e) => setAdventure({ ...adventure, description: e.target.value })}
                    placeholder="Deep in the jungle lies a forgotten temple, filled with ancient treasures and deadly traps..."
                    className="h-40 medieval-input"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-amber-900/80 text-sm">
                    💡 <strong>Tip:</strong> Write a compelling description that will attract players. 
                    Hint at the adventure's themes and what makes it unique!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 1: Settings */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-lg font-bold text-amber-900 mb-3">Genre Tags (select at least one) *</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRE_TAGS.map(tag => (
                      <Badge
                        key={tag}
                        className={`cursor-pointer transition-all ${
                          adventure.tags.includes(tag)
                            ? 'bg-amber-600/80 text-white border-amber-600'
                            : 'bg-amber-800/20 text-amber-900 border-amber-800/40 hover:bg-amber-800/30'
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {adventure.tags.includes(tag) && '✓ '}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-amber-900 mb-2">Difficulty Rating</label>
                    <Select
                      value={adventure.difficulty_rating.toString()}
                      onValueChange={(value) => setAdventure({ ...adventure, difficulty_rating: parseInt(value) })}
                    >
                      <SelectTrigger className="medieval-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">⭐ Very Easy</SelectItem>
                        <SelectItem value="2">⭐⭐ Easy</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Medium</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Hard</SelectItem>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Very Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-amber-900 mb-2">Estimated Time</label>
                    <Select
                      value={adventure.estimated_time}
                      onValueChange={(value) => setAdventure({ ...adventure, estimated_time: value })}
                    >
                      <SelectTrigger className="medieval-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hour">1 hour</SelectItem>
                        <SelectItem value="2hours">2 hours</SelectItem>
                        <SelectItem value="3hours+">3+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-amber-900 mb-2">Recommended Level</label>
                    <Select
                      value={adventure.recommended_level.toString()}
                      onValueChange={(value) => setAdventure({ ...adventure, recommended_level: parseInt(value) })}
                    >
                      <SelectTrigger className="medieval-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(20)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Level {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-amber-900 mb-2">Content Rating</label>
                    <Select
                      value={adventure.content_rating}
                      onValueChange={(value) => setAdventure({ ...adventure, content_rating: value })}
                    >
                      <SelectTrigger className="medieval-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_ages">All Ages</SelectItem>
                        <SelectItem value="teen">Teen (13+)</SelectItem>
                        <SelectItem value="mature">Mature (17+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Starting Scene */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-lg font-bold text-amber-900 mb-2">Opening Scene *</label>
                  <Textarea
                    value={adventure.starting_scene}
                    onChange={(e) => setAdventure({ ...adventure, starting_scene: e.target.value })}
                    placeholder="You stand at the entrance of an ancient temple, vines covering the weathered stone entrance. The air is thick with humidity and the distant sound of waterfalls echoes through the jungle..."
                    className="h-64 medieval-input"
                  />
                  <p className="text-sm text-amber-900/60 mt-2">
                    This is the first scene players will see. Set the mood and introduce the adventure's premise.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-amber-900/80 text-sm">
                    💡 <strong>Tip:</strong> After creating the adventure, you'll be able to add branching paths, 
                    choices, and encounters in the advanced editor.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">📖</div>
                  <h2 className="text-3xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Review Your Adventure
                  </h2>
                  <p className="text-amber-800/70">
                    Make sure everything looks good before creating your adventure
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-amber-800/10 rounded-lg p-4 border border-amber-800/20">
                    <h3 className="font-bold text-amber-900 mb-2">Title</h3>
                    <p className="text-amber-800">{adventure.title}</p>
                  </div>

                  <div className="bg-amber-800/10 rounded-lg p-4 border border-amber-800/20">
                    <h3 className="font-bold text-amber-900 mb-2">Description</h3>
                    <p className="text-amber-800">{adventure.description}</p>
                  </div>

                  <div className="bg-amber-800/10 rounded-lg p-4 border border-amber-800/20">
                    <h3 className="font-bold text-amber-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {adventure.tags.map(tag => (
                        <Badge key={tag} className="bg-amber-600/20 text-amber-900">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-800/10 rounded-lg p-4 border border-amber-800/20">
                      <h3 className="font-bold text-amber-900 text-sm mb-1">Difficulty</h3>
                      <p className="text-amber-800">{'⭐'.repeat(adventure.difficulty_rating)}</p>
                    </div>
                    <div className="bg-amber-800/10 rounded-lg p-4 border border-amber-800/20">
                      <h3 className="font-bold text-amber-900 text-sm mb-1">Est. Time</h3>
                      <p className="text-amber-800">{adventure.estimated_time}</p>
                    </div>
                    <div className="bg-amber-800/10 rounded-lg p-4 border border-amber-800/20">
                      <h3 className="font-bold text-amber-900 text-sm mb-1">Rec. Level</h3>
                      <p className="text-amber-800">Level {adventure.recommended_level}</p>
                    </div>
                    <div className="bg-amber-800/10 rounded-lg p-4 border border-amber-800/20">
                      <h3 className="font-bold text-amber-900 text-sm mb-1">Rating</h3>
                      <p className="text-amber-800">{adventure.content_rating}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="btn-scroll px-8 py-4"
          >
            ← Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="btn-scroll px-8 py-4"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isCreating || !canProceed()}
              className="btn-scroll-danger px-12 py-4"
            >
              {isCreating ? (
                <>
                  <span className="animate-spin mr-2">🔄</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Create Adventure
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}