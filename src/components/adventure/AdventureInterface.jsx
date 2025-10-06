
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Adventure } from "@/api/entities";
import { Character } from "@/api/entities";
import { Node } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

import ActionChoices from "./ActionChoices";
import AdventureLog from "./AdventureLog";
import DeathScreen from "./DeathScreen";
import CombatInterface from "../combat/CombatInterface"; // Added CombatInterface import

const NODE_GENERATION_SCHEMA = {
    type: "object",
    properties: {
        nodes: {
            type: "array",
            description: "An array of exactly 5 new, unique nodes representing the outcomes of the 5 choices.",
            minItems: 5,
            maxItems: 5,
            items: {
                type: "object",
                properties: {
                    scene_description: { type: "string", description: "A rich, atmospheric description for this new scene (3-5 sentences)." },
                    encounter_type: { type: "string", enum: ["combat", "social", "exploration", "puzzle", "trap", "resolution"], description: "The type of encounter, based on weighted probabilities (40% combat, 25% social, 20% exploration, 15% other)." },
                    details: { type: "string", description: "Details for the encounter, like monster names, NPC dialogue hooks, or location descriptions." },
                },
                required: ["scene_description", "encounter_type", "details"]
            }
        },
        choices: {
            type: "array",
            description: "An array of exactly 5 choices for the player at the CURRENT node.",
            minItems: 5,
            maxItems: 5,
            items: {
                type: "object",
                properties: {
                    label: { type: "string", description: "A concise, compelling label for the action button (3-5 words)." },
                    description: { type: "string", description: "A one-sentence description of the action, hinting at risk/reward." },
                    type: { type: "string", enum: ["safe", "risky", "balanced"] },
                    theme: { type: "string", enum: ["social", "exploration", "strategy", "combat", "utility"] },
                    child_node_index: { type: "number", description: "The 0-based index of the node in the 'nodes' array that this choice leads to." }
                },
                required: ["label", "description", "type", "theme", "child_node_index"]
            }
        }
    },
    required: ["nodes", "choices"]
};

// Enemy generation based on encounter
const generateEnemiesForEncounter = (encounterType, characterLevel, sceneDescription) => {
  const enemyTypes = {
    combat: [
      { name: "Goblin Scout", type: "humanoid", damage_dice: "1d6+1" },
      { name: "Orc Warrior", type: "humanoid", damage_dice: "1d8+2" },
      { name: "Skeleton", type: "undead", damage_dice: "1d6+1" },
      { name: "Wolf", type: "beast", damage_dice: "2d4+2" },
      { name: "Bandit", type: "humanoid", damage_dice: "1d6+2" }
    ]
  };

  const numEnemies = Math.min(Math.floor(characterLevel / 2) + 1, 3);
  const enemies = [];
  
  for (let i = 0; i < numEnemies; i++) {
    const template = enemyTypes.combat[Math.floor(Math.random() * enemyTypes.combat.length)];
    const levelVariance = Math.floor(Math.random() * 3) - 1;
    const enemyLevel = Math.max(1, characterLevel + levelVariance);
    
    enemies.push({
      ...template,
      level: enemyLevel,
      max_hit_points: (enemyLevel * 8) + 10,
      armor_class: 10 + enemyLevel,
      attack_bonus: Math.floor(enemyLevel / 2) + 2
    });
  }
  
  return enemies;
};

