import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { PublicAdventure } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DMToolsPage() {
  const [user, setUser] = useState(null);
  const [myAdventures, setMyAdventures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.role === 'dungeon_master' || currentUser.role === 'admin') {
        const adventures = await PublicAdventure.filter({ author_id: currentUser.id }, "-created_date");
        setMyAdventures(adventures);
      }
    } catch (error) {
      console.error("Error loading DM data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeDM = async () => {
    try {
      await User.updateMyUserData({ role: 'dungeon_master', dm_verified: true });
      await loadData();
    } catch (error) {
      console.error("Error activating DM role:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  // If user is not a DM, show become DM screen
  if (user && user.role === 'player') {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="parchment p-8 sm:p-12 text-center"
          >
            <div className="text-8xl mb-6">📚</div>
            <h1 className="dynamic-title text-amber-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Become a Dungeon Master
            </h1>
            <p className="text-lg text-amber-800/80 mb-8 max-w-2xl mx-auto">
              Create your own epic adventures, share them with the community, and watch players experience your stories. 
              As a Dungeon Master, you'll have access to powerful tools to craft branching narratives, design encounters, and build memorable quests.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-amber-800/10 rounded-lg p-6 border border-amber-800/20">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Create Adventures</h3>
                <p className="text-amber-800/70">Build branching stories with our intuitive adventure builder</p>
              </div>
              
              <div className="bg-amber-800/10 rounded-lg p-6 border border-amber-800/20">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Share Worldwide</h3>
                <p className="text-amber-800/70">Publish your adventures and reach players globally</p>
              </div>
              
              <div className="bg-amber-800/10 rounded-lg p-6 border border-amber-800/20">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Track Analytics</h3>
                <p className="text-amber-800/70">See how players interact with your creations</p>
              </div>
            </div>

            <button
              onClick={handleBecomeDM}
              className="btn-scroll px-12 py-5 text-xl"
            >
              <span className="text-2xl mr-2">🎲</span>
              Activate DM Role
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // DM Dashboard
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="dynamic-title text-amber-100 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Dungeon Master Tools
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4"></div>
          <p className="text-amber-200/80 text-lg" style={{ fontFamily: 'var(--font-accent)' }}>
            Create, manage, and share your epic adventures
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="parchment p-6"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📖</div>
              <div>
                <div className="text-3xl font-bold text-amber-900">{myAdventures.length}</div>
                <div className="text-amber-800/70">Adventures Created</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="parchment p-6"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎮</div>
              <div>
                <div className="text-3xl font-bold text-amber-900">
                  {myAdventures.reduce((sum, adv) => sum + (adv.play_count || 0), 0)}
                </div>
                <div className="text-amber-800/70">Total Plays</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="parchment p-6"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">⭐</div>
              <div>
                <div className="text-3xl font-bold text-amber-900">
                  {myAdventures.length > 0
                    ? (myAdventures.reduce((sum, adv) => sum + (adv.rating_average || 0), 0) / myAdventures.length).toFixed(1)
                    : '0.0'}
                </div>
                <div className="text-amber-800/70">Average Rating</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => navigate(createPageUrl("AdventureBuilder"))}
              className="btn-scroll w-full h-24 text-xl"
            >
              <span className="text-3xl mr-3">✨</span>
              Create New Adventure
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => navigate(createPageUrl("AdventureBrowser"))}
              className="btn-scroll w-full h-24 text-xl"
            >
              <span className="text-3xl mr-3">🔍</span>
              Browse Adventures
            </button>
          </motion.div>
        </div>

        {/* My Adventures List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-amber-100 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            My Adventures
          </h2>

          {myAdventures.length === 0 ? (
            <div className="parchment p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg text-amber-900/80 mb-6">
                You haven't created any adventures yet. Start your journey as a Dungeon Master!
              </p>
              <button
                onClick={() => navigate(createPageUrl("AdventureBuilder"))}
                className="btn-scroll px-8 py-4"
              >
                Create Your First Adventure
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAdventures.map((adventure, index) => (
                <motion.div
                  key={adventure.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="parchment p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(createPageUrl(`AdventureEditor?id=${adventure.id}`))}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-amber-900 flex-1" style={{ fontFamily: 'var(--font-heading)' }}>
                      {adventure.title}
                    </h3>
                    <Badge className={
                      adventure.status === 'published' ? 'bg-green-800/20 text-green-900' :
                      adventure.status === 'draft' ? 'bg-yellow-800/20 text-yellow-900' :
                      'bg-gray-800/20 text-gray-900'
                    }>
                      {adventure.status}
                    </Badge>
                  </div>

                  <p className="text-amber-800/70 text-sm mb-4 line-clamp-2">
                    {adventure.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {adventure.tags && adventure.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} className="bg-amber-800/20 text-amber-900 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-amber-900/70">
                    <div className="flex items-center gap-1">
                      <span>🎮</span>
                      <span>{adventure.play_count || 0} plays</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{(adventure.rating_average || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-amber-800/20 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(createPageUrl(`AdventureEditor?id=${adventure.id}`));
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(adventure.seed_code);
                        alert('Seed code copied!');
                      }}
                    >
                      📋 {adventure.seed_code}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}