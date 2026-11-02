import { useEffect, useRef } from 'react'
import { chapters } from '../data/portfolio.js'
import { reducedMotion } from '../lib/motion.js'
import { isTouch, isSmall } from '../lib/device.js'

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

// 只混合四色光谱（+ 底色 #0e0e11）；u_focus 为悬停章节色，u_focusAmt 控制其占比
const FRAG = `precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform vec3 u_focus; uniform float u_focusAmt;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
float blob(vec2 p, vec2 c, float r){ vec2 d = p - c; return exp(-dot(d, d) / r); }
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = u_time * 0.07;
  vec2 m = vec2(u_mouse.x * asp, u_mouse.y);
  vec2 w = p + 0.12 * vec2(sin(p.y * 3.1 + t * 2.3), cos(p.x * 2.4 - t * 1.7));
  w += (m - p) * 0.10 * exp(-dot(m - p, m - p) * 3.0);
  float b0 = blob(w, vec2(asp * (0.64 + 0.10 * sin(t * 1.1)), 0.78 + 0.08 * cos(t * 1.3)), 0.10);
  float b1 = blob(w, vec2(asp * (0.88 + 0.06 * cos(t * 0.9)), 0.42 + 0.12 * sin(t * 1.2)), 0.08);
  float b2 = blob(w, vec2(asp * (0.70 + 0.12 * cos(t * 1.4)), 0.12 + 0.08 * sin(t)), 0.09);
  float b3 = blob(w, vec2(asp * (0.42 + 0.10 * sin(t * 0.8)), 0.95 + 0.06 * cos(t * 1.6)), 0.07);
  vec3 col = vec3(0.055, 0.055, 0.067);
  vec3 glow = c0 * b0 + c1 * b1 + c2 * b2 + c3 * b3;
  float sum = b0 + b1 + b2 + b3;
  glow = mix(glow, u_focus * sum, u_focusAmt);
  col += glow * 0.62;
  col *= mix(0.55, 1.0, smoothstep(0.0, 0.62, uv.x));
  col *= mix(0.7, 1.0, smoothstep(0.0, 0.35, uv.y));
  gl_FragColor = vec4(col, 1.0);
}`

/**
 * 首屏四色流体背景：WebGL 低分辨率渲染，随鼠标轻微扰动；
 * 首屏不可见时暂停；手机降分辨率与帧率；不支持 WebGL 或减少动态效果时降级为静态渐变。
 */
export default function FluidBackground({ focus }) {
  const canvas = useRef(null)
  const state = useRef({ focus: null, amt: 0 })

  useEffect(() => {
    state.current.focusTarget = focus
  }, [focus])

  useEffect(() => {
    const el = canvas.current
    if (reducedMotion) return undefined
    const gl = el.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return undefined
    el.classList.add('is-live')

    const sh = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      el.classList.remove('is-live')
      return undefined
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (n) => gl.getUniformLocation(prog, n)
    const U = { res: u('u_res'), time: u('u_time'), mouse: u('u_mouse'), focus: u('u_focus'), amt: u('u_focusAmt') }
    chapters.forEach((c, i) => gl.uniform3fv(u(`c${i}`), hex(c.color)))

    const small = isSmall()
    const scale = small ? 0.28 : 0.45
    const frameGap = small ? 1000 / 30 : 0
    const resize = () => {
      el.width = Math.max(2, Math.round(el.clientWidth * scale))
      el.height = Math.max(2, Math.round(el.clientHeight * scale))
      gl.viewport(0, 0, el.width, el.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 }
    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth
      mouse.ty = 1 - e.clientY / window.innerHeight
    }
    if (!isTouch) window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(el)

    const focusRGB = [1, 0.24, 0.43]
    const s = state.current
    let raf = 0
    let last = 0
    const t0 = performance.now()
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible || now - last < frameGap) return
      last = now
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      const target = s.focusTarget ? 1 : 0
      s.amt += (target - s.amt) * 0.06
      if (s.focusTarget) hex(s.focusTarget).forEach((v, i) => (focusRGB[i] += (v - focusRGB[i]) * 0.12))
      gl.uniform2f(U.res, el.width, el.height)
      gl.uniform1f(U.time, (now - t0) / 1000)
      gl.uniform2f(U.mouse, mouse.x, mouse.y)
      gl.uniform3fv(U.focus, focusRGB)
      gl.uniform1f(U.amt, s.amt * 0.85)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <div className="fluid" aria-hidden="true">
      <canvas ref={canvas} className="fluid__canvas" />
    </div>
  )
}
