import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'
import { reducedMotion } from './device.js'

gsap.registerPlugin(ScrollTrigger, CustomEase)

/** 全站主缓动：cubic-bezier(0.22, 1, 0.36, 1)，时长控制在 0.6–1.2s */
CustomEase.create('brand', '0.22,1,0.36,1')
CustomEase.create('brandInOut', '0.76,0,0.24,1')

export { gsap, ScrollTrigger, reducedMotion }

export const EASE = 'brand'
export const EASE_IN_OUT = 'brandInOut'
export const NAV_OFFSET = -96

// 每次进入都从顶部开始（ScrollTrigger 会接管 history.scrollRestoration，需用它的 API 设置）
if (typeof window !== 'undefined') {
  ScrollTrigger.clearScrollMemory('manual')
  window.scrollTo(0, 0)
}

let lenis = null

/** Lenis 只平滑滚轮；触屏保持原生滚动。减少动态效果时不启用 */
export function initSmoothScroll() {
  if (reducedMotion || lenis) return () => {}
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, syncTouch: false })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

export function scrollToTarget(target, { offset = NAV_OFFSET, immediate = false, duration = 1.2 } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el === null) return
  if (lenis) {
    lenis.scrollTo(el, { offset, duration, immediate, force: true })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: reducedMotion || immediate ? 'auto' : 'smooth' })
  }
}

/** 等字体与布局稳定后再跳到锚点（直接访问 /#about 或跨页跳转时使用） */
export function scrollToHash(hash) {
  const run = () => requestAnimationFrame(() => scrollToTarget(hash, { immediate: true }))
  if (document.fonts) document.fonts.ready.then(run)
  else run()
}

/** 数字从 0 滚动到目标值，只改 textContent，不触发 React 重渲染 */
export function animateCount(el, value, { duration = 1.2, delay = 0, pad = 0 } = {}) {
  const format = (v) => String(Math.round(v)).padStart(pad, '0')
  if (reducedMotion) {
    el.textContent = format(value)
    return null
  }
  const state = { v: 0 }
  el.textContent = format(0)
  return gsap.to(state, {
    v: value,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = format(state.v)
    },
  })
}

/* ---------- 转场 / 开场期间的入场延迟：首屏动效等遮罩拉开后再开始 ---------- */
let enterDelay = 0
export const setEnterDelay = (v) => {
  enterDelay = v
}
export const getEnterDelay = () => enterDelay

/* ---------- 开场动画完成信号：首页首屏在它之后入场 ---------- */
let resolveIntro
export const introDone = new Promise((r) => {
  resolveIntro = r
})
export const finishIntro = () => resolveIntro()
