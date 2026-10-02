export interface VoiceCommandResult {
  transcript: string;
  intent: 'create_game' | 'add_graphics' | 'unknown';
}

export function startVoiceRecognition(onResult: (result: VoiceCommandResult) => void): void {
  // Browser SpeechRecognition API support check
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult({
      transcript,
      intent: transcript.toLowerCase().includes('game') ? 'create_game' : 'unknown'
    });
  };

  recognition.start();
}
