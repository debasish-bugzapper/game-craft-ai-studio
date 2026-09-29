import { Gamepad2, Sparkles, Box, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

interface NavbarProps {
  onNavigate: (section: string) => void;
  onAuthClick: () => void;
}

export function Navbar({ onNavigate, onAuthClick }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { user, isFounder, signOut } = useAuth();

  const links = [
    { label: 'Generator', id: 'generator' },
    { label: '2D Games', id: 'games-2d' },
    { label: '3D Games', id: 'games-3d' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Pricing', id: 'pricing' },
  ];

  function handleNav(id: string) { onNavigate(id); setOpen(false); }
  function handleSignOut() { signOut(); setOpen(false); }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => handleNav('hero')} className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
            <Gamepad2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">PixelGen <span className="text-gradient">AI</span></span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button key={link.id} onClick={() => handleNav(link.id)}
              className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {isFounder && <span className="px-2.5 py-1 rounded-md bg-secondary-500/15 text-secondary-300 text-xs font-semibold border border-secondary-500/20 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Founder</span>}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">{user.email?.[0]?.toUpperCase() ?? 'U'}</div>
                <span className="text-xs text-gray-300 max-w-[120px] truncate">{user.email}</span>
              </div>
              <button onClick={handleSignOut} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Sign out"><LogOut className="w-4 h-4 text-gray-400" /></button>
            </div>
          ) : (
            <>
              <button onClick={onAuthClick} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-1.5"><User className="w-4 h-4" /> Sign In</button>
              <button onClick={() => handleNav('generator')} className="btn-accent !py-2 !px-4 text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" /> Start Building</button>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-white/5">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass border-t border-white/[0.06] px-4 py-4 space-y-2 animate-fade-in-down">
          {links.map((link) => (
            <button key={link.id} onClick={() => handleNav(link.id)} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5">{link.label}</button>
          ))}
          <div className="pt-2 border-t border-white/[0.06] mt-2">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">{user.email?.[0]?.toUpperCase() ?? 'U'}</div>
                  <span className="text-xs text-gray-300 truncate">{user.email}</span>
                  {isFounder && <span className="text-xs text-secondary-400 font-semibold">Founder</span>}
                </div>
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-error-300 hover:text-error-200 rounded-lg hover:bg-error-500/10 flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign Out</button>
              </div>
            ) : (
              <>
                <button onClick={() => { onAuthClick(); setOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 flex items-center gap-2"><User className="w-4 h-4" /> Sign In</button>
                <button onClick={() => handleNav('generator')} className="btn-accent w-full !py-2.5 text-sm flex items-center justify-center gap-2 mt-2"><Sparkles className="w-4 h-4" /> Start Building</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function GameTypeBadge({ type }: { type: '2d' | '3d' }) {
  return type === '2d' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-500/15 text-primary-300 text-xs font-semibold border border-primary-500/20"><Gamepad2 className="w-3 h-3" /> 2D</span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent-500/15 text-accent-300 text-xs font-semibold border border-accent-500/20"><Box className="w-3 h-3" /> 3D</span>
  );
}
