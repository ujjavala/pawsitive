import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, Camera, Eye, ImagePlus, Lightbulb, RotateCcw, ShieldCheck, Upload, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DogCueAnimation } from '../components/DogCueAnimation'
import { PipMascot } from '../components/PipMascot'
import { Button, Card, Eyebrow, LinkButton } from '../components/ui'
import { demoAnalysis, dogAnalysisSchema } from '../lib/analysis'
import { analyzeOnDevice, OnDeviceAnalysisError } from '../lib/onDeviceAnalysis'
import { useAppStore } from '../store/useAppStore'
import type { DogAnalysis } from '../types'

class ServerAnalysisError extends Error {
  readonly code: string

  constructor(code: string) {
    super(code)
    this.name = 'ServerAnalysisError'
    this.code = code
  }
}

const fetchServerAnalysis = async (file: File, model: string, signal: AbortSignal) => {
  const body = new FormData()
  body.append('image', file)
  body.append('model', model)
  const response = await fetch('/api/analyze-dog', { method: 'POST', body, signal })
  const payload: unknown = await response.json()
  if (!response.ok) {
    const code = typeof payload === 'object' && payload && 'error' in payload ? String(payload.error) : 'request_failed'
    throw new ServerAnalysisError(code)
  }
  const parsed = dogAnalysisSchema.safeParse(payload)
  if (!parsed.success) throw new ServerAnalysisError('invalid_response')
  return parsed.data
}

const unavailableMessage = (error: unknown) => error instanceof OnDeviceAnalysisError && error.code === 'unavailable'
  ? 'Uh-oh! Server Gemini is not configured, and private on-device analysis is not available in this browser or device.'
  : 'Private on-device analysis could not complete. Please try again or use the labelled demo.'

const getPhotoLabel = (source: DogAnalysis['source']) => {
  if (source === 'demo') return 'Sample illustration · seeded result'
  if (source === 'on-device') return 'Your photo · analysed on this device'
  return 'Your photo'
}

