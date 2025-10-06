import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { name: "Home", text: "🏠", path: "Home", description: "Return to main hub" },
    { name: "Character", text: "👤", path: "Character", description: "Manage heroes" },
    { name: "Adventure", text: "⚔️", path: "QuestSelection", description: "Begin quests" },
    { name: "DM Tools", text: "📚", path: "DMTools", description: "Create adventures" }
];

export default function NavigationBar() {
    const location = useLocation();
    const isHomePage = location.pathname === createPageUrl('Home') || location.pathname === '/';

    return (
        <>
            {/* Desktop Sidebar - Enhanced D&D Beyond Style */}
            <nav className="hidden md:flex flex-col w-72 h-screen sticky top-0 z-50" style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
              borderRight: '2px solid var(--border-gold)',
              boxShadow: 'inset -8px 0 24px rgba(0, 0, 0, 0.5), 8px 0 32px rgba(0, 0, 0, 0.6)'
            }}>
              <div className="p-8 border-b-2 border-amber-900/30 relative">
                <div className="text-center mb-4 relative">
                  <h1 className="dynamic-title-sidebar text-amber-100 tracking-wider" style={{ 
                    fontFamily: 'var(--font-header)',
                    textShadow: '0 0 20px rgba(212, 175, 55, 0.5), 2px 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    DungeonRoller
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-3"></div>
                  <p className="text-amber-200/60 text-xs mt-2 uppercase tracking-widest" style={{fontFamily: 'var(--font-body)'}}>
                    Epic Adventures Await
                  </p>
                </div>
              </div>
              
              <div className="p-6 flex-1">
                <ul className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === createPageUrl(item.path);
                    return (
                      <motion.li 
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={createPageUrl(item.path)}
                          className={`flex items-center gap-4 text-base p-4 rounded-lg transition-all duration-300 relative group ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-900/50 to-amber-800/30 text-amber-100 border-l-4 border-amber-400 shadow-lg'
                              : 'text-amber-200/70 hover:bg-amber-900/20 hover:text-amber-100 hover:border-l-4 hover:border-amber-600/50'
                          }`}
                          style={{ fontFamily: 'var(--font-header)' }}
                        >
                          <span className="text-2xl transform group-hover:scale-110 transition-transform">{item.text}</span>
                          <div className="flex-1">
                            <div className="font-semibold tracking-wide">{item.name}</div>
                            <div className="text-xs text-amber-300/50 group-hover:text-amber-300/70 transition-colors" style={{fontFamily: 'var(--font-body)'}}>
                              {item.description}
                            </div>
                          </div>
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute right-2 w-2 h-2 rounded-full bg-amber-400 shadow-lg"
                              style={{boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)'}}
                            />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* Footer decoration */}
              <div className="p-6 border-t-2 border-amber-900/30">
                <div className="text-center text-amber-300/40 text-xs" style={{fontFamily: 'var(--font-fantasy)'}}>
                  <p>"Roll the dice,</p>
                  <p>Write your legend"</p>
                </div>
              </div>
            </nav>

            {/* Mobile Bottom Nav - Roll20 Style */}
            <AnimatePresence>
                {!isHomePage && (
                <motion.nav 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg h-20 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl border-2 border-amber-500/30 rounded-2xl shadow-2xl z-50 flex items-center justify-around md:hidden"
                    style={{boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'}}
                >
                    {navItems.map((item, index) => {
                    const url = createPageUrl(item.path);
                    const isActive = location.pathname === url;
                    return (
                        <Link to={url} key={item.name} className="flex flex-col items-center justify-center relative">
                          <motion.div 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }}
                            className="relative"
                          >
                            <span className={`text-2xl mb-1 transition-all duration-200 ${
                              isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-white/70'
                            }`}>
                              {item.text}
                            </span>
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveIndicator"
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400"
                                style={{boxShadow: '0 0 10px rgba(212, 175, 55, 1)'}}
                              />
                            )}
                          </motion.div>
                          <span className={`text-[10px] font-semibold transition-colors duration-200 uppercase tracking-wider ${
                            isActive ? 'text-white' : 'text-white/60'
                          }`} style={{fontFamily: 'var(--font-header)'}}>
                            {item.name}
                          </span>
                        </Link>
                    );
                    })}
                </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}