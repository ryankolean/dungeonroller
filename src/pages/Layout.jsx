
import React from "react";
import { useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/layout/Footer';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isHomePage = location.pathname === createPageUrl('Home') || location.pathname === '/';

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center text-amber-50 flex flex-col" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070')" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Open+Sans:wght@300;400;600;700&family=Uncial+Antiqua&display=swap');
        
        /* ... keep existing code (all CSS) ... */
      `}</style>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${10 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row relative z-10 flex-1">
        {!isHomePage && <NavigationBar />}
        
        <main className={`flex-1 relative z-10 w-full flex flex-col ${!isHomePage ? "p-4 md:p-8 pt-24 pb-24 md:pt-8" : ""}`}>
          <div className="flex-1">
            {children}
          </div>
          
          {!isHomePage && <Footer />}
        </main>
      </div>

      {isHomePage && (
        <div className="relative z-10">
          <Footer />
        </div>
      )}
    </div>
  );
}
