import { Award, BookOpen, RotateCcw, Sparkles } from 'lucide-react'
import { achievements, lessons, scenarios } from '../data/content'
import { PipMascot } from '../components/PipMascot'
import { Button, Card, Eyebrow, LinkButton, PawProgress, ProgressBar } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export default function Progress() {
  const completedLessons = useAppStore((state) => state.completedLessons)
  const completedScenarios = useAppStore((state) => state.completedScenarios)
  const confidence = useAppStore((state) => state.confidence)
  const reset = useAppStore((state) => state.reset)
  const personDone = lessons.filter((lesson) => lesson.perspective === 'person' && completedLessons.includes(lesson.id)).length
  const earned = new Set<string>()
  if (completedLessons.length) earned.add('first-step')
  if (personDone >= 5) earned.add('dog-detective')
  if (completedScenarios.length >= 5) earned.add('situation-ready')
  if (completedScenarios.includes('footpath-person') && completedScenarios.includes('footpath-owner')) earned.add('perspective-shift')
  if (personDone >= 10) earned.add('growing-confidence')
  const overall = (completedLessons.length + completedScenarios.length) / (lessons.length + scenarios.length) * 100
  return <section className="section progress-page"><div className="page-intro progress-intro"><div><Eyebrow><Sparkles size={15}/> Your journey</Eyebrow><h1>{completedLessons.length ? 'Look how far you’ve come.' : 'Your journey starts here.'}</h1><p>Progress is information, not pressure. Every small step counts.</p></div><PipMascot mood={completedLessons.length ? 'happy' : 'calm'} size={180}/></div><div className="progress-overview"><Card className="journey-card"><Eyebrow>Overall journey</Eyebrow><h2>{Math.round(overall)}% explored</h2><ProgressBar value={overall}/><PawProgress current={personDone}/></Card><Card className="stat-card blue"><BookOpen/><strong>{completedLessons.length}</strong><span>Lessons completed</span><small>of {lessons.length} available</small></Card><Card className="stat-card coral"><Sparkles/><strong>{completedScenarios.length}</strong><span>Scenarios completed</span><small>of {scenarios.length} available</small></Card><Card className="stat-card mint"><Award/><strong>{confidence}%</strong><span>Current confidence</span><small>A personal reflection, not a clinical score</small></Card></div><div className="achievements-section"><div className="module-heading"><div><Eyebrow>Gentle milestones</Eyebrow><h2>Your achievements</h2></div><span>{earned.size}/{achievements.length} unlocked</span></div><div className="achievement-grid">{achievements.map((achievement) => <Card className={earned.has(achievement.id) ? 'achievement earned' : 'achievement'} key={achievement.id}><span>{earned.has(achievement.id) ? achievement.icon : '○'}</span><div><h3>{achievement.title}</h3><p>{achievement.description}</p></div>{earned.has(achievement.id) && <small>Unlocked</small>}</Card>)}</div></div>{completedLessons.length === 0 ? <div className="empty-cta"><PipMascot mood="curious" size={150}/><div><h2>Your first lesson is ready.</h2><p>Start with a two-minute introduction to how dogs communicate.</p><LinkButton to="/learn">Start learning</LinkButton></div></div> : <div className="button-row centered"><LinkButton to="/learn">Keep learning</LinkButton><Button className="button-ghost" onClick={() => { if (window.confirm('Reset all Pawsitive progress and preferences?')) reset() }}><RotateCcw size={16}/> Reset demo</Button></div>}</section>
}
