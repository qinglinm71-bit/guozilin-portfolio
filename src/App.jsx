import { useLayoutEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import { initSmoothScroll } from './lib/motion.js'
import { TransitionProvider } from './lib/transition.jsx'
import Nav from './components/Nav.jsx'
import Cursor from './components/Cursor.jsx'
import Intro from './components/Intro.jsx'
import { GlassDefs } from './components/Glass.jsx'
import { StarBurst, Toaster } from './components/Effects.jsx'
import Home from './pages/Home.jsx'
import Case from './pages/Case.jsx'

function Shell() {
  const location = useLocation()
  const [nav, setNav] = useState({ active: null, current: 1, fallback: null })
  // 只有从首页进入时播放「54 页画布 → 封面」开场
  const [introCanvas] = useState(() => location.pathname === '/')

  useLayoutEffect(() => initSmoothScroll(), [])

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <i />
        <i />
      </div>
      <GlassDefs />
      <Nav active={nav.active} current={nav.current} routeKey={location.pathname} />
      <Routes>
        <Route path="/" element={<Home onNav={setNav} />} />
        <Route path="/work/:slug" element={<Case onNav={setNav} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
      <StarBurst />
      <Cursor />
      <Intro withCanvas={introCanvas} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Shell />
      </TransitionProvider>
    </BrowserRouter>
  )
}
