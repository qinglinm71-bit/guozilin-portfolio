# 郭子琳 · 设计作品集

UI / 视觉设计师郭子琳的个人作品集网站。内容唯一来源为 Figma「作品集定稿」页（画板 01 封面 Cover → 54 封底 Thanks）。

**上传到 GitHub、部署到 Vercel / Cloudflare 的详细步骤见 [上传与部署说明.md](./上传与部署说明.md)。**

技术栈：React 19 + Vite 8 + GSAP（ScrollTrigger）+ Lenis + React Router。需要 Node.js ≥ 22.22（推荐 24）。

## 本地运行

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

- `npm run dev`：开发预览，<http://127.0.0.1:5173>
- `npm run build`：打包到 `dist/`
- `npm run preview`：预览打包结果，<http://127.0.0.1:4173>

## 网站结构

- `/` 首页：01 封面 → 作品（03 目录，四个章节一屏展开面板）→ 关于（02 简介）→ 联系（54 封底）
- `/work/:slug` 案例页：章节页（04 / 22 / 34 / 47）为首屏 → 概要 → 分段导航 → 按 Figma 顺序排列的画板 → 下一个案例
  - `consumer-app`（P.05–21）· `campaign-h5`（P.23–33）· `saas-dashboard`（P.35–46）· `visual-works`（P.48–53）
- 点击任意画板全屏查看 2x 原图：← → / 左右滑动切换，Esc 关闭，手机支持双指缩放

## 修改内容

所有文案、顺序、图片路径集中在 `src/data/portfolio.js`，组件只负责渲染：

- `pages`：54 个画板，按 Figma 顺序排列
- `chapters` / `cases`：四个章节的文案、主题色、分层素材坐标与案例分段
- `cover` / `about` / `thanks` / `contentsHead`：封面、简介、封底、目录的文案
- `ip`：星星女巫素材

## 图片

- `public/slides/NN.webp`（2x，2880×1620）、`NN-1440.webp`（1x）、`NN-480.webp`（缩略图），由对应画板导出
- `public/layers/*.webp`：封面与章节页的分层素材（透明背景）、简介照片、封底主视觉
- `public/ip/*.webp`：星星女巫（Figma 第 48–49 页导出，透明背景）

替换某一页时，从 Figma 以 2x 导出该画板，按同名覆盖这三个文件即可。

## 视觉记号与动效

- **四色光谱**：粉 / 橙 / 蓝 / 紫对应四个章节，全站主题色（`--c`）随当前章节过渡
- **54 页画布**：开场平铺 54 张画板后推进到封面；右上角页码计数器
- **星星女巫**：加载动画、回到顶部、封底告别、查看器最后一页彩蛋、点击空白处的小星星
- **液态玻璃**：`<Glass>` 组件，Chromium 下边缘折射，其他浏览器降级为毛玻璃

GSAP + ScrollTrigger + Lenis，统一缓动 `cubic-bezier(0.22, 1, 0.36, 1)`。系统开启「减少动态效果」时只保留简单淡入；开启「降低透明度」时玻璃改为不透明深色底；触屏设备关闭自定义光标与鼠标视差。
