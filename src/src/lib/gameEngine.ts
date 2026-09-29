export type GameType = '2d' | '3d';

export interface GameTemplate {
  id: string;
  title: string;
  type: GameType;
  description: string;
  keywords: string[];
  emoji: string;
}

export const GAME_TEMPLATES: GameTemplate[] = [
  { id: 'snake', title: 'Neon Snake', type: '2d', description: 'Classic snake game with neon visuals', keywords: ['snake', 'serpent', 'worm', 'eat', 'grow', 'classic', 'grid', 'food', 'apple'], emoji: 'Snake' },
  { id: 'pong', title: 'Arcade Pong', type: '2d', description: 'Retro paddle ball game', keywords: ['pong', 'paddle', 'ball', 'retro', 'tennis', 'bounce', 'rally', 'wall'], emoji: 'Pong' },
  { id: 'breakout', title: 'Brick Breaker', type: '2d', description: 'Break bricks with a bouncing ball', keywords: ['breakout', 'brick', 'block', 'break', 'destroy', 'wall', 'bounce', 'arkanoid'], emoji: 'Breakout' },
  { id: 'flappy', title: 'Flappy Bird', type: '2d', description: 'Tap to fly through pipes', keywords: ['flappy', 'bird', 'fly', 'pipe', 'tap', 'jump', 'obstacle', 'gravity', 'wings'], emoji: 'Flappy' },
  { id: 'runner', title: '3D Endless Runner', type: '3d', description: 'Dodge obstacles in a 3D corridor', keywords: ['runner', 'run', 'dash', 'race', 'obstacle', 'endless', '3d', 'corridor', 'speed', 'subway', 'temple'], emoji: 'Runner' },
  { id: 'spaceshooter', title: '3D Space Shooter', type: '3d', description: 'Shoot asteroids in 3D space', keywords: ['space', 'shooter', 'shoot', 'asteroid', 'laser', 'galaxy', 'star', '3d', 'cosmic', 'alien', 'ufo', 'meteor'], emoji: 'Space Shooter' },
];

export interface GameMatch {
  template: GameTemplate;
  config: { theme: string; difficulty: string; colorScheme: string; prompt: string; };
}

const THEMES = ['neon', 'retro', 'cyberpunk', 'minimal', 'sunset', 'ocean'];
const DIFFICULTIES = ['easy', 'normal', 'hard', 'extreme'];
const COLOR_SCHEMES = ['blue', 'green', 'orange', 'pink', 'cyan', 'gold'];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
  return Math.abs(hash);
}

function scoreTemplate(template: GameTemplate, promptLower: string): number {
  let score = 0;
  for (const kw of template.keywords) { if (promptLower.includes(kw)) { score += kw.length > 4 ? 3 : 2; } }
  return score;
}

export function matchGame(prompt: string, gameType: GameType): GameMatch {
  const promptLower = prompt.toLowerCase().trim();
  const candidates = GAME_TEMPLATES.filter((t) => t.type === gameType);
  const scored = candidates.map((t) => ({ template: t, score: scoreTemplate(t, promptLower) })).sort((a, b) => b.score - a.score);
  const best = scored[0]?.score > 0 ? scored[0].template : candidates[0];
  const h = hashString(prompt);
  const theme = THEMES[h % THEMES.length];
  const difficulty = DIFFICULTIES[(h >> 4) % DIFFICULTIES.length];
  const colorScheme = COLOR_SCHEMES[(h >> 8) % COLOR_SCHEMES.length];
  return { template: best, config: { theme, difficulty, colorScheme, prompt } };
}

export const EXAMPLE_PROMPTS_2D = [
  'A neon snake game where you eat glowing orbs',
  'Retro pong with a cyberpunk twist',
  'Break all the bricks in a sunset-colored wall',
  'Flappy bird flying through golden pipes',
];

export const EXAMPLE_PROMPTS_3D = [
  'Endless runner dodging obstacles in a neon corridor',
  'Space shooter blasting asteroids in a cosmic galaxy',
  '3D speed run through a temple of obstacles',
  'Fly through an asteroid field shooting lasers',
];
