## Background and Motivation

We now have the Mini App live on `app.openbands.xyz` and want a polished marketing site on the apex domain `openbands.xyz`. The goal is to clearly communicate the value of Openbands: verified, anonymous workplace discussions powered by zero-knowledge proofs, and to drive users to launch the app or join a waitlist. The old landing was salary-focused and outdated; the new site must align with the brand "Anonymous. Verified. Raw." and showcase the Mini App UI/UX.

## Key Challenges and Analysis

- Host strategy: Serve marketing at `openbands.xyz` while keeping the Mini App at `app.openbands.xyz`. Options: separate Vercel project (simplest) vs host-based routing in one project (middleware). Separate project reduces risk and keeps envs clean.
- Decision: Use a separate Vercel project, but keep code in the same repository (monorepo) under a new root directory `landing/`. Vercel will be configured to build from this subdirectory. This avoids duplicated assets, keeps history together, and prevents Mini App web3 deps from bloating the landing build.

### Brand tokens (proposed)
- Colors (midnight blue gradient, not pure black):
  - `midnight-900` #0B1020 (bg darkest)
  - `midnight-800` #0E1428
  - `midnight-700` #111A3A
  - Accent primary (blue): `accent-500` #5163FF, `accent-600` #3D4CFF
  - Accent secondary (purple): `secondary-500` #7C5CFF
  - Semantic: success #16A34A, warning #EAB308, danger #EF4444
- Typography: rounded sans-serif via Google Fonts `Manrope` (fallback: system-ui, sans-serif). Strong headings, comfortable line-height, slightly increased letter-spacing for hero.
- Radius: `rounded-xl` as default for cards/sections.
- Brand and visuals: Maintain monochrome + deep blue/purple accent, strong typographic hierarchy, tasteful gradients, screenshots of the app, and dark-mode support.
- Messaging: Emphasize zero-knowledge privacy, verified company domains, and candid conversations. Clear CTAs: Launch App, Join Waitlist.
- SEO/Meta: Proper OpenGraph/Twitter images, sitemap, robots, clean lighthouse scores.
- Performance: Optimized images, minimal JS for marketing, no wallet/web3 libraries on marketing pages.

## High-level Task Breakdown (Landing `openbands.xyz`)

1) Decide hosting approach and set up domain
   - Success: `openbands.xyz` serves the marketing site; `app.openbands.xyz` unchanged.

2) Create marketing app structure
   - Success: `marketing/` (or `(marketing)` route group) with standalone `layout.tsx`, `page.tsx`, and components. No web3 deps loaded.
   - Decision: Create `landing/` Next.js App Router app with Tailwind; configure Vercel project root to `landing/`.

3) Implement Navbar + sticky header
   - Success: Logo left, links to App, Docs (placeholder), X/Farcaster, and CTA button "Launch App". Mobile menu works.

4) Hero section
   - Success: New headline and subheading aligned with brand, gradient accent, primary CTA "Launch App", secondary "Join Waitlist" (Tally modal). Responsive and accessible.

5) Product showcase
   - Success: Two to three clean screenshots (feed, company page, connect flow) in a device frame with subtle tilt/shadow.

6) Value props / Features
   - Success: Cards for: Zero-knowledge privacy, Verified company domains, New/Hot feeds, Anonymous posts & comments, Cross-company discovery.

7) How it works (3 steps)
   - Success: Steps: Connect wallet → Sign in with Google → Generate ZK proof → Post anonymously. Light illustrations.

8) Social proof / Achievement
   - Success: Noirhack 2025 winner badge + logos. Optional testimonials later.

9) FAQ
   - Success: Updated Q&A for anonymity, verification, what’s public (domain only), and data handling.

10) Footer
   - Success: Brand blurb, links (X, Farcaster), legal placeholders.

11) Theming & Dark mode
   - Success: Class-based dark mode toggle persisted to localStorage. Consistent colors with app.

12) SEO & Metadata
   - Success: Title, description (~140–170 chars), OG/Twitter images, `robots.txt` allow, `sitemap.xml` basic.

13) Performance QA
   - Success: Lighthouse 90+ perf/accessibility/SEO; images optimized with Next Image.

### Deployment plan (monorepo)
- Add `landing/` app with its own `package.json`, `tailwind.config.ts`, and `next.config.ts` minimal config.
- Create new Vercel project, set Root Directory = `landing/`, attach `openbands.xyz` as Primary.
- Env: `NEXT_PUBLIC_BASE_APP_URL=https://app.openbands.xyz` for CTA links; no web3/env secrets needed.


## Project Status Board

- [ ] Decide hosting approach (separate Vercel project vs domain routing)
- [ ] Scaffold marketing app/route and base layout
- [ ] Build Navbar + mobile menu + CTA
- [ ] Build Hero with updated copy and waitlist modal
- [ ] Add Screenshots section with optimized images
- [ ] Add Features grid (privacy, verification, feeds, discovery)
- [ ] Add How It Works (3 steps) with simple illustrations
- [ ] Add Social proof badge/logos
- [ ] Add FAQ with current messaging
- [ ] Add Footer with links
- [ ] Implement dark mode and brand theming
- [ ] Add SEO metadata, OG images, robots, sitemap
- [ ] QA: responsiveness and Lighthouse ≥ 90

## Executor's Feedback or Assistance Requests

- Preferred hosting approach? I recommend a separate Vercel project (marketing) mapped to `openbands.xyz` to keep the Mini App isolated on `app.openbands.xyz`. If you prefer a single project, we can add host-based routing via middleware.
- Provide latest brand assets (SVG logo, hero artwork) and any preferred accent colors beyond current palette.
- Confirm the waitlist tool (Tally) embed link and any newsletter provider.

## Lessons
