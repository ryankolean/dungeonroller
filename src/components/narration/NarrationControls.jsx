import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNarration } from "./useNarration";

export default function NarrationControls({ onClose }) {
  const {
    voices,
    selectedVoice,
    settings,
    updateSettings,
    setSelectedVoice
  } = useNarration();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-xl">🔊</span>
            Narration Settings
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <span className="text-lg">❌</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Voice Selection */}
          <div>
            <Label className="text-white mb-3 block flex items-center gap-2">
              <span className="text-lg">🎶</span>
              Voice
            </Label>
            <Select
              value={selectedVoice?.name || ""}
              onValueChange={(voiceName) => {
                const voice = voices.find(v => v.name === voiceName);
                setSelectedVoice(voice);
              }}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Choose voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speech Rate */}
          <div>
            <Label className="text-white mb-3 block flex items-center gap-2">
              <span className="text-lg">⏩</span>
              Speech Rate: {settings.rate.toFixed(1)}x
            </Label>
            <Slider
              value={[settings.rate]}
              onValueChange={([value]) => updateSettings({ rate: value })}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <Label className="text-white mb-3 block flex items-center gap-2">
              <span className="text-lg">🎼</span>
              Pitch: {settings.pitch.toFixed(1)}
            </Label>
            <Slider
              value={[settings.pitch]}
              onValueChange={([value]) => updateSettings({ pitch: value })}
              min={0.5}
              max={1.5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Deep</span>
              <span>High</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <Label className="text-white mb-3 block flex items-center gap-2">
              <span className="text-lg">🔊</span>
              Volume: {Math.round(settings.volume * 100)}%
            </Label>
            <Slider
              value={[settings.volume]}
              onValueChange={([value]) => updateSettings({ volume: value })}
              min={0.1}
              max={1.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </div>

          {/* Test Button */}
          <Button
            onClick={() => {
              const testText = "Greetings, brave adventurer. Your quest awaits in the mysterious depths of the ancient dungeon.";
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(testText);
                if (selectedVoice) utterance.voice = selectedVoice;
                utterance.rate = settings.rate;
                utterance.pitch = settings.pitch;
                utterance.volume = settings.volume;
                speechSynthesis.speak(utterance);
              }
            }}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-pink-700 text-white"
          >
            Test Voice
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}