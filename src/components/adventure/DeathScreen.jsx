import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function DeathScreen({ character, onConfirmDeath }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-red-900/20 backdrop-blur-md border-2 border-red-500/50 rounded-2xl p-8 max-w-md text-center"
      >
        <div className="text-6xl mb-4">💀</div>
        <h3 className="text-3xl font-bold text-red-300 mb-4" style={{fontFamily: 'var(--font-heading)'}}>
          {character.name} Has Fallen
        </h3>
        <p className="text-red-200/90 mb-6 leading-relaxed">
          Your character has met their demise. In this unforgiving world, death is final. Their story ends here, and they will be permanently deleted from the annals of history.
        </p>
        <Button
          onClick={onConfirmDeath}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
        >
          Accept Your Fate
        </Button>
      </motion.div>
    </motion.div>
  );
}