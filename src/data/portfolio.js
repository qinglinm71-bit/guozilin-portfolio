/**
 * 作品集内容配置 —— 唯一数据源
 * 全部文案、顺序与图片均来自 Figma「作品集定稿」页（画板 01 封面 Cover → 54 封底 Thanks）。
 * 组件只负责渲染；增删 / 调整页面只需改这里。
 *
 * 图片约定：public/slides/{NN}.webp      2x（2880×1620）
 *           public/slides/{NN}-1440.webp  1x
 *           public/slides/{NN}-480.webp   缩略图
 *           public/layers/*.webp          封面 / 章节页分层素材（含透明通道）
 * 坐标约定：x / y / w / h 均为 Figma 画板（1440×810）内的设计坐标。
 */

export const site = {
  name: '郭子琳',
  brand: 'GUO ZILIN  ·  DESIGN WORKS 2026',
  total: 54,
  contact: 'GUO ZILIN  ·  18535650191  ·  18535650191@163.com',
}

/** 01 封面 Cover —— 用 HTML 重建以实现分层入场动效 */
export const cover = {
  header: 'UI / UX · 视觉设计',
  tag: 'DESIGN PORTFOLIO 2026',
  title: '设计作品集',
  titleEn: 'DESIGN WORKS',
  ghost: 'PORTFOLIO',
  rule: ['#ff3d6e', '#ff7a3d', '#2f6bff', '#7b5cff'],
  name: '郭子琳  ·  UI / 视觉设计师',
  fields: 'C端 APP  /  H5 运营  /  B端 SaaS  /  IP · 海报 · 字体',
  stats: [
    { value: 30, suffix: '+', label: 'APP 页面', x: 80 },
    { value: 5, suffix: '', label: 'H5 活动', x: 210 },
    { value: 16, suffix: '', label: 'B端页面', x: 340 },
    { value: 20, suffix: '+', label: '字体 & IP', x: 470 },
  ],
  badge: '4 类项目 · 54 页完整叙事',
  footer: 'GUO ZILIN  ·  18535650191  ·  18535650191@163.com',
  // depth：鼠标视差强度（越大越靠前）
  layers: [
    { src: 'cover-web', x: 703, y: 113.8, w: 713.4, h: 488.1, depth: 0.35, from: 'up' },
    { src: 'cover-phone1', x: 629.7, y: 208.2, w: 347.7, h: 557.4, depth: 0.7, from: 'left' },
    { src: 'cover-phone2', x: 875.2, y: 238.9, w: 312.5, h: 532, depth: 0.9, from: 'up' },
    { src: 'cover-phone3', x: 1079.1, y: 176.8, w: 341.5, h: 531, depth: 0.75, from: 'right' },
    { src: 'cover-3d-box', x: 1267, y: 570, w: 112.6, h: 112.6, depth: 1.4, from: 'pop', float: true },
    { src: 'cover-3d-bag', x: 641, y: 583.2, w: 103.2, h: 112.4, depth: 1.5, from: 'pop', float: true },
  ],
}

