export interface SoundTrack {
  id: string;
  theme: 'action' | 'horror' | 'adventure' | 'arcade';
  audioUrl: string;
  duration: number;
}

export async function generateGameSoundtrack(theme: 'action' | 'horror' | 'adventure' | 'arcade'): Promise<SoundTrack> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `snd_${Date.now()}`,
        theme,
        audioUrl: `https://assets.example.com/audio/${theme}-theme.mp3`,
        duration: 30
      });
    }, 1200);
  });
}
