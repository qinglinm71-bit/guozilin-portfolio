import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, EASE, reducedMotion, animateCount } from './motion.js'
import { isTouch } from './device.js'
import { setTheme } from './theme.js'

/**
 * 页面级滚动动效。在页面根节点内用 data 属性声明：
 *   data-reveal="up"      淡入 + 轻微上移（辅助信息用）
 *   data-reveal="clip"    图片遮罩展开 + 内部图片由大到小
 *   data-reveal="slide"   画板：轻微 3D 翻正（rotateX 8°→0）+ 遮罩展开
 *   data-reveal="chars"   逐字遮罩上移（内部使用 <Split>）
 *   data-reveal="line"    线条从左向右生长
 *   data-count-view       进入视口后数字从 0 滚动
 *   data-parallax="0.1"   随滚动轻微位移（触屏关闭）
 *   data-theme="#hex"     处于视口中部时，全站主题色切换为该章节色
 */
export function useScrollMotion(ref, deps = []) {
  useLayoutEffect(() => {
    const root = ref.current
    if (root === null) return undefined

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root)
      const once = (trigger, start = 'top 88%') => ({ trigger, start, once: true })

      q('[data-theme]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setTheme(el.dataset.theme),
        })
      })

      q('[data-count-view]').forEach((el) => {
        ScrollTrigger.create({
          ...once(el, 'top 92%'),
          onEnter: () => animateCount(el, Number(el.dataset.countView), { pad: Number(el.dataset.pad || 0) }),
        })
      })

      if (reducedMotion) {
        const all = q('[data-reveal]')
        gsap.set(all, { opacity: 0 })
        ScrollTrigger.batch(all, {
          start: 'top 95%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 0.4, overwrite: true }),
        })
        return
      }

      const ups = q('[data-reveal="up"]')
      gsap.set(ups, { opacity: 0, y: 28 })
      ScrollTrigger.batch(ups, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.06, overwrite: true }),
      })

      q('[data-reveal="clip"]').forEach((el) => {
        const img = el.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: once(el) })
        tl.fromTo(el, { clipPath: 'inset(14% 5% 0% 5% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.1, ease: EASE })
        if (img) tl.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.2, ease: EASE }, 0)
      })

      // 画板：轻微 3D 翻正 + 遮罩展开；相邻画板交替从左右两侧微微切入
      q('[data-reveal="slide"]').forEach((el, i) => {
        const img = el.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: once(el, 'top 90%') })
        tl.fromTo(
          el,
          { rotationX: 8, y: 60, x: i % 2 ? 24 : -24, clipPath: 'inset(10% 0% 0% 0% round 24px)', transformOrigin: '50% 100%' },
          { rotationX: 0, y: 0, x: 0, clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.2, ease: EASE },
        )
        if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: EASE }, 0)
      })

      q('[data-reveal="chars"]').forEach((el) => {
        gsap.from(el.querySelectorAll('.split__char'), {
          yPercent: 115,
          duration: 0.9,
          ease: EASE,
          stagger: 0.025,
          scrollTrigger: once(el, 'top 92%'),
        })
      })

      q('[data-reveal="line"]').forEach((el) => {
        gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: EASE, scrollTrigger: once(el, 'top 95%') })
      })

      if (!isTouch) {
        q('[data-parallax]').forEach((el) => {
          const speed = Number(el.dataset.parallax) || 0.1
          gsap.fromTo(
            el,
            { yPercent: speed * 100 },
            {
              yPercent: -speed * 100,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      }
    }, root)

    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
