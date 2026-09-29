import { useState, useCallback } from 'react';
import { X, Mail, Lock, Loader2, AlertCircle, Gamepad2, User as UserIcon, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { FOUNDER_EMAIL } from '@/lib/supabase';

interface AuthModalProps { open: boolean; onClose: () => void; }

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Please enter both email and password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const result = mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setLoading(false);
    if (result.error) { setError(result.error); } else { onClose(); setEmail(''); setPassword(''); }
  }, [email, password, mode, signIn, signUp, onClose]);

  const handleFounderLogin = useCallback(async () => {
    setLoading(true); setError(''); setEmail(FOUNDER_EMAIL);
    const FOUNDER_PASSWORD = 'PixelGen@2026';
    let result = await signIn(FOUNDER_EMAIL, FOUNDER_PASSWORD);
    if (result.error) {
      const signUpResult = await signUp(FOUNDER_EMAIL, FOUNDER_PASSWORD);
      if (signUpResult.error) { result = await signIn(FOUNDER_EMAIL, FOUNDER_PASSWORD); if (result.error) { setError(result.error); setLoading(false); return; } } else { result = signUpResult; }
    }
    setLoading(false); if (!result.error) { onClose(); } else { setError(result.error); }
  }, [signIn, signUp, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md glass rounded-3xl border border-white/10 overflow-hidden animate-scale-in">
        <div className="relative px-6 py-6 border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-white" strokeWidth={2.5} /></div>
              <div><h2 className="font-display text-xl font-bold">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2><p className="text-xs text-gray-400">{mode === 'signin' ? 'Sign in to PixelGen AI Studio' : 'Join PixelGen AI Studio'}</p></div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" disabled={loading} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all disabled:opacity-50" autoComplete="email" /></div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="At least 6 characters" disabled={loading} className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all disabled:opacity-50" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></div>
          </div>
          {error && <div className="p-3 rounded-xl bg-error-500/10 border border-error-500/20 flex items-start gap-2 animate-fade-in"><AlertCircle className="w-4 h-4 text-error-400 flex-shrink-0 mt-0.5" /><p className="text-xs text-error-300">{error}</p></div>}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'signin' ? <><Zap className="w-4 h-4" /> Sign In</> : <><UserIcon className="w-4 h-4" /> Create Account</>}</button>
          <div className="text-center"><button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }} className="text-xs text-gray-400 hover:text-white transition-colors">{mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button></div>
        </form>

        <div className="px-6"><div className="flex items-center gap-3"><div className="flex-1 h-px bg-white/[0.06]" /><span className="text-xs text-gray-500">or</span><div className="flex-1 h-px bg-white/[0.06]" /></div></div>

        <div className="px-6 py-5">
          <button onClick={handleFounderLogin} disabled={loading} className="w-full p-3.5 rounded-xl bg-gradient-to-r from-secondary-500/15 to-accent-500/15 border border-secondary-500/25 hover:border-secondary-500/40 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 group">
            <Crown className="w-5 h-5 text-secondary-400 group-hover:scale-110 transition-transform" />
            <div className="text-left"><p className="text-sm font-semibold text-secondary-300">Founder Quick Access</p><p className="text-xs text-gray-500">Instant login for the CEO</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}
