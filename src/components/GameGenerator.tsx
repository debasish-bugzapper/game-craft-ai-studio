import { useState, useCallback } from 'react';
import { Wand2, Loader2, Gamepad2, Box, Sparkles, AlertCircle, RefreshCw, Play, Check, Share2, Cpu, Palette, GamepadIcon, Rocket, Brain } from 'lucide-react';
import { matchGame, EXAMPLE_PROMPTS_2D, EXAMPLE_PROMPTS_3D, type GameType } from '@/lib/gameEngine';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { GameTypeBadge } from './Navbar';
import type { ShareData } from '@/lib/share';

interface GeneratedGame { gameId: string; gameType: GameType; title: string; config: { theme: string; difficulty: string; colorScheme: string; prompt: string; }; }
interface GameGeneratorProps { onPlay: (game: GeneratedGame) => void; onPricing: (type: GameType) => void; onShare: (data: ShareData) => void; onAuthRequired: () => void; }
type GenState = 'idle' | 'generating' | 'success' | 'error';
interface GenStep { label: string; icon: typeof Brain; detail: string; }

const GENERATION_STEPS: GenStep[] = [
  { label: 'Analyzing Your Prompt', icon: Brain, detail: 'Understanding your game concept and extracting key elements' },
  { label: 'Selecting Game Engine', icon: Cpu, detail: 'Matching your idea to the optimal game template' },
  { label: 'Designing Visual Theme', icon: Palette, detail: 'Applying colors, effects, and atmosphere to your game' },
  { label: 'Building Game Logic', icon: GamepadIcon, detail: 'Wiring up controls, physics, and scoring systems' },
  { label: 'Initializing Engine', icon: Rocket, detail: 'Loading assets and preparing your playable game' },
];

