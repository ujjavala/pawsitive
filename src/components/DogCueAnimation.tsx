import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { DogCue } from '../types'

type CueConfig = {
  label: string
  note: string
  bodyX: number[]
  bodyY: number[]
  bodyRotate: number[]
  headRotate: number[]
  tailRotate: number[]
  duration: number
  showPerson: boolean
  showBark: boolean
  showStress: boolean
  showFocus: boolean
  personX: number[]
}

const still = [0, 0, 0]
const cueConfig: Record<DogCue, CueConfig> = {
  'whole-body': { label: 'Watch the whole pattern', note: 'Body, face, movement, and context belong together.', bodyX: still, bodyY: [0, -2, 0], bodyRotate: [-1, 1, -1], headRotate: [-2, 3, -2], tailRotate: [-7, 10, -7], duration: 2.5, showPerson: false, showBark: false, showStress: false, showFocus: false, personX: still },
  'loose-stiff': { label: 'Loose movement and held stillness', note: 'Stiffness is a reason to add space—not proof of anger.', bodyX: still, bodyY: [0, -1, 0], bodyRotate: [0, .5, 0], headRotate: [0, 1, 0], tailRotate: [0, 2, 0], duration: 3.2, showPerson: false, showBark: false, showStress: false, showFocus: true, personX: still },
  tail: { label: 'A moving tail is one clue', note: 'Compare the tail with tension through the rest of the body.', bodyX: still, bodyY: still, bodyRotate: still, headRotate: still, tailRotate: [-24, 27, -24], duration: .65, showPerson: false, showBark: false, showStress: false, showFocus: false, personX: still },
  bark: { label: 'Sound needs context', note: 'Barking can accompany several different states.', bodyX: still, bodyY: still, bodyRotate: still, headRotate: [-3, 5, -3], tailRotate: still, duration: .8, showPerson: false, showBark: true, showStress: false, showFocus: false, personX: still },
  focus: { label: 'Focused and still', note: 'A fixed look shows attention, not a certain intention.', bodyX: still, bodyY: still, bodyRotate: still, headRotate: still, tailRotate: still, duration: 2, showPerson: true, showBark: false, showStress: false, showFocus: true, personX: still },
  space: { label: 'Turning and shifting away', note: 'Several distancing cues together can suggest more room would help.', bodyX: [8, -16, 8], bodyY: still, bodyRotate: [0, -2, 0], headRotate: [0, -13, 0], tailRotate: [0, -14, 0], duration: 2.7, showPerson: true, showBark: false, showStress: true, showFocus: false, personX: still },
  choice: { label: 'Interaction stays optional', note: 'Pause at a comfortable distance and wait for clear consent.', bodyX: still, bodyY: still, bodyRotate: still, headRotate: [-2, 2, -2], tailRotate: [-4, 5, -4], duration: 2.8, showPerson: true, showBark: false, showStress: false, showFocus: false, personX: still },
  passing: { label: 'Create a calm passing lane', note: 'Position and distance communicate reassurance better than words.', bodyX: [-22, 18, -22], bodyY: [0, -2, 0], bodyRotate: still, headRotate: [-2, 2, -2], tailRotate: [-5, 7, -5], duration: 3.4, showPerson: true, showBark: false, showStress: false, showFocus: false, personX: still },
  approach: { label: 'Notice movement early', note: 'An early step aside avoids a rushed reaction later.', bodyX: [-36, 22, -36], bodyY: [0, -2, 0], bodyRotate: still, headRotate: still, tailRotate: [-8, 11, -8], duration: 3, showPerson: true, showBark: false, showStress: false, showFocus: false, personX: still },
  leave: { label: 'A steady exit is a valid choice', note: 'You do not need certainty before choosing more distance.', bodyX: still, bodyY: still, bodyRotate: still, headRotate: still, tailRotate: [-3, 3, -3], duration: 3.3, showPerson: true, showBark: false, showStress: false, showFocus: false, personX: [0, 34, 0] },
  excited: { label: 'Fast movement needs management', note: 'Playful intent does not make rushing or jumping comfortable for others.', bodyX: [-10, 18, -10], bodyY: [0, -18, 0], bodyRotate: [0, -5, 0], headRotate: [-4, 7, -4], tailRotate: [-25, 28, -25], duration: 1.1, showPerson: true, showBark: false, showStress: false, showFocus: false, personX: still },
  stress: { label: 'Notice changes and clusters', note: 'Turning away, scanning, or tension may mean the situation is getting harder.', bodyX: [5, -9, 5], bodyY: still, bodyRotate: [0, -1, 0], headRotate: [0, -12, 4, 0], tailRotate: [0, -12, 0], duration: 2.9, showPerson: false, showBark: false, showStress: true, showFocus: true, personX: still },
  consent: { label: 'A yes can become a no', note: 'Stepping back or freezing is a cue to pause and restore space.', bodyX: still, bodyY: still, bodyRotate: still, headRotate: [-2, 1, -2], tailRotate: [-3, 4, -3], duration: 2.7, showPerson: true, showBark: false, showStress: false, showFocus: false, personX: [0, 28, 0] },
}