export default function UnderstandDog() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [analysis, setAnalysis] = useState<DogAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('This should only take a moment.')
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [geminiIssue, setGeminiIssue] = useState(false)
  const [serverConfigured, setServerConfigured] = useState<boolean | null>(null)
  const aiEnabled = useAppStore((state) => state.aiAnalysisEnabled)
  const geminiModel = useAppStore((state) => state.geminiModel)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    const statusController = new AbortController()
    fetch('/api/analyze-dog', { signal: statusController.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
      .then((status: { configured?: boolean }) => setServerConfigured(status.configured === true))
      .catch((statusError: Error) => { if (statusError.name !== 'AbortError') setServerConfigured(null) })
    return () => statusController.abort()
  }, [])

  const choose = (selected?: File) => {
    if (!selected) return
    if (!aiEnabled) {
      setGeminiIssue(true)
      setError('Uh-oh! It looks like AI photo analysis is turned off. Enable it in Your preferences before uploading a photo.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 5_000_000) {
      setGeminiIssue(false)
      setError('Choose a JPG, PNG, or WebP image smaller than 5 MB.')
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(selected))
    setFile(selected)
    setAnalysis(null)
    setError('')
    setGeminiIssue(false)
  }

  const analyzePrivately = async () => {
    if (!file || !controller.current) return
    setLoadingMessage('Checking whether private on-device analysis is available…')
    setDownloadProgress(null)
    const result = await analyzeOnDevice(file, {
      signal: controller.current.signal,
      onAvailabilityChange: (availability) => setLoadingMessage(availability === 'available'
        ? 'Pip is checking the visible clues privately on this device…'
        : 'Chrome is preparing its private on-device model. The first download may take a while…'),
      onDownloadProgress: setDownloadProgress,
    })
    setAnalysis(result)
  }

  const tryPrivateAnalysis = async (messageForOtherFailure?: string) => {
    try {
      await analyzePrivately()
      return true
    } catch (deviceError) {
      if (deviceError instanceof DOMException && deviceError.name === 'AbortError') return false
      setGeminiIssue(true)
      setError(messageForOtherFailure ?? unavailableMessage(deviceError))
      return false
    }
  }

  const analyze = async () => {
    if (!file) return
    if (!aiEnabled) {
      setGeminiIssue(true)
      setError('Uh-oh! It looks like AI photo analysis is turned off. Enable it in Your preferences, then try again.')
      return
    }

    setLoading(true)
    setLoadingMessage('Pip is checking the visible clues…')
    setDownloadProgress(null)
    setError('')
    setGeminiIssue(false)
    controller.current = new AbortController()

    if (serverConfigured === false) {
      await tryPrivateAnalysis()
      setLoading(false)
      return
    }

    let timedOut = false
    const timeout = window.setTimeout(() => {
      timedOut = true
      controller.current?.abort()
    }, 10_000)

    try {
      setAnalysis(await fetchServerAnalysis(file, geminiModel, controller.current.signal))
    } catch (serverError) {
      const keyMissing = serverError instanceof ServerAnalysisError && serverError.code === 'analysis_unavailable'
      if (keyMissing || timedOut) {
        window.clearTimeout(timeout)
        controller.current = new AbortController()
        if (keyMissing) setServerConfigured(false)
        await tryPrivateAnalysis(timedOut
          ? 'The server took too long, and private on-device analysis could not complete. Please try again shortly.'
          : undefined)
      } else if (!(serverError instanceof DOMException && serverError.name === 'AbortError')) {
        setError('We couldn’t analyse that image right now. Please try again shortly.')
      }
    } finally {
      window.clearTimeout(timeout)
      setLoading(false)
    }
  }

  const reset = () => {
    controller.current?.abort()
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview('')
    setAnalysis(null)
    setError('')
    setGeminiIssue(false)
    setDownloadProgress(null)
  }

  if (loading) return (
    <section className="section ai-loading">
      <div className="ai-orbit"><PipMascot mood="curious" size={300}/><span className="orbit-dot one"/><span className="orbit-dot two"/><span className="orbit-dot three"/></div>
      <Eyebrow>Visible-signal analysis</Eyebrow>
      <h1>Pip is checking the visible clues…</h1>
      <p aria-live="polite">{loadingMessage}</p>
      {downloadProgress !== null && <p><strong>{downloadProgress}% downloaded</strong></p>}
      <p>A photo cannot determine whether a dog is safe or predict what it will do.</p>
      <Button className="button-secondary" onClick={() => { controller.current?.abort(); setLoading(false) }}>Cancel</Button>
    </section>
  )

  if (analysis) {
    const photoLabel = getPhotoLabel(analysis.source)
    return (
      <section className="section ai-results">
        <div className="results-heading">
          <div>
            <Eyebrow><Eye size={15}/> Educational analysis</Eyebrow>
            <h1>Here are the visible clues.</h1>
            <p>This is one still moment—not a safety assessment.</p>
            {analysis.source === 'on-device' && <p className="on-device-note"><ShieldCheck size={16}/> Analysed privately on this device. The photo was not sent to a server.</p>}
          </div>
          <Button className="button-secondary" onClick={reset}><RotateCcw size={17}/> Try another photo</Button>
        </div>
        <div className="results-grid">
          <div><div className="photo-card">
            {analysis.source === 'demo' ? <div className="demo-dog-visual"><DogCueAnimation cue="sample-loose" compact/></div> : <img src={preview} alt="Uploaded dog for body-language analysis"/>}
            <span>{photoLabel}</span>
          </div></div>
          <div className="result-stack">
            <Card className="result-card observe"><span className="feature-icon blue"><Eye/></span><div><Eyebrow>What we can observe</Eyebrow>{analysis.visibleSignals.map((signal) => <div className="signal-result" key={signal.signal}><span>🐾</span><div><strong>{signal.signal}</strong><p>{signal.explanation}</p><small>{signal.confidence} visual confidence</small></div></div>)}</div></Card>
            <Card className="result-card"><span className="feature-icon yellow"><Lightbulb/></span><div><Eyebrow>What this might indicate</Eyebrow><p>{analysis.possibleInterpretation}</p></div></Card>
            <Card className="result-card uncertainty"><span className="feature-icon lavender"><AlertCircle/></span><div><Eyebrow>What we cannot know</Eyebrow><ul>{analysis.uncertainties.map((item) => <li key={item}>{item}</li>)}</ul></div></Card>
            <Card className="result-card action"><span className="feature-icon mint"><ShieldCheck/></span><div><Eyebrow>What you can do</Eyebrow><p>{analysis.recommendedAction}</p><small>{analysis.safetyNote}</small></div></Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section understand-page">
      <div className="page-intro"><div><Eyebrow><Camera size={15}/> Understand This Dog</Eyebrow><h1>What is this dog telling me?</h1><p>Upload a photo and explore visible body-language cues—with uncertainty made clear.</p></div><PipMascot mood="curious" size={180}/></div>
      <div className="upload-layout">
        <Card className="upload-card">
          {preview ? <div className="image-preview"><img src={preview} alt="Selected dog"/><button type="button" className="remove-image" onClick={reset} aria-label="Remove selected image"><X/></button></div> : (
            <label className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files[0]) }}>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => choose(event.target.files?.[0])}/><span className="upload-icon"><ImagePlus/></span><strong>Drop a dog photo here</strong><span>or choose an image</span><small>JPG, PNG or WebP · up to 5 MB</small>
            </label>
          )}
          {error && <div className={`error-message ${geminiIssue ? 'pip-config-message' : ''}`} role="alert">{geminiIssue ? <PipMascot mood="confused" size={105}/> : <AlertCircle/>}<div><strong>{error}</strong><span>{geminiIssue ? 'Your photo stays on this device.' : 'Your image has not been saved.'}</span>{geminiIssue && <Link to="/settings">Open Your preferences <ArrowRight size={15}/></Link>}</div></div>}
          <div className="upload-actions"><Button disabled={!file || !aiEnabled} onClick={analyze}><Upload size={18}/> Help me understand</Button><button type="button" className="text-button" onClick={() => { setAnalysis(demoAnalysis); setPreview('') }}>Try the labelled demo photo <ArrowRight size={15}/></button></div>
        </Card>
        <aside>
          <Card><Eyebrow>Before you begin</Eyebrow><h3>A photo is a clue, not a guarantee.</h3><ul className="check-list"><li><ShieldCheck/> We describe visible signals only</li><li><ShieldCheck/> We use cautious language</li><li><ShieldCheck/> We always recommend safe space</li></ul></Card>
          <Card className="privacy-card"><strong>Your privacy</strong><p>Photos are processed only when you choose “Help me understand”. On-device analysis keeps the photo local; server analysis does not store it.</p></Card>
        </aside>
      </div>
      {error && !geminiIssue && <div className="button-row centered"><Button className="button-secondary" onClick={analyze}>Try again</Button><LinkButton to="/learn" variant="ghost">Continue learning</LinkButton></div>}
    </section>
  )
}