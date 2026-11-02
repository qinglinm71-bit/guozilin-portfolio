import { useState } from 'react'
import { cases, contentsHead, pad, site, slideSrc } from '../data/portfolio.js'
import { setTheme } from '../lib/theme.js'
import { useGo } from '../lib/transition.jsx'
import { Split } from './Split.jsx'

/**
 * 03 目录 → 作品区：四个章节并排在一屏内，悬停 / 聚焦的一项展开显示封面与分段，
 * 其余收窄为编号与名称；点击直接进入案例。手机端为纵向排列的四张卡片。
 */
export default function WorkPanels() {
  const go = useGo()
  const [open, setOpen] = useState(0)

  const focus = (i) => {
    setOpen(i)
    setTheme(cases[i].chapter.color)
  }

  return (
    <section className="section work" id="work" data-section="work" data-page="3" data-theme={cases[open].chapter.color} aria-labelledby="work-title">
      <div className="container section__head">
        <span className="eyebrow" data-reveal="up">
          <b>P.03</b>
          <i data-reveal="line" />
          {contentsHead.tag}
        </span>
        <h2 className="section__title" id="work-title" data-reveal="chars">
          <Split text={contentsHead.title} />
        </h2>
        <p className="section__desc" data-reveal="up">
          {contentsHead.desc}
        </p>
      </div>

      <ol className="panels container">
        {cases.map((c, i) => (
          <li key={c.slug} className={`panel ${open === i ? 'is-open' : ''}`} style={{ '--c': c.chapter.color }} data-reveal="up">
            <a
              href={`/work/${c.slug}`}
              className="panel__link"
              data-cursor="查看"
              aria-label={`${c.chapter.no} ${c.name} · ${c.sub}`}
              onPointerEnter={() => focus(i)}
              onFocus={() => focus(i)}
              onClick={(e) => {
                e.preventDefault()
                go(`/work/${c.slug}`, { kase: c })
              }}
            >
              <span className="panel__media" aria-hidden="true">
                <img
                  src={slideSrc(c.cover, 1440)}
                  srcSet={`${slideSrc(c.cover, 480)} 480w, ${slideSrc(c.cover, 1440)} 1440w, ${slideSrc(c.cover)} 2880w`}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  width="2880"
                  height="1620"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="panel__shade" aria-hidden="true" />
              <i className="panel__line" aria-hidden="true" />

              <span className="panel__top">
                <span className="panel__no">{c.chapter.no}</span>
                <span className="panel__range">
                  P.{pad(c.hero.no)}—{pad(c.last)} <em>/ {site.total}</em>
                </span>
              </span>

              <span className="panel__body">
                <span className="panel__label">{c.chapter.header}</span>
                <span className="panel__title">{c.name}</span>
                <span className="panel__sub">{c.sub}</span>
                <span className="panel__sections">
                  {c.sections.map((s) => (
                    <span key={s.from}>
                      <b>{pad(s.from)}</b>
                      {s.title}
                    </span>
                  ))}
                </span>
              </span>

              <span className="panel__go" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
