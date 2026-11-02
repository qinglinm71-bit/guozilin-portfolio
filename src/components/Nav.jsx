import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site } from '../data/portfolio.js'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion.js'
import { useGo } from '../lib/transition.jsx'
import { Glass } from './Glass.jsx'
import { FlipCounter } from './FlipCounter.jsx'

const LINKS = [
  { id: 'work', label: '作品' },
  { id: 'about', label: '关于' },
  { id: 'contact', label: '联系' },
]

/** 导航项 + 当前项的玻璃水滴：切换时先被拉长覆盖两项，再弹性收拢到新位置 */
function Links({ active }) {
  const go = useGo()
  const wrap = useRef(null)
  const drop = useRef(null)
  const tween = useRef(null)
  const shown = useRef(false)
  // 点击后水滴立刻移到目标项，并在平滑滚动期间保持不动，不随途经的区块来回跳
  const [pending, setPending] = useState(null)
  const target = pending ?? active

  useEffect(() => {
    if (pending === null) return undefined
    const t = setTimeout(() => setPending(null), 1500)
    return () => clearTimeout(t)
  }, [pending])

  useLayoutEffect(() => {
    const d = drop.current
    const place = (animate) => {
      // 每次只保留一个水滴动画，避免连续切换时多个动画互相覆盖导致错位
      tween.current?.kill()
      const el = wrap.current.querySelector(`[data-id="${target}"]`)
      if (!el) {
        tween.current = gsap.to(d, { opacity: 0, scale: 0.5, duration: 0.35, ease: 'brand' })
        shown.current = false
        return
      }
      const left = el.offsetLeft
      const width = el.offsetWidth
      if (!animate || !shown.current || reducedMotion) {
        gsap.set(d, { x: left, width, scaleY: 1 })
        tween.current = gsap.to(d, { opacity: 1, scale: 1, duration: 0.45, ease: 'brand' })
      } else {
        // 从水滴当前的实际位置出发：先拉长覆盖两项，再弹性收拢
        const curL = Number(gsap.getProperty(d, 'x'))
        const curW = d.offsetWidth
        const minL = Math.min(curL, left)
        const maxR = Math.max(curL + curW, left + width)
        tween.current = gsap
          .timeline()
          .to(d, { opacity: 1, scale: 1, duration: 0.2 }, 0)
          .to(d, { x: minL, width: maxR - minL, scaleY: 0.86, duration: 0.2, ease: 'power2.out' }, 0)
          .to(d, { x: left, width, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' })
      }
      shown.current = true
    }
    place(true)
    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [target])

  return (
    <ul className="links" ref={wrap}>
      <li className="links__drop" ref={drop} aria-hidden="true" />
      {LINKS.map((l) => (
        <li key={l.id}>
          <a
            href={`/#${l.id}`}
            data-id={l.id}
            className={target === l.id ? 'is-active' : ''}
            aria-current={target === l.id ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault()
              setPending(l.id)
              go(`/#${l.id}`)
            }}
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * 导航：顶部为名字 + 玻璃胶囊（作品 / 关于 / 联系）+ 页码计数器；
 * 滚动后名字收起，胶囊变为悬浮玻璃。手机端：顶部名字，底部悬浮胶囊与页码。
 */
export default function Nav({ active, current, routeKey }) {
  const go = useGo()
  const bar = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useLayoutEffect(() => {
    const tween = gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [routeKey])

  useEffect(() => {
    const st = ScrollTrigger.create({ start: 40, end: 'max', onToggle: (self) => setScrolled(self.isActive) })
    return () => st.kill()
  }, [routeKey])

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span ref={bar} />
      </div>

      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a
          className="nav__brand"
          href="/"
          onClick={(e) => {
            e.preventDefault()
            go('/')
          }}
        >
          <i />
          <span>{site.brand}</span>
        </a>

        <Glass className="nav__capsule" liquid={false} as="nav" aria-label="主导航">
          <Links active={active} />
        </Glass>

        <div className="nav__right">
          <Glass className="nav__count" liquid={false}>
            <FlipCounter value={current} total={site.total} />
          </Glass>
        </div>
      </header>

      {/* 手机端底部悬浮胶囊 */}
      <Glass className="dock" liquid={false} as="nav" aria-label="主导航（底部）">
        <Links active={active} />
        <FlipCounter value={current} total={site.total} className="dock__count" />
      </Glass>
    </>
  )
}