/** 四个章节（以 Figma 中的 Chapter 页为分隔） */
export const chapters = [
  {
    id: 'chapter-01',
    page: 4,
    no: '01',
    nav: 'C端设计',
    label: 'CHAPTER 01',
    header: 'CHAPTER 01 · C端设计',
    title: 'C端设计',
    titleEn: 'CONSUMER APP',
    desc: ['美物清单 · 社交电商 APP', '从竞品与用户洞察出发，完成信息架构、原型、视觉规范与核心页面设计'],
    footer: 'MEIWU QINGDAN  ·  SOCIAL E-COMMERCE APP',
    pageLabel: '01  C端设计 · 美物清单',
    color: '#ff3d6e',
    layers: [
      { src: 'ch1-phone-a', x: 748.8, y: 185.6, w: 401.8, h: 579.6, depth: 0.6 },
      { src: 'ch1-phone-b', x: 948.3, y: 112.7, w: 472.1, h: 661.8, depth: 1 },
    ],
  },
  {
    id: 'chapter-02',
    page: 22,
    no: '02',
    nav: 'C端H5运营',
    label: 'CHAPTER 02',
    header: 'CHAPTER 02 · C端H5运营',
    title: 'C端H5运营',
    titleEn: 'CAMPAIGN H5',
    desc: ['美物清单 · 运营活动视觉', '会员大放价 / 女神节 / 薅羊毛 / 官方立减 / 年度账单 / Banner 与弹窗'],
    footer: 'MEIWU QINGDAN  ·  CAMPAIGN H5 DESIGN',
    pageLabel: '02  C端H5 · 运营活动',
    color: '#ff7a3d',
    layers: [
      { src: 'ch2-phone-a', x: 705.4, y: 204.4, w: 360.8, h: 575.1, depth: 0.6 },
      { src: 'ch2-phone-b', x: 897.2, y: 155.6, w: 353, h: 571.9, depth: 1 },
    ],
  },
  {
    id: 'chapter-03',
    page: 34,
    no: '03',
    nav: 'B端设计',
    label: 'CHAPTER 03',
    header: 'CHAPTER 03 · B端设计',
    title: 'B端设计',
    titleEn: 'SAAS DASHBOARD',
    desc: ['美业 SaaS 后台管理系统', '用户画像 / 功能架构 / 设计规范 / 栅格 / 业务页面 / 弹窗'],
    footer: 'BEAUTY SAAS  ·  BACKEND MANAGEMENT SYSTEM',
    pageLabel: '03  B端设计 · 美业SaaS',
    color: '#2f6bff',
    layers: [
      { src: 'ch3-web-a', x: 841.7, y: 307.9, w: 507.1, h: 374.3, depth: 0.6 },
      { src: 'ch3-web-b', x: 724.7, y: 382.9, w: 537.2, h: 389.3, depth: 1 },
    ],
  },
  {
    id: 'chapter-04',
    page: 47,
    no: '04',
    nav: '其他设计',
    label: 'CHAPTER 04',
    header: 'CHAPTER 04 · 其他设计',
    title: '其他设计',
    titleEn: 'VISUAL WORKS',
    desc: ['IP 形象 · 视觉海报 · 字体设计', '星星女巫 IP / 东方美学海报 / AI 字体设计'],
    footer: 'VISUAL WORKS  ·  IP · POSTER · TYPOGRAPHY',
    pageLabel: '04  其他设计 · IP / 海报 / 字体',
    color: '#7b5cff',
    layers: [{ src: 'ch4-ip', x: 700, y: 170, w: 699.8, h: 562.1, depth: 0.8 }],
  },
]

/**
 * 54 个画板，严格按 Figma 顺序。
 * kind: cover | chapter | slide
 * chapter: 所属章节 id（封面 / 简介 / 目录 / 封底为 null）
 * tone: 画板底色（dark: #0e0e11 / #111114；light: #f7f8fa 或浅粉渐变），用作图片加载前的占位色
 */
const D = 'dark'
const L = 'light'
const C1 = 'chapter-01'
const C2 = 'chapter-02'
const C3 = 'chapter-03'
const C4 = 'chapter-04'