function PersonFigure({ active, x }: Readonly<{ active: boolean; x: number[] }>) {
  return <motion.g className="cue-person" animate={{ x: active ? x : still }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
    <path d="M491 67 L491 78 L508 78 L508 65" fill="#f4bf8b" stroke="#9f663e" strokeWidth="2"/>
    <circle cx="499" cy="48" r="20" fill="#f4bf8b" stroke="#9f663e" strokeWidth="2"/>
    <path d="M481 47 Q481 25 500 25 Q519 27 520 46 Q510 37 499 38 Q489 39 481 47 Z" fill="#604334"/>
    <circle cx="516" cy="50" r="5" fill="#edaa72" stroke="#9f663e" strokeWidth="1.5"/>
    <path d="M484 44 Q489 41 493 44" fill="none" stroke="#604334" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="488" cy="48" r="2.4" fill="#263238"/>
    <path d="M484 59 Q491 65 498 59" fill="none" stroke="#8c512f" strokeWidth="2" strokeLinecap="round"/>
    <path d="M487 76 Q499 72 512 77 Q522 91 520 142 Q500 153 479 142 Q477 96 487 76 Z" fill="#6ecbf5" stroke="#3c7f9c" strokeWidth="3"/>
    <path d="M483 87 Q468 104 458 130" fill="none" stroke="#6ecbf5" strokeWidth="13" strokeLinecap="round"/>
    <path d="M458 130 Q453 139 457 146" fill="none" stroke="#f4bf8b" strokeWidth="10" strokeLinecap="round"/>
    <path d="M516 88 Q528 107 528 132" fill="none" stroke="#6ecbf5" strokeWidth="13" strokeLinecap="round"/>
    <path d="M528 132 Q530 142 525 148" fill="none" stroke="#f4bf8b" strokeWidth="10" strokeLinecap="round"/>
    <path d="M481 140 Q500 147 519 140 L517 160 L508 211 L493 211 L488 161 L475 211 L460 211 L478 145 Z" fill="#536166" stroke="#3b474b" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M458 211 L477 211 Q480 218 472 222 L456 222 Q452 218 458 211 Z M491 211 L510 211 Q515 218 506 222 L490 222 Q486 218 491 211 Z" fill="#38556a"/>
  </motion.g>
}

function CueDetails({ config, active }: Readonly<{ config: CueConfig; active: boolean }>) {
  return <>
    {config.showPerson && <PersonFigure active={active} x={config.personX}/>} 
    {config.showBark && <g fill="none" stroke="#ff7a6b" strokeWidth="5" strokeLinecap="round"><motion.path d="M339 145 Q361 157 341 172" animate={{ opacity: active ? [0, 1, 0] : 1, x: active ? [0, 10, 21] : 0 }} transition={{ duration: 1.1, repeat: Infinity }}/><motion.path d="M351 125 Q384 152 355 189" animate={{ opacity: active ? [0, 1, 0] : 1, x: active ? [0, 8, 18] : 0 }} transition={{ duration: 1.1, repeat: Infinity, delay: .18 }}/></g>}
    {config.showStress && <motion.g animate={{ opacity: active ? [.25, 1, .25] : 1 }} transition={{ duration: 1.8, repeat: Infinity }}><path d="M121 153 Q108 136 115 123" fill="none" stroke="#7b6bc7" strokeWidth="5" strokeLinecap="round"/><path d="M140 148 Q138 127 150 118" fill="none" stroke="#7b6bc7" strokeWidth="5" strokeLinecap="round"/></motion.g>}
  </>
}

export function DogCueAnimation({ cue, compact = false }: Readonly<{ cue: DogCue; compact?: boolean }>) {
  const systemReduced = useReducedMotion()
  const appReduced = useAppStore((state) => state.reducedMotion)
  const active = !systemReduced && !appReduced
  const config = cueConfig[cue]
  const gradientId = useId().replaceAll(':', '')
  const blink = config.showFocus ? [1, 1, .25, 1] : [1, 1, .08, 1]

  return (
    <figure className={`dog-cue ${compact ? 'dog-cue--compact' : ''}`} aria-label={`${config.label}. ${config.note}`}>
      <svg viewBox="0 0 600 255" role="img" aria-hidden="true">
        <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d69a61"/><stop offset="1" stopColor="#a96336"/></linearGradient></defs>
        <path className="cue-ground" d="M48 219 C174 207 405 226 556 211"/>
        <g className="cue-dog" transform="translate(35 82) scale(.62)">
        <motion.g animate={{ x: active ? config.bodyX : still, y: active ? config.bodyY : still, rotate: active ? config.bodyRotate : still }} transition={{ duration: config.duration, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '285px 160px' }}>
          <motion.path d="M190 159 C158 158 140 141 143 116 C146 93 167 82 183 98" fill="none" stroke="#8c512f" strokeWidth="22" strokeLinecap="round" animate={{ rotate: active ? config.tailRotate : still }} transition={{ duration: config.duration, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '190px 159px' }}/>
          <path d="M181 159 C186 125 228 108 289 111 C337 113 369 133 372 165 C375 195 341 207 291 207 L235 205 C197 201 175 183 181 159 Z" fill={`url(#${gradientId})`} stroke="#5f3925" strokeWidth="5"/>
          <path d="M203 157 Q215 129 247 119" fill="none" stroke="#e8b47b" strokeWidth="8" strokeLinecap="round" opacity=".42"/>
          <path d="M214 191 L207 226 Q207 235 219 235 L230 235 M260 199 L258 228 Q258 236 270 236 L281 236 M322 198 L330 228 Q332 236 344 235 L354 234 M354 184 L371 218 Q375 227 387 223 L396 219" fill="none" stroke="#6f4229" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
          <motion.g animate={{ rotate: active ? config.headRotate : still }} transition={{ duration: config.duration, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '386px 139px' }}>
            <path d="M357 156 Q347 128 363 103 Q378 79 409 84 Q435 88 445 111 L450 139 Q430 168 392 174 Q370 174 357 156 Z" fill="#c9824b" stroke="#5f3925" strokeWidth="5"/>
            <path d="M371 105 Q343 75 344 111 Q345 139 373 145 Q386 129 371 105 Z" fill="#75442b" stroke="#5f3925" strokeWidth="5"/>
            <path d="M405 89 Q424 65 437 92 Q440 106 429 118" fill="#8f5533" stroke="#5f3925" strokeWidth="5"/>
            <path d="M431 124 Q459 121 474 141 Q480 157 459 167 Q435 175 414 160 Q410 140 431 124 Z" fill="#e8b47b"/>
            <motion.ellipse cx="411" cy="116" rx={config.showFocus ? 7 : 6} ry={config.showFocus ? 10 : 8} fill="#263238" animate={{ scaleY: active ? blink : 1, scale: active && config.showFocus ? [1, 1.16, 1] : 1 }} transition={{ duration: config.showFocus ? 1.5 : 4, repeat: Infinity }}/>
            <circle cx="474" cy="145" r="9" fill="#263238"/><path d="M471 157 Q457 169 437 160" fill="none" stroke="#5f3925" strokeWidth="4" strokeLinecap="round"/>
            <path d="M361 151 Q373 161 386 165" fill="none" stroke="#ffd84d" strokeWidth="8"/><circle cx="383" cy="164" r="7" fill="#ffd84d" stroke="#5f3925" strokeWidth="3"/>
            {config.showStress && <motion.path d="M445 164 Q455 182 465 164" fill="#ff7a83" stroke="#5f3925" strokeWidth="3" animate={{ scaleY: active ? [.15, 1, .15] : 1 }} transition={{ duration: 2.2, repeat: Infinity }}/>} 
          </motion.g>
        </motion.g>
        </g>
        <CueDetails config={config} active={active}/>
      </svg>
      {!compact && <figcaption><strong>{config.label}</strong><span>{config.note}</span></figcaption>}
    </figure>
  )
}
