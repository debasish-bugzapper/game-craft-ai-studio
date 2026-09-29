import { useRef, useEffect, useState, useCallback } from 'react';
import { X, Play, RotateCcw, Trophy, Gamepad2, Box, Keyboard, Share2 } from 'lucide-react';
import { createGame, GAME_NAMES, GAME_CONTROLS_INFO, type GameConfig, type GameControls } from '@/games';
import { GameTypeBadge } from './Navbar';
import type { ShareData } from '@/lib/share';

interface GamePlayerProps { open: boolean; onClose: () => void; gameId: string; gameType: '2d' | '3d'; config: GameConfig; prompt: string; onShare: (data: ShareData) => void; }

export function GamePlayer({ open, onClose, gameId, gameType, config, prompt, onShare }: GamePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<GameControls | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.width = gameType === '3d' ? 800 : 600; canvas.height = 450;
    controlsRef.current?.stop();
    setScore(0); setGameOver(false); setPlaying(false); setReady(false);
    controlsRef.current = createGame(gameId, canvas, config, {
      onScore: (s) => setScore(s),
      onGameOver: (s) => { setScore(s); setGameOver(true); setPlaying(false); },
      onReady: () => setReady(true),
    });
  }, [gameId, gameType, config]);

  useEffect(() => {
    if (open) { const timer = setTimeout(() => initGame(), 100); return () => { clearTimeout(timer); controlsRef.current?.stop(); }; }
  }, [open, initGame]);

  useEffect(() => { return () => { controlsRef.current?.stop(); }; }, []);

  function handleStart() { if (gameOver) { controlsRef.current?.reset(); setGameOver(false); } canvasRef.current?.focus(); controlsRef.current?.start(); setPlaying(true); }
  function handleRestart() { controlsRef.current?.reset(); setGameOver(false); setScore(0); canvasRef.current?.focus(); controlsRef.current?.start(); setPlaying(true); }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl glass rounded-3xl border border-white/10 overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gameType === '2d' ? 'bg-primary-500/15' : 'bg-accent-500/15'}`}>{gameType === '2d' ? <Gamepad2 className="w-5 h-5 text-primary-400" /> : <Box className="w-5 h-5 text-accent-400" />}</div>
            <div><h2 className="font-display text-xl font-bold">{GAME_NAMES[gameId]}</h2><div className="flex items-center gap-2 mt-0.5"><GameTypeBadge type={gameType} /><span className="text-xs text-gray-500 capitalize">{config.difficulty} · {config.theme}</span></div></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-secondary-400" /><span className="text-sm text-gray-400">Score:</span><span className="font-display text-2xl font-bold text-gradient">{score}</span></div>
            <div className="flex items-center gap-2">
              <button onClick={() => onShare({ gameId, gameTitle: GAME_NAMES[gameId], gameType, prompt, score })} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"><Share2 className="w-4 h-4 text-accent-400" /><span className="hidden sm:inline">Share Game</span></button>
              {!playing && !gameOver && ready && <button onClick={handleStart} className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2"><Play className="w-4 h-4" /> Start Game</button>}
              {(gameOver || (!playing && ready && score > 0)) && <button onClick={handleRestart} className="btn-accent !py-2 !px-4 text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
            <canvas ref={canvasRef} className="max-w-full h-auto block focus:outline-none" style={{ imageRendering: gameType === '2d' ? 'pixelated' : 'auto' }} />
            {!ready && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><div className="w-8 h-8 border-2 border-white/20 border-t-primary-400 rounded-full animate-spin" /></div>}
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 animate-fade-in">
                <Trophy className="w-12 h-12 text-secondary-400 mb-3" /><p className="font-display text-2xl font-bold mb-1">Game Over</p><p className="text-lg text-accent-400 mb-4">Final Score: {score}</p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button onClick={handleRestart} className="btn-accent !py-2.5 !px-6 text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Play Again</button>
                  <button onClick={() => onShare({ gameId, gameTitle: GAME_NAMES[gameId], gameType, prompt, score })} className="btn-secondary !py-2.5 !px-6 text-sm flex items-center gap-2"><Share2 className="w-4 h-4 text-accent-400" /> Share Score</button>
                </div>
              </div>
            )}
            {!playing && !gameOver && ready && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 animate-fade-in cursor-pointer" onClick={handleStart}>
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 hover:scale-110 transition-transform"><Play className="w-8 h-8 text-white ml-1" /></div>
                <p className="text-sm text-gray-300">Click to start</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"><Keyboard className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-xs text-gray-400">{GAME_CONTROLS_INFO[gameId]}</p></div>
          <div className="mt-3 px-4 py-3 rounded-xl bg-primary-500/[0.05] border border-primary-500/10"><p className="text-xs text-gray-500 mb-1">Generated from prompt:</p><p className="text-sm text-gray-300 italic">"{prompt}"</p></div>
        </div>
      </div>
    </div>
  );
}