export function GameGenerator({ onPlay, onPricing, onShare, onAuthRequired }: GameGeneratorProps) {
  const { user } = useAuth();
  const [gameType, setGameType] = useState<GameType>('2d');
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<GenState>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedGame | null>(null);
  const [recentGames, setRecentGames] = useState<GeneratedGame[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const examples = gameType === '2d' ? EXAMPLE_PROMPTS_2D : EXAMPLE_PROMPTS_3D;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) { setError('Please describe your game idea first.'); setState('error'); return; }
    setState('generating'); setError(''); setActiveStep(0); setCompletedSteps([]);
    const stepDelay = 350;
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, stepDelay));
      setCompletedSteps((prev) => [...prev, i]);
      await new Promise((r) => setTimeout(r, 150));
    }
    try {
      const match = matchGame(prompt, gameType);
      const generated: GeneratedGame = { gameId: match.template.id, gameType: match.template.type, title: match.template.title, config: match.config };
      supabase.from('game_history').insert({ prompt: prompt.trim(), game_type: match.template.type, game_id: match.template.id, game_title: match.template.title, config: match.config, user_id: user?.id ?? null })
        .then(({ error: dbError }) => { if (dbError) console.warn('Failed to save game history:', dbError.message); });
      setResult(generated); setRecentGames((prev) => [generated, ...prev].slice(0, 4)); setState('success'); setActiveStep(-1);
    } catch { setError('Something went wrong while generating your game. Please try again.'); setState('error'); setActiveStep(-1); }
  }, [prompt, gameType, user]);

  function handleReset() { setState('idle'); setResult(null); setError(''); setPrompt(''); setActiveStep(-1); setCompletedSteps([]); }
  function useExample(ex: string) { setPrompt(ex); setState('idle'); setError(''); }
  function handlePlayBtn() { if (!result) return; if (!user) { onAuthRequired(); return; } onPlay(result); }

  return (
    <section id="generator" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/10 rounded-full blur-[100px]" />
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"><Sparkles className="w-4 h-4 text-accent-400" /><span className="text-sm font-medium text-gray-300">AI Game Generator</span></div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Create Your <span className="text-gradient">Game</span></h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Type your game idea below and our AI will generate a fully playable game instantly.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-white/5 mb-6 max-w-md mx-auto">
          <button onClick={() => { setGameType('2d'); setState('idle'); setResult(null); }} className={`py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${gameType === '2d' ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-400 hover:text-white'}`}><Gamepad2 className="w-4 h-4" /> 2D Games</button>
          <button onClick={() => { setGameType('3d'); setState('idle'); setResult(null); }} className={`py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${gameType === '3d' ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-gray-950 shadow-lg shadow-accent-500/30' : 'text-gray-400 hover:text-white'}`}><Box className="w-4 h-4" /> 3D Games</button>
        </div>

        <div className="glass-card p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Describe your {gameType === '2d' ? '2D' : '3D'} game idea</label>
          <textarea value={prompt} onChange={(e) => { setPrompt(e.target.value); if (state === 'error') setState('idle'); }} placeholder={gameType === '2d' ? 'e.g., A neon snake game where you collect glowing orbs in a cyberpunk arena...' : 'e.g., An endless runner dashing through a neon corridor, dodging obstacles at high speed...'} rows={3} disabled={state === 'generating'} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none disabled:opacity-50" />
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((ex, i) => (<button key={i} onClick={() => useExample(ex)} disabled={state === 'generating'} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50">{ex.length > 40 ? ex.slice(0, 40) + '...' : ex}</button>))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleGenerate} disabled={state === 'generating' || !prompt.trim()} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {state === 'generating' ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Your Game...</> : <><Wand2 className="w-5 h-5" /> Generate Game</>}
            </button>
            {(state === 'success' || state === 'error') && (<button onClick={handleReset} className="btn-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Reset</button>)}
          </div>

          {state === 'error' && (<div className="mt-4 p-4 rounded-xl bg-error-500/10 border border-error-500/20 flex items-start gap-3 animate-fade-in"><AlertCircle className="w-5 h-5 text-error-400 flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-error-300">Generation Failed</p><p className="text-xs text-error-400/80 mt-0.5">{error}</p></div></div>)}

          {state === 'generating' && (
            <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in">
              <div className="flex items-center gap-2 mb-4"><div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" /><span className="text-xs font-semibold text-accent-300 uppercase tracking-wide">AI Processing Pipeline</span></div>
              <div className="space-y-2.5">
                {GENERATION_STEPS.map((step, i) => {
                  const isActive = activeStep === i; const isDone = completedSteps.includes(i); const Icon = step.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-500/10 border border-primary-500/20 scale-[1.01]' : isDone ? 'bg-success-500/5 border border-success-500/10' : 'bg-transparent border border-transparent opacity-40'}`} style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isDone ? 'bg-success-500/20' : isActive ? 'bg-primary-500/20' : 'bg-white/5'}`}>
                        {isDone ? <Check className="w-4 h-4 text-success-400" /> : isActive ? <Loader2 className="w-4 h-4 text-primary-400 animate-spin" /> : <Icon className="w-4 h-4 text-gray-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition-colors ${isDone ? 'text-success-300' : isActive ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                        {(isActive || isDone) && <p className="text-xs text-gray-500 mt-0.5 animate-fade-in">{step.detail}</p>}
                      </div>
                      {isDone && <span className="text-xs text-success-400 font-mono">done</span>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out" style={{ width: `${(completedSteps.length / GENERATION_STEPS.length) * 100}%` }} /></div>
            </div>
          )}
        </div>

        {state === 'success' && result && (
          <div className="glass-card p-6 animate-bounce-in border-primary-500/20">
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center"><Check className="w-5 h-5 text-success-400" /></div><span className="font-semibold text-success-300">Game Generated Successfully!</span></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${result.gameType === '2d' ? 'bg-primary-500/15' : 'bg-accent-500/15'}`}>{result.gameType === '2d' ? <Gamepad2 className="w-7 h-7 text-primary-400" /> : <Box className="w-7 h-7 text-accent-400" />}</div>
                <div><h3 className="font-display text-xl font-bold">{result.title}</h3><div className="flex items-center gap-2 mt-1"><GameTypeBadge type={result.gameType} /><span className="text-xs text-gray-500 capitalize">{result.config.theme} theme · {result.config.difficulty}</span></div></div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:items-center">
                <button onClick={handlePlayBtn} className="btn-accent flex items-center gap-2 justify-center"><Play className="w-5 h-5" /> {user ? 'Play Now' : 'Sign In to Play'}</button>
                <button onClick={() => onShare({ gameId: result.gameId, gameTitle: result.title, gameType: result.gameType, prompt: result.config.prompt })} className="btn-secondary flex items-center gap-2 justify-center"><Share2 className="w-4 h-4 text-accent-400" /> Share Game</button>
              </div>
            </div>
          </div>
        )}

        {recentGames.length > 0 && state !== 'generating' && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Recently Generated</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentGames.map((g, i) => (
                <button key={i} onClick={() => onPlay(g)} className="glass-card p-4 flex items-center gap-3 text-left hover:border-primary-500/20 hover:scale-[1.02] transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${g.gameType === '2d' ? 'bg-primary-500/15' : 'bg-accent-500/15'}`}>{g.gameType === '2d' ? <Gamepad2 className="w-5 h-5 text-primary-400" /> : <Box className="w-5 h-5 text-accent-400" />}</div>
                  <div className="min-w-0 flex-1"><p className="font-semibold text-sm truncate">{g.title}</p><p className="text-xs text-gray-500 truncate">{g.config.prompt}</p></div>
                  <Play className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-white/[0.06] text-center">
          <p className="text-sm text-gray-300 mb-3">Want unlimited game generations? Subscribe to unlock full access.</p>
          <button onClick={() => onPricing(gameType)} className="btn-secondary inline-flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-secondary-400" /> View {gameType === '2d' ? '2D' : '3D'} Pricing Plans</button>
        </div>
      </div>
    </section>
  );
}
