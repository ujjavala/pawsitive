import { ArrowRight, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PipMascot } from '../components/PipMascot'
import { Card, Eyebrow, LessonTile, LinkButton, ProgressBar, SafetyDisclaimer } from '../components/ui'
import { lessons, scenarios } from '../data/content'
import { useAppStore } from '../store/useAppStore'

export default function Owners() {
  const completed = useAppStore((state) => state.completedLessons)
  const ownerLessons = lessons.filter((lesson) => lesson.perspective === 'owner')
  const done = ownerLessons.filter((lesson) => completed.includes(lesson.id)).length
  const ownerScenarios = scenarios.filter((scenario) => scenario.perspective === 'owner')
  return <section className="section owner-page"><div className="owner-hero"><div><Eyebrow><HeartHandshake size={16}/> For dog owners</Eyebrow><h1>Help your dog feel easier to be around.</h1><p>You know your dog is friendly. A stranger may not know that yet. Small choices can help everyone share space comfortably.</p><LinkButton to={`/learn/${ownerLessons.find((lesson) => !completed.includes(lesson.id))?.id ?? ownerLessons[0].id}`}>{done ? 'Continue owner journey' : 'Start owner journey'} <ArrowRight size={18}/></LinkButton></div><PipMascot mood="happy" size={300}/></div><div className="owner-grid"><div><div className="module-heading"><div><Eyebrow>Owner learning path</Eyebrow><h2>Thoughtful ownership</h2></div><span>{done}/{ownerLessons.length}</span></div><div className="lesson-list">{ownerLessons.map((lesson, index) => <LessonTile key={lesson.id} to={`/learn/${lesson.id}`} title={lesson.title} description={lesson.description} index={index + 1} complete={completed.includes(lesson.id)}/>)}</div></div><aside><Card className="progress-card"><Eyebrow>Your owner journey</Eyebrow><h3>Space is a kindness.</h3><ProgressBar value={done / ownerLessons.length * 100}/><p>Not everyone wants to interact with a dog—and that’s okay.</p></Card><Card><Eyebrow>Try a scenario</Eyebrow><h3>{ownerScenarios[0].title}</h3><p>{ownerScenarios[0].description}</p><Link to={`/scenarios/${ownerScenarios[0].id}`}>Practise now <ArrowRight size={15}/></Link></Card><SafetyDisclaimer/></aside></div></section>
}
