export class AudioBootController {
  private isInitialized = false;

  private async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
      }
    });
  }

  public async forceSpeakOnReady(text: string, onFail: () => void) {
    if (this.isInitialized) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = await this.getVoices();
      utterance.voice = voices.find(v => v.lang.startsWith('en')) || null;
      utterance.rate = 0.94;

      utterance.onerror = (e) => {
        console.error('[SOVR] AudioBootController Error:', e);
        onFail();
      };

      utterance.onend = () => {
        this.isInitialized = true;
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('[SOVR] AudioBootController critical failure:', err);
      onFail();
    }
  }
}
