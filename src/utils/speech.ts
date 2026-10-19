/**
 * Web Speech API text-to-speech helper with pt-BR voice support
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return !!this.synth;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;

    this.stop();

    this.onEndCallback = onEnd || null;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Slightly slower, clear pace for 4th graders
    utterance.pitch = 1.05; // Friendly warm pitch

    // Try finding a Brazilian Portuguese voice
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt-BR') || v.lang.startsWith('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }
}

export const speechService = new SpeechService();
