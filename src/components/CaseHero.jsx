import { useLayoutEffect, useMemo, useRef } from 'react'
import { layerBox, layerSrc } from '../data/portfolio.js'
import { gsap, EASE, reducedMotion, getEnterDelay } from '../lib/motion.js'
import { isTouch } from '../lib/device.js'
import { Split } from './Split.jsx'
import { Glass } from './Glass.jsx'

/** 案例首屏 = Figma 章节页（04 / 22 / 34 / 47），响应式重建：文案 + 巨大章节编号 + 分层主视觉 */
export default function CaseHero({ chapter, page, children }) {
  const root = useRef(null)
  const box = useMemo(() => layerBox(chapter.layers), [chapter])

  useLayoutEffect(() => {
    const el = root.current
    const q = gsap.utils.selector(el)
    const ctx = gsap.context(() => {
      if (reducedMotion) return
      const tl = gsap.timeline({ defaults: { ease: EASE }, delay: getEnterDelay() + 0.05 })
      tl.from(q('.case-hero__no'), { yPercent: 30, opacity: 0, duration: 1.2 }, 0)
        .from(q('.case-hero__title .split__char'), { yPercent: 118, duration: 1.1, stagger: 0.07 }, 0.1)
        .from(q('.case-hero__en .split__char'), { yPercent: () => gsap.utils.random(-50, 50), opacity: 0, duration: 0.9, stagger: { each: 0.025, from: 'random' } }, 0.3)
        .from(q('.case-bar > *, .case-hero__tag, .case-hero__desc span'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.35)
        .from(q('.case-hero__rule'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.8 }, 0.6)
      q('.case-hero__layer img').forEach((img, i) => {
        tl.from(img, { y: 140, rotation: i % 2 ? 6 : -6, opacity: 0, duration: 1.2 }, 0.15 + i * 0.12)
      })

      // 滚出首屏：大号编号、主视觉、文字三层以不同速度移动（触屏只保留轻量位移）
      const out = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(q('.case-hero__no'), { yPercent: 30, ease: 'none', scrollTrigger: out })
      gsap.to(q('.case-hero__visual'), { yPercent: -12, scale: 0.92, ease: 'none', scrollTrigger: out })
      if (!isTouch) gsap.to(q('.case-hero__copy'), { y: -50, opacity: 0.2, ease: 'none', scrollTrigger: out })
    }, el)
    return () => ctx.revert()
  }, [chapter.id])

  return (
    <header ref={root} className="case-hero" style={{ '--c': chapter.color }} id="top" data-page={page.no} data-theme={chapter.color}>
      {children}
      <div className="case-hero__glow" aria-hidden="true" />
      <div className="case-hero__inner container">
        <div className="case-hero__copy">
          <Glass className="pill case-hero__tag" liquid={false}>
            <i className="pill__dot" />
            {chapter.label}
          </Glass>
          <h1 className="case-hero__title">
            <Split text={chapter.title} />
          </h1>
          <p className="case-hero__en">
            <Split text={chapter.titleEn} />
          </p>
          <i className="case-hero__rule" aria-hidden="true" />
          <p className="case-hero__desc">
            {chapter.desc.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <div className="case-hero__stage">
          <span className="case-hero__no" aria-hidden="true">
            {chapter.no}
          </span>
          <div className="case-hero__visual" style={{ aspectRatio: box.ratio }}>
            {box.items.map((l) => (
              <div key={l.src} className="case-hero__layer" style={{ left: `${l.left}%`, top: `${l.top}%`, width: `${l.width}%`, height: `${l.height}%` }}>
                <img src={layerSrc(l.src)} alt="" width={Math.round(l.w * 2)} height={Math.round(l.h * 2)} decoding="async" fetchPriority="high" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="case-hero__footer container" aria-hidden="true">
        <i />
        {chapter.footer}
      </p>
    </header>
  )
}
