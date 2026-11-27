# Tools, skills and libraries for the portfolio rebuild

Researched 2026-11-27 from GitHub, skill directories and vendor docs. Social-media sources were not searched directly. Community skills are not security-audited: read a skill's `SKILL.md` before installing it.

## Install first (small, high value)
| What | Why | Install |
|---|---|---|
| Playwright MCP | Lets Claude Code open the site, screenshot it at several sizes and iterate on what it sees | `claude mcp add playwright npx @playwright/mcp@latest` |
| GSAP official skills (8 skills: core, timeline, scrolltrigger, plugins, utils, react, frameworks, performance) | Teaches correct GSAP/ScrollTrigger usage | `npx skills add https://github.com/greensock/gsap-skills` or `/plugin marketplace add greensock/gsap-skills` |
| Vercel `web-design-guidelines` skill | Audits UI code against 100+ accessibility / UX / performance rules | `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines` |
| Context7 MCP | Current docs for GSAP, Lenis, Supabase etc. instead of stale training data | `claude mcp add context7 -- npx -y @upstash/context7-mcp` (or the Context7 plugin) |
| `frontend-design` skill (Anthropic) | Pushes for a distinct aesthetic and away from generic AI-looking pages | Install from the plugin marketplace (`/plugin`) or the skills CLI; check the version you get |

## Libraries (no tool install, load from npm or a CDN)
- **GSAP 3.13+**: fully free including SplitText, Flip, MorphSVG, DrawSVG, MotionPath, ScrollSmoother (Webflow acquisition, April 2025). Standard licence allows commercial use.
- **Lenis**: smooth scroll. Sync with ScrollTrigger exactly like this:
  ```js
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
  Use `data-lenis-prevent` on nested scroll areas; Lenis does not scroll over iframes.
- **CSS View Transitions** for the Home -> Portfolio switch: same-document transitions work in Chrome/Edge 111, Safari 18, Firefox 144. Treat as progressive enhancement with a GSAP/CSS fallback.
- **CSS scroll-driven animations**: still a cross-browser focus area of Interop 2026, so keep GSAP ScrollTrigger as the primary mechanism.

## Motion assets
- **Lottie / dotLottie**: best for After Effects work exported with Bodymovin; light on the page (a light `lottie-web` build is about 46 KB gzipped; verify before choosing).
- **Rive**: only if you need real interactive state machines; its web runtime is about 1 MB gzipped, heavy for a few small animations.
- **Remotion** (React video) with its official agent skills: not for the site itself, but good for data-driven motion graphics and design-education reels. Start with `npx create-video --yes --blank my-video`.
- **Spline** and **Three.js / React Three Fiber**: only if the chosen direction needs 3D. Not needed for a flat editorial direction.

## Optional collections (review before installing)
- `freshtechbro/claudedesignskills` (23 skills: GSAP ScrollTrigger, Three.js, R3F, Motion, Spline, Lottie…): `npx -y skills add freshtechbro/claudedesignskills --agent claude-code`.
- `github/awesome-copilot` `premium-frontend-ui`: `npx -y skills add github/awesome-copilot --skill premium-frontend-ui --agent claude-code`. It leans toward animation-heavy dark UIs, which conflicts with this brief; use selectively.

## 2026 trend notes that fit the brief (Webflow trends article, Awwwards portfolio winners)
- Human craft as the differentiator: hand-made, proprietary effects and illustration over template looks.
- Minimal copy: let whitespace and the work carry the message.
- "TL;DR" overview first, details on demand (fits Home -> Portfolio -> case study).
- Dynamic text treatments and guided scrolling (progress cues) done with restraint.
- Awwwards portfolio winners are mostly built with GSAP, Three.js/WebGL, Lottie, Motion and Barba.js-style page transitions.
