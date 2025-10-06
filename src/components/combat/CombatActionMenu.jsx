import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CombatActionMenu({ 
  onDash, 
  onDisengage, 
  onDodge, 
  onHide, 
  onFlee, 
  onEndTurn,
  actionUsed,
  bonusActionUsed,
  character 
}) {
  const [expanded, setExpanded] = useState(false);

  const actions = [
    { name: "Attack", icon: "⚔️", action: () => {}, description: "Click an enemy to attack", type: "action", disabled: actionUsed },
    { name: "Dash", icon: "🏃", action: onDash, description: "Double your movement speed", type: "action", disabled: actionUsed },
    { name: "Disengage", icon: "🏃‍♂️", action: onDisengage, description: "Avoid opportunity attacks", type: "action", disabled: actionUsed },
    { name: "Dodge", icon: "🛡️", action: onDodge, description: "Impose disadvantage on attacks", type: "action", disabled: actionUsed },
    { name: "Hide", icon: "👻", action: onHide, description: "Make a Stealth check", type: "action", disabled: actionUsed },
    { name: "Flee", icon: "🏃💨", action: onFlee, description: "Attempt to escape combat", type: "special", disabled: false }
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-black/80 backdrop-blur-lg border-2 border-amber-500/50 rounded-2xl p-4 shadow-2xl">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={!action.disabled ? { scale: 1.05 } : {}}
              whileTap={!action.disabled ? { scale: 0.95 } : {}}
              onClick={action.action}
              disabled={action.disabled}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                action.disabled
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : action.type === 'special'
                  ? 'bg-yellow-600/80 hover:bg-yellow-500 text-white'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
              }`}
              title={action.description}
            >
              <span className="text-xl mr-2">{action.icon}</span>
              {action.name}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onEndTurn}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-bold"
          >
            ✓ End Turn
          </Button>
        </div>

        <div className="mt-3 text-center text-xs text-white/50">
          Tip: Conserve your action for attacks or use tactical options
        </div>
      </div>
    </div>
  );
}