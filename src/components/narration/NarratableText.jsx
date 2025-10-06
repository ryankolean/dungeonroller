import React, { useState } from "react";
import { motion } from "framer-motion";

export default function NarratableText({ 
  children, 
  className = "", 
  highlightedWord = "",
  ...props 
}) {
  const [highlightWord, setHighlightWord] = useState("");

  // Function to highlight current word during narration
  const renderTextWithHighlight = (text) => {
    if (!highlightedWord || !text) return text;

    const words = text.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      const isHighlighted = cleanWord === highlightedWord.toLowerCase();
      
      return (
        <span key={index}>
          {isHighlighted ? (
            <motion.span
              initial={{ backgroundColor: "transparent" }}
              animate={{ 
                backgroundColor: ["rgba(168, 85, 247, 0.3)", "rgba(236, 72, 153, 0.3)", "rgba(168, 85, 247, 0.3)"]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="px-1 rounded"
            >
              {word}
            </motion.span>
          ) : (
            word
          )}{index < words.length - 1 ? ' ' : ''}
        </span>
      );
    });
  };

  if (typeof children === 'string') {
    return (
      <span className={className} {...props}>
        {renderTextWithHighlight(children)}
      </span>
    );
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}