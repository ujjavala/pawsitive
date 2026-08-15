import * as Switch from '@radix-ui/react-switch'
import { ArrowLeft, RotateCcw, Volume2, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Eyebrow } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export default function Settings() {
  const sound = useAppStore((state) => state.soundEnabled)
  const reduced = useAppStore((state) => state.reducedMotion)
  const setSound = useAppStore((state) => state.setSoundEnabled)
  const setReduced = useAppStore((state) => state.setReducedMotion)
  const reset = useAppStore((state) => state.reset)
  return <section className="section settings-page"><Link to="/" className="back-link"><ArrowLeft size={17}/> Back home</Link><Eyebrow>Your preferences</Eyebrow><h1>Make Pawsitive feel right for you.</h1><p>Sound and movement are always optional.</p><div className="settings-list"><Card className="setting-row"><span className="feature-icon blue"><Volume2/></span><div><h3>Gentle sounds</h3><p>Play soft feedback sounds after your interaction. Dog sounds never play unexpectedly.</p></div><Switch.Root className="switch-root" checked={sound} onCheckedChange={setSound} aria-label="Gentle sounds"><Switch.Thumb className="switch-thumb"/></Switch.Root></Card><Card className="setting-row"><span className="feature-icon lavender"><Waves/></span><div><h3>Reduce motion</h3><p>Minimise decorative movement and celebrations. Functional state changes remain.</p></div><Switch.Root className="switch-root" checked={reduced} onCheckedChange={setReduced} aria-label="Reduce motion"><Switch.Thumb className="switch-thumb"/></Switch.Root></Card><Card className="setting-row danger-zone"><span className="feature-icon coral"><RotateCcw/></span><div><h3>Reset demo progress</h3><p>Clear onboarding, lessons, scenarios, achievements, and preferences from this device.</p></div><button className="button button-secondary" onClick={() => { if (window.confirm('Reset all progress?')) reset() }}>Reset</button></Card></div></section>
}
