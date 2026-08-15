import * as Switch from '@radix-ui/react-switch'
import { useEffect, useState } from 'react'
import { ArrowLeft, Cpu, KeyRound, RotateCcw, Volume2, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Eyebrow } from '../components/ui'
import { getOnDeviceAvailability, type OnDeviceAvailability } from '../lib/onDeviceAnalysis'
import { useAppStore } from '../store/useAppStore'

type GeminiStatus = { configured: boolean; model: string }

const deviceStatusText = (status: OnDeviceAvailability | null) => {
  if (status === null) return { title: 'Checking on-device AI…', detail: 'Looking for Chrome’s built-in multimodal model.' }
  if (status === 'available') return { title: 'On-device AI is ready', detail: 'Photos can be analysed privately with Chrome’s built-in Gemini Nano model.' }
  if (status === 'downloadable') return { title: 'On-device AI can be downloaded', detail: 'Chrome will request the model download after you choose to analyse a photo.' }
  if (status === 'downloading') return { title: 'On-device AI is downloading', detail: 'Chrome is preparing its local model. Progress appears on the analysis screen.' }
  return { title: 'On-device AI is unavailable', detail: 'This browser, operating system, or device does not currently support the required multimodal LanguageModel session.' }
}

const serverStatusTitle = (status: GeminiStatus | 'unavailable' | null) => {
  if (status === null) return 'Checking Gemini configuration…'
  if (status === 'unavailable') return 'Configuration status unavailable'
  return status.configured ? 'Gemini is configured' : 'Gemini key not detected'
}

export default function Settings() {
  const sound = useAppStore((state) => state.soundEnabled)
  const reduced = useAppStore((state) => state.reducedMotion)
  const setSound = useAppStore((state) => state.setSoundEnabled)
  const setReduced = useAppStore((state) => state.setReducedMotion)
  const reset = useAppStore((state) => state.reset)
  const [gemini, setGemini] = useState<GeminiStatus | 'unavailable' | null>(null)
  const [deviceStatus, setDeviceStatus] = useState<OnDeviceAvailability | null>(null)

  useEffect(() => {
    fetch('/api/analyze-dog')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
      .then((status: GeminiStatus) => setGemini(status))
      .catch(() => setGemini('unavailable'))
  }, [])

  useEffect(() => {
    void getOnDeviceAvailability().then(setDeviceStatus)
  }, [])

  const geminiTitle = serverStatusTitle(gemini)
  const geminiDetail = gemini && gemini !== 'unavailable' && gemini.configured
    ? <>Server default: <strong>{gemini.model}</strong></>
    : <>Set <strong>GEMINI_API_KEY</strong> and optionally <strong>GEMINI_MODEL</strong> in the local or deployment environment, then restart the server.</>
  const device = deviceStatusText(deviceStatus)

  return (
    <section className="section settings-page">
      <Link to="/" className="back-link"><ArrowLeft size={17}/> Back home</Link>
      <Eyebrow>Your preferences</Eyebrow>
      <h1>Make Pawsitive feel right for you.</h1>
      <p>Sound and movement are always optional.</p>
      <div className="settings-list">
        <Card className="setting-row">
          <span className="feature-icon blue"><Volume2/></span>
          <div><h3>Gentle sounds</h3><p>Play soft feedback sounds after your interaction. Dog sounds never play unexpectedly.</p></div>
          <Switch.Root className="switch-root" checked={sound} onCheckedChange={setSound} aria-label="Gentle sounds"><Switch.Thumb className="switch-thumb"/></Switch.Root>
        </Card>
        <Card className="setting-row">
          <span className="feature-icon lavender"><Waves/></span>
          <div><h3>Reduce motion</h3><p>Minimise decorative movement and celebrations. Functional state changes remain.</p></div>
          <Switch.Root className="switch-root" checked={reduced} onCheckedChange={setReduced} aria-label="Reduce motion"><Switch.Thumb className="switch-thumb"/></Switch.Root>
        </Card>
        <Card className="gemini-config-card">
          <span className="feature-icon yellow"><KeyRound/></span>
          <div><Eyebrow>Server configuration</Eyebrow><h3>{geminiTitle}</h3><p>{geminiDetail}</p><small>The API key cannot be entered here because browser storage would expose it. Pawsitive only reports whether the server has one configured.</small></div>
        </Card>
        <Card className="gemini-config-card">
          <span className="feature-icon blue"><Cpu/></span>
          <div>
            <Eyebrow>Private fallback</Eyebrow>
            <h3>{device.title}</h3>
            <p>{device.detail}</p>
            <small>
              An initial browser-managed model download may be required. Once installed, inference is local and the photo is not sent to a server.
              <br/><br/>
              <strong>Prerequisites:</strong> Chrome 148+ on a supported desktop device, sufficient storage and compatible hardware. <a className="requirements-link" href="https://developer.chrome.com/docs/ai/get-started" target="_blank" rel="noreferrer">View Chrome’s official requirements<span className="sr-only"> (opens in a new tab)</span></a>.
            </small>
          </div>
        </Card>
        <Card className="setting-row danger-zone">
          <span className="feature-icon coral"><RotateCcw/></span>
          <div><h3>Reset demo progress</h3><p>Clear onboarding, lessons, scenarios, achievements, and preferences from this device.</p></div>
          <button type="button" className="button button-secondary" onClick={() => { if (window.confirm('Reset all progress?')) reset() }}>Reset</button>
        </Card>
      </div>
    </section>
  )
}