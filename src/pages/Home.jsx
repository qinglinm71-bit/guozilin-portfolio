import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { scrollToHash } from '../lib/motion.js'
import { setTheme } from '../lib/theme.js'
import { useScrollMotion } from '../lib/useScrollMotion.js'
import { usePageTracking } from '../lib/usePageTracking.js'
import Hero from '../components/Hero.jsx'
import WorkPanels from '../components/WorkPanels.jsx'
import About from '../components/About.jsx'
import Contact from '../components/Contact.jsx'

/** 首页：01 封面 → 作品（03 目录）→ 关于（02 简介）→ 联系（54 封底） */
export default function Home({ onNav }) {
  const root = useRef(null)
  const location = useLocation()

  useLayoutEffect(() => {
    onNav({ active: null, current: 1, fallback: null })
    setTheme('#ff3d6e', { immediate: true })
    if (location.hash) scrollToHash(location.hash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useScrollMotion(root)
  usePageTracking(root, onNav)

  return (
    <main ref={root} className="page page--home">
      <Hero />
      <WorkPanels />
      <About />
      <Contact />
    </main>
  )
}
