import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CombatLog({ messages }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const getMessageStyle = (type) => {
    switch (type) {
      case 'critical':
        return 'text-yellow-300 font-bold border-l-4 border-yellow-500 pl-3';
      case 'hit':
        return 'text-green-300 border-l-4 border-green-500 pl-3';
      case 'miss':
        return 'text-gray-400 border-l-4 border-gray-600 pl-3';
      case 'fumble':
        return 'text-red-400 font-bold border-l-4 border-red-500 pl-3';
      case 'defeat':
        return 'text-amber-300 font-bold border-l-4 border-amber-500 pl-3';
      case 'action':
        return 'text-blue-300 border-l-4 border-blue-500 pl-3';
      case 'enemy-action':
        return 'text-orange-300 border-l-4 border-orange-500 pl-3';
      case 'success':
        return 'text-green-400 font-bold border-l-4 border-green-500 pl-3';
      case 'error':
        return 'text-red-300 border-l-4 border-red-500 pl-3';
      default:
        return 'text-white/70 border-l-4 border-white/30 pl-3';
    }
  };

  return (
    <div className="mt-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📜 Combat Log
      </h3>
      <ScrollArea className="h-64 pr-4" ref={scrollRef}>
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.timestamp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className={`mb-2 p-2 rounded ${getMessageStyle(msg.type)}`}
            >
              {msg.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}