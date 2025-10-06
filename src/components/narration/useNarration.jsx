
import { useState, useEffect, useCallback, useRef } from "react";

export function useNarration() {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [settings, setSettings] = useState({
    rate: 0.8,
    pitch: 0.7,
    volume: 0.8
  });
  
  const utteranceRef = useRef(null);
  const highlightCallbackRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      
      // Filter for English male voices (baritone preference)
      const maleVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('male') ||
         voice.name.toLowerCase().includes('david') ||
         voice.name.toLowerCase().includes('alex') ||
         voice.name.toLowerCase().includes('daniel') ||
         voice.name.toLowerCase().includes('fred') ||
         voice.name.toLowerCase().includes('jorge') ||
         !voice.name.toLowerCase().includes('female') && 
         !voice.name.toLowerCase().includes('samantha') &&
         !voice.name.toLowerCase().includes('victoria'))
      );
      
      setVoices(maleVoices);
      
      // Select the best baritone voice available
      const preferredVoice = maleVoices.find(voice => 
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('david')
      ) || maleVoices[0];
      
      setSelectedVoice(preferredVoice);
    };

    // Delay initial voice load slightly to ensure API is ready
    setTimeout(() => {
      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }, 100);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const stopNarration = useCallback(() => {
    speechSynthesis.cancel();
    setIsNarrating(false);
    setIsPaused(false);
    setCurrentText("");
    if (highlightCallbackRef.current) {
      highlightCallbackRef.current("");
    }
  }, []);

  const startNarration = useCallback((text, onHighlight = null) => {
    // Add a small delay to ensure the DOM is updated before we try to read from it.
    setTimeout(() => {
      if (!selectedVoice || !text || !text.trim()) return;
      
      stopNarration();
      
      const cleanText = text.replace(/[#*_`]/g, '').replace(/\s+/g, ' ').trim();
      setCurrentText(cleanText);
      highlightCallbackRef.current = onHighlight;
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = selectedVoice;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      
      utterance.onstart = () => {
        setIsNarrating(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsNarrating(false);
        setIsPaused(false);
        setCurrentText("");
        if (onHighlight) onHighlight("");
      };
      
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsNarrating(false);
        setIsPaused(false);
        setCurrentText("");
        if (onHighlight) onHighlight("");
      };
      
      utterance.onboundary = (event) => {
        if (event.name === 'word' && onHighlight) {
          const word = cleanText.substring(event.charIndex, event.charIndex + event.charLength);
          onHighlight(word);
        }
      };
      
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }, 100); // 100ms delay to allow DOM to settle
  }, [selectedVoice, settings, stopNarration]);

  const pauseNarration = useCallback(() => {
    if (isNarrating && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isNarrating, isPaused]);

  const resumeNarration = useCallback(() => {
    if (isNarrating && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isNarrating, isPaused]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isNarrating,
    isPaused,
    currentText,
    voices,
    selectedVoice,
    settings,
    startNarration,
    stopNarration,
    pauseNarration,
    resumeNarration,
    updateSettings,
    setSelectedVoice
  };
}
