import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cases, cover, layerBox, layerSrc, pad, slideSrc } from '../data/portfolio.js'
import { gsap, EASE, reducedMotion, animateCount, introDone, getEnterDelay } from '../lib/motion.js'
import { isTouch, isSmall } from '../lib/device.js'
import { setTheme } from '../lib/theme.js'
import { useGo } from '../lib/transition.jsx'
import { Split } from './Split.jsx'
import FluidBackground from './FluidBackground.jsx'

/**
 * 首屏：尺寸以视口为单位（--u = min(1vw, 1.9vh)），任意缩放比例下都铺满一屏。
 * 上：标题与身份；右：倾斜的分层主视觉；下：四色 = 四章节 = 四组数据的索引条，贴底。
 */
export default function Hero() {
  const root = useRef(null)
  const go = useGo()
  const [focus, setFocus] = useState(null)
  const box = useMemo(() => layerBox(cover.layers), [])

  useLayoutEffect(() => {
    const el = root.current
    const q = gsap.utils.selector(el)
    let started = false

    const ctx = gsap.context(() => {
      const counters = q('[data-count]')
      if (reducedMotion) {
        counters.forEach((c) => animateCount(c, Number(c.dataset.count)))
        return
      }

      // 主视觉初始倾斜交给 GSAP 管理，与鼠标倾斜共用同一组属性（手机端保持正视）
      const flat = isSmall()
      gsap.set(q('.hero__tilt'), flat ? { rotationY: 0, rotationX: 0 } : { rotationY: -10, rotationX: 4 })

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } })
      tl.from(q('.hero__title .split__char'), { yPercent: 118, duration: 1.1, stagger: 0.07 }, 0)
        .from(
          q('.hero__en .split__char'),
          {
            yPercent: () => gsap.utils.random(-60, 60),
            xPercent: () => gsap.utils.random(-30, 30),
            rotation: () => gsap.utils.random(-10, 10),
            opacity: 0,
            duration: 0.9,
            stagger: { each: 0.03, from: 'random' },
          },
          0.3,
        )
        .from(q('.hero__eyebrow, .hero__who'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.45)
        .from(q('.hero__tilt'), { opacity: 0, yPercent: 8, rotationY: flat ? 0 : -24, duration: 1.4 }, 0.15)
        .from(q('.index__item'), { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.6)
        .from(q('.index__line'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, stagger: 0.08 }, 0.65)
        .add(() => counters.forEach((c, i) => animateCount(c, Number(c.dataset.count), { delay: i * 0.08 })), 0.75)

      q('.hero__layer').forEach((layer, i) => {
        tl.from(layer.querySelector('img'), { y: 70 + i * 12, opacity: 0, duration: 1.1 }, 0.3 + i * 0.08)
      })
      q('.hero__float').forEach((f, i) => {
        gsap.to(f, { y: -12, rotation: i % 2 ? 4 : -4, duration: 2.8 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })

      introDone.then(() => {
        if (started) return
        started = true
        tl.delay(getEnterDelay()).play()
      })

      // 鼠标：整组主视觉轻微 3D 倾斜，各层再按深度位移（触屏关闭）
      if (!isTouch && !flat) {
        const tilt = q('.hero__tilt')[0]
        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 1.2, ease: 'power3' })
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 1.2, ease: 'power3' })
        const movers = q('.hero__layer').map((layer) => ({
          d: Number(layer.dataset.depth),
          x: gsap.quickTo(layer, 'x', { duration: 1, ease: 'power3' }),
          y: gsap.quickTo(layer, 'y', { duration: 1, ease: 'power3' }),
        }))
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          ry(-10 + nx * 10)
          rx(4 - ny * 8)
          movers.forEach((m) => {
            m.x(nx * 24 * m.d)
            m.y(ny * 16 * m.d)
          })
        }
        el.addEventListener('pointermove', onMove)
      }

      // 滚出首屏：主视觉缩小下沉，环境光过渡到第一章的粉色
      const out = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(q('.hero__visual'), {
        scale: 0.86,
        yPercent: 12,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: { ...out, onLeave: () => setTheme(cases[0].chapter.color) },
      })
      gsap.to(q('.hero__head'), { y: -50, opacity: 0.2, ease: 'none', scrollTrigger: out })
    }, el)

    return () => ctx.revert()
  }, [])

  const enter = (c) => {
    setFocus(c.chapter.color)
    setTheme(c.chapter.color)
  }
  const leave = () => {
    setFocus(null)
    setTheme(cases[0].chapter.color)
  }

  return (
    <header ref={root} className="hero" id="top" data-page="1">
      <FluidBackground focus={focus} />

      <div className="hero__frame">
        <div className="hero__head">
          <p className="hero__eyebrow">
            <span>P.01</span>
            <i />
            {cover.tag}
          </p>
          <h1 className="hero__title">
            <Split text={cover.title} />
          </h1>
          <p className="hero__en">
            <Split text={cover.titleEn} />
          </p>
          <p className="hero__who">
            <strong>{cover.name}</strong>
            <span>{cover.fields}</span>
          </p>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__tilt" style={{ aspectRatio: box.ratio }}>
            {box.items.map((l) => (
              <div
                key={l.src}
                className={`hero__layer ${l.src === 'cover-web' ? 'is-back' : ''}`}
                data-depth={l.depth}
                style={{ left: `${l.left}%`, top: `${l.top}%`, width: `${l.width}%`, height: `${l.height}%` }}
              >
                <div className={l.float ? 'hero__float' : 'hero__still'}>
                  <img src={layerSrc(l.src)} alt="" width={Math.round(l.w * 2)} height={Math.round(l.h * 2)} fetchPriority="high" decoding="async" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 四色 = 四章节 = 四组数据 */}
        <nav className="index" aria-label="章节入口" onPointerLeave={leave}>
          {cases.map((c, i) => {
            const s = cover.stats[i]
            return (
              <a
                key={c.slug}
                href={`/work/${c.slug}`}
                className={`index__item ${focus === c.chapter.color ? 'is-on' : ''}`}
                style={{ '--c': c.chapter.color }}
                onPointerEnter={() => enter(c)}
                onFocus={() => enter(c)}
                onBlur={leave}
                onClick={(e) => {
                  e.preventDefault()
                  go(`/work/${c.slug}`, { kase: c })
                }}
              >
                <i className="index__line" />
                <span className="index__head">
                  <b>{c.chapter.no}</b>
                  {c.name}
                </span>
                <span className="index__stat">
                  <span data-count={s.value}>{s.value}</span>
                  {s.suffix}
                  <small>{s.label}</small>
                </span>
                <span className="index__range">
                  P.{pad(c.hero.no)}—{pad(c.last)}
                </span>
                <span className="index__preview" aria-hidden="true">
                  <img src={slideSrc(c.hero.no, 480)} alt="" width="480" height="270" loading="lazy" />
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
