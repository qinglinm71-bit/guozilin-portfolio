import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion.js'
import { isTouch } from '../lib/device.js'

/**
 * 液态玻璃（香水瓶 / 唇釉质感）：
 * - 半透明白 + 当前章节色调，blur + saturate；1px 上亮下暗渐变描边，内阴影与底部投影
 * - Chromium 下边缘折射（SVG feDisplacementMap，见 <GlassDefs>），其他浏览器降级为毛玻璃
 * - 高光跟随光标，边缘带四色光谱色散；悬停轻微膨胀、按下挤扁、松开弹性回弹
 * 只用于导航、按钮、标签、计数器、控制条与提示，不覆盖作品画板。
 */
export const Glass = forwardRef(function Glass(
  { as: Tag = 'div', className = '', tint, refract = true, liquid = true, children, style, ...rest },
  outerRef,
) {
  const ref = useRef(null)
  useImperativeHandle(outerRef, () => ref.current)

  useEffect(() => {
    const el = ref.current
    if (el === null || isTouch || reducedMotion) return undefined
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    }
    const enter = () => liquid && gsap.to(el, { scale: 1.035, duration: 0.6, ease: 'brand', overwrite: 'auto' })
    const leave = () => liquid && gsap.to(el, { scale: 1, scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
    const down = () => liquid && gsap.to(el, { scaleX: 1.06, scaleY: 0.92, duration: 0.14, ease: 'power2.out', overwrite: 'auto' })
    const up = () => liquid && gsap.to(el, { scaleX: 1.035, scaleY: 1.035, duration: 0.9, ease: 'elastic.out(1.1, 0.35)', overwrite: 'auto' })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointerup', up)
    }
  }, [liquid])

  return (
    <Tag
      ref={ref}
      className={`glass ${refract ? 'glass--refract' : ''} ${className}`}
      style={tint ? { ...style, '--tint': tint } : style}
      {...rest}
    >
      <span className="glass__fx" aria-hidden="true" />
      {children}
    </Tag>
  )
})

/**
 * 折射用的位移贴图：中心为中性灰（不偏移），四周边缘渐变产生向外弯曲。
 * 水平与垂直两张贴图以 50% 叠加，分别驱动 R / G 通道。
 */
const MAP = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none">
<defs>
<linearGradient id="h" x1="0" x2="1" y1="0" y2="0">
<stop offset="0" stop-color="rgb(0,128,128)"/><stop offset=".18" stop-color="rgb(128,128,128)"/>
<stop offset=".82" stop-color="rgb(128,128,128)"/><stop offset="1" stop-color="rgb(255,128,128)"/>
</linearGradient>
<linearGradient id="v" x1="0" x2="0" y1="0" y2="1">
<stop offset="0" stop-color="rgb(128,0,128)"/><stop offset=".22" stop-color="rgb(128,128,128)"/>
<stop offset=".78" stop-color="rgb(128,128,128)"/><stop offset="1" stop-color="rgb(128,255,128)"/>
</linearGradient>
</defs>
<rect width="100" height="100" fill="url(#h)"/>
<rect width="100" height="100" fill="url(#v)" opacity=".5"/>
</svg>`)

export function GlassDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="glass-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={`data:image/svg+xml,${MAP}`} preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="22" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
