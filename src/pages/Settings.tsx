import * as Switch from '@radix-ui/react-switch'
import { useEffect, useState } from 'react'
import { ArrowLeft, Bot, KeyRound, RotateCcw, Volume2, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Eyebrow } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

const verifiedGeminiModels = [
  { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' },
]

type GeminiStatus = { configured: boolean; model: string; models?: { id: string; label: string }[] }

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

  useEffect(() => {
    fetch('/api/analyze-dog')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
      .then((status: GeminiStatus) => {
        setGemini(status)
        if (status.models?.length && !status.models.some((model) => model.id === selectedModel)) setSelectedModel(status.model)
      })
        .catch(() => setGemini('unavailable'))
  }, [selectedModel, setSelectedModel])

      const geminiTitle = gemini === null ? 'Checking Gemini configuration…' : gemini === 'unavailable' ? 'Configuration status unavailable' : gemini.configured ? 'Gemini is configured' : 'Gemini key not detected'
      const geminiDetail = gemini && gemini !== 'unavailable' && gemini.configured ? <>Server default: <strong>{gemini.model}</strong></> : <>Set <strong>GEMINI_API_KEY</strong> and optionally <strong>GEMINI_MODEL</strong> in the local or deployment environment, then restart the server.</>
      const modelOptions = gemini && gemini !== 'unavailable' && gemini.models?.length ? gemini.models : verifiedGeminiModels

  return <section className="section settings-page"><Link to="/" className="back-link"><ArrowLeft size={17}/> Back home</Link><Eyebrow>Your preferences</Eyebrow><h1>Make Pawsitive feel right for you.</h1><p>Sound, movement, and AI photo analysis are always optional.</p><div className="settings-list"><Card className="setting-row"><span className="feature-icon blue"><Volume2/></span><div><h3>Gentle sounds</h3><p>Play soft feedback sounds after your interaction. Dog sounds never play unexpectedly.</p></div><Switch.Root className="switch-root" checked={sound} onCheckedChange={setSound} aria-label="Gentle sounds"><Switch.Thumb className="switch-thumb"/></Switch.Root></Card><Card className="setting-row"><span className="feature-icon lavender"><Waves/></span><div><h3>Reduce motion</h3><p>Minimise decorative movement and celebrations. Functional state changes remain.</p></div><Switch.Root className="switch-root" checked={reduced} onCheckedChange={setReduced} aria-label="Reduce motion"><Switch.Thumb className="switch-thumb"/></Switch.Root></Card><Card className="setting-row"><span className="feature-icon mint"><Bot/></span><div><h3>Gemini photo analysis</h3><p>Allow selected dog photos to be sent to the configured Gemini model for visible-signal analysis.</p><label className="model-picker"><span>Analysis model</span><select value={selectedModel} onChange={(event) => setSelectedModel(event.target.value)} disabled={!aiEnabled}>{modelOptions.map((model) => <option value={model.id} key={model.id}>{model.label}</option>)}</select><small>Stable multimodal models verified from Google’s Gemini API model catalogue on 15 August 2026.</small></label></div><Switch.Root className="switch-root" checked={aiEnabled} onCheckedChange={setAiEnabled} aria-label="Gemini photo analysis"><Switch.Thumb className="switch-thumb"/></Switch.Root></Card><Card className="gemini-config-card"><span className="feature-icon yellow"><KeyRound/></span><div><Eyebrow>Server configuration</Eyebrow><h3>{geminiTitle}</h3><p>{geminiDetail}</p><small>The API key cannot be entered here because browser storage would expose it. Pawsitive only reports whether the server has one configured.</small></div></Card><Card className="setting-row danger-zone"><span className="feature-icon coral"><RotateCcw/></span><div><h3>Reset demo progress</h3><p>Clear onboarding, lessons, scenarios, achievements, and preferences from this device.</p></div><button type="button" className="button button-secondary" onClick={() => { if (window.confirm('Reset all progress?')) reset() }}>Reset</button></Card></div></section>
}
