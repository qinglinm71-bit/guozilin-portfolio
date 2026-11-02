import { useEffect } from 'react'
import { gsap, reducedMotion } from '../lib/motion.js'
import { useToast } from '../lib/toast.js'
import { Glass } from './Glass.jsx'

const STAR = 'M12 1.8l2.9 6.6 7.2.7-5.4 4.8 1.6 7-6.3-3.7-6.3 3.7 1.6-7L1.9 9.1l7.2-.7z'
const IGNORE = 'a, button, input, textarea, select, label, img, video, [role="dialog"], .slide__frame, .glass'

/** 点击页面空白处迸出几颗小星星，颜色取当前章节色；点到为止 */
export function StarBurst() {
  useEffect(() => {
    if (reducedMotion) return undefined
    const onClick = (e) => {
      if (e.button !== 0 || e.target.closest(IGNORE)) return
      if (window.getSelection()?.toString()) return
      const color = getComputedStyle(document.documentElement).getPropertyValue('--c').trim() || '#ff3d6e'
      const n = 6
      for (let i = 0; i < n; i += 1) {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const size = gsap.utils.random(9, 15)
        s.setAttribute('viewBox', '0 0 24 24')
        s.setAttribute('width', size)
        s.setAttribute('height', size)
        s.setAttribute('class', 'burst')
        s.innerHTML = `<path d="${STAR}" fill="${i % 3 === 0 ? '#fff' : color}"/>`
        document.body.appendChild(s)
        const a = (i / n) * Math.PI * 2 + gsap.utils.random(-0.4, 0.4)
        const d = gsap.utils.random(28, 64)
        gsap.fromTo(
          s,
          { x: e.clientX - size / 2, y: e.clientY - size / 2, scale: 0.2, rotation: 0, opacity: 1 },
          {
            x: e.clientX - size / 2 + Math.cos(a) * d,
            y: e.clientY - size / 2 + Math.sin(a) * d,
            scale: 1,
            rotation: gsap.utils.random(-120, 120),
            duration: 0.7,
            ease: 'brand',
            onComplete: () => gsap.to(s, { opacity: 0, scale: 0.4, duration: 0.25, onComplete: () => s.remove() }),
          },
        )
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}

/** 全局提示条 */
export function Toaster() {
  const msg = useToast()
  return (
    <div className="toaster" aria-live="polite">
      {msg && (
        <Glass key={msg.id} className="toast" liquid={false}>
          <i className="pill__dot pill__dot--ok" />
          {msg.text}
        </Glass>
      )}
    </div>
  )
}
