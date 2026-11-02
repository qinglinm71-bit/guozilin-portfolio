import { useLayoutEffect, useRef, useState } from 'react'
import { chapters, cover, frameName, ip, layerSrc, pages, slideSrc } from '../data/portfolio.js'
import { gsap, EASE, EASE_IN_OUT, finishIntro, lockScroll, reducedMotion } from '../lib/motion.js'
import { isSmall } from '../lib/device.js'

const STARS = 12
const SPECTRUM = chapters.map((c) => c.color)
const SEEN_KEY = 'gzl-intro-seen'

// 同一会话只完整播放一次开场（在模块加载时读取一次，避免开发模式下 effect 重复执行误判）
const firstVisit = (() => {
  try {
    const first = sessionStorage.getItem(SEEN_KEY) !== '1'
    sessionStorage.setItem(SEEN_KEY, '1')
    return first
  } catch {
    return true
  }
})()

const starColor = (i) => SPECTRUM[Math.min(SPECTRUM.length - 1, Math.floor((i / STARS) * SPECTRUM.length))]

export const StarIcon = ({ color = 'currentColor', size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path d="M12 1.8l2.9 6.6 7.2.7-5.4 4.8 1.6 7-6.3-3.7-6.3 3.7 1.6-7L1.9 9.1l7.2-.7z" fill={color} />
  </svg>
)

function preload(srcs, onProgress) {
  let done = 0
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          const finish = () => {
            done += 1
            onProgress(done / srcs.length)
            resolve()
          }
          img.onload = () => (img.decode ? img.decode().catch(() => {}).then(finish) : finish())
          img.onerror = finish
          img.src = src
        }),
    ),
  )
}

/**
 * 开场：星星女巫挥动魔法棒，星星飞出汇成进度条 →
 * 54 张画板像 Figma 画布一样平铺 → 镜头推进到 01 封面，进入首屏。
 * 同一会话第二次进入只保留简短的加载；手机端整体压缩到 1.5 秒以内。
 */
