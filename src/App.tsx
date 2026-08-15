import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PipMascot } from './components/PipMascot'

const Home = lazy(() => import('./pages/Home'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Learn = lazy(() => import('./pages/Learn'))
const Lesson = lazy(() => import('./pages/Lesson'))
const Scenarios = lazy(() => import('./pages/Scenarios'))
const Scenario = lazy(() => import('./pages/Scenario'))
const UnderstandDog = lazy(() => import('./pages/UnderstandDog'))
const Owners = lazy(() => import('./pages/Owners'))
const Progress = lazy(() => import('./pages/Progress'))
const Settings = lazy(() => import('./pages/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Loading() {
  return <div className="route-loading"><PipMascot mood="curious" size={150}/><span>One paw at a time…</span></div>
}

export default function App() {
  return <BrowserRouter><Suspense fallback={<Loading/>}><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="onboarding" element={<Onboarding/>}/><Route path="learn" element={<Learn/>}/><Route path="learn/:lessonId" element={<Lesson/>}/><Route path="scenarios" element={<Scenarios/>}/><Route path="scenarios/:scenarioId" element={<Scenario/>}/><Route path="understand" element={<UnderstandDog/>}/><Route path="owners" element={<Owners/>}/><Route path="progress" element={<Progress/>}/><Route path="settings" element={<Settings/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></Suspense></BrowserRouter>
}
