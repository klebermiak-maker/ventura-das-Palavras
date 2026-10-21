/**
 * Web Speech API text-to-speech helper with pt-BR voice support
 * Provides Play, Pause, Resume, and Stop controls without reducing student score.
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPausedState: boolean = false;
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
    return this.isSpeaking && !this.isPausedState;
  }

  public getIsPaused(): boolean {
    return this.isPausedState;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;

    this.stop();

    this.onEndCallback = onEnd || null;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Cadência pausada e acolhedora para alunos do 4º ano
    utterance.pitch = 1.05;

    // Localizar voz em português do Brasil
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt-BR') || v.lang.startsWith('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPausedState = false;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPausedState = false;
      this.currentUtterance = null;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPausedState = false;
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPausedState) {
      this.synth.pause();
      this.isPausedState = true;
    }
  }

  public resume() {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPausedState = false;
      this.currentUtterance = null;
    }
  }
}

export const speechService = new SpeechService();
