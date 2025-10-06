import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, useScroll, useTransform } from "framer-motion";

const FeatureSection = ({ icon, title, description, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 py-20`}
    >
      {/* Icon Side */}
      <motion.div
        whileInView={{ scale: [0.8, 1.1, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-shrink-0"
      >
        <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center text-8xl md:text-9xl drop-shadow-2xl">
          {icon}
        </div>
      </motion.div>

      {/* Content Side */}
      <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}>
        <motion.h2
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          style={{ 
            fontFamily: 'var(--font-heading)',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.5), 3px 3px 6px rgba(0,0,0,0.9)'
          }}
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto md:mx-0"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Full Background Image */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6"
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://user-gen-media-assets.s3.amazonaws.com/seedream_images/0363df8c-e50d-4b09-93d7-fced8b11ff68.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-amber-400 mb-8"
            style={{ 
              fontFamily: 'var(--font-heading)',
              textShadow: '0 0 40px rgba(212, 175, 55, 0.6), 4px 4px 8px rgba(0,0,0,0.9)'
            }}
          >
            DungeonRoller
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-12"
            style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.9)' }}
          >
            Embark on epic adventures where your choices shape your legend. 
            Roll the dice, face peril, and write your own story in a world of myth and magic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to={createPageUrl("QuestSelection")}>
              <button className="btn-scroll px-12 py-6 text-2xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-300">
                <span className="text-3xl mr-3">⚔️</span>
                Begin Your Quest
              </button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/60 text-4xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section with Dark Background */}
      <div className="relative bg-gradient-to-b from-black/80 via-gray-900/95 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          
          {/* Feature 1: Fateful Dice */}
          <FeatureSection
            icon="🎲"
            title="Fateful Dice"
            description="Experience realistic dice rolling that determines your character's triumphs and tribulations. Every roll matters in your journey through danger and glory."
            index={0}
          />

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent my-12"
          />

          {/* Feature 2: Living Tales */}
          <FeatureSection
            icon="📖"
            title="Living Tales"
            description="Immerse yourself in rich, text-based adventures where every decision carves a new path. Your story unfolds dynamically, shaped by your choices and the roll of the dice."
            index={1}
          />

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent my-12"
          />

          {/* Feature 3: Forge a Hero */}
          <FeatureSection
            icon="⚔️"
            title="Forge a Hero"
            description="Create and develop a unique character with deep progression systems. Level up, unlock abilities, and become a legend—but remember, death means permanent loss forever."
            index={2}
          />

        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-20 px-4"
        >
          <h2 
            className="text-5xl md:text-6xl font-bold text-amber-400 mb-8"
            style={{ 
              fontFamily: 'var(--font-heading)',
              textShadow: '0 0 30px rgba(212, 175, 55, 0.5), 3px 3px 6px rgba(0,0,0,0.9)'
            }}
          >
            Your Legend Awaits
          </h2>
          <p className="text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join thousands of adventurers forging their own epic tales
          </p>
          <Link to={createPageUrl("Character")}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-scroll-danger px-16 py-7 text-2xl shadow-2xl"
            >
              <span className="text-3xl mr-3">✨</span>
              Create Your Hero
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}