
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

        :root {
          --font-heading: 'Cinzel', serif;
          --font-body: 'Open Sans', sans-serif;
          --font-accent: 'Cinzel', serif;
          --font-header: 'Cinzel', serif;
          --font-fantasy: 'Uncial Antiqua', cursive;
          --border-gold: #d4af37;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: var(--font-body);
        }

        .floating-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.8), transparent);
          border-radius: 50%;
          animation: float linear infinite;
          opacity: 0;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }

        .parchment {
          background: linear-gradient(135deg,
            rgba(245, 222, 179, 0.95) 0%,
            rgba(222, 184, 135, 0.95) 50%,
            rgba(210, 180, 140, 0.95) 100%);
          border: 3px solid #8b7355;
          border-radius: 12px;
          box-shadow:
            inset 0 0 30px rgba(139, 115, 85, 0.3),
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .parchment::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 115, 85, 0.03) 2px,
              rgba(139, 115, 85, 0.03) 4px
            );
          border-radius: 12px;
          pointer-events: none;
        }

        .btn-scroll {
          background: linear-gradient(135deg, #8b7355 0%, #6b5844 100%);
          color: #f5f5dc;
          border: 2px solid var(--border-gold);
          font-family: var(--font-heading);
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .btn-scroll:hover:not(:disabled) {
          background: linear-gradient(135deg, #6b5844 0%, #5a4a38 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          border-color: #ffd700;
        }

        .btn-scroll:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-scroll-danger {
          background: linear-gradient(135deg, #8b0000 0%, #660000 100%);
          color: #ffd700;
          border: 2px solid var(--border-gold);
          font-family: var(--font-heading);
          font-weight: 700;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .btn-scroll-danger:hover:not(:disabled) {
          background: linear-gradient(135deg, #a00000 0%, #800000 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 0, 0, 0.5);
          border-color: #ffd700;
        }

        .btn-scroll-danger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dynamic-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          text-shadow:
            0 0 20px rgba(212, 175, 55, 0.5),
            2px 2px 4px rgba(0, 0, 0, 0.8),
            4px 4px 8px rgba(0, 0, 0, 0.5);
        }

        .dynamic-title-sidebar {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .dynamic-title {
            font-size: clamp(2rem, 6vw, 3rem);
          }
        }

        * {
          box-sizing: border-box;
        }
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