export default function Intro({ withCanvas }) {
  const root = useRef(null)
  const [done, setDone] = useState(reducedMotion || !firstVisit)

  useLayoutEffect(() => {
    // 同一会话内刷新：资源已缓存，直接进入首屏，不再播放加载
    if (reducedMotion || !firstVisit) {
      finishIntro()
      return undefined
    }
    const showCanvas = withCanvas && firstVisit
    const small = isSmall()
    const el = root.current
    const q = gsap.utils.selector(el)
    const witch = q('.intro__witch')[0]
    const stars = q('.intro__bar i')
    let lit = 0
    let killed = false

    lockScroll(true)
    const ctx = gsap.context(() => {
      gsap.from(q('.intro__loader'), { opacity: 0, y: 16, duration: 0.6, ease: EASE })
      // 挥动魔法棒：整体轻微摆动 + 上下浮动
      gsap.to(witch, { rotation: -5, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '60% 70%' })
      gsap.to(witch, { y: -8, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)

    // 星星从魔法棒尖飞向进度条
    const emit = () => {
      if (killed || lit >= STARS) return
      const target = stars[lit]
      const w = witch.getBoundingClientRect()
      const t = target.getBoundingClientRect()
      const sx = w.left + w.width * 0.66
      const sy = w.top + w.height * 0.14
      const s = document.createElement('span')
      s.className = 'intro__spark'
      s.style.color = starColor(lit)
      s.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M12 1.8l2.9 6.6 7.2.7-5.4 4.8 1.6 7-6.3-3.7-6.3 3.7 1.6-7L1.9 9.1l7.2-.7z" fill="currentColor"/></svg>'
      el.appendChild(s)
      const idx = lit
      gsap.fromTo(
        s,
        { x: sx, y: sy, scale: 0.4, opacity: 0 },
        {
          keyframes: [
            { x: (sx + t.left) / 2 + 30, y: Math.min(sy, t.top) - 60, scale: 1.2, opacity: 1, duration: 0.28, ease: 'power2.out' },
            { x: t.left + t.width / 2 - 6, y: t.top + t.height / 2 - 6, scale: 0.6, duration: 0.3, ease: 'power2.in' },
          ],
          onComplete: () => {
            s.remove()
            stars[idx].classList.add('is-lit')
          },
        },
      )
    }

    let progress = 0
    const assets = [...cover.layers.map((l) => layerSrc(l.src)), ...(showCanvas ? pages.map((p) => slideSrc(p.no, 480)) : [])]
    const loading = preload(assets, (p) => {
      progress = p
    })
    const ticker = setInterval(() => {
      const want = Math.ceil(progress * STARS)
      if (lit < want) {
        emit()
        lit += 1
        q('.intro__pct')[0].textContent = String(Math.round((lit / STARS) * 100)).padStart(2, '0')
      }
    }, small ? 45 : 80)

    const minTime = new Promise((r) => setTimeout(r, showCanvas ? (small ? 450 : 900) : 400))
    const maxTime = new Promise((r) => setTimeout(r, 4000))
    const fonts = document.fonts?.ready ?? Promise.resolve()

    Promise.race([Promise.all([loading, minTime, fonts]), maxTime]).then(() => {
      if (killed) return
      progress = 1
      // 等最后几颗星落位
      const waitStars = setInterval(() => {
        if (lit < STARS && !killed) return
        clearInterval(waitStars)
        gsap.delayedCall(0.25, showCanvas ? playCanvas : finish)
      }, 30)
    })

    const finish = () => {
      // 淡出一开始就放行点击与滚动；即使淡出动画被挂起（如标签页在后台），遮罩也不会挡住页面
      el.style.pointerEvents = 'none'
      lockScroll(false)
      finishIntro()
      setTimeout(() => !killed && setDone(true), 900)
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => setDone(true),
      })
    }

    const playCanvas = () => {
      const canvas = q('.intro__canvas')[0]
      const first = q('.intro__frame')[0]
      const tl = gsap.timeline({ defaults: { ease: EASE } })
      tl.to(q('.intro__loader'), { opacity: 0, y: -12, duration: 0.3 })
        .set(canvas, { visibility: 'visible' })
        .from(q('.intro__frame'), {
          opacity: 0,
          scale: 0.86,
          duration: small ? 0.35 : 0.55,
          stagger: { each: small ? 0.004 : 0.008, from: 'start' },
        })
        .add(() => {
          // 镜头推进：以 01 画板中心为原点放大到铺满视口
          const c = canvas.getBoundingClientRect()
          const f = first.getBoundingClientRect()
          const fx = f.left - c.left + f.width / 2
          const fy = f.top - c.top + f.height / 2
          const scale = Math.max(window.innerWidth / f.width, window.innerHeight / f.height) * 1.02
          gsap.set(canvas, { transformOrigin: `${fx}px ${fy}px` })
          gsap
            .timeline()
            .to(canvas, {
              x: window.innerWidth / 2 - (c.left + fx),
              y: window.innerHeight / 2 - (c.top + fy),
              scale,
              duration: small ? 0.6 : 1.1,
              ease: EASE_IN_OUT,
            })
            .to(q('.intro__label'), { opacity: 0, duration: 0.2 }, 0)
            .add(finish, small ? 0.4 : 0.8)
        }, small ? '+=0.05' : '+=0.15')
    }

    return () => {
      killed = true
      clearInterval(ticker)
      ctx.revert()
      lockScroll(false)
    }
  }, [withCanvas])

  if (done) return null

  return (
    <div ref={root} className="intro" aria-hidden="true">
      <div className="intro__loader">
        <img className="intro__witch" src={ip.broom} alt="" width="728" height="600" />
        <div className="intro__bar">
          {Array.from({ length: STARS }, (_, i) => (
            <i key={i} style={{ color: starColor(i) }}>
              <StarIcon size={14} />
            </i>
          ))}
        </div>
        <span className="intro__pct">00</span>
      </div>

      {withCanvas && (
        <div className="intro__canvas">
          {pages.map((p) => (
            <figure key={p.no} className="intro__frame" data-tone={p.tone}>
              <figcaption className="intro__label">{frameName(p.no)}</figcaption>
              <img src={slideSrc(p.no, 480)} alt="" width="480" height="270" />
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
