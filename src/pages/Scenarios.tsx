import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DogCueAnimation } from '../components/DogCueAnimation'
import { Card, Eyebrow, SafetyDisclaimer } from '../components/ui'
import { PipMascot } from '../components/PipMascot'
import { scenarios } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function Scenarios() {
  const completed = useAppStore((state) => state.completedScenarios)
  return <section className="section"><div className="page-intro scenario-intro"><div><Eyebrow><Sparkles size={15}/> What Would You Do?</Eyebrow><h1>Practise the moment before it happens.</h1><p>Choose a calm response, see why it helps, and switch perspectives.</p></div><PipMascot mood="curious" size={180}/></div><div className="scenario-grid">{scenarios.map((scenario, index) => <Link key={scenario.id} to={`/scenarios/${scenario.id}`} className="scenario-link"><Card><div className="scenario-scene scenario-cue-preview"><DogCueAnimation cue={scenario.cue} compact/></div><div className="scenario-meta"><span className={`difficulty ${scenario.difficulty.toLowerCase()}`}>{scenario.difficulty}</span><span>{scenario.perspective === 'owner' ? 'Owner perspective' : 'Person perspective'}</span></div><h2>{scenario.title}</h2><p>{scenario.description}</p><div className="scenario-footer"><span>{completed.includes(scenario.id) ? '✓ Completed' : `Scenario ${index + 1}`}</span><ArrowRight/></div></Card></Link>)}</div><SafetyDisclaimer/></section>
}
