import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from './motion.js'

/** 视口中部所在的 Figma 画板编号 → 页码计数器；带 data-section 的区块 → 导航高亮 */
export function usePageTracking(ref, onNav) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('[data-page]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && onNav((n) => ({ ...n, current: Number(el.dataset.page) })),
        })
      })
      ref.current.querySelectorAll('[data-section]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) onNav((n) => ({ ...n, active: el.dataset.section }))
            else onNav((n) => (n.active === el.dataset.section ? { ...n, active: n.fallback ?? null } : n))
          },
        })
      })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
