import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/content'
import { useAppStore, selectNextLesson } from '../store/useAppStore'
import { Card, Eyebrow, LessonTile, LinkButton, PawProgress, ProgressBar, SafetyDisclaimer } from '../components/ui'
import { PipMascot } from '../components/PipMascot'

export default function Learn() {
  const completed = useAppStore((state) => state.completedLessons)
  const person = lessons.filter((lesson) => lesson.perspective === 'person')
  const next = selectNextLesson(completed)
  const percent = completed.filter((id) => person.some((lesson) => lesson.id === id)).length / person.length * 100
  const modules = [...new Set(person.map((lesson) => lesson.module))]
  return <section className="section dashboard"><div className="page-intro"><div><Eyebrow><Sparkles size={15}/> Your learning path</Eyebrow><h1>Learn to read the clues.</h1><p>Small lessons, practical choices, and no pressure to interact.</p></div><PipMascot mood="calm" size={170}/></div><div className="dashboard-grid"><div className="main-column">{next ? <Card className="continue-card"><div><small>Continue learning · Lesson {person.findIndex((lesson) => lesson.id === next.id) + 1}</small><h2>{next.title}</h2><p>{next.description}</p><span className="meta"><Clock size={15}/> {next.durationMinutes} min</span></div><LinkButton to={`/learn/${next.id}`}>Continue <ArrowRight size={18}/></LinkButton></Card> : <Card className="continue-card complete-journey"><h2>You completed the beginner journey! 🐾</h2><p>Try the owner perspective or practise another scenario.</p><LinkButton to="/owners">Try owner perspective</LinkButton></Card>}{modules.map((module) => <div className="module" key={module}><div className="module-heading"><div><Eyebrow>Module {modules.indexOf(module) + 1}</Eyebrow><h2>{module}</h2></div><span>{person.filter((lesson) => lesson.module === module && completed.includes(lesson.id)).length}/{person.filter((lesson) => lesson.module === module).length}</span></div><div className="lesson-list">{person.filter((lesson) => lesson.module === module).map((lesson) => <LessonTile key={lesson.id} to={`/learn/${lesson.id}`} title={lesson.title} description={`${lesson.durationMinutes} min · Beginner`} complete={completed.includes(lesson.id)} index={person.indexOf(lesson) + 1}/>)}</div></div>)}</div><aside className="side-column"><Card className="progress-card"><Eyebrow>Your confidence journey</Eyebrow><h3>You’re {completed.filter((id) => person.some((lesson) => lesson.id === id)).length} paws in!</h3><ProgressBar value={percent} /><PawProgress current={completed.filter((id) => person.some((lesson) => lesson.id === id)).length}/><Link to="/progress">See all progress <ArrowRight size={15}/></Link></Card><SafetyDisclaimer /></aside></div></section>
}