export const pages = [
  { no: 1, title: '封面 Cover', kind: 'cover', chapter: null, tone: D },
  { no: 2, title: '个人简介 About', kind: 'slide', chapter: null, tone: D },
  {
    no: 3, title: '目录 Contents', kind: 'slide', chapter: null, tone: D,
    // 目录页四张章节卡片的位置（设计坐标），叠加可点击热区跳转对应章节
    hotspots: [
      { x: 80, y: 250, w: 302, h: 480, to: C1 },
      { x: 406, y: 250, w: 302, h: 480, to: C2 },
      { x: 732, y: 250, w: 302, h: 480, to: C3 },
      { x: 1058, y: 250, w: 302, h: 480, to: C4 },
    ],
  },
  { no: 4, title: 'Chapter 01 · C端设计', kind: 'chapter', chapter: C1, tone: D },
  { no: 5, title: '美物清单 · 项目封面', kind: 'slide', chapter: C1, tone: L },
  { no: 6, title: '项目背景与定位', kind: 'slide', chapter: C1, tone: L },
  { no: 7, title: '竞品分析', kind: 'slide', chapter: C1, tone: L },
  { no: 8, title: '用户画像', kind: 'slide', chapter: C1, tone: L },
  { no: 9, title: '信息架构', kind: 'slide', chapter: C1, tone: L },
  { no: 10, title: '低保真原型', kind: 'slide', chapter: C1, tone: L },
  { no: 11, title: '视觉规范 · 色彩与字体', kind: 'slide', chapter: C1, tone: L },
  { no: 12, title: '视觉规范 · 组件与图标', kind: 'slide', chapter: C1, tone: L },
  { no: 13, title: '核心页面 · 首页', kind: 'slide', chapter: C1, tone: L },
  { no: 14, title: '核心页面 · 一级页面', kind: 'slide', chapter: C1, tone: L },
  { no: 15, title: '核心页面 · 会员中心', kind: 'slide', chapter: C1, tone: D },
  { no: 16, title: '核心页面 · 商品详情与秒杀', kind: 'slide', chapter: C1, tone: L },
  { no: 17, title: '核心流程 · 返现与提现', kind: 'slide', chapter: C1, tone: L },
  { no: 18, title: '页面 · 启动引导登录搜索', kind: 'slide', chapter: C1, tone: L },
  { no: 19, title: '页面 · 缺省状态', kind: 'slide', chapter: C1, tone: L },
  { no: 20, title: '长页面展示', kind: 'slide', chapter: C1, tone: D },
  { no: 21, title: '页面总览 Showcase', kind: 'slide', chapter: C1, tone: L },
  { no: 22, title: 'Chapter 02 · C端H5运营', kind: 'chapter', chapter: C2, tone: D },
  { no: 23, title: 'H5 活动总览', kind: 'slide', chapter: C2, tone: L },
  { no: 24, title: '会员大放价 · 项目介绍', kind: 'slide', chapter: C2, tone: L },
  { no: 25, title: '会员大放价 · 视觉展示', kind: 'slide', chapter: C2, tone: L },
  { no: 26, title: '女神节 · 项目介绍', kind: 'slide', chapter: C2, tone: L },
  { no: 27, title: '女神节 · 页面展示', kind: 'slide', chapter: C2, tone: L },
  { no: 28, title: '一起薅羊毛', kind: 'slide', chapter: C2, tone: L },
  { no: 29, title: '官方立减好货', kind: 'slide', chapter: C2, tone: L },
  { no: 30, title: '年度账单 · 概念与IP', kind: 'slide', chapter: C2, tone: L },
  { no: 31, title: '年度账单 · 页面流程', kind: 'slide', chapter: C2, tone: D },
  { no: 32, title: 'H5 长页展示', kind: 'slide', chapter: C2, tone: D },
  { no: 33, title: 'Banner 与弹窗延展', kind: 'slide', chapter: C2, tone: L },
  { no: 34, title: 'Chapter 03 · B端设计', kind: 'chapter', chapter: C3, tone: D },
  { no: 35, title: '美业SaaS · 项目封面', kind: 'slide', chapter: C3, tone: L },
  { no: 36, title: '项目概述', kind: 'slide', chapter: C3, tone: L },
  { no: 37, title: '用户画像', kind: 'slide', chapter: C3, tone: L },
  { no: 38, title: '功能架构', kind: 'slide', chapter: C3, tone: L },
  { no: 39, title: '设计规范 · 色彩与字体', kind: 'slide', chapter: C3, tone: L },
  { no: 40, title: '设计规范 · 栅格与组件', kind: 'slide', chapter: C3, tone: L },
  { no: 41, title: '核心页面 · 首页工作台', kind: 'slide', chapter: C3, tone: L },
  { no: 42, title: '核心页面 · 会员管理', kind: 'slide', chapter: C3, tone: L },
  { no: 43, title: '核心页面 · 开单与预约', kind: 'slide', chapter: C3, tone: L },
  { no: 44, title: '核心页面 · 营销与库存', kind: 'slide', chapter: C3, tone: L },
  { no: 45, title: '登录页', kind: 'slide', chapter: C3, tone: L },
  { no: 46, title: '全部页面总览', kind: 'slide', chapter: C3, tone: D },
  { no: 47, title: 'Chapter 04 · 其他设计', kind: 'chapter', chapter: C4, tone: D },
  { no: 48, title: 'IP · 星星女巫', kind: 'slide', chapter: C4, tone: L },
  { no: 49, title: 'IP · 表情动作延展', kind: 'slide', chapter: C4, tone: L },
  { no: 50, title: 'IP · 场景延展', kind: 'slide', chapter: C4, tone: D },
  { no: 51, title: '视觉海报 · 东方美学', kind: 'slide', chapter: C4, tone: D },
  { no: 52, title: '视觉海报 · 美食系列', kind: 'slide', chapter: C4, tone: D },
  { no: 53, title: '字体设计', kind: 'slide', chapter: C4, tone: D },
  { no: 54, title: '封底 Thanks', kind: 'slide', chapter: null, tone: D },
]

