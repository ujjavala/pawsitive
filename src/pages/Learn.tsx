import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lessons } from '../data/content'
import { useAppStore, selectNextLesson } from '../store/useAppStore'
import { Card, Eyebrow, LessonTile, LinkButton, PawProgress, ProgressBar, SafetyDisclaimer } from '../components/ui'
import { PipMascot } from '../components/PipMascot'

const moduleGuidance: Record<string, { goal: string; method: string; outcome: string }> = {
  'Understanding Dogs': {
    goal: 'What: notice posture, movement, attention, sound, and distance as a connected pattern.',
    method: 'How: practise describing visible cues without jumping to a label such as “friendly” or “angry.”',
    outcome: 'Why: careful observation makes uncertainty easier to manage and helps you choose space sooner.',
  },
  'Meeting Dogs Safely': {
    goal: 'What: recognise your choices when a dog, owner, or invitation comes closer.',
    method: 'How: use early movement, clear words, and comfortable distance to keep interaction optional.',
    outcome: 'Why: a simple plan reduces last-second reactions and protects your right not to greet a dog.',
  },
}

export default function Learn() {
  const completed = useAppStore((state) => state.completedLessons)
  const person = lessons.filter((lesson) => lesson.perspective === 'person')
  const next = selectNextLesson(completed)
  const completedCount = completed.filter((id) => person.some((lesson) => lesson.id === id)).length
  const percent = completedCount / person.length * 100
  const modules = [...new Set(person.map((lesson) => lesson.module))]

  return (
    <section className="section dashboard">
      <div className="page-intro">
        <div><Eyebrow><Sparkles size={15}/> Your learning path</Eyebrow><h1>Learn to read the clues.</h1><p>First understand what you can observe and why it matters. Then practise how to respond without pressure to interact.</p></div>
        <PipMascot mood="calm" size={170}/>
      </div>
      <div className="dashboard-grid">
        <div className="main-column">
          {next ? (
            <Card className="continue-card">
              <div><small>Continue learning · Lesson {person.findIndex((lesson) => lesson.id === next.id) + 1}</small><h2>{next.title}</h2><p>{next.description}</p><span className="meta"><Clock size={15}/> {next.durationMinutes} min</span></div>
              <LinkButton to={`/learn/${next.id}`}>Continue <ArrowRight size={18}/></LinkButton>
            </Card>
          ) : (
            <Card className="continue-card complete-journey"><h2>You completed the beginner journey! 🐾</h2><p>Try the owner perspective or apply the What–Why–How method in a scenario.</p><LinkButton to="/owners">Try owner perspective</LinkButton></Card>
          )}

          {modules.map((module, moduleIndex) => {
            const moduleLessons = person.filter((lesson) => lesson.module === module)
            const moduleDone = moduleLessons.filter((lesson) => completed.includes(lesson.id)).length
            const guidance = moduleGuidance[module]
            return (
              <div className="module" key={module}>
                <div className="module-heading"><div><Eyebrow>Module {moduleIndex + 1}</Eyebrow><h2>{module}</h2></div><span>{moduleDone}/{moduleLessons.length}</span></div>
                {guidance && <Card className="module-guide"><p><strong>{guidance.goal.split(': ')[0]}:</strong> {guidance.goal.split(': ')[1]}</p><p><strong>{guidance.method.split(': ')[0]}:</strong> {guidance.method.split(': ')[1]}</p><p><strong>{guidance.outcome.split(': ')[0]}:</strong> {guidance.outcome.split(': ')[1]}</p></Card>}
                <div className="lesson-list">
                  {moduleLessons.map((lesson) => <LessonTile key={lesson.id} to={`/learn/${lesson.id}`} title={lesson.title} description={`${lesson.durationMinutes} min · ${lesson.description}`} complete={completed.includes(lesson.id)} index={person.indexOf(lesson) + 1}/>) }
                </div>
              </div>
            )
          })}
        </div>
        <aside className="side-column">
          <Card className="progress-card"><Eyebrow>Your confidence journey</Eyebrow><h3>You’re {completedCount} paws in!</h3><ProgressBar value={percent}/><PawProgress current={completedCount}/><Link to="/progress">See all progress <ArrowRight size={15}/></Link></Card>
          <Card><Eyebrow>The learning method</Eyebrow><h3>What → Why → How</h3><p>Observe the cue, understand its limits, then choose a calm action you can actually use.</p></Card>
          <SafetyDisclaimer/>
        </aside>
      </div>
    </section>
  )
}
