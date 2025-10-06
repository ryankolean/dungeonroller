
import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';

export default function AdventureLog({ log }) {
  const scrollAreaRef = useRef(null);
  const safeLog = useMemo(() => log || [], [log]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }, 100);
    }
  }, [safeLog]);

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 flex-shrink-0">
        <History className="w-5 h-5" />
        Adventure Log
      </h3>
      <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {safeLog.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              <p>Your story has yet to be written.</p>
            </div>
          ) : (
            safeLog.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/80 border-l-2 border-white/10 pl-4"
              >
                <p className="font-bold text-amber-300">Depth {index + 1}</p>
                <p className="italic text-white/70">{entry}</p>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
