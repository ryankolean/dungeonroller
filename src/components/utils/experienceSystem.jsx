// Experience System Utilities for DungeonRoller

// XP Values for Different Actions
export const XP_VALUES = {
  combat: {
    killEnemy: 50,
    defeatBoss: 200,
    surviveCombatRound: 5,
    criticalHit: 10,
    strategicChoice: 15
  },
  exploration: {
    discoverLocation: 25,
    findSecret: 40,
    successfulCheck: 10,
    navigateHazard: 20,
    mapCompletion: 100
  },
  social: {
    persuasion: 20,
    peacefulSolution: 30,
    gatherInfo: 15,
    buildRelationship: 25
  },
  problemSolving: {
    solvePuzzle: 35,
    creativeSolution: 40,
    avoidTrap: 30,
    skillCheck: 10
  },
  story: {
    questObjective: 75,
    storyMilestone: 100,
    meaningfulChoice: 20,
    characterMoment: 30
  }
};

// Calculate XP required for a specific level
export const calculateXPRequired = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calculate total XP needed to reach a level from level 1
export const calculateTotalXPForLevel = (level) => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateXPRequired(i);
  }
  return total;
};

// Apply modifiers to base XP
export const applyXPModifiers = (baseXP, modifiers = {}) => {
  let finalXP = baseXP;
  
  if (modifiers.difficulty) finalXP *= modifiers.difficulty;
  if (modifiers.creativity) finalXP *= 1.2;
  if (modifiers.risk) finalXP *= modifiers.risk;
  if (modifiers.level) {
    // Reduce XP for low-level content
    const levelDiff = modifiers.playerLevel - modifiers.contentLevel;
    if (levelDiff > 3) {
      finalXP *= Math.max(0.5, 1 - (levelDiff * 0.1));
    }
  }
  
  return Math.floor(finalXP);
};

// Get milestone rewards for a level
export const getMilestoneRewards = (level) => {
  const milestones = {
    3: {
      title: "Seasoned Adventurer",
      description: "Choose a specialization path",
      abilityPoints: 3,
      skillPoints: 2,
      bonus: "10% XP gain bonus",
      special: "specialization_unlock"
    },
    5: {
      title: "Proven Hero",
      description: "Unlock signature ability",
      abilityPoints: 2,
      skillPoints: 2,
      bonus: "Equipment upgrade tier",
      special: "signature_ability"
    },
    7: {
      title: "Veteran Explorer",
      description: "Gain danger sense",
      abilityPoints: 2,
      skillPoints: 1,
      bonus: "+1 extra action per combat",
      special: "danger_sense"
    },
    10: {
      title: "Master Adventurer",
      description: "Choose legendary trait",
      abilityPoints: 3,
      skillPoints: 2,
      bonus: "Prestige class access",
      special: "legendary_trait"
    },
    15: {
      title: "Legendary Figure",
      description: "Fate point system unlocked",
      abilityPoints: 3,
      skillPoints: 2,
      bonus: "Story influence ability",
      special: "fate_points"
    },
    20: {
      title: "Mythic Champion",
      description: "Achieve ascension",
      abilityPoints: 5,
      skillPoints: 3,
      bonus: "Immortality mechanics",
      special: "ascension"
    }
  };
  
  return milestones[level] || null;
};

// Standard level up rewards
export const getStandardLevelRewards = () => {
  return {
    abilityPoints: 2,
    skillPoints: 1,
    hpIncrease: Math.floor(Math.random() * 6) + 3 // 3-8 HP per level
  };
};

// Award XP to character
export const awardXP = async (character, xpAmount, reason = "Unknown") => {
  const newCurrentXP = character.current_xp + xpAmount;
  const newTotalXP = character.total_xp_earned + xpAmount;
  
  const updates = {
    current_xp: newCurrentXP,
    total_xp_earned: newTotalXP
  };
  
  return {
    updates,
    xpGained: xpAmount,
    reason,
    leveledUp: newCurrentXP >= character.xp_to_next_level
  };
};

// Check and process level up
export const processLevelUp = (character) => {
  if (character.current_xp < character.xp_to_next_level) {
    return null;
  }
  
  const newLevel = character.level + 1;
  const standardRewards = getStandardLevelRewards();
  const milestoneReward = getMilestoneRewards(newLevel);
  
  const updates = {
    level: newLevel,
    current_xp: character.current_xp - character.xp_to_next_level,
    xp_to_next_level: calculateXPRequired(newLevel),
    ability_points: character.ability_points + standardRewards.abilityPoints + (milestoneReward?.abilityPoints || 0),
    skill_points: character.skill_points + standardRewards.skillPoints + (milestoneReward?.skillPoints || 0),
    max_hit_points: character.max_hit_points + standardRewards.hpIncrease,
    hit_points: character.hit_points + standardRewards.hpIncrease
  };
  
  if (milestoneReward) {
    const milestones = character.milestones_unlocked || [];
    updates.milestones_unlocked = [...milestones, milestoneReward.special];
  }
  
  return {
    updates,
    newLevel,
    rewards: {
      ...standardRewards,
      milestone: milestoneReward
    }
  };
};

// Get XP progress percentage
export const getXPProgress = (character) => {
  return Math.floor((character.current_xp / character.xp_to_next_level) * 100);
};

// Get enemy XP reward based on level
export const getEnemyXPReward = (enemyLevel, playerLevel) => {
  const baseXP = XP_VALUES.combat.killEnemy;
  const levelDiff = enemyLevel - playerLevel;
  
  let multiplier = 1.0;
  if (levelDiff > 0) multiplier = 1 + (levelDiff * 0.2); // Bonus for fighting higher level enemies
  if (levelDiff < -3) multiplier = Math.max(0.5, 1 + (levelDiff * 0.15)); // Reduced for lower level enemies
  
  return Math.floor(baseXP * multiplier);
};

export default {
  XP_VALUES,
  calculateXPRequired,
  calculateTotalXPForLevel,
  applyXPModifiers,
  getMilestoneRewards,
  getStandardLevelRewards,
  awardXP,
  processLevelUp,
  getXPProgress,
  getEnemyXPReward
};