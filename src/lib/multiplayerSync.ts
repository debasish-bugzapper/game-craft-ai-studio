export interface MultiplayerSession {
  roomId: string;
  hostName: string;
  playersConnected: number;
  shareableLink: string;
}

export function createMultiplayerSession(gameName: string, hostName: string): MultiplayerSession {
  const roomId = Math.random().toString(36.substring(2, 8)).toUpperCase();
  const sanitizedGame = gameName.toLowerCase().replace(/\s+/g, '-');
  
  return {
    roomId,
    hostName: hostName || 'Creator',
    playersConnected: 1,
    shareableLink: `https://game-craft-ai-studio.vercel.app/play/${sanitizedGame}?room=${roomId}`
  };
}
