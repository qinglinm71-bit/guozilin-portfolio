import { useLayoutEffect, useRef } from 'react'
import { cover, ip, layerSrc, site, thanks } from '../data/portfolio.js'
import { gsap, reducedMotion, scrollToTarget, ScrollTrigger } from '../lib/motion.js'
import { copyText, toast } from '../lib/toast.js'
import { Split } from './Split.jsx'
import { Glass } from './Glass.jsx'

/** 54 封底 Thanks → 联系：玻璃卡片点击复制；星星女巫挥手告别。首页与案例页共用 */
export default function Contact({ theme = '#7b5cff' }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion) return undefined
    const ctx = gsap.context(() => {
      const witch = root.current.querySelector('.contact__witch img')
      gsap.set(witch, { yPercent: 40, opacity: 0, rotation: 0 })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 55%',
        once: true,
        onEnter: () =>
          gsap
            .timeline()
            .to(witch, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.6)' })
            // 挥手：以脚为支点左右摆动三次
            .to(witch, { rotation: 6, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: 5, transformOrigin: '50% 95%' }, '-=0.2'),
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const copy = async (text, label) => {
    const ok = await copyText(text)
    toast(ok ? `已复制${label}：${text}` : `复制失败，请手动复制 ${text}`)
  }

  const toTop = (e) => {
    const btn = e.currentTarget
    if (!reducedMotion) {
      gsap.fromTo(btn.querySelector('img'), { y: 0 }, { y: -80, opacity: 0, duration: 0.6, ease: 'power2.in', onComplete: () => gsap.set(btn.querySelector('img'), { y: 0, opacity: 1, delay: 1.2 }) })
    }
    scrollToTarget('#top', { offset: 0, duration: 1.6 })
  }

  return (
    <>
      <section ref={root} className="section contact" id="contact" data-section="contact" data-page="54" data-theme={theme} aria-labelledby="contact-title">
        <div className="contact__ghost" aria-hidden="true" data-parallax="0.18">
          {thanks.titleEn}
        </div>
        <div className="container contact__grid">
          <div className="contact__copy">
            <span className="eyebrow" data-reveal="up">
              <b>P.54</b>
              <i data-reveal="line" />
              {thanks.tag}
            </span>
            <h2 className="contact__title" id="contact-title" data-reveal="chars">
              <Split text={thanks.title} />
            </h2>
            <p className="contact__en" data-reveal="chars">
              <Split text={thanks.titleEn} />
            </p>
            <div className="contact__rule" aria-hidden="true" data-reveal="line">
              {cover.rule.map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </div>
            <p className="contact__line" data-reveal="up">
              {thanks.line}
            </p>
            <p className="contact__fields" data-reveal="up">
              {thanks.fields}
            </p>

            <div className="contact__cards" data-reveal="up">
              <Glass as="button" type="button" className="copy-card" onClick={() => copy(thanks.phone, '电话')} data-cursor="复制">
                <span className="copy-card__label">PHONE</span>
                <span className="copy-card__value">{thanks.phone}</span>
                <CopyIcon />
              </Glass>
              <Glass as="button" type="button" className="copy-card" onClick={() => copy(thanks.email, '邮箱')} data-cursor="复制">
                <span className="copy-card__label">EMAIL</span>
                <span className="copy-card__value">{thanks.email}</span>
                <CopyIcon />
              </Glass>
            </div>
          </div>

          <div className="contact__visual" data-reveal="up">
            <img data-parallax="0.06" src={layerSrc(thanks.visual)} alt="" width="1680" height="1250" loading="lazy" decoding="async" />
            <div className="contact__witch" aria-hidden="true">
              <img src={ip.wave} alt="" width="312" height="560" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <footer className="end container">
        <span className="end__line" />
        <span className="end__text">{site.contact}</span>
        <Glass as="button" type="button" className="end__top" onClick={toTop} aria-label="回到顶部" data-cursor="顶部">
          <img src={ip.broom} alt="" width="728" height="600" loading="lazy" />
        </Glass>
      </footer>
    </>
  )
}

function CopyIcon() {
  return (
    <svg className="copy-card__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
