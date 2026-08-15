export type SoundName = 'button' | 'correct' | 'complete' | 'achievement' | 'progress' | 'bark' | 'success' | 'error-soft'

class SoundService {
  private context?: AudioContext
  play(name: SoundName, enabled = true) {
    if (!enabled || typeof window === 'undefined') return
    this.context ??= new AudioContext()
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    const frequencies: Record<SoundName, number> = { button: 330, correct: 660, complete: 520, achievement: 740, progress: 580, bark: 180, success: 620, 'error-soft': 240 }
    oscillator.frequency.value = frequencies[name]
    oscillator.type = name === 'bark' ? 'sawtooth' : 'sine'
    gain.gain.setValueAtTime(.0001, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(name === 'bark' ? .025 : .04, this.context.currentTime + .02)
    gain.gain.exponentialRampToValueAtTime(.0001, this.context.currentTime + .18)
    oscillator.connect(gain).connect(this.context.destination)
    oscillator.start()
    oscillator.stop(this.context.currentTime + .2)
  }
}
export const soundService = new SoundService()
