import { useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { GameGenerator } from '@/components/GameGenerator';
import { GamesShowcase } from '@/components/GamesShowcase';
import { ShowcaseGallery } from '@/components/ShowcaseGallery';
import { PricingSection } from '@/components/PricingSection';
import { Footer } from '@/components/Footer';
import { PricingModal } from '@/components/PricingModal';
import { GamePlayer } from '@/components/GamePlayer';
import { ShareModal } from '@/components/ShareModal';
import { AuthModal } from '@/components/AuthModal';
import { AuthProvider, useAuth } from '@/lib/auth';
import type { GameType } from '@/lib/gameEngine';
import type { ShareData } from '@/lib/share';

interface GeneratedGame {
  gameId: string;
  gameType: GameType;
  title: string;
  config: {
    theme: string;
    difficulty: string;
    colorScheme: string;
    prompt: string;
  };
}

function AppContent() {
  const { user } = useAuth();
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pricingType, setPricingType] = useState<GameType>('2d');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GeneratedGame | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleOpenPricing = useCallback((type: GameType) => {
    setPricingType(type);
    setPricingOpen(true);
  }, []);

  const handlePlayGame = useCallback((game: GeneratedGame) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setActiveGame(game);
    setPlayerOpen(true);
  }, [user]);

  const handleShare = useCallback((data: ShareData) => {
    setShareData(data);
    setShareOpen(true);
  }, []);

  const handleAuthRequired = useCallback(() => {
    setAuthOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      <Navbar onNavigate={scrollToSection} onAuthClick={() => setAuthOpen(true)} />

      <main>
        <Hero
          onGenerate={() => scrollToSection('generator')}
          onPricing={() => handleOpenPricing('2d')}
        />

        <GamesShowcase onGenerate={() => scrollToSection('generator')} />

        <GameGenerator
          onPlay={handlePlayGame}
          onPricing={handleOpenPricing}
          onShare={handleShare}
          onAuthRequired={handleAuthRequired}
        />

        <ShowcaseGallery
          onPlay={handlePlayGame}
          onGenerate={() => scrollToSection('generator')}
        />

        <PricingSection onSelectPlan={handleOpenPricing} />
      </main>

      <Footer onNavigate={scrollToSection} />

      {/* Modals */}
      <PricingModal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        initialType={pricingType}
      />

      <GamePlayer
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
        gameId={activeGame?.gameId ?? ''}
        gameType={activeGame?.gameType ?? '2d'}
        config={activeGame?.config ?? { theme: 'neon', difficulty: 'normal', colorScheme: 'blue', prompt: '' }}
        prompt={activeGame?.config.prompt ?? ''}
        onShare={handleShare}
      />

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={shareData}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
