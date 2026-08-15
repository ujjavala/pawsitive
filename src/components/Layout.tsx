import { Home, BookOpen, Sparkles, Trophy, Dog, Menu, Volume2, VolumeX } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/scenarios', label: 'Scenarios', icon: Sparkles },
  { to: '/understand', label: 'Understand a Dog', short: 'AI', icon: Dog },
  { to: '/owners', label: 'For Owners', desktop: true, icon: Dog },
  { to: '/progress', label: 'Progress', icon: Trophy },
]

export function Layout() {
  const location = useLocation()
  const sound = useAppStore((state) => state.soundEnabled)
  const setSound = useAppStore((state) => state.setSoundEnabled)
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><NavLink className="brand" to="/" aria-label="Pawsitive home"><span className="brand-mark">🐾</span><span>Pawsitive</span></NavLink><nav className="desktop-nav" aria-label="Primary navigation">{nav.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>{item.label}</NavLink>)}</nav><div className="header-actions"><button className="icon-button" onClick={() => setSound(!sound)} aria-label={`Turn sound ${sound ? 'off' : 'on'}`}>{sound ? <Volume2 /> : <VolumeX />}</button><NavLink className="icon-button" to="/settings" aria-label="Open settings"><Menu /></NavLink></div></header>
    <main id="main" key={location.pathname}><Outlet /></main>
    <nav className="bottom-nav" aria-label="Mobile navigation">{nav.filter((item) => !item.desktop).map((item) => { const Icon = item.icon; return <NavLink key={item.to} to={item.to}><Icon size={21} /><span>{item.short ?? item.label}</span></NavLink> })}</nav>
    <footer><span>Made with care for calmer encounters.</span><span>Two perspectives. One better interaction.</span></footer>
  </div>
}
