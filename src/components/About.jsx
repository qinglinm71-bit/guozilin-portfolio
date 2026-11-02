import { useLayoutEffect, useRef } from 'react'
import { about, chapterById, layerSrc } from '../data/portfolio.js'
import { gsap, reducedMotion } from '../lib/motion.js'
import { isTouch } from '../lib/device.js'
import { Split } from './Split.jsx'

/** 02 个人简介：能力数字滚动计数；工具列表横向无缝滚动，悬停减速 */
export default function About() {
  const marquee = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion) return undefined
    const track = marquee.current.querySelector('.marquee__track')
    const tween = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
    const slow = () => gsap.to(tween, { timeScale: 0.18, duration: 0.8, ease: 'power2.out' })
    const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.8, ease: 'power2.out' })
    const el = marquee.current
    if (!isTouch) {
      el.addEventListener('pointerenter', slow)
      el.addEventListener('pointerleave', fast)
    }
    return () => {
      tween.kill()
      el.removeEventListener('pointerenter', slow)
      el.removeEventListener('pointerleave', fast)
    }
  }, [])

  const tools = about.toolkit.tools

  return (
    <section className="section about" id="about" data-section="about" data-page="2" data-theme="#7b5cff" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__side">
          <div className="about__portrait" data-reveal="clip">
            <img data-parallax="0.06" src={layerSrc(about.portrait)} alt={about.name} width="646" height="848" loading="lazy" decoding="async" />
          </div>
          <div className="about__id" data-reveal="up">
            <strong>{about.name}</strong>
            <span>{about.role}</span>
          </div>
        </div>

        <div className="about__main">
<span className="eyebrow" data-reveal="up">
            <b>P.02</b>
            <i data-reveal="line" />
            {about.tag}
          </span>
          <h2 className="section__title" id="about-title" data-reveal="chars">
            <Split text={about.title} />
          </h2>
          <p className="about__bio" data-reveal="up">
            {about.bio}
          </p>

          <ol className="skills">
            {about.skills.map((s) => (
              <li key={s.no} className="skill" style={{ '--c': chapterById[s.chapter].color }} data-reveal="up">
                <span className="skill__no">{s.no}</span>
                <span className="skill__title">{s.title}</span>
                <span className="skill__value">
                  <b data-count-view={s.value}>{s.value}</b>
                  {s.suffix}
                </span>
                <span className="skill__unit">{s.unit}</span>
                <img className="skill__art" src={layerSrc(s.layer)} alt="" loading="lazy" decoding="async" />
              </li>
            ))}
          </ol>

          <div className="fact" data-reveal="up">
            <span className="fact__label">{about.education.label}</span>
            <div className="fact__row">
              <strong>{about.education.school}</strong>
              <span className="fact__period">{about.education.period}</span>
            </div>
            <p className="fact__major">{about.education.major}</p>
            <p className="fact__note">{about.education.courses}</p>
          </div>
        </div>
      </div>

      <div className="marquee" ref={marquee} aria-label={`${about.toolkit.label}：${tools.map((t) => t.name).join('、')}`}>
        <span className="marquee__label">{about.toolkit.label}</span>
        <div className="marquee__viewport">
          <ul className="marquee__track" aria-hidden="true">
            {[...tools, ...tools, ...tools, ...tools].map((t, i) => (
              <li key={i}>
                <b>{t.abbr}</b>
                <span>{t.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <span className="marquee__more">{about.toolkit.more}</span>
      </div>
    </section>
  )
}
