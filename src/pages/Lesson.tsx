import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, Lightbulb, ShieldCheck } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PipMascot } from '../components/PipMascot'
import { Button, Card, Eyebrow, ProgressBar, SafetyDisclaimer } from '../components/ui'
import { lessons } from '../data/content'
import { soundService } from '../services/sound'
import { useAppStore } from '../store/useAppStore'

export default function Lesson() {
  const { lessonId } = useParams()
  const lesson = lessons.find((item) => item.id === lessonId)
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState('')
  const complete = useAppStore((state) => state.completeLesson)
  const sound = useAppStore((state) => state.soundEnabled)
  const navigate = useNavigate()
  if (!lesson) return <section className="section empty-state"><h1>Lesson not found</h1><Link to="/learn">Return to learning</Link></section>
  const steps = [
    <div className="lesson-step"><Eyebrow>Situation</Eyebrow><h1>{lesson.situation}</h1><PipMascot mood="calm" size={280}/><p className="lesson-lead">Take a moment. There’s no need to decide how the dog feels.</p></div>,
    <div className="lesson-step"><span className="feature-icon blue"><Eye/></span><Eyebrow>What are you noticing?</Eyebrow><h1>Look at the whole dog.</h1><div className="clue-grid">{lesson.observations.map((item, index) => <Card key={item}><span>{index + 1}</span><strong>{item}</strong></Card>)}</div></div>,
    <div className="lesson-step"><span className="feature-icon yellow"><Lightbulb/></span><Eyebrow>What might this mean?</Eyebrow><h1>Clues make sense together.</h1><Card className="teaching-card"><p>{lesson.meaning}</p></Card><p className="context-note">Remember: look at the whole dog and the context.</p></div>,
    <div className="lesson-step"><span className="feature-icon mint"><ShieldCheck/></span><Eyebrow>What can you do?</Eyebrow><h1>Choose space and calm movement.</h1><Card className="teaching-card action"><p>{lesson.action}</p></Card></div>,
    <div className="lesson-step quiz-step"><Eyebrow>Quick check</Eyebrow><h1>What is the most considerate response?</h1><div className="option-list">{lesson.options.map((option) => <button key={option.id} className={`select-option compact ${answer === option.id ? 'selected' : ''}`} onClick={() => setAnswer(option.id)}><span className="option-letter">{option.id.toUpperCase()}</span><strong>{option.label}</strong>{answer === option.id && <Check/>}</button>)}</div>{answer && <Card className={`feedback ${answer === lesson.answer ? 'correct' : 'gentle'}`} aria-live="polite"><PipMascot mood={answer === lesson.answer ? 'happy' : 'curious'} size={105}/><div><strong>{answer === lesson.answer ? 'Nice choice! 🐾' : 'Not quite. Let’s look at a calmer option.'}</strong><p>{lesson.explanation}</p></div></Card>}</div>,
    <div className="lesson-step completion"><PipMascot mood="celebrating" size={245}/><Eyebrow>Lesson complete</Eyebrow><h1>Nice work! 🐾</h1><p>You learned to notice clues without treating them as guarantees.</p><Card className="confidence-bump"><span>Confidence</span><strong>+5</strong><small>One small step at a time.</small></Card></div>,
  ]
  const next = () => { if (step === 4 && answer === lesson.answer) { complete(lesson.id); soundService.play('complete', sound) } setStep((value) => Math.min(5, value + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const finish = () => navigate(lesson.perspective === 'owner' ? '/owners' : '/learn')
  return <section className="lesson-page section"><div className="lesson-top"><Link to={lesson.perspective === 'owner' ? '/owners' : '/learn'}><ArrowLeft size={17}/> Exit lesson</Link><span>{lesson.title}</span></div><ProgressBar value={(step + 1) / 6 * 100} label={`Lesson step ${step + 1} of 6`}/><div className="lesson-layout"><Card className="lesson-stage">{steps[step]}<div className="lesson-controls">{step > 0 && step < 5 && <Button className="button-ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={18}/> Back</Button>}{step < 5 ? <Button disabled={step === 4 && !answer} onClick={next}>{step === 4 ? 'See result' : 'Continue'} <ArrowRight size={18}/></Button> : <Button onClick={finish}>Back to journey <ArrowRight size={18}/></Button>}</div></Card><aside><Card><Eyebrow>Today’s idea</Eyebrow><h3>{lesson.title}</h3><p>{lesson.description}</p></Card><SafetyDisclaimer/></aside></div></section>
}
