import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion.js'
import { isTouch } from '../lib/device.js'

/**
 * 自定义光标（触屏关闭）：小圆点紧跟指针，外圈带惯性跟随，颜色随当前章节；
 * 悬停到 [data-cursor="文字"] 时外圈放大成章节色圆并显示文字，悬停链接 / 按钮时轻微放大。
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const text = useRef(null)

  useEffect(() => {
    if (reducedMotion || isTouch) return undefined
    const html = document.documentElement
    html.classList.add('has-cursor')

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })
    let shown = false

    const move = (e) => {
      if (!shown) {
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        html.classList.add('cursor-on')
        shown = true
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e) => {
      const labelled = e.target.closest('[data-cursor]')
      const link = e.target.closest('a, button')
      const label = labelled?.dataset.cursor ?? ''
      text.current.textContent = label
      ring.current.classList.toggle('is-label', label !== '')
      ring.current.classList.toggle('is-link', label === '' && link !== null)
      const local = labelled ? getComputedStyle(labelled).getPropertyValue('--c').trim() : ''
      if (local) ring.current.style.setProperty('--ring', local)
      else ring.current.style.removeProperty('--ring')
    }
    const leave = () => {
      html.classList.remove('cursor-on')
      shown = false
    }
    const down = () => ring.current.classList.add('is-down')
    const up = () => ring.current.classList.remove('is-down')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    html.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      html.classList.remove('has-cursor', 'cursor-on')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      html.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring">
        <span ref={text} />
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  )
}
