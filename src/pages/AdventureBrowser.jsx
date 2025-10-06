import React, { useState, useEffect } from "react";
import { PublicAdventure } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdventureBrowserPage() {
  const [adventures, setAdventures] = useState([]);
  const [filteredAdventures, setFilteredAdventures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterGenre, setFilterGenre] = useState("all");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...adventures];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(adv =>
        adv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adv.author_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (filterGenre !== 'all') {
      filtered = filtered.filter(adv => adv.tags && adv.tags.includes(filterGenre));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
        break;
      default:
        break;
    }

    setFilteredAdventures(filtered);
  }, [adventures, searchTerm, sortBy, filterGenre]);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const publishedAdventures = await PublicAdventure.filter({ status: 'published' }, "-created_date");
      setAdventures(publishedAdventures);
    } catch (error) {
      console.error("Error loading adventures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (adventureId) => {
    if (!user) return;
    
    try {
      const favorites = user.favorite_adventures || [];
      const isFavorited = favorites.includes(adventureId);
      
      if (isFavorited) {
        await User.updateMyUserData({
          favorite_adventures: favorites.filter(id => id !== adventureId)
        });
      } else {
        await User.updateMyUserData({
          favorite_adventures: [...favorites, adventureId]
        });
      }
      
      await loadData();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handlePlayAdventure = (adventure) => {
    // For now, just show the seed code. Later this would integrate with character selection
    alert(`Adventure Seed: ${adventure.seed_code}\n\nThis will soon integrate with character selection to start playing!`);
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

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="dynamic-title text-amber-100 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Adventure Browser
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4"></div>
          <p className="text-amber-200/80 text-lg">
            Discover and play community-created adventures
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="parchment p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search adventures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="medieval-input"
            />
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="medieval-select">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="medieval-select">
                <SelectValue placeholder="Filter by genre..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="Fantasy">Fantasy</SelectItem>
                <SelectItem value="Horror">Horror</SelectItem>
                <SelectItem value="Mystery">Mystery</SelectItem>
                <SelectItem value="Comedy">Comedy</SelectItem>
                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-amber-900/70">
            Showing {filteredAdventures.length} of {adventures.length} adventures
          </div>
        </div>

        {/* Adventures Grid */}
        {filteredAdventures.length === 0 ? (
          <div className="parchment p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-amber-900/80">
              No adventures found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdventures.map((adventure, index) => (
              <motion.div
                key={adventure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="parchment p-6 hover:shadow-xl transition-all relative"
              >
                {adventure.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-600/80 text-white">
                      ⭐ Featured
                    </Badge>
                  </div>
                )}

                <h3 className="text-xl font-bold text-amber-900 mb-2 pr-20" style={{ fontFamily: 'var(--font-heading)' }}>
                  {adventure.title}
                </h3>

                <p className="text-sm text-amber-800/70 mb-1">
                  by {adventure.author_name}
                </p>

                <p className="text-amber-800/70 text-sm mb-4 line-clamp-3">
                  {adventure.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {adventure.tags && adventure.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} className="bg-amber-800/20 text-amber-900 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-amber-900/70 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span>{'⭐'.repeat(adventure.difficulty_rating)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🎮</span>
                      <span>{adventure.play_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{(adventure.rating_average || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlayAdventure(adventure)}
                    className="btn-scroll flex-1 py-2 text-sm"
                  >
                    Play Now
                  </button>
                  <button
                    onClick={() => handleFavorite(adventure.id)}
                    className={`btn-scroll w-12 h-10 flex items-center justify-center text-lg ${
                      user?.favorite_adventures?.includes(adventure.id) ? 'bg-red-600/80' : ''
                    }`}
                  >
                    {user?.favorite_adventures?.includes(adventure.id) ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="mt-3 text-center text-xs text-amber-900/60">
                  Seed: {adventure.seed_code}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}