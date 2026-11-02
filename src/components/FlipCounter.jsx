import { pad } from '../data/portfolio.js'

/** 翻页计数器：每一位数字是一列 0–9，切换时整列滚动到目标位 */
export function FlipCounter({ value, total, className = '' }) {
  const digits = pad(value).split('')
  return (
    <span className={`flip ${className}`} aria-label={`第 ${value} 页，共 ${total} 页`}>
      <span className="flip__digits" aria-hidden="true">
        {digits.map((d, i) => (
          <span className="flip__col" key={i}>
            <span className="flip__reel" style={{ transform: `translateY(${-Number(d) * 10}%)` }}>
              {'0123456789'.split('').map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
      <span className="flip__total" aria-hidden="true">
        / {total}
      </span>
    </span>
  )
}
