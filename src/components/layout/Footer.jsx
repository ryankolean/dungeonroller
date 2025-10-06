import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 border-t-2 border-amber-500/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-amber-400 mb-3" style={{ fontFamily: 'var(--font-header)' }}>
              DungeonRoller
            </h3>
            <p className="text-amber-100/60 text-sm mb-2">
              Epic tabletop RPG adventures
            </p>
            <p className="text-amber-100/80 text-xs">
              © 2025 Summit Software Solutions LLC
            </p>
            <p className="text-amber-100/60 text-xs mt-1">
              All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-amber-400 mb-3" style={{ fontFamily: 'var(--font-header)' }}>
              Legal
            </h4>
            <div className="flex flex-col space-y-2">
              <Link 
                to={createPageUrl("About")} 
                className="text-amber-100/70 hover:text-amber-400 text-sm transition-colors"
              >
                About Us
              </Link>
              <Link 
                to={createPageUrl("Terms")} 
                className="text-amber-100/70 hover:text-amber-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to={createPageUrl("Privacy")} 
                className="text-amber-100/70 hover:text-amber-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to={createPageUrl("Contact")} 
                className="text-amber-100/70 hover:text-amber-400 text-sm transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-amber-400 mb-3" style={{ fontFamily: 'var(--font-header)' }}>
              Contact
            </h4>
            <div className="text-sm text-amber-100/70 space-y-2">
              <p>
                <strong className="text-amber-400">Email:</strong><br />
                <a href="mailto:info@summitsoftwaresolutions.dev" className="hover:text-amber-400 transition-colors">
                  info@summitsoftwaresolutions.dev
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-amber-500/20 text-center">
          <p className="text-amber-100/50 text-xs" style={{ fontFamily: 'var(--font-fantasy)' }}>
            "Roll the dice, write your legend"
          </p>
          <p className="text-amber-100/60 text-xs mt-2">
            Developed by <span className="text-amber-400 font-semibold">Summit Software Solutions LLC</span>
          </p>
        </div>
      </div>
    </footer>
  );
}