/** 逐字拆分，配合遮罩做字符错位入场 */
export function Split({ text, className = '', ...rest }) {
  return (
    <span className={`split ${className}`} aria-label={text} {...rest}>
      <span className="split__mask" aria-hidden="true">
        {[...text].map((ch, i) => (
          <span className="split__char" key={i}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </span>
  )
}
