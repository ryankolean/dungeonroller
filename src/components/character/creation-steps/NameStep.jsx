import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, RotateCcw } from "lucide-react";

export default function NameStep({ character, setCharacter }) {
  const [isRandomizing, setIsRandomizing] = useState(false);

  const firstNames = [
    "Aeliana", "Brynn", "Caelan", "Darius", "Elara", "Fenwick", "Gareth", "Hazel",
    "Iorveth", "Jasper", "Kira", "Lysander", "Mira", "Nolan", "Orion", "Petra",
    "Quinn", "Rowan", "Sage", "Theron", "Ulric", "Vera", "Willem", "Xara", "Yorick", "Zara"
  ];
  
  const lastNames = [
    "Brightblade", "Stormwind", "Ironforge", "Goldleaf", "Shadowmere", "Fireborn",
    "Moonwhisper", "Earthshaker", "Starweaver", "Thornfield", "Ravencrest", "Lightbringer",
    "Darkbane", "Swiftstrike", "Strongarm", "Silverbough", "Dragonheart", "Winterfell",
    "Summerwind", "Nightfall", "Dawnbreaker", "Stormcaller", "Flameheart", "Frostborn"
  ];

  const handleRandomize = async () => {
    setIsRandomizing(true);
    
    // Simulate loading time
    setTimeout(() => {
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${randomFirstName} ${randomLastName}`;
      
      setCharacter(prev => ({ ...prev, name: fullName }));
      setIsRandomizing(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">What is your character's name?</h3>
        <p className="text-white/70">Choose a name that will echo through legend, or let fate decide.</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label className="text-white mb-2 block text-lg">Character Name</Label>
          <Input
            placeholder="Enter your character's name"
            value={character.name}
            onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 text-lg p-4 h-14"
          />
        </div>

        <Button
          onClick={handleRandomize}
          variant="outline"
          className="w-full bg-green-600/20 border-green-500/50 text-white hover:bg-green-600/30 h-12"
        >
          {isRandomizing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 mr-2"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.div>
          ) : (
            <RotateCcw className="w-5 h-5 mr-2" />
          )}
          {isRandomizing ? "Generating..." : "Randomize Name"}
        </Button>

        {character.name && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 bg-white/10 rounded-lg border border-white/20"
          >
            <p className="text-white/70 mb-2">Your character will be known as:</p>
            <p className="text-2xl font-bold text-white">{character.name}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}