import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, RotateCcw } from "lucide-react";

export default function BackgroundStep({ character, setCharacter }) {
  const [isRandomizing, setIsRandomizing] = useState(false);

  const backgrounds = [
    "Born in the grand library of Candlekeep, you were destined for a life of quiet study and ink-stained fingers. You showed a prodigious talent for deciphering ancient and forbidden texts from a young age, often sneaking into restricted sections. This curiosity, however, became your undoing when you stumbled upon a tome detailing a forgotten, heretical prophecy that threatened the established order. Accused of treason for not immediately reporting your findings, you were branded a traitor and exiled from the only home you've ever known. Fearing for your life, you fled with only a satchel of scrolls and the dangerous knowledge you uncovered. Now you wander the land as a fugitive, seeking allies who might believe your story. The weight of the prophecy presses heavily upon you, a constant reminder of the life you lost and the future you must now protect.",

    "You grew up under the vibrant tents of the 'Wandering Wonders,' a traveling circus renowned for its acrobats and illusionists. Your days were filled with laughter, applause, and the thrill of performing death-defying feats on the high wire. Tragedy struck when the circus master, a cruel and greedy man, fell into debt with a dangerous criminal guild. To save your 'found family', you began using your agility and sleight of hand for less-than-legal purposes at night. You became a ghost, lifting coin purses and precious jewels from wealthy merchants in the towns you visited. Though your actions saved the circus, the thrill of the heist and the guilt of your crimes created a deep conflict within you. Eventually, you left the circus behind, unable to reconcile your two lives, and now seek a legendary treasure, hoping one grand score will be enough to buy back your honor.",
    
    "You were a proud member of the Stoneguard, a stoic order of warriors sworn to protect a vital mountain pass. For generations, your order held back the savage hordes that threatened the lowlands with unwavering resolve. During a particularly harsh winter, your fortress was besieged by an overwhelming force led by a terrifying hobgoblin warlord. You fought valiantly for weeks, but one by one, your comrades fell around you. In the final, bloody assault, you were knocked unconscious and left for dead beneath a pile of your kin. When you awoke, you were the sole survivor amidst a smoldering ruin, the pass breached. Consumed by survivor's guilt and a burning desire for vengeance, you now hunt the warlord responsible for your order's demise, carrying the shield of your fallen captain as a heavy burden and a symbol of your unending oath.",

    "You once served as a revered cleric in a small, peaceful village, known for your gentle touch and miraculous healing abilities. Your powers stemmed from a pact with a benevolent nature spirit that resided in the nearby ancient woods. One day, a desperate noble brought his dying daughter to you, her body ravaged by a mysterious magical plague. In your attempt to save her, you drew too deeply from your power, inadvertently angering the nature spirit and twisting its benevolent energy. The child was saved, but a dark curse was transferred to you. Now, while you can still heal, each use of your power causes a creeping, shadowy blight to spread across your own skin, and plants wither at your touch. Cast out from your village as an abomination, you search for a way to break the curse, all while wrestling with the moral dilemma of using your tainted gift to help others."
  ];

  const handleRandomize = async () => {
    setIsRandomizing(true);
    
    setTimeout(() => {
      const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      setCharacter(prev => ({ ...prev, background: randomBackground }));
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
        <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Tell your character's story</h3>
        <p className="text-white/70">Create a rich background that explains how your character became an adventurer.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <Label className="text-white mb-2 block text-lg">Background Story</Label>
          <Textarea
            placeholder="Write your character's background story, or use the randomize button for inspiration..."
            value={character.background}
            onChange={(e) => setCharacter(prev => ({ ...prev, background: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[200px] resize-none"
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
          {isRandomizing ? "Generating..." : "Generate Random Background"}
        </Button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30"
        >
          <p className="text-blue-200 text-sm">
            <strong>Optional:</strong> You can skip this step or add more details later. A good background adds depth to your character's motivations.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}