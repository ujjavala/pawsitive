import { motion, useReducedMotion } from 'motion/react'
import type { PipMood } from '../types'
import { useAppStore } from '../store/useAppStore'

type PipMascotProps = Readonly<{ mood?: PipMood; size?: number; label?: string }>

function getPipState(mood: PipMood, reduced: boolean) {
  const happy = ['happy', 'celebrating'].includes(mood)
  const curious = ['curious', 'confused'].includes(mood)
  return {
    happy,
    bodyMotion: reduced ? undefined : { y: happy ? [0, -5, 0] : [0, -1.5, 0] },
    bodyTransition: { duration: happy ? 0.7 : 3.2, repeat: happy ? 1 : Infinity },
    headMotion: !reduced && curious ? { rotate: [0, 5, 5] } : undefined,
    tailMotion: reduced ? undefined : { rotate: happy ? [-8, 18, -8] : [-5, 7, -5] },
    mouthPath: mood === 'confused' ? 'M132 113 Q150 107 168 113' : 'M132 109 Q150 126 168 109',
  }
}

export function PipMascot({ mood = 'idle', size = 240, label }: PipMascotProps) {
  const systemReduced = useReducedMotion()
  const appReduced = useAppStore((state) => state.reducedMotion)
  const reduced = Boolean(systemReduced || appReduced)
  const { happy, bodyMotion, bodyTransition, headMotion, tailMotion, mouthPath } = getPipState(mood, reduced)

  return <motion.svg
    className={`pip pip-${mood}`}
    width={size}
    viewBox="0 0 300 330"
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    initial={reduced ? false : { opacity: 0, y: 7 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <defs>
      <linearGradient id="pip-fur" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#dba255"/>
        <stop offset="0.55" stopColor="#c7863f"/>
        <stop offset="1" stopColor="#a9642f"/>
      </linearGradient>
      <linearGradient id="pip-chest" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f9dfb6"/>
        <stop offset="1" stopColor="#e8bd7d"/>
      </linearGradient>
      <radialGradient id="pip-muzzle">
        <stop offset="0" stopColor="#f8deb5"/>
        <stop offset="1" stopColor="#e6b978"/>
      </radialGradient>
      <filter id="pip-shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#593515" floodOpacity=".18"/>
      </filter>
    </defs>

    <ellipse cx="151" cy="309" rx="105" ry="13" fill="#263238" opacity=".1"/>

    <motion.g animate={bodyMotion} transition={bodyTransition} filter="url(#pip-shadow)">
      <motion.path
        d="M239 226 C280 211 285 172 268 154 C269 190 250 196 228 199"
        fill="none"
        stroke="#a9642f"
        strokeWidth="19"
        strokeLinecap="round"
        style={{ transformOrigin: '235px 213px' }}
        animate={tailMotion}
        transition={{ duration: happy ? 0.3 : 2.2, repeat: Infinity }}
      />

      <path d="M88 276 C65 285 61 306 77 310 C98 313 116 304 124 289" fill="url(#pip-fur)" stroke="#70401f" strokeWidth="3"/>
      <path d="M212 274 C236 282 241 304 225 309 C205 314 185 305 178 289" fill="url(#pip-fur)" stroke="#70401f" strokeWidth="3"/>

      <path d="M84 191 C90 145 112 125 150 124 C189 124 214 146 219 192 L229 266 C229 289 201 299 150 299 C99 299 72 289 72 266 Z" fill="url(#pip-fur)" stroke="#70401f" strokeWidth="3"/>
      <path d="M117 145 C127 135 139 131 150 131 C163 131 177 136 186 148 C184 204 176 264 150 284 C123 263 115 204 117 145Z" fill="url(#pip-chest)" opacity=".94"/>

      <path d="M100 202 C90 232 90 270 98 297 C105 306 122 307 132 298 L126 209" fill="#c88640" stroke="#70401f" strokeWidth="3"/>
      <path d="M200 202 C210 232 210 270 202 297 C195 306 178 307 168 298 L174 209" fill="#bd7837" stroke="#70401f" strokeWidth="3"/>
      <path d="M94 298 C99 289 124 289 132 298 C132 310 121 314 108 314 C96 314 90 309 94 298Z" fill="#d9a25d" stroke="#70401f" strokeWidth="3"/>
      <path d="M168 298 C176 289 201 289 206 298 C210 309 204 314 192 314 C179 314 168 310 168 298Z" fill="#cf904b" stroke="#70401f" strokeWidth="3"/>
      <path d="M104 304 L104 309 M113 302 L113 310 M122 304 L122 309 M178 304 L178 309 M187 302 L187 310 M196 304 L196 309" stroke="#70401f" strokeWidth="2" strokeLinecap="round"/>

      <path d="M104 161 Q150 184 196 161 L191 179 Q150 197 109 179Z" fill="#4e9f7c" stroke="#263238" strokeWidth="3"/>
      <circle cx="150" cy="181" r="8" fill="#ffd84d" stroke="#263238" strokeWidth="2"/>

      <motion.g animate={headMotion} style={{ transformOrigin: '150px 104px' }}>
        <path d="M105 62 C76 44 64 65 72 99 C77 121 89 137 107 133 C118 122 120 88 105 62Z" fill="#915329" stroke="#70401f" strokeWidth="3"/>
        <path d="M195 62 C224 44 236 65 228 99 C223 121 211 137 193 133 C182 122 180 88 195 62Z" fill="#8d5028" stroke="#70401f" strokeWidth="3"/>
        <path d="M84 80 C88 42 112 22 150 22 C188 22 212 42 216 80 C221 122 195 151 150 153 C105 151 79 122 84 80Z" fill="url(#pip-fur)" stroke="#70401f" strokeWidth="3"/>
        <path d="M102 48 C120 28 141 27 150 28 C127 38 117 53 113 72Z" fill="#edc17f" opacity=".55"/>
        <path d="M114 91 C121 75 134 68 150 68 C166 68 179 75 186 91 C192 111 181 135 150 139 C119 135 108 111 114 91Z" fill="url(#pip-muzzle)"/>

        <path d="M107 74 Q122 66 134 75" fill="none" stroke="#70401f" strokeWidth="3" strokeLinecap="round"/>
        <path d="M166 75 Q178 66 193 74" fill="none" stroke="#70401f" strokeWidth="3" strokeLinecap="round"/>
        <motion.g animate={reduced ? undefined : { scaleY: [1, 1, 0.08, 1] }} transition={{ duration: 4.4, repeat: Infinity }}>
          <ellipse cx="124" cy="82" rx="6.5" ry="8" fill="#2c241e"/>
          <ellipse cx="176" cy="82" rx="6.5" ry="8" fill="#2c241e"/>
          <circle cx="126" cy="79" r="2" fill="#fff"/>
          <circle cx="178" cy="79" r="2" fill="#fff"/>
        </motion.g>

        <path d="M136 98 C138 90 162 90 164 98 C164 106 157 110 150 110 C143 110 136 106 136 98Z" fill="#282522"/>
        <path d="M140 96 Q150 92 160 96" fill="none" stroke="#fff" strokeWidth="2" opacity=".35" strokeLinecap="round"/>
        <path d={mouthPath} fill="none" stroke="#4a2d22" strokeWidth="3" strokeLinecap="round"/>
        {happy && <path d="M142 119 Q150 128 158 119 Q156 137 150 139 Q144 137 142 119Z" fill="#d97979" stroke="#704040" strokeWidth="1.5"/>}
      </motion.g>
    </motion.g>

    {mood === 'celebrating' && !reduced && <g className="sparkles" aria-hidden="true"><text x="35" y="70">✦</text><text x="244" y="95">★</text><text x="226" y="38">✦</text></g>}
  </motion.svg>
}
