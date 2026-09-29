export interface ShareData {
  gameId: string;
  gameTitle: string;
  gameType: '2d' | '3d';
  prompt: string;
  score?: number;
}

export const VIRAL_CAPTIONS: string[] = [
  'Made this game in 10 seconds using PixelGen AI Studio! Try it now',
  'I just generated a fully playable game with AI. No coding needed. Try PixelGen AI Studio!',
  'AI generated this game from a single text prompt. Mind blown. Make yours on PixelGen AI Studio!',
  'From prompt to playable in seconds. PixelGen AI Studio is the future of game creation!',
  'No code. No setup. Just describe your game and play it. PixelGen AI Studio is incredible!',
  'I typed a sentence and got a real game. PixelGen AI Studio is magic. Try it now!',
  'Built my dream game without writing a single line of code. PixelGen AI Studio FTW!',
  'This AI game generator is unreal. Describe it, play it, share it. PixelGen AI Studio!',
];

export const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://pixelgen.ai';
export const HASHTAGS = ['PixelGenAI', 'AIGameGenerator', 'GameDev', 'MadeWithAI', 'IndieGames'];

export function getShareableLink(data: ShareData): string {
  const params = new URLSearchParams({ game: data.gameId, type: data.gameType, title: data.gameTitle, prompt: data.prompt });
  return `${SITE_URL}/?${params.toString()}#generator`;
}

export function getRandomCaption(): string {
  return VIRAL_CAPTIONS[Math.floor(Math.random() * VIRAL_CAPTIONS.length)];
}

export function buildShareText(data: ShareData, caption: string): string {
  const link = getShareableLink(data);
  const hashtags = HASHTAGS.map((h) => `#${h}`).join(' ');
  const scoreLine = data.score !== undefined && data.score > 0 ? ` My score: ${data.score}!` : '';
  return `${caption}${scoreLine}\n\n${link}\n\n${hashtags}`;
}

export function shareToWhatsApp(data: ShareData, caption: string): void {
  const text = buildShareText(data, caption);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

export function shareToTwitter(data: ShareData, caption: string): void {
  const text = buildShareText(data, caption);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

export function shareToInstagram(data: ShareData, caption: string): void {
  const text = buildShareText(data, caption);
  if (navigator.share) {
    navigator.share({ title: `PixelGen AI Studio — ${data.gameTitle}`, text, url: getShareableLink(data) }).catch(() => { copyToClipboard(text); });
  } else { copyToClipboard(text); }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
