import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PipMascot } from '../components/PipMascot'
import { Button, Card, Eyebrow, SafetyDisclaimer } from '../components/ui'
import { scenarios } from '../data/content'
import { soundService } from '../services/sound'
import { useAppStore } from '../store/useAppStore'

export default function Scenario() {
  const { scenarioId } = useParams()
  const scenario = scenarios.find((item) => item.id === scenarioId)
  const [answer, setAnswer] = useState('')
  const [revealed, setRevealed] = useState(false)
  const complete = useAppStore((state) => state.completeScenario)
  const sound = useAppStore((state) => state.soundEnabled)
  const navigate = useNavigate()
  if (!scenario) return <section className="section empty-state"><h1>Scenario not found</h1><Link to="/scenarios">Return to scenarios</Link></section>
  const correct = answer === scenario.answer
  const reveal = () => { setRevealed(true); complete(scenario.id, correct); soundService.play(correct ? 'correct' : 'error-soft', sound) }
  return <section className="section scenario-page"><Link to="/scenarios" className="back-link"><ArrowLeft size={17}/> All scenarios</Link><div className="scenario-layout"><Card className="scenario-stage"><div className="scenario-title"><div><Eyebrow>{scenario.perspective === 'owner' ? 'You are the owner' : 'You are the person'}</Eyebrow><h1>{scenario.title}</h1><p>{scenario.description}</p></div><span className={`difficulty ${scenario.difficulty.toLowerCase()}`}>{scenario.difficulty}</span></div><div className="wide-scene"><span>🚶</span><div className="path-lines"/><span>🐕</span><span>🧑</span></div>{!revealed ? <><h2>What would you do?</h2><div className="option-list">{scenario.options.map((option) => <button key={option.id} className={`select-option compact ${answer === option.id ? 'selected' : ''}`} onClick={() => setAnswer(option.id)}><span className="option-letter">{option.id.toUpperCase()}</span><strong>{option.label}</strong>{answer === option.id && <Check/>}</button>)}</div><Button disabled={!answer} onClick={reveal}>Check my choice <ArrowRight size={18}/></Button></> : <div className="scenario-result" aria-live="polite"><PipMascot mood={correct ? 'happy' : 'curious'} size={160}/><div><Eyebrow>{correct ? 'Thoughtful choice' : 'Paws for thought'}</Eyebrow><h2>{correct ? 'You created space for everyone.' : 'Let’s try a calmer option.'}</h2><p>{scenario.explanation}</p>{scenario.safetyNote && <p className="safety-note"><strong>Safety note:</strong> {scenario.safetyNote}</p>}<div className="button-row">{!correct && <Button className="button-secondary" onClick={() => { setAnswer(''); setRevealed(false) }}><RotateCcw size={17}/> Try again</Button>}{scenario.pairedScenarioId ? <Button onClick={() => { setAnswer(''); setRevealed(false); navigate(`/scenarios/${scenario.pairedScenarioId}`) }}>Switch perspective <ArrowRight size={17}/></Button> : <Button onClick={() => navigate('/scenarios')}>Another scenario <ArrowRight size={17}/></Button>}</div></div></div>}</Card><aside><Card><Eyebrow>Same moment</Eyebrow><h3>Two perspectives.</h3><p>Space and clear boundaries can make an encounter easier for the person, owner, and dog.</p></Card><SafetyDisclaimer/></aside></div></section>
}
