import { useLayoutEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { caseBySlug, cases, pad, site, slideSrc } from '../data/portfolio.js'
import { gsap, ScrollTrigger, scrollToTarget } from '../lib/motion.js'
import { setTheme } from '../lib/theme.js'
import { useScrollMotion } from '../lib/useScrollMotion.js'
import { usePageTracking } from '../lib/usePageTracking.js'
import { useGo } from '../lib/transition.jsx'
import CaseHero from '../components/CaseHero.jsx'
import SlidePage from '../components/SlidePage.jsx'
import Viewer from '../components/Viewer.jsx'
import Contact from '../components/Contact.jsx'
import { Split } from '../components/Split.jsx'
import { Glass } from '../components/Glass.jsx'

export default function Case({ onNav }) {
  const { slug } = useParams()
  const kase = caseBySlug[slug]
  if (!kase) return <Navigate to="/" replace />
  // key 保证切换案例时整页重新挂载、动效重新初始化
  return <CaseView key={slug} kase={kase} onNav={onNav} />
}

/** 案例页：章节页首屏 → 概要 → 分段导航 → 按 Figma 顺序的画板 → 下一个案例 → 联系 */
function CaseView({ kase, onNav }) {
  const root = useRef(null)
  const go = useGo()
  const [viewer, setViewer] = useState(null)
  const [section, setSection] = useState(kase.sections[0].no)
  const [indexOpen, setIndexOpen] = useState(false)
  const next = cases[(kase.index + 1) % cases.length]
  const { chapter } = kase

  useLayoutEffect(() => {
    onNav({ active: 'work', current: kase.hero.no, fallback: 'work' })
    setTheme(chapter.color, { immediate: true })
    const ctx = gsap.context(() => {
      root.current.querySelectorAll('[data-case-section]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setSection(el.dataset.caseSection),
        })
      })
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useScrollMotion(root)
  usePageTracking(root, onNav)

  const open = (no) => setViewer(kase.pages.findIndex((p) => p.no === no))

  return (
    <main ref={root} className="page page--case" style={{ '--c': chapter.color }}>
      <CaseHero chapter={chapter} page={kase.hero}>
        <div className="case-bar container">
          <Glass
            as="a"
            href="/#work"
            className="pill case-bar__back"
            onClick={(e) => {
              e.preventDefault()
              go('/#work')
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            全部作品
          </Glass>
          <span className="case-bar__file">
            CASE {chapter.no} / {pad(cases.length)}
          </span>
        </div>
      </CaseHero>

      <section className="case-intro container" aria-label="案例概要">
        <div className="case-intro__lead">
          <span className="eyebrow" data-reveal="up">
            <i data-reveal="line" />
            {chapter.header}
          </span>
          <h2 className="case-intro__title" data-reveal="chars">
            <Split text={kase.name} />
          </h2>
          <p className="case-intro__sub" data-reveal="up">
            {kase.sub}
          </p>
        </div>
        <dl className="case-intro__meta">
          {chapter.desc.map((line, i) => (
            <div key={line} data-reveal="up">
              <dt>{pad(i + 1)}</dt>
              <dd>{line}</dd>
            </div>
          ))}
          <div data-reveal="up">
            <dt>PAGES</dt>
            <dd className="case-intro__range">
              <span data-count-view={kase.first} data-pad="2">
                {pad(kase.first)}
              </span>
              <i />
              <span data-count-view={kase.last} data-pad="2">
                {pad(kase.last)}
              </span>
              <em>/ {site.total}</em>
            </dd>
          </div>
        </dl>
      </section>

      <div className="subnav">
        <div className="subnav__inner container">
          <ol className="subnav__list">
            {kase.sections.map((s) => (
              <li key={s.no}>
                <a
                  href={`#s-${s.no}`}
                  className={section === s.no ? 'is-active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget(`#s-${s.no}`, { offset: -150 })
                  }}
                >
                  <b>{s.no}</b>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
          <button type="button" className={`subnav__index ${indexOpen ? 'is-open' : ''}`} onClick={() => setIndexOpen((v) => !v)} aria-expanded={indexOpen}>
            原稿索引
            <i aria-hidden="true" />
          </button>
        </div>
        <div className={`subnav__panel ${indexOpen ? 'is-open' : ''}`}>
          <ol className="container thumbs">
            {kase.pages.map((p) => (
              <li key={p.no}>
                <button
                  type="button"
                  className="thumb"
                  data-cursor="放大"
                  onClick={() => {
                    setIndexOpen(false)
                    open(p.no)
                  }}
                >
                  <span className="thumb__img" data-tone={p.tone}>
                    <img src={slideSrc(p.no, 480)} alt="" width="480" height="270" loading="lazy" decoding="async" />
                  </span>
                  <span className="thumb__cap">
                    <b>{pad(p.no)}</b>
                    {p.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {kase.sections.map((s) => (
        <section key={s.no} id={`s-${s.no}`} className="case-section container" data-case-section={s.no}>
          <header className="case-section__head">
            <span className="case-section__no" data-reveal="up">
              {s.no}
            </span>
            <div className="case-section__text">
              <span className="case-section__range" data-reveal="up">
                P.{pad(s.pages[0].no)}
                {s.pages.length > 1 && `—${pad(s.pages[s.pages.length - 1].no)}`}
              </span>
              <h2 className="case-section__title" data-reveal="chars">
                <Split text={s.title} />
              </h2>
            </div>
            <i className="case-section__line" data-reveal="line" aria-hidden="true" />
          </header>
          <div className="slides">
            {s.pages.map((p) => (
              <SlidePage key={p.no} page={p} onOpen={open} />
            ))}
          </div>
        </section>
      ))}

      <section className="next-case container" style={{ '--c': next.chapter.color }} aria-label="下一个案例">
        <a
          href={`/work/${next.slug}`}
          className="next-case__link"
          data-cursor="下一章"
          onClick={(e) => {
            e.preventDefault()
            go(`/work/${next.slug}`, { kase: next })
          }}
        >
          <span className="next-case__eyebrow" data-reveal="up">
            NEXT CASE / {next.chapter.no}
          </span>
          <span className="next-case__title" data-reveal="chars">
            <Split text={next.name} />
          </span>
          <span className="next-case__sub" data-reveal="up">
            {next.sub}
          </span>
          <span className="next-case__frame" data-reveal="clip">
            <img src={slideSrc(next.cover, 1440)} alt="" width="1440" height="810" loading="lazy" decoding="async" />
          </span>
        </a>
      </section>

      <Contact theme={chapter.color} />

      {viewer !== null && <Viewer pages={kase.pages} index={viewer} onChange={setViewer} onClose={() => setViewer(null)} />}
    </main>
  )
}
