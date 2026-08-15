import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, Camera, Eye, ImagePlus, Lightbulb, RotateCcw, ShieldCheck, Upload, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DogCueAnimation } from '../components/DogCueAnimation'
import { PipMascot } from '../components/PipMascot'
import { Button, Card, Eyebrow, LinkButton } from '../components/ui'
import { demoAnalysis, dogAnalysisSchema } from '../lib/analysis'
import { useAppStore } from '../store/useAppStore'
import type { DogAnalysis } from '../types'

export default function UnderstandDog() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [analysis, setAnalysis] = useState<DogAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geminiIssue, setGeminiIssue] = useState(false)
  const aiEnabled = useAppStore((state) => state.aiAnalysisEnabled)
  const geminiModel = useAppStore((state) => state.geminiModel)
  const controller = useRef<AbortController | null>(null)
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  useEffect(() => () => controller.current?.abort(), [])
  const choose = (selected?: File) => {
    if (!selected) return
    if (!aiEnabled) {
      setGeminiIssue(true)
      setError('Uh-oh! It looks like Gemini photo analysis is turned off. Enable it in Your preferences before uploading a photo.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 5_000_000) {
      setGeminiIssue(false)
      setError('Choose a JPG, PNG, or WebP image smaller than 5 MB.')
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(selected)); setFile(selected); setAnalysis(null); setError(''); setGeminiIssue(false)
  }
  const analyze = async () => {
    if (!file) return
    if (!aiEnabled) {
      setGeminiIssue(true)
      setError('Uh-oh! It looks like Gemini photo analysis is turned off. Enable it in Your preferences, then try again.')
      return
    }
    setLoading(true); setError(''); setGeminiIssue(false); controller.current = new AbortController()
    let timedOut = false
    const timeout = window.setTimeout(() => { timedOut = true; controller.current?.abort() }, 10_000)
    try {
      const body = new FormData(); body.append('image', file); body.append('model', geminiModel)
      const response = await fetch('/api/analyze-dog', { method: 'POST', body, signal: controller.current.signal })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error === 'analysis_unavailable' ? 'gemini_unconfigured' : 'request_failed')
      const parsed = dogAnalysisSchema.safeParse(payload)
      if (!parsed.success) throw new Error('invalid_response')
      setAnalysis(parsed.data)
    } catch (error_) {
      const issue = error_ as Error
      if (timedOut || issue.message === 'gemini_unconfigured') {
        setGeminiIssue(true)
        setError('Uh-oh! Gemini does not appear to be configured. Add GEMINI_API_KEY to the server environment, restart it, then try again.')
      } else if (issue.name !== 'AbortError') setError('We couldn’t analyse that image right now. Please try again shortly.')
    } finally {
      window.clearTimeout(timeout)
      setLoading(false)
    }
  }
  const reset = () => {
    controller.current?.abort()
    if (preview) URL.revokeObjectURL(preview)
    setFile(null); setPreview(''); setAnalysis(null); setError(''); setGeminiIssue(false)
  }
  if (loading) return <section className="section ai-loading"><div className="ai-orbit"><PipMascot mood="curious" size={300}/><span className="orbit-dot one"/><span className="orbit-dot two"/><span className="orbit-dot three"/></div><Eyebrow>Visible-signal analysis</Eyebrow><h1>Pip is checking the visible clues…</h1><p>This should only take a moment. A photo cannot determine whether a dog is safe or predict what it will do.</p></section>
  if (analysis) return <section className="section ai-results"><div className="results-heading"><div><Eyebrow><Eye size={15}/> Educational analysis</Eyebrow><h1>Here are the visible clues.</h1><p>This is one still moment—not a safety assessment.</p></div><Button className="button-secondary" onClick={reset}><RotateCcw size={17}/> Try another photo</Button></div><div className="results-grid"><div><div className="photo-card">{analysis.source === 'demo' ? <div className="demo-dog-visual"><DogCueAnimation cue="sample-loose" compact/></div> : <img src={preview} alt="Uploaded dog for body-language analysis"/>}<span>{analysis.source === 'demo' ? 'Sample illustration · seeded result' : 'Your photo'}</span></div></div><div className="result-stack"><Card className="result-card observe"><span className="feature-icon blue"><Eye/></span><div><Eyebrow>What we can observe</Eyebrow>{analysis.visibleSignals.map((signal) => <div className="signal-result" key={signal.signal}><span>🐾</span><div><strong>{signal.signal}</strong><p>{signal.explanation}</p><small>{signal.confidence} visual confidence</small></div></div>)}</div></Card><Card className="result-card"><span className="feature-icon yellow"><Lightbulb/></span><div><Eyebrow>What this might indicate</Eyebrow><p>{analysis.possibleInterpretation}</p></div></Card><Card className="result-card uncertainty"><span className="feature-icon lavender"><AlertCircle/></span><div><Eyebrow>What we cannot know</Eyebrow><ul>{analysis.uncertainties.map((item) => <li key={item}>{item}</li>)}</ul></div></Card><Card className="result-card action"><span className="feature-icon mint"><ShieldCheck/></span><div><Eyebrow>What you can do</Eyebrow><p>{analysis.recommendedAction}</p><small>{analysis.safetyNote}</small></div></Card></div></div></section>
  return <section className="section understand-page"><div className="page-intro"><div><Eyebrow><Camera size={15}/> Understand This Dog</Eyebrow><h1>What is this dog telling me?</h1><p>Upload a photo and explore visible body-language cues—with uncertainty made clear.</p></div><PipMascot mood="curious" size={180}/></div><div className="upload-layout"><Card className="upload-card">{preview ? <div className="image-preview"><img src={preview} alt="Selected dog"/><button type="button" className="remove-image" onClick={reset} aria-label="Remove selected image"><X/></button></div> : <label className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files[0]) }}><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => choose(event.target.files?.[0])}/><span className="upload-icon"><ImagePlus/></span><strong>Drop a dog photo here</strong><span>or choose an image</span><small>JPG, PNG or WebP · up to 5 MB</small></label>}{error && <div className={`error-message ${geminiIssue ? 'pip-config-message' : ''}`} role="alert">{geminiIssue ? <PipMascot mood="confused" size={105}/> : <AlertCircle/>}<div><strong>{error}</strong><span>{geminiIssue ? 'Your photo stays on this device.' : 'Your image has not been saved.'}</span>{geminiIssue && <Link to="/settings">Open Your preferences <ArrowRight size={15}/></Link>}</div></div>}<div className="upload-actions"><Button disabled={!file || !aiEnabled} onClick={analyze}><Upload size={18}/> Help me understand</Button><button type="button" className="text-button" onClick={() => { setAnalysis(demoAnalysis); setPreview('') }}>Try the labelled demo photo <ArrowRight size={15}/></button></div></Card><aside><Card><Eyebrow>Before you begin</Eyebrow><h3>A photo is a clue, not a guarantee.</h3><ul className="check-list"><li><ShieldCheck/> We describe visible signals only</li><li><ShieldCheck/> We use cautious language</li><li><ShieldCheck/> We always recommend safe space</li></ul></Card><Card className="privacy-card"><strong>Your privacy</strong><p>Photos are sent only when you choose “Help me understand” and are not stored by Pawsitive.</p></Card></aside></div>{error && !geminiIssue && <div className="button-row centered"><Button className="button-secondary" onClick={analyze}>Try again</Button><LinkButton to="/learn" variant="ghost">Continue learning</LinkButton></div>}</section>
}
