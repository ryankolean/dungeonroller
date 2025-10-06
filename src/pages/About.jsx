import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="parchment p-8 sm:p-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-6" style={{ fontFamily: 'var(--font-header)' }}>
            About DungeonRoller
          </h1>

          <div className="space-y-6 text-amber-900/90">
            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                Our Story
              </h2>
              <p className="text-lg leading-relaxed">
                DungeonRoller is developed and owned by <strong>Summit Software Solutions LLC</strong>, 
                a company dedicated to creating innovative digital experiences for tabletop gaming enthusiasts. 
                We believe in bringing the magic of storytelling and adventure to life through technology.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed">
                To provide immersive, interactive storytelling tools that bring the magic of tabletop 
                role-playing to the digital realm. We strive to create experiences that honor the spirit 
                of traditional tabletop gaming while leveraging modern technology to enhance accessibility 
                and engagement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                What Makes Us Different
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-800/10 p-4 rounded-lg border border-amber-800/20">
                  <h3 className="font-bold text-xl mb-2">🎲 Authentic Experience</h3>
                  <p>True-to-tabletop mechanics with D&D 5e rules implementation</p>
                </div>
                <div className="bg-amber-800/10 p-4 rounded-lg border border-amber-800/20">
                  <h3 className="font-bold text-xl mb-2">🌟 Community-Driven</h3>
                  <p>Player and DM tools designed with community feedback</p>
                </div>
                <div className="bg-amber-800/10 p-4 rounded-lg border border-amber-800/20">
                  <h3 className="font-bold text-xl mb-2">📖 Rich Storytelling</h3>
                  <p>AI-enhanced narrative generation for endless adventures</p>
                </div>
                <div className="bg-amber-800/10 p-4 rounded-lg border border-amber-800/20">
                  <h3 className="font-bold text-xl mb-2">⚔️ Complete System</h3>
                  <p>Character creation, combat, progression, and more</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                Contact Information
              </h2>
              <div className="bg-amber-800/10 p-6 rounded-lg border border-amber-800/20">
                <p className="text-lg font-bold mb-3">Summit Software Solutions LLC</p>
                <p><strong>Email:</strong> <a href="mailto:info@summitsoftwaresolutions.dev" className="text-amber-700 hover:text-amber-900">info@summitsoftwaresolutions.dev</a></p>
              </div>
            </section>

            <section className="text-center pt-8 border-t-2 border-amber-800/30">
              <p className="text-xl" style={{ fontFamily: 'var(--font-fantasy)' }}>
                "Every legend begins with a single roll..."
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}