export const pad = (n) => String(n).padStart(2, '0')
export const slideSrc = (no, size) => `/slides/${pad(no)}${size ? `-${size}` : ''}.webp`
export const layerSrc = (name) => `/layers/${name}.webp`
export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c]))

/* ================================================================
 * 网站结构（参照 maqinglin-design 的「首页 + 案例详情页」）
 * 首页：01 封面 → 03 作品目录（案例卡片）→ 02 个人简介 → 54 封底（联系）
 * 案例页 /work/:slug：章节页（04/22/34/47）为首屏，其后按 Figma 顺序排列本章画板
 * ================================================================ */

/** 03 目录 Contents 中的四张章节卡片文案；sections 为卡片里列出的分段（起始页码 + 标题） */
const contents = {
  'chapter-01': {
    slug: 'consumer-app',
    name: 'C端设计',
    sub: '美物清单 · 社交电商 APP',
    cover: 5,
    sections: [
      { from: 5, title: '项目背景 · 竞品' },
      { from: 8, title: '用户画像 · 架构' },
      { from: 10, title: '原型 · 视觉规范' },
      { from: 13, title: '核心页面解析' },
      { from: 21, title: '页面总览' },
    ],
  },
  'chapter-02': {
    slug: 'campaign-h5',
    name: 'C端 H5 运营',
    sub: '美物清单 · 活动视觉',
    cover: 23,
    sections: [
      { from: 23, title: '活动总览' },
      { from: 24, title: '会员大放价 · 女神节' },
      { from: 28, title: '薅羊毛 · 官方立减' },
      { from: 30, title: '年度账单' },
      { from: 33, title: 'Banner & 弹窗' },
    ],
  },
  'chapter-03': {
    slug: 'saas-dashboard',
    name: 'B端设计',
    sub: '美业 SaaS 后台管理系统',
    cover: 35,
    sections: [
      { from: 35, title: '项目概述 · 画像' },
      { from: 38, title: '功能架构' },
      { from: 39, title: '设计规范 · 栅格' },
      { from: 41, title: '业务页面' },
      { from: 46, title: '全部页面' },
    ],
  },
  'chapter-04': {
    slug: 'visual-works',
    name: '其他设计',
    sub: 'IP · 海报 · 字体',
    cover: 48,
    sections: [
      { from: 48, title: '星星女巫 IP' },
      { from: 49, title: 'IP 延展' },
      { from: 51, title: '视觉海报' },
      { from: 53, title: '字体设计' },
    ],
  },
}

/** 案例：每个章节一个案例页，页面按 Figma 顺序归入各分段 */
export const cases = chapters.map((chapter, index) => {
  const meta = contents[chapter.id]
  const chapterPages = pages.filter((p) => p.chapter === chapter.id && p.kind === 'slide')
  const sections = meta.sections.map((s, i) => {
    const next = meta.sections[i + 1]?.from ?? Infinity
    return { ...s, no: pad(i + 1), pages: chapterPages.filter((p) => p.no >= s.from && p.no < next) }
  })
  return {
    ...meta,
    index,
    chapter,
    hero: pages.find((p) => p.no === chapter.page),
    pages: chapterPages,
    sections,
    first: chapterPages[0].no,
    last: chapterPages[chapterPages.length - 1].no,
  }
})
export const caseBySlug = Object.fromEntries(cases.map((c) => [c.slug, c]))

/** 03 目录 Contents 标题区 */
export const contentsHead = {
  tag: 'CONTENTS · 目录',
  title: '作品目录',
  desc: '4 个章节 · 54 页 —— 从 C 端产品到运营视觉，从 B 端系统到 IP 与字体。',
}

