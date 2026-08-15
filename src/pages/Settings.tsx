import * as Switch from '@radix-ui/react-switch'
import { useEffect, useState } from 'react'
import { ArrowLeft, Bot, Cpu, KeyRound, RotateCcw, Volume2, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Eyebrow } from '../components/ui'
import { getOnDeviceAvailability, type OnDeviceAvailability } from '../lib/onDeviceAnalysis'
import { useAppStore } from '../store/useAppStore'

const verifiedGeminiModels = [
  { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' },
]

type GeminiStatus = { configured: boolean; model: string; models?: { id: string; label: string }[] }

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
  const aiEnabled = useAppStore((state) => state.aiAnalysisEnabled)
  const selectedModel = useAppStore((state) => state.geminiModel)
  const setSound = useAppStore((state) => state.setSoundEnabled)
  const setReduced = useAppStore((state) => state.setReducedMotion)
  const setAiEnabled = useAppStore((state) => state.setAiAnalysisEnabled)
  const setSelectedModel = useAppStore((state) => state.setGeminiModel)
  const reset = useAppStore((state) => state.reset)
  const [gemini, setGemini] = useState<GeminiStatus | 'unavailable' | null>(null)
  const [deviceStatus, setDeviceStatus] = useState<OnDeviceAvailability | null>(null)

  useEffect(() => {
    fetch('/api/analyze-dog')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
      .then((status: GeminiStatus) => {
        setGemini(status)
        if (status.models?.length && !status.models.some((model) => model.id === selectedModel)) setSelectedModel(status.model)
      })
      .catch(() => setGemini('unavailable'))
  }, [selectedModel, setSelectedModel])

  useEffect(() => {
    void getOnDeviceAvailability().then(setDeviceStatus)
  }, [])

  const geminiTitle = serverStatusTitle(gemini)
  const geminiDetail = gemini && gemini !== 'unavailable' && gemini.configured
    ? <>Server default: <strong>{gemini.model}</strong></>
    : <>Set <strong>GEMINI_API_KEY</strong> and optionally <strong>GEMINI_MODEL</strong> in the local or deployment environment, then restart the server.</>
  const modelOptions = gemini && gemini !== 'unavailable' && gemini.models?.length ? gemini.models : verifiedGeminiModels
  const device = deviceStatusText(deviceStatus)

  return (
    <section className="section settings-page">
      <Link to="/" className="back-link"><ArrowLeft size={17}/> Back home</Link>
      <Eyebrow>Your preferences</Eyebrow>
      <h1>Make Pawsitive feel right for you.</h1>
      <p>Sound, movement, and AI photo analysis are always optional.</p>
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
        <Card className="setting-row">
          <span className="feature-icon mint"><Bot/></span>
          <div>
            <h3>AI photo analysis</h3>
            <p>Allow server Gemini analysis when configured, with private on-device analysis as a fallback when supported.</p>
            <label className="model-picker"><span>Server analysis model</span><select value={selectedModel} onChange={(event) => setSelectedModel(event.target.value)} disabled={!aiEnabled}>{modelOptions.map((model) => <option value={model.id} key={model.id}>{model.label}</option>)}</select><small>Stable multimodal models verified from Google’s Gemini API model catalogue on 15 August 2026.</small></label>
          </div>
          <Switch.Root className="switch-root" checked={aiEnabled} onCheckedChange={setAiEnabled} aria-label="AI photo analysis"><Switch.Thumb className="switch-thumb"/></Switch.Root>
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