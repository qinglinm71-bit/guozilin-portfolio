import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ip, pad, slideSrc, site } from '../data/portfolio.js'
import { gsap, EASE, lockScroll, reducedMotion } from '../lib/motion.js'
import { Glass } from './Glass.jsx'

/**
 * 全屏查看：2x 原图；← → / 左右滑动切换，Esc 关闭；双指缩放、缩放后可拖动；
 * 翻到本案例最后一页时，星星女巫从角落探头比耶（小彩蛋）。
 */
export default function Viewer({ pages, index, onChange, onClose }) {
  const root = useRef(null)
  const img = useRef(null)
  const egg = useRef(null)
  const zoom = useRef({ s: 1, x: 0, y: 0 })
  const page = pages[index]
  const isLast = index === pages.length - 1

  useLayoutEffect(() => {
    lockScroll(true)
    if (!reducedMotion) {
      gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(root.current.querySelector('.viewer__stage'), { scale: 0.94, y: 24 }, { scale: 1, y: 0, duration: 0.8, ease: EASE })
    }
    return () => lockScroll(false)
  }, [])

  useLayoutEffect(() => {
    zoom.current = { s: 1, x: 0, y: 0 }
    if (img.current) gsap.set(img.current, { scale: 1, x: 0, y: 0 })
    if (!reducedMotion && img.current) gsap.fromTo(img.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: EASE })
    if (isLast && egg.current && !reducedMotion) {
      gsap.fromTo(egg.current, { yPercent: 100, rotation: 12 }, { yPercent: 0, rotation: 0, duration: 0.9, ease: 'back.out(1.7)', delay: 0.3 })
    }
  }, [index, isLast])

  const step = (d) => onChange((index + d + pages.length) % pages.length)
  const close = () => {
    if (reducedMotion) return onClose()
    return gsap.to(root.current, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: onClose })
  }

  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })

  // 触控：单指左右滑动翻页；双指缩放；放大后单指拖动
  useEffect(() => {
    const stage = root.current.querySelector('.viewer__stage')
    const pts = new Map()
    let start = null
    let pinch = null
    const apply = () => {
      const z = zoom.current
      gsap.set(img.current, { scale: z.s, x: z.x, y: z.y })
    }
    const down = (e) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pts.size === 1) start = { x: e.clientX, y: e.clientY, zx: zoom.current.x, zy: zoom.current.y, t: Date.now() }
      if (pts.size === 2) {
        const [a, b] = [...pts.values()]
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: zoom.current.s }
      }
    }
    const move = (e) => {
      if (!pts.has(e.pointerId)) return
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pts.size === 2 && pinch) {
        const [a, b] = [...pts.values()]
        zoom.current.s = Math.min(4, Math.max(1, (pinch.s * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.d))
        apply()
      } else if (pts.size === 1 && start && zoom.current.s > 1) {
        zoom.current.x = start.zx + (e.clientX - start.x)
        zoom.current.y = start.zy + (e.clientY - start.y)
        apply()
      }
    }
    const up = (e) => {
      const p = pts.get(e.pointerId)
      pts.delete(e.pointerId)
      if (pts.size < 2) pinch = null
      if (pts.size === 0 && start && p && zoom.current.s <= 1.02) {
        const dx = p.x - start.x
        const dy = p.y - start.y
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - start.t < 600) step(dx < 0 ? 1 : -1)
        zoom.current = { s: 1, x: 0, y: 0 }
        apply()
      }
      if (pts.size === 0) start = null
    }
    const dbl = () => {
      zoom.current = zoom.current.s > 1 ? { s: 1, x: 0, y: 0 } : { s: 2, x: 0, y: 0 }
      gsap.to(img.current, { scale: zoom.current.s, x: 0, y: 0, duration: 0.4, ease: EASE })
    }
    stage.addEventListener('pointerdown', down)
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerup', up)
    stage.addEventListener('pointercancel', up)
    stage.addEventListener('dblclick', dbl)
    return () => {
      stage.removeEventListener('pointerdown', down)
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerup', up)
      stage.removeEventListener('pointercancel', up)
      stage.removeEventListener('dblclick', dbl)
    }
  })

  // 挂到 body，避免被页面容器的层叠上下文压在导航之下
  return createPortal(
    <div ref={root} className="viewer" role="dialog" aria-modal="true" aria-label={`${pad(page.no)} ${page.title}`}>
      <Glass className="viewer__bar" liquid={false}>
        <span className="viewer__no">{pad(page.no)}</span>
        <span className="viewer__title">{page.title}</span>
        <span className="viewer__count">
          P.{pad(page.no)} / {site.total}
        </span>
        <Glass as="button" type="button" className="viewer__btn" onClick={close} aria-label="关闭">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </Glass>
      </Glass>

      <div className="viewer__stage" onClick={(e) => e.target === e.currentTarget && close()}>
        <img ref={img} key={page.no} src={slideSrc(page.no)} alt={`${pad(page.no)} ${page.title}`} width="2880" height="1620" draggable="false" />
      </div>

      <Glass as="button" type="button" className="viewer__btn viewer__nav viewer__nav--prev" onClick={() => step(-1)} aria-label="上一页">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Glass>
      <Glass as="button" type="button" className="viewer__btn viewer__nav viewer__nav--next" onClick={() => step(1)} aria-label="下一页">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Glass>

      {isLast && (
        <div className="viewer__egg" aria-hidden="true">
          <img ref={egg} src={ip.peace} alt="" width="293" height="560" />
        </div>
      )}
    </div>,
    document.body,
  )
}