/** 02 个人简介 About */
export const about = {
  tag: 'ABOUT ME · 个人简介',
  title: '用设计连接业务与体验',
  bio: '视觉传达设计专业，专注 C 端产品体验与运营视觉。习惯从业务目标出发梳理流程与信息架构，再以统一的视觉语言落地；兼具 3D、IP 与字体设计能力，可独立完成从原型、规范到运营包装的完整链路。',
  name: '郭子琳',
  role: 'UI / VISUAL DESIGNER',
  portrait: 'about-portrait',
  phone: '18535650191',
  email: '18535650191@163.com',
  skills: [
    { no: '01', title: 'C端 APP', value: 30, suffix: '+', unit: '高保真页面', layer: 'ch1-phone-a', chapter: 'chapter-01' },
    { no: '02', title: 'H5 运营', value: 5, suffix: '', unit: '个活动专题', layer: 'ch2-phone-a', chapter: 'chapter-02' },
    { no: '03', title: 'B端 SaaS', value: 16, suffix: '', unit: '个系统页面', layer: 'ch3-web-b', chapter: 'chapter-03' },
    { no: '04', title: 'IP · 字体', value: 20, suffix: '+', unit: '字体 & IP', layer: 'ch4-ip', chapter: 'chapter-04' },
  ],
  education: {
    label: 'EDUCATION',
    school: '山西农业大学',
    period: '2022.09 – 2026.06',
    major: '视觉传达设计 · 本科',
    courses: 'UI 设计 · 版式编排 · 插图 · 海报 · 包装 · 视觉动效',
  },
  toolkit: {
    label: 'TOOLKIT',
    tools: [
      { abbr: 'Fg', name: 'Figma' },
      { abbr: 'Ps', name: 'Photoshop' },
      { abbr: 'Ai', name: 'Illustrator' },
      { abbr: 'Ae', name: 'AE 动效' },
      { abbr: 'C4D', name: 'Cinema 4D' },
      { abbr: 'Pc', name: 'Procreate' },
      { abbr: 'AI', name: 'AIGC' },
    ],
    more: '+ 蓝湖 · 剪映 · WPS',
  },
}

/** 54 封底 Thanks */
export const thanks = {
  tag: 'THANKS FOR WATCHING',
  title: '感谢观看',
  titleEn: 'THANK YOU',
  line: '郭子琳  ·  期待与你一起做好设计',
  fields: 'UI / 视觉设计师 · C端产品 · 运营视觉 · B端系统 · IP 与字体',
  phone: '18535650191',
  email: '18535650191@163.com',
  visual: 'thanks-visual',
  footer: 'GUO ZILIN  ·  DESIGN PORTFOLIO 2026',
}

/* ================================================================
 * 第二轮：星星女巫 IP 素材（Figma 第 48–49 页导出，透明背景）
 * ================================================================ */
export const ip = {
  broom: '/ip/witch-broom.webp', // 48 / 47 章节页：骑扫帚挥魔法棒 → 加载动画
  wave: '/ip/witch-wave.webp', // 49 · 04 表情动作：挥手 → 封底告别 / 回到顶部
  peace: '/ip/witch-peace.webp', // 49 · 01 表情动作：比耶 → 查看器最后一页彩蛋
}

/** Figma 画板名，用于画板名标签，如「04 Chapter 01 · C端设计」 */
export const frameName = (no) => `${pad(no)} ${pages[no - 1].title}`

/** 把一组分层素材的设计坐标换算成相对包围盒的百分比，用于响应式主视觉 */
export function layerBox(layers) {
  const x0 = Math.min(...layers.map((l) => l.x))
  const y0 = Math.min(...layers.map((l) => l.y))
  const x1 = Math.max(...layers.map((l) => l.x + l.w))
  const y1 = Math.max(...layers.map((l) => l.y + l.h))
  const W = x1 - x0
  const H = y1 - y0
  return {
    ratio: W / H,
    items: layers.map((l) => ({
      ...l,
      left: ((l.x - x0) / W) * 100,
      top: ((l.y - y0) / H) * 100,
      width: (l.w / W) * 100,
      height: (l.h / H) * 100,
    })),
    at: (x, y) => ({ left: ((x - x0) / W) * 100, top: ((y - y0) / H) * 100 }),
  }
}
