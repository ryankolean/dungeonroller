import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield, Swords, Brain, Handshake, Map } from 'lucide-react';

const getActionStyle = (type) => {
  switch (type) {
    case 'safe':
      return {
        icon: <Shield className="w-5 h-5 text-green-300" />,
        badge: 'bg-green-700/30 text-green-300 border-green-500/50',
        button: 'bg-green-900/10 hover:bg-green-900/20 border-green-800/30 hover:border-green-600/50',
      };
    case 'risky':
      return {
        icon: <Swords className="w-5 h-5 text-red-400" />,
        badge: 'bg-red-700/30 text-red-300 border-red-500/50',
        button: 'bg-red-900/10 hover:bg-red-900/20 border-red-800/30 hover:border-red-600/50',
      };
    case 'balanced':
    default:
      return {
        icon: <Handshake className="w-5 h-5 text-blue-300" />,
        badge: 'bg-blue-700/30 text-blue-300 border-blue-500/50',
        button: 'bg-blue-900/10 hover:bg-blue-900/20 border-blue-800/30 hover:border-blue-600/50',
      };
  }
};

const getThemeIcon = (theme) => {
    switch(theme) {
        case 'social': return <Handshake className="w-4 h-4 text-amber-300" />;
        case 'exploration': return <Map className="w-4 h-4 text-amber-300" />;
        case 'strategy': return <Brain className="w-4 h-4 text-amber-300" />;
        case 'combat': return <Swords className="w-4 h-4 text-amber-300" />;
        default: return <Shield className="w-4 h-4 text-amber-300" />;
    }
}

export default function ActionChoices({ actions, onChoice }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <h4 className="text-2xl text-amber-900/90" style={{fontFamily: 'var(--font-heading)'}}>
        What do you do?
      </h4>
      {actions.map((choice, index) => {
        const style = getActionStyle(choice.type);
        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ transform: 'translateX(5px)' }}
            onClick={() => onChoice(choice)}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-300 ${style.button}`}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                    {style.icon}
                    <span className="text-lg text-amber-100 font-semibold">{choice.label}</span>
                </div>
              <Badge className={style.badge}>{choice.type}</Badge>
            </div>
            <p className="text-amber-200/70 ml-8">{choice.description}</p>
          </motion.button>
        );
      })}
    </motion.div>
  );
}