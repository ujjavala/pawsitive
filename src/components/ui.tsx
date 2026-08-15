import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, LockKeyhole } from 'lucide-react'
import { motion } from 'motion/react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`card ${className}`} {...props} /> }
export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`button ${className}`} {...props} /> }
export function LinkButton({ to, children, variant = 'primary' }: { to: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' }) { return <Link className={`button button-${variant}`} to={to}>{children}</Link> }
export function Eyebrow({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span> }

export function ProgressBar({ value, label = 'Progress' }: { value: number; label?: string }) {
  const safe = Math.min(100, Math.max(0, value))
  return <div className="progress-wrap"><div className="progress-label"><span>{label}</span><strong>{Math.round(safe)}%</strong></div><div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(safe)}><motion.div className="progress-fill" initial={{ scaleX: 0 }} animate={{ scaleX: safe / 100 }} /></div></div>
}

export function PawProgress({ current, total = 10 }: { current: number; total?: number }) {
  return <div className="paw-progress" aria-label={`${current} of ${total} lessons complete`}>{Array.from({ length: total }, (_, index) => <span key={index} className={index < current ? 'paw done' : 'paw'} aria-hidden="true">{index < current ? '🐾' : '○'}</span>)}</div>
}

export function LessonTile({ to, title, description, complete, locked = false, index }: { to: string; title: string; description: string; complete: boolean; locked?: boolean; index: number }) {
  return <Link to={locked ? '#' : to} aria-disabled={locked} className={`lesson-tile ${complete ? 'complete' : ''} ${locked ? 'locked' : ''}`}><span className="lesson-number">{complete ? <Check size={18} /> : locked ? <LockKeyhole size={18} /> : index}</span><span><strong>{title}</strong><small>{description}</small></span></Link>
}

export function SafetyDisclaimer() { return <aside className="safety-disclaimer"><strong>Learning tool:</strong> not professional animal-behaviour or emergency advice. Never assume an unfamiliar dog is safe to approach. When in doubt, give the dog space.</aside> }
