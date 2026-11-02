import { createContext, useCallback, useContext, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { frameName } from '../data/portfolio.js'
import { gsap, EASE, EASE_IN_OUT, reducedMotion, scrollToHash, scrollToTarget, scrollToTop, setEnterDelay } from './motion.js'
import { setTheme } from './theme.js'

const TransitionContext = createContext(() => {})

/**
 * 章节过渡：整屏被该章节颜色的液态玻璃擦过，中间出现巨大的章节编号，
 * 切换路由并回到顶部后，玻璃继续上移离场露出新页面。
 * go('/work/xxx', { kase }) 进入案例；go('/#about') 回到首页锚点。
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const wipe = useRef(null)
  const busy = useRef(false)
  const pendingHash = useRef(null)

  const go = useCallback(
    (to, { kase } = {}) => {
      const [path = '/', hash] = to.split('#')
      const target = path || '/'
      if (target === location.pathname) {
        if (hash) scrollToTarget(`#${hash}`)
        else scrollToTarget('#top', { offset: 0 })
        return
      }
      if (busy.current) return
      const color = kase?.chapter.color ?? '#ff3d6e'
      if (reducedMotion) {
        pendingHash.current = hash ?? null
        setTheme(color, { immediate: true })
        scrollToTop()
        navigate(target)
        return
      }
      busy.current = true
      // 兜底：动画若被挂起（如标签页在后台），4 秒后解除锁定，避免之后的点击全部失效
      setTimeout(() => {
        busy.current = false
      }, 4000)
      const el = wipe.current
      const q = gsap.utils.selector(el)
      el.style.setProperty('--wc', color)
      q('.wipe__no')[0].textContent = kase ? kase.chapter.no : '01'
      q('.wipe__label')[0].textContent = kase ? kase.chapter.header : frameName(1)

      gsap
        .timeline()
        .set(el, { visibility: 'visible' })
        .fromTo(
          q('.wipe__glass'),
          { yPercent: 100, borderRadius: '50% 50% 0 0 / 22% 22% 0 0' },
          { yPercent: 0, borderRadius: '0% 0% 0 0 / 0% 0% 0 0', duration: 0.95, ease: EASE_IN_OUT },
        )
        .fromTo(q('.wipe__no'), { yPercent: 70, scale: 0.86, opacity: 0 }, { yPercent: 0, scale: 1, opacity: 1, duration: 0.8, ease: EASE }, 0.4)
        .fromTo(q('.wipe__label'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: EASE }, 0.6)
        .add(() => {
          pendingHash.current = hash ?? null
          setEnterDelay(0.45)
          setTheme(color, { immediate: true })
          // 玻璃完全遮住时回到顶部，再挂载新页面，保证滚动触发从初始状态开始
          scrollToTop()
          navigate(target)
        }, 1.05)
    },
    [location.pathname, navigate],
  )

  // 新页面已挂载：处理锚点并让玻璃离场（父组件的 layout effect 在子页面之后执行）
  useLayoutEffect(() => {
    const hash = pendingHash.current
    pendingHash.current = null
    if (hash) scrollToHash(`#${hash}`)
    if (!busy.current) return
    const el = wipe.current
    const q = gsap.utils.selector(el)
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false
          setEnterDelay(0)
          gsap.set(el, { visibility: 'hidden' })
        },
      })
      .to(q('.wipe__no, .wipe__label'), { yPercent: -60, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.04 }, 0.1)
      .to(q('.wipe__glass'), { yPercent: -100, borderRadius: '0 0 50% 50% / 0 0 22% 22%', duration: 1, ease: EASE_IN_OUT }, 0.3)
  }, [location.pathname])

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div ref={wipe} className="wipe" aria-hidden="true">
        <div className="wipe__glass" />
        <div className="wipe__content">
          <span className="wipe__no" />
          <span className="wipe__label" />
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

export const useGo = () => useContext(TransitionContext)
