import { gsap } from './motion.js'

/**
 * 四色光谱：当前所在章节的颜色写入 :root 的 --c，
 * 环境光、玻璃色调、进度条、光标、星星都读取它，滚动时依次 粉 → 橙 → 蓝 → 紫。
 */
const listeners = new Set()
let current = '#ff3d6e'

export function setTheme(color, { immediate = false } = {}) {
  if (!color || color === current) return
  current = color
  gsap.to(document.documentElement, {
    '--c': color,
    duration: immediate ? 0 : 0.9,
    ease: 'brand',
    overwrite: true,
  })
  listeners.forEach((fn) => fn(color))
}

export const getTheme = () => current

export function onTheme(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
