import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, Lightbulb, ShieldCheck } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DogCueAnimation } from '../components/DogCueAnimation'
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

  if (!lesson) {
    return <section className="section empty-state"><h1>Lesson not found</h1><Link to="/learn">Return to learning</Link></section>
  }

  const selectedOption = lesson.options.find((option) => option.id === answer)
  const correct = answer === lesson.answer
  const steps = [
    <div className="lesson-step" key="situation">
      <Eyebrow>{lesson.perspective === 'owner' ? 'You are the owner' : 'You are the person'} · Situation</Eyebrow>
      <h1>{lesson.situation}</h1>
      <DogCueAnimation cue={lesson.cue}/>
      <p className="lesson-lead">Observe what is visible first. The animation demonstrates a cue, not a certain emotion or outcome.</p>
    </div>,
    <div className="lesson-step" key="what">
      <span className="feature-icon blue"><Eye/></span>
      <Eyebrow>What should I notice?</Eyebrow>
      <h1>Start with observable clues.</h1>
      <p className="lesson-guidance">{lesson.what}</p>
      <div className="clue-grid">
        {lesson.observations.map((item, index) => <Card key={item}><span>{index + 1}</span><strong>{item}</strong></Card>)}
      </div>
    </div>,
    <div className="lesson-step" key="why">
      <span className="feature-icon yellow"><Lightbulb/></span>
      <Eyebrow>Why does this matter?</Eyebrow>
      <h1>Clues make sense together.</h1>
      <Card className="teaching-card"><p>{lesson.meaning}</p></Card>
      <p className="lesson-guidance">{lesson.why}</p>
      <p className="context-note">Body cues such as stiffness, staring, or fast movement can signal arousal or discomfort, but should not be labelled “anger” from appearance alone.</p>
    </div>,
    <div className="lesson-step" key="how">
      <span className="feature-icon mint"><ShieldCheck/></span>
      <Eyebrow>How can I respond?</Eyebrow>
      <h1>Choose a practical next step.</h1>
      <Card className="teaching-card action"><p>{lesson.action}</p></Card>
      <p className="lesson-guidance">{lesson.how}</p>
    </div>,
    <div className="lesson-step quiz-step" key="quiz">
      <Eyebrow>Quick check</Eyebrow>
      <h1>What best applies this lesson?</h1>
      <div className="option-list">
        {lesson.options.map((option) => (
          <button
            type="button"
            key={option.id}
            className={`select-option compact ${answer === option.id ? 'selected' : ''}`}
            onClick={() => setAnswer(option.id)}
          >
            <span className="option-letter">{option.id.toUpperCase()}</span>
            <strong>{option.label}</strong>
            {answer === option.id && <Check/>}
          </button>
        ))}
      </div>
      {answer && (
        <Card className={`feedback ${correct ? 'correct' : 'gentle'}`} aria-live="polite">
          <PipMascot mood={correct ? 'happy' : 'curious'} size={105}/>
          <div>
            <strong>{correct ? 'Nice choice! 🐾' : 'Let’s think that through.'}</strong>
            <p>{selectedOption?.teaching}</p>
            <small>{correct ? lesson.explanation : 'Choose another answer when you are ready—there is no penalty.'}</small>
          </div>
        </Card>
      )}
    </div>,
    <div className="lesson-step completion" key="completion">
      <PipMascot mood="celebrating" size={245}/>
      <Eyebrow>Lesson complete</Eyebrow>
      <h1>One idea to carry with you.</h1>
      <Card className="takeaway-card"><Eyebrow>Remember</Eyebrow><p>{lesson.takeaway}</p></Card>
      <Card className="confidence-bump"><span>Confidence</span><strong>+5</strong><small>One small step at a time.</small></Card>
    </div>,
  ]

  const next = () => {
    if (step === 4 && correct) {
      complete(lesson.id)
      soundService.play('complete', sound)
    }
    setStep((value) => Math.min(5, value + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const finish = () => navigate(lesson.perspective === 'owner' ? '/owners' : '/learn')

  return (
    <section className="lesson-page section">
      <div className="lesson-top"><Link to={lesson.perspective === 'owner' ? '/owners' : '/learn'}><ArrowLeft size={17}/> Exit lesson</Link><span>{lesson.title}</span></div>
      <ProgressBar value={(step + 1) / 6 * 100} label={`Lesson step ${step + 1} of 6`}/>
      <div className="lesson-layout">
        <Card className="lesson-stage">
          {steps[step]}
          <div className="lesson-controls">
            {step > 0 && step < 5 && <Button className="button-ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={18}/> Back</Button>}
            {step < 5 ? <Button disabled={step === 4 && !correct} onClick={next}>{step === 4 ? 'Complete lesson' : 'Continue'} <ArrowRight size={18}/></Button> : <Button onClick={finish}>Back to journey <ArrowRight size={18}/></Button>}
          </div>
        </Card>
        <aside>
          <Card><Eyebrow>Today’s idea</Eyebrow><h3>{lesson.title}</h3><p>{lesson.description}</p><strong className="mini-takeaway">{lesson.takeaway}</strong></Card>
          <SafetyDisclaimer/>
        </aside>
      </div>
    </section>
  )
}