export default function AdventureInterface({ character, adventure, onAdventureUpdate, onCharacterDeath }) {
    const [currentNode, setCurrentNode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const [logEntries, setLogEntries] = useState([]);
    const [inCombat, setInCombat] = useState(false);
    const [combatEnemies, setCombatEnemies] = useState([]);

    const generateAndLinkNodes = useCallback(async (parentNode) => {
        setIsLoading(true);

        const history = (await Node.list())
            .filter(n => adventure.path_log.includes(n.id))
            .map(n => ({ depth: n.depth, description: n.content.scene_description }));

        const prompt = `
            You are a master D&D Dungeon Master generating a procedural adventure based on a decision tree.
            Adventure Seed: ${adventure.seed}
            Character: ${character.name}, a level ${character.level} ${character.race} ${character.class}.
            Current Node (Depth ${parentNode.depth}): ${parentNode.content.scene_description}
            Adventure History Summary: ${JSON.stringify(history.slice(-5))}

            Your task is to generate the next layer of the tree. Create exactly 5 new potential outcome nodes and 5 choices for the current node that lead to them.
            
            RULES:
            1.  **Generate 5 distinct choices** for the current node: one 'safe', one 'risky', and three 'balanced' with varied themes (social, exploration, etc.).
            2.  **Generate 5 corresponding outcome nodes.** Each choice must map to one of these new nodes.
            3.  **Overlap Constraint:** Among the 5 new outcome nodes, a maximum of 2 can be identical. You must generate at least 3 unique nodes. For example, two choices could lead to the same 'Goblin Ambush' node, but three cannot.
            4.  **Weighted Encounters:** The 'encounter_type' for the new nodes should loosely follow these weights: 40% combat, 25% social, 20% exploration, 15% other (puzzle, trap, resolution).
            5.  **Be Creative:** The story must be engaging and react to the character and history. Depth is critical. A node at depth ${parentNode.depth + 1} must feel like a progression.
            
            Respond ONLY with the JSON matching the provided schema. Ensure the 'child_node_index' correctly maps each choice to its outcome node.
        `;

        try {
            const response = await InvokeLLM({ prompt, response_json_schema: NODE_GENERATION_SCHEMA });

            // Create new node records in the database
            const newNodeData = response.nodes.map(nodeContent => ({
                adventure_id: adventure.id,
                parent_id: parentNode.id,
                depth: parentNode.depth + 1,
                content: nodeContent,
                choices: [],
            }));
            const createdNodes = await Node.bulkCreate(newNodeData);

            // Map choices to the newly created node IDs
            const finalChoices = response.choices.map(choice => ({
                ...choice,
                child_node_id: createdNodes[choice.child_node_index].id
            }));

            // Update the parent node with its new choices
            await Node.update(parentNode.id, { choices: finalChoices });

            return { ...parentNode, choices: finalChoices };
        } catch (error) {
            console.error("Error generating next nodes:", error);
            // Re-throw or handle more robustly if needed, but for now, reset loading and return original node
            setIsLoading(false);
            throw error; // Propagate error so loadNode can catch it and reset loading
        }
    }, [adventure, character]);

    const loadNode = useCallback(async () => {
        if (!adventure || !adventure.current_node_id) return;
        setIsLoading(true);

        try {
            let node = await Node.get(adventure.current_node_id);

            if (!node.choices || node.choices.length === 0) {
                node = await generateAndLinkNodes(node);
            }

            const pathNodes = (await Node.list())
                .filter(n => adventure.path_log.includes(n.id));
            const sortedLog = adventure.path_log
                .map(id => pathNodes.find(n => n.id === id))
                .filter(Boolean); // Ensure only existing nodes are mapped
            setLogEntries(sortedLog.map(n => n.content.scene_description));

            setCurrentNode(node);
        } catch (error) {
            console.error("Error loading or generating node:", error);
            // Optionally, set an error state or default content
        } finally {
            setIsLoading(false);
        }
    }, [adventure, generateAndLinkNodes]);

    useEffect(() => {
        if (!inCombat) { // Only load node if not currently in combat
            loadNode();
        }
    }, [loadNode, inCombat]); // Added inCombat to dependencies

    const handleChoice = async (choice) => {
        if (isLoading || inCombat) return;

        // Check if choice leads to combat
        const targetNode = await Node.get(choice.child_node_id);
        
        if (targetNode.content.encounter_type === 'combat') {
          // Generate enemies and enter combat
          const enemies = generateEnemiesForEncounter(
            targetNode.content.encounter_type,
            character.level,
            targetNode.content.scene_description
          );
          
          setCombatEnemies(enemies);
          setInCombat(true);
          
          // Update adventure to the combat node
          const newPathLog = [...(adventure.path_log || []), choice.child_node_id];
          await onAdventureUpdate({
            current_node_id: choice.child_node_id,
            path_log: newPathLog,
          });
          
          return;
        }

        // Non-combat choice handling
        // Simple HP check for lethality on risky choices
        if (choice.type === 'risky' && character.hit_points < 5) {
            const deathChance = Math.random();
            if (deathChance < 0.5) { // 50% chance of death on risky move with low HP
                setIsDead(true);
                return;
            }
        }

        const newPathLog = [...(adventure.path_log || []), choice.child_node_id];
        await onAdventureUpdate({
            current_node_id: choice.child_node_id,
            path_log: newPathLog,
        });
        // The adventure prop will update, triggering the useEffect/loadNode flow
    };

    const handleCombatEnd = async (combatState) => {
        setInCombat(false);
        setCombatEnemies([]); // Clear enemies once combat is over
        
        if (combatState.outcome === 'defeat') {
          setIsDead(true);
          return;
        }
        
        // Update character HP and XP after combat
        await Character.update(character.id, {
          hit_points: combatState.playerHP,
          experience_points: character.experience_points + (combatState.totalDamageDealt * 10)
        });
        
        // Continue adventure.
        // The character update will cause AdventureInterface to re-render,
        // and the useEffect for loadNode will then trigger to display the current node.
    };

    if (isDead) {
        return <DeathScreen character={character} onConfirmDeath={() => onCharacterDeath(character.id)} />;
    }

    if (inCombat) {
        return (
          <CombatInterface
            character={character}
            enemies={combatEnemies}
            onCombatEnd={handleCombatEnd}
          />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col lg:flex-row gap-8 h-full"
        >
            {/* Left Panel: Narrative and Choices */}
            <div className="lg:w-2/3 flex flex-col gap-6">
                <div className="parchment p-6 flex-grow">
                    <h3 className="text-3xl md:text-4xl text-amber-900/90 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        The Unfolding Tale
                    </h3>
                    <p className="text-lg text-amber-900/80 leading-relaxed mb-6">
                        {currentNode?.content?.scene_description || "Your adventure is about to begin..."}
                    </p>
                    <div className="w-full h-px bg-amber-800/30 my-6"></div>

                    <AnimatePresence mode="wait">
                        {isLoading || !currentNode ? (
                            <motion.div key="loading" className="flex flex-col items-center justify-center h-64 text-amber-900/80">
                                <span className="text-5xl animate-spin mb-4">🔄</span>
                                <p className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>The Dungeon Master is pondering your fate...</p>
                            </motion.div>
                        ) : (
                            <ActionChoices key="actions" actions={currentNode?.choices || []} onChoice={handleChoice} />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Panel: Action Log */}
            <div className="lg:w-1/3">
                <AdventureLog log={logEntries} />
            </div>
        </motion.div>
    );
}
