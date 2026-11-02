import { pad, slideSrc, site } from '../data/portfolio.js'
import { Split } from './Split.jsx'

/**
 * 案例中的单个画板：Figma 整页导出图为主角，上方只保留页码与画板名。
 * 进场轻微 3D 翻正 + 遮罩展开（data-reveal="slide"），点击全屏查看。
 */
export default function SlidePage({ page, onOpen }) {
  return (
    <article className={`slide slide--${page.tone}`} id={`p-${pad(page.no)}`} data-page={page.no}>
      <header className="slide__meta">
        <span className="slide__no" data-reveal="up">
          {pad(page.no)}
        </span>
        <h3 className="slide__title" data-reveal="chars">
          <Split text={page.title} />
        </h3>
        <span className="slide__count" data-reveal="up">
          P.{pad(page.no)} <i>/</i> {site.total}
        </span>
      </header>

      <div className="slide__stage">
        <button
          type="button"
          className="slide__frame"
          data-reveal="slide"
          data-cursor="放大"
          onClick={() => onOpen(page.no)}
          aria-label={`全屏查看 ${pad(page.no)} ${page.title}`}
        >
          <img
            src={slideSrc(page.no, 1440)}
            srcSet={`${slideSrc(page.no, 480)} 480w, ${slideSrc(page.no, 1440)} 1440w, ${slideSrc(page.no)} 2880w`}
            sizes="(max-width: 1023px) calc(100vw - 32px), min(1680px, calc(100vw - 96px))"
            width="2880"
            height="1620"
            alt={`${pad(page.no)} ${page.title}`}
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>
    </article>
  )
}
