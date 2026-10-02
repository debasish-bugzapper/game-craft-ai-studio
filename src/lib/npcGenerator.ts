export interface NPCConfig {
  npcId: string;
  name: string;
  role: 'enemy' | 'merchant' | 'quest-giver' | 'companion';
  behavior: 'aggressive' | 'defensive' | 'neutral' | 'wander';
  dialogueLines: string[];
}

export function generateGameNPC(role: 'enemy' | 'merchant' | 'quest-giver' | 'companion', theme: string): NPCConfig {
  const randomId = `npc_${Date.now()}`;
  
  let name = "Guard";
  let behavior: NPCConfig['behavior'] = 'neutral';
  let dialogueLines = ["Hello traveler!", "Be careful out there."];

  if (role === 'enemy') {
    name = theme === 'horror' ? "Zombie Mutant" : "Cyber Raider";
    behavior = 'aggressive';
    dialogueLines = ["Grrr...", "You cannot escape!", "Attack!"];
  } else if (role === 'merchant') {
    name = "Shopkeeper Bob";
    behavior = 'neutral';
    dialogueLines = ["Want to buy some weapons?", "Fresh potions available!"];
  } else if (role === 'quest-giver') {
    name = "Elder Master";
    behavior = 'wander';
    dialogueLines = ["Save our village from the dark forces!", "Find the hidden key."];
  }

  return {
    npcId: randomId,
    name,
    role,
    behavior,
    dialogueLines
  };
}
