/** 设备与偏好检测：动效、玻璃折射、光标等按这里的结果降级 */
const hasWindow = typeof window !== 'undefined'
const mq = (q) => hasWindow && window.matchMedia(q).matches

export const reducedMotion = mq('(prefers-reduced-motion: reduce)')
export const reducedTransparency = mq('(prefers-reduced-transparency: reduce)')
/** 触屏设备：关闭自定义光标、鼠标视差、高光跟随 */
export const isTouch = mq('(hover: none), (pointer: coarse)')
/** 只有 Chromium 支持 backdrop-filter: url(#svg)，其他浏览器降级为毛玻璃 */
export const isChromium = hasWindow && Boolean(navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand)))
export const isSmall = () => hasWindow && window.innerWidth < 768

if (hasWindow) {
  const html = document.documentElement
  html.classList.toggle('is-chromium', isChromium && !reducedTransparency)
  html.classList.toggle('is-touch', isTouch)
  html.classList.toggle('reduce-motion', reducedMotion)
}
