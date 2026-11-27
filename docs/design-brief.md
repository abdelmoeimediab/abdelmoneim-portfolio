# Master Handoff Prompt for Claude AI — Abdelmoneim Diab Portfolio Redesign

انسخ النص الموجود داخل المربع التالي بالكامل وابعته لـ **Claude AI** (ولو حابب، ارفع معاه ملف `rasas-portfolio-guide-ar.pdf` في نفس الشات):

```markdown
I am moving my personal portfolio project to you so we can design and build it fresh from the ground up.

**IMPORTANT RULE BEFORE WE START:**
Do NOT copy or assume any previous color palette or visual layout. Instead, I want **you** to propose the visual direction, color system, and layout architecture based on my references, non-negotiable constraints, and structure below. Start by proposing **2–3 distinct visual/architectural directions** for my approval before writing the final production code.

---

### 1. Who I Am (Identity & Content Context)
- **Name:** Abdelmoneim Ashraf Diab (عبد المنعم أشرف دياب) — Creative identity: **Abdelmoneim Diab | Visual & Motion Lab** (`@abdelmoneimdiab`).
- **Title:** Senior Multimedia & Graphic Designer Specialist / Head of Graphic Design (Art Director track).
- **Education:** B.A. in Media, Mansoura University.
- **Core Expertise:** Branding & Visual Identity, Social Media Campaigns, Video Editing & Motion Graphics (Adobe After Effects, Premiere Pro), Print & Advertising, and AI Creative Workflows.
- **Experience & Clients:**
  - Head of Design Department at **MB Engineering Group**
  - Consultant for the **Ministry of Investment**
  - Agency & Brand Experience: **TRIORA Agency**, **AN Marketing**, **AG Developers**, **Next Home**, **CON.C.E.P.T**, **The Waterway**, plus independent **Freelance** projects (note: some corporate/agency work is under NDA).
- **Portfolio Links & Contact:**
  - Behance: https://www.behance.net/bodadiab
  - Video Reel (Google Drive): https://drive.google.com/drive/folders/1jIKtJWc1zTp2mR-sIEPpgVQG-CTPOdEz?usp=sharing
  - Email: abdelmoneim.ashraf.diab@gmail.com
  - Phone / WhatsApp: +20 112 202 6078
  - Hosting Target: GitHub + Vercel static deployment (previously deployed at https://abdelmoneim-portfolio-pink.vercel.app/).

---

### 2. Design References (Your Creative Compass)
Please study and synthesize the philosophy of these two references (without copying them literally):
1. **Hardik Agarwal Portfolio (`https://www.wallofportfolios.in/portfolios/hardik-agarwal/`)**
   - Use as the benchmark for Awwwards-level motion quality, smooth momentum scrolling, tactile micro-interactions, clean pacing, and effortless navigation.
2. **Rasas Portfolio Guide v1.0 (`دليل البورتفوليو — رصاص` / `rasas.co`)**
   - Use as the benchmark for visual restraint ("fewer decisions, consistent execution"), clean editorial typography, generous whitespace, and project storytelling that states **Context, Specific Role, and Visual Decision** instead of generic AI praise.

---

### 3. Non-Negotiable Visual & Motion Rules (الثوابت)
- **100% Flat Design — Zero "AI-Generated" Clichés:**
  - **NO** wireframe boxes, outlines, strokes, or borders around headlines.
  - **NO** neon glows, glassmorphism, gradient text, pill-tag clutter, or heavy drop shadows.
- **NO Pitch-Black / Dark-AI Template Look:**
  - Avoid black (`#000000`) backgrounds. Propose a refined, calm, light/warm editorial palette (e.g., warm off-white, soft paper, or architectural neutrals with restrained accent ink) that feels human-crafted and timeless.
- **No Personal Photo:**
  - Do NOT include a personal portrait photo on the home screen. Instead, include a clean, optional/hidden container (`#afterEffectsHeroVideoSlot`) reserved for a future After Effects intro video.
- **Awwwards-Level Smooth Motion (Must Work Reliably on Vercel):**
  - Integrate **Lenis** smooth momentum scrolling synchronized with **GSAP 3 + ScrollTrigger** (`gsap.registerPlugin(ScrollTrigger)` + `gsap.ticker`), avoiding jittery CSS transitions on scroll.
  - Include lightweight CSS/Web Animations API fallbacks so core entrance animations never fail or get stuck invisible on static Vercel deployments.

---

### 4. Required Information Architecture (Home Screen vs. Portfolio)
Clients visiting the site should understand who I am and trust my track record immediately, then jump smoothly into my work:
- **View 1 — Dedicated Home Screen (Separate from the Portfolio Grid):**
  - Shows **ONLY**:
    1. My Name, Title, and concise Editorial Bio (short, sharp, zero fluff).
    2. Key Credibility Signals: **Project Count / Years of Experience** and **Clients Showcase** (client names / clean flat ticker or list).
    3. Clear, smooth navigation into the separate **Portfolio** view/tab (and Experience / Contact).
  - Do **NOT** dump project cards or galleries directly onto the Home Screen.
- **View 2 — Dedicated Portfolio Tab / View:**
  - Organized into **5 Core Categories**:
    1. Social Media Design
    2. Print & Advertising
    3. Reels & Short Videos
    4. Cinematics & Commercials
    5. AI Video Production
  - Respect native media aspect ratios (`9:16` for vertical reels, `4:5` for social media, `16:9` for commercials/branding).
  - Every project item & case study view should clearly show **Client/Context, My Specific Role, and the Visual/Creative Decision** (no generic AI filler text).

---

### 5. Typography & Strict Bilingual Separation (`EN` / `AR`)
- I want a clean **EN / AR** language switcher with **100% strict separation**:
  - **English Mode (`EN`):** 100% English across the entire site — zero Arabic words anywhere. Use a refined, formal yet modern editorial font pairing (Serif + clean Sans-Serif).
  - **Arabic Mode (`AR`):** 100% Arabic across the entire site — use **Alexandria** font. Only proper English brand/company names (e.g., `MB Engineering Group`, `TRIORA Agency`, `AG Developers`) remain in English, wrapped in `<bdi dir="ltr">` so RTL punctuation and direction never break.

---

### 6. Admin Panel & Editing System (DISABLED FOR NOW)
- **Do NOT build an Admin Dashboard, Login Gate, Password screen, Edit/Delete buttons, or Supabase/LocalStorage CMS right now.**
- Keep Phase 1 100% focused on a clean, fast, static front-end experience for visitors and clients.
- Once we finalize and approve the main design and structure in Phase 1, we will design a custom Admin/Sync panel in Phase 2 tailored specifically to that finalized structure.

---

### Your First Step
Before writing the full codebase, please propose **2–3 visual & architectural directions** (covering color palette, typography pairing, Home Screen layout, and how the Home-to-Portfolio transition feels) aligned with the Hardik Agarwal and Rasas references. Once I pick a direction, we will build it together.
```
