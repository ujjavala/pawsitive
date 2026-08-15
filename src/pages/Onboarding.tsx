import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PipMascot } from '../components/PipMascot'
import { Button, Card, Eyebrow, ProgressBar } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

const comfortOptions = [{ value: 20, icon: '😰', label: 'Very nervous' }, { value: 40, icon: '😟', label: 'A little nervous' }, { value: 50, icon: '😐', label: 'Unsure' }, { value: 70, icon: '🙂', label: 'Mostly comfortable' }, { value: 85, icon: '🐕', label: 'Very comfortable' }]
const situations = ['Dog walking toward me', 'Dog barking', 'Dog jumping', 'Large dogs', 'Dogs running freely', 'Dogs staring at me', 'Being asked to pet a dog', 'Dogs approaching while I’m walking', 'I don’t know']
const goals = ['Feel safer walking outside', 'Understand dog behaviour', 'Stop panicking around dogs', 'Feel comfortable visiting dog owners', 'Eventually interact with dogs', 'Just understand dogs better']

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [comfort, setComfort] = useState<number | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const setOnboarding = useAppStore((state) => state.setOnboarding)
  const navigate = useNavigate()
  const canContinue = step === 1 ? comfort !== null : step === 2 ? selected.length > 0 : goal.length > 0
  const toggle = (item: string) => setSelected((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item])
  const finish = () => { if (comfort === null) return; setOnboarding({ comfort, situations: selected, goal }); setStep(4) }
  return <section className="onboarding-page section"><div className="onboarding-aside"><PipMascot mood={step === 4 ? 'celebrating' : 'curious'} size={240}/><p>{step === 1 ? 'It’s okay to feel nervous.' : step === 2 ? 'You choose what to share.' : step === 3 ? 'There’s no “right” goal.' : 'Your path is ready!'}</p></div><Card className="onboarding-card"><ProgressBar value={step === 4 ? 100 : step * 25} label="Onboarding" />{step < 4 && <><Eyebrow>Question {step} of 3</Eyebrow><h1>{step === 1 ? 'How do you currently feel around unfamiliar dogs?' : step === 2 ? 'What situations make you most uncomfortable?' : 'What would you like to achieve?'}</h1>{step === 1 && <div className="option-list" role="radiogroup" aria-label="Comfort around unfamiliar dogs">{comfortOptions.map((option) => <button type="button" role="radio" aria-checked={comfort === option.value} className={`select-option ${comfort === option.value ? 'selected' : ''}`} onClick={() => setComfort(option.value)} key={option.value}><span>{option.icon}</span><strong>{option.label}</strong>{comfort === option.value && <Check />}</button>)}</div>}{step === 2 && <div className="chip-grid" aria-label="Uncomfortable situations">{situations.map((item) => <button type="button" aria-pressed={selected.includes(item)} className={selected.includes(item) ? 'chip selected' : 'chip'} onClick={() => toggle(item)} key={item}>{item}{selected.includes(item) && <Check size={16}/>}</button>)}</div>}{step === 3 && <div className="option-list" role="radiogroup" aria-label="Learning goal">{goals.map((item) => <button type="button" role="radio" aria-checked={goal === item} className={`select-option compact ${goal === item ? 'selected' : ''}`} onClick={() => setGoal(item)} key={item}><strong>{item}</strong>{goal === item && <Check />}</button>)}</div>}<div className="onboarding-actions">{step > 1 && <Button className="button-ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={18}/> Back</Button>}<Button disabled={!canContinue} onClick={() => step === 3 ? finish() : setStep(step + 1)}>{step === 3 ? 'See my starting point' : 'Continue'} <ArrowRight size={18}/></Button></div></>}{step === 4 && <div className="starting-point"><span className="celebrate-icon">🐾</span><Eyebrow>Your starting point</Eyebrow><h1>Let’s begin with the clues dogs use.</h1><p>We’ll start with whole-body language before moving into real-world situations. You control the pace, and you can stop at any time.</p><div className="path-preview"><span>1</span><div><strong>Dogs communicate differently</strong><small>About 2 minutes · Beginner</small></div></div><Button onClick={() => navigate('/learn')}>Begin my journey <ArrowRight size={18}/></Button></div>}</Card></section>
}
