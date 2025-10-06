import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import CombatCharacterCard from "./CombatCharacterCard";
import CombatEnemyCard from "./CombatEnemyCard";
import CombatActionMenu from "./CombatActionMenu";
import CombatLog from "./CombatLog";
import DiceRollAnimation from "./DiceRollAnimation";
import BattleReport from "./BattleReport";

export default function CombatInterface({ character, enemies, onCombatEnd }) {
  const [combatState, setCombatState] = useState({
    round: 1,
    currentTurn: 'player',
    playerHP: character.hit_points,
    enemiesState: enemies.map(e => ({ ...e, hp: e.max_hit_points })),
    combatLog: [],
    isRolling: false,
    lastRoll: null,
    battleEnded: false,
    outcome: null,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    // D&D 5e Action Economy
    actionUsed: false,
    bonusActionUsed: false,
    reactionUsed: false,
    movementRemaining: 30, // Standard movement speed
    // Conditions
    playerConditions: [],
    enemyConditions: enemies.map(() => []),
    // Advantage/Disadvantage
    hasAdvantage: false,
    hasDisadvantage: false
  });

  // Check for battle end conditions
  useEffect(() => {
    if (combatState.playerHP <= 0) {
      endBattle('defeat');
    } else if (combatState.enemiesState.every(e => e.hp <= 0)) {
      endBattle('victory');
    }
  }, [combatState.playerHP, combatState.enemiesState]);

  const endBattle = (outcome) => {
    setCombatState(prev => ({
      ...prev,
      battleEnded: true,
      outcome
    }));
  };

  const addToLog = (message, type = 'info') => {
    setCombatState(prev => ({
      ...prev,
      combatLog: [...prev.combatLog, { message, type, timestamp: Date.now() }]
    }));
  };

  const rollDice = (sides, bonus = 0, advantage = false, disadvantage = false) => {
    return new Promise((resolve) => {
      setCombatState(prev => ({ ...prev, isRolling: true }));
      
      setTimeout(() => {
        let roll1 = Math.floor(Math.random() * sides) + 1;
        let roll2 = advantage || disadvantage ? Math.floor(Math.random() * sides) + 1 : roll1;
        
        let finalRoll = roll1;
        if (advantage && !disadvantage) {
          finalRoll = Math.max(roll1, roll2);
        } else if (disadvantage && !advantage) {
          finalRoll = Math.min(roll1, roll2);
        }
        
        const total = finalRoll + bonus;
        const isCritical = sides === 20 && (finalRoll === 1 || finalRoll === 20);
        
        setCombatState(prev => ({
          ...prev,
          isRolling: false,
          lastRoll: { 
            roll: finalRoll, 
            roll1, 
            roll2: (advantage || disadvantage) ? roll2 : null,
            bonus, 
            total, 
            isCritical, 
            type: finalRoll === 20 ? 'critical' : finalRoll === 1 ? 'fumble' : 'normal',
            advantage,
            disadvantage
          }
        }));
        
        resolve({ roll: finalRoll, total, isCritical });
      }, 1500);
    });
  };

  const performAttack = async (targetIndex, actionType = 'action') => {
    if (actionType === 'action' && combatState.actionUsed) {
      addToLog("You've already used your action this turn!", 'error');
      return;
    }
    if (actionType === 'bonus' && combatState.bonusActionUsed) {
      addToLog("You've already used your bonus action this turn!", 'error');
      return;
    }

    const target = combatState.enemiesState[targetIndex];
    
    addToLog(`${character.name} attacks ${target.name}!`, 'action');
    
    // Check for advantage/disadvantage from conditions
    const hasAdvantage = combatState.playerConditions.includes('hidden') || 
                         target.conditions?.includes('prone');
    const hasDisadvantage = combatState.playerConditions.includes('prone') ||
                           combatState.playerConditions.includes('frightened');
    
    // Attack roll
    const attackBonus = Math.floor((character.strength - 10) / 2) + 2; // Proficiency bonus
    const attackRoll = await rollDice(20, attackBonus, hasAdvantage, hasDisadvantage);
    
    if (attackRoll.isCritical && attackRoll.roll === 1) {
      addToLog(`💀 CRITICAL MISS! ${character.name}'s attack goes wide!`, 'fumble');
      setCombatState(prev => ({ ...prev, [actionType === 'action' ? 'actionUsed' : 'bonusActionUsed']: true }));
      return;
    }
    
    if (attackRoll.total < target.armor_class && !attackRoll.isCritical) {
      addToLog(`Miss! Roll: ${attackRoll.total} vs AC: ${target.armor_class}`, 'miss');
      setCombatState(prev => ({ ...prev, [actionType === 'action' ? 'actionUsed' : 'bonusActionUsed']: true }));
      return;
    }
    
    // Damage roll
    const damageBonus = Math.floor((character.strength - 10) / 2);
    const damageDice = attackRoll.isCritical && attackRoll.roll === 20 ? 2 : 1; // Critical hit
    let totalDamage = 0;
    
    for (let i = 0; i < damageDice; i++) {
      const damageRoll = await rollDice(8, i === 0 ? damageBonus : 0);
      totalDamage += (i === 0 ? damageRoll.total : damageRoll.roll);
    }
    
    if (attackRoll.isCritical && attackRoll.roll === 20) {
      addToLog(`💥 CRITICAL HIT! ${totalDamage} damage to ${target.name}!`, 'critical');
    } else {
      addToLog(`Hit! ${totalDamage} damage to ${target.name}!`, 'hit');
    }
    
    // Apply damage
    const newEnemiesState = [...combatState.enemiesState];
    newEnemiesState[targetIndex].hp = Math.max(0, target.hp - totalDamage);
    
    if (newEnemiesState[targetIndex].hp === 0) {
      addToLog(`${target.name} has been defeated!`, 'defeat');
    }
    
    setCombatState(prev => ({
      ...prev,
      enemiesState: newEnemiesState,
      totalDamageDealt: prev.totalDamageDealt + totalDamage,
      [actionType === 'action' ? 'actionUsed' : 'bonusActionUsed']: true
    }));
  };

  const performDash = () => {
    if (combatState.actionUsed) {
      addToLog("You've already used your action this turn!", 'error');
      return;
    }
    
    addToLog(`${character.name} dashes, doubling movement speed!`, 'action');
    setCombatState(prev => ({
      ...prev,
      actionUsed: true,
      movementRemaining: prev.movementRemaining + 30
    }));
  };

  const performDisengage = () => {
    if (combatState.actionUsed) {
      addToLog("You've already used your action this turn!", 'error');
      return;
    }
    
    addToLog(`${character.name} disengages! Movement won't provoke opportunity attacks.`, 'action');
    setCombatState(prev => ({
      ...prev,
      actionUsed: true,
      playerConditions: [...prev.playerConditions, 'disengaged']
    }));
  };

  const performDodge = () => {
    if (combatState.actionUsed) {
      addToLog("You've already used your action this turn!", 'error');
      return;
    }
    
    addToLog(`${character.name} takes the Dodge action! Attacks against you have disadvantage.`, 'action');
    setCombatState(prev => ({
      ...prev,
      actionUsed: true,
      playerConditions: [...prev.playerConditions, 'dodging']
    }));
  };

  const performHide = async () => {
    if (combatState.actionUsed) {
      addToLog("You've already used your action this turn!", 'error');
      return;
    }
    
    addToLog(`${character.name} attempts to hide...`, 'action');
    
    const stealthBonus = Math.floor((character.dexterity - 10) / 2);
    const stealthRoll = await rollDice(20, stealthBonus);
    
    // Assuming average enemy passive perception of 12
    const enemyPerception = 12;
    
    if (stealthRoll.total >= enemyPerception) {
      addToLog(`Successfully hidden! (Stealth: ${stealthRoll.total})`, 'success');
      setCombatState(prev => ({
        ...prev,
        actionUsed: true,
        playerConditions: [...prev.playerConditions, 'hidden']
      }));
    } else {
      addToLog(`Failed to hide. (Stealth: ${stealthRoll.total} vs Perception: ${enemyPerception})`, 'miss');
      setCombatState(prev => ({ ...prev, actionUsed: true }));
    }
  };

  const attemptFlee = async () => {
    addToLog(`${character.name} attempts to flee!`, 'action');
    const fleeRoll = await rollDice(20);
    
    if (fleeRoll.total >= 12) {
      addToLog(`Successfully escaped from combat!`, 'success');
      endBattle('fled');
    } else {
      addToLog(`Failed to escape! The enemy blocks your path!`, 'miss');
      endPlayerTurn();
    }
  };

  const endPlayerTurn = () => {
    // Remove end-of-turn conditions
    const newConditions = combatState.playerConditions.filter(
      c => c !== 'disengaged' && c !== 'dodging'
    );
    
    setCombatState(prev => ({ 
      ...prev, 
      currentTurn: 'enemy',
      playerConditions: newConditions
    }));
    setTimeout(() => performEnemyTurns(), 1000);
  };

  const performEnemyTurns = async () => {
    const aliveEnemies = combatState.enemiesState.filter(e => e.hp > 0);
    
    for (const enemy of aliveEnemies) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addToLog(`${enemy.name} attacks ${character.name}!`, 'enemy-action');
      
      // Check for advantage/disadvantage
      const hasAdvantage = combatState.playerConditions.includes('prone');
      const hasDisadvantage = combatState.playerConditions.includes('dodging');
      
      const attackRoll = await rollDice(20, enemy.attack_bonus, hasAdvantage, hasDisadvantage);
      
      const playerAC = 10 + Math.floor((character.dexterity - 10) / 2);
      
      if (attackRoll.total < playerAC) {
        addToLog(`${enemy.name} misses!`, 'miss');
        continue;
      }
      
      // Parse damage dice (e.g., "2d6+3")
      const [diceStr, bonusStr] = enemy.damage_dice.split('+');
      const [numDice, diceSides] = diceStr.split('d').map(Number);
      const bonus = parseInt(bonusStr) || 0;
      
      let damage = bonus;
      const isCrit = attackRoll.isCritical && attackRoll.roll === 20;
      const totalDice = isCrit ? numDice * 2 : numDice;
      
      for (let i = 0; i < totalDice; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        damage += roll;
      }
      
      if (isCrit) {
        addToLog(`💥 CRITICAL HIT! ${enemy.name} deals ${damage} damage!`, 'critical');
      } else {
        addToLog(`${enemy.name} hits for ${damage} damage!`, 'hit');
      }
      
      setCombatState(prev => ({
        ...prev,
        playerHP: Math.max(0, prev.playerHP - damage),
        totalDamageTaken: prev.totalDamageTaken + damage
      }));
    }
    
    // Start new round
    setCombatState(prev => ({
      ...prev,
      round: prev.round + 1,
      currentTurn: 'player',
      actionUsed: false,
      bonusActionUsed: false,
      reactionUsed: false,
      movementRemaining: 30
    }));
  };

  if (combatState.battleEnded) {
    return (
      <BattleReport
        character={character}
        outcome={combatState.outcome}
        rounds={combatState.round}
        damageDealt={combatState.totalDamageDealt}
        damageTaken={combatState.totalDamageTaken}
        enemies={enemies}
        onContinue={() => onCombatEnd(combatState)}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Combat Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-100 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            ⚔️ Combat! ⚔️
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge className="bg-blue-600/30 text-blue-200 border-blue-500/50 text-lg">
              Round {combatState.round}
            </Badge>
            <Badge className={`text-lg ${
              combatState.currentTurn === 'player' 
                ? 'bg-green-600/30 text-green-200 border-green-500/50' 
                : 'bg-red-600/30 text-red-200 border-red-500/50'
            }`}>
              {combatState.currentTurn === 'player' ? 'Your Turn' : 'Enemy Turn'}
            </Badge>
          </div>
        </div>

        {/* Action Economy Display */}
        {combatState.currentTurn === 'player' && (
          <div className="mb-6 flex justify-center gap-4 flex-wrap">
            <Badge className={combatState.actionUsed ? 'bg-gray-600/50' : 'bg-green-600/50'}>
              Action {combatState.actionUsed ? '✓' : '○'}
            </Badge>
            <Badge className={combatState.bonusActionUsed ? 'bg-gray-600/50' : 'bg-yellow-600/50'}>
              Bonus Action {combatState.bonusActionUsed ? '✓' : '○'}
            </Badge>
            <Badge className={combatState.reactionUsed ? 'bg-gray-600/50' : 'bg-blue-600/50'}>
              Reaction {combatState.reactionUsed ? '✓' : '○'}
            </Badge>
            <Badge className='bg-blue-600/50'>
              Movement: {combatState.movementRemaining}ft
            </Badge>
          </div>
        )}

        {/* Combat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Player Side */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Your Party
            </h3>
            <CombatCharacterCard
              character={character}
              currentHP={combatState.playerHP}
              conditions={combatState.playerConditions}
              isActive={combatState.currentTurn === 'player'}
            />
          </div>

          {/* Enemy Side */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Enemies
            </h3>
            {combatState.enemiesState.map((enemy, index) => (
              <CombatEnemyCard
                key={index}
                enemy={enemy}
                conditions={combatState.enemyConditions[index] || []}
                onTarget={() => combatState.currentTurn === 'player' && !combatState.actionUsed && performAttack(index)}
                isTargetable={combatState.currentTurn === 'player' && !combatState.actionUsed && enemy.hp > 0 && !combatState.isRolling}
              />
            ))}
          </div>
        </div>

        {/* Dice Roll Animation */}
        <AnimatePresence>
          {combatState.isRolling && (
            <DiceRollAnimation />
          )}
        </AnimatePresence>

        {/* Last Roll Display */}
        {combatState.lastRoll && !combatState.isRolling && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className={`inline-block px-6 py-3 rounded-lg ${
              combatState.lastRoll.type === 'critical' ? 'bg-yellow-600/30 border-2 border-yellow-500' :
              combatState.lastRoll.type === 'fumble' ? 'bg-red-600/30 border-2 border-red-500' :
              'bg-blue-600/20 border border-blue-500/50'
            }`}>
              {combatState.lastRoll.advantage && (
                <div className="text-xs text-green-300 mb-1">WITH ADVANTAGE</div>
              )}
              {combatState.lastRoll.disadvantage && (
                <div className="text-xs text-red-300 mb-1">WITH DISADVANTAGE</div>
              )}
              <span className="text-2xl font-bold text-white">
                {combatState.lastRoll.type === 'critical' && '🎯 '}
                {combatState.lastRoll.type === 'fumble' && '💀 '}
                {combatState.lastRoll.roll2 !== null && combatState.lastRoll.roll2 !== combatState.lastRoll.roll && (
                  <span className="text-white/50">({combatState.lastRoll.roll1}, {combatState.lastRoll.roll2}) → </span>
                )}
                Roll: {combatState.lastRoll.roll}
                {combatState.lastRoll.bonus !== 0 && ` + ${combatState.lastRoll.bonus}`}
                {' = '}{combatState.lastRoll.total}
              </span>
            </div>
          </motion.div>
        )}

        {/* Action Menu */}
        {combatState.currentTurn === 'player' && !combatState.isRolling && (
          <CombatActionMenu
            onDash={performDash}
            onDisengage={performDisengage}
            onDodge={performDodge}
            onHide={performHide}
            onFlee={attemptFlee}
            onEndTurn={endPlayerTurn}
            actionUsed={combatState.actionUsed}
            bonusActionUsed={combatState.bonusActionUsed}
            character={character}
          />
        )}

        {/* Combat Log */}
        <CombatLog messages={combatState.combatLog} />
      </motion.div>
    </div>
  );
}