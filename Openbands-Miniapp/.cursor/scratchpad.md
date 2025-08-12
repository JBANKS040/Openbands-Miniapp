## Background and Motivation
Openbands Mini App is live on `miniapp.openbands.xyz` with Google auth and a Farcaster manifest. We must harden the MiniKit integration to match Base docs for native Farcaster behavior (frame lifecycle, add-to-user, notifications) and make the manifest/env setup resilient.

Refs:
- Existing App Integration: [docs](https://docs.base.org/base-app/miniapps/existing-app-integration)
- MiniKit Quickstart: [docs](https://docs.base.org/base-app/miniapps/quickstart)
- Debugging: [docs](https://docs.base.org/base-app/miniapps/debugging)
- Thinking Social: [docs](https://docs.base.org/base-app/miniapps/thinking-social)

## Key Challenges and Analysis
- We added a custom `MiniKitProvider` (mock) and used `OnchainKitProvider`, but per docs we should use `MiniKitProvider` from `@coinbase/onchainkit/minikit` which wires wagmi/react-query/connectors automatically [existing-app-integration].
- We don’t call `setFrameReady()` via `useMiniKit()`; required to dismiss splash and signal readiness [existing-app-integration, quickstart].
- `/.well-known/farcaster.json` is static and minimal. Docs recommend env-driven route with `accountAssociation` and a `frame` object, plus `noindex: true` during testing [existing-app-integration, quickstart].
- Env naming: code uses `NEXT_PUBLIC_CDP_CLIENT_API_KEY`. Docs use `NEXT_PUBLIC_ONCHAINKIT_API_KEY` (or CDP key) and `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`, plus optional icon/splash/OG envs [quickstart]. We should support both and add missing.
- Our “Add to Apps” and “Share” are mocked. Should use `useAddFrame()` and `useOpenUrl()` (or other MiniKit hooks) [quickstart].
- Need a debugging checklist per docs (context, readiness, manifest validation) [debugging].
- Product pressure-test: capture viral/retention loops from “Thinking Social” (add-frame prompts, sharing, lightweight invites, notifications) [thinking-social].

## High-level Task Breakdown
1) Replace custom MiniKit mock with official SDK provider
   - Success: Providers come from `@coinbase/onchainkit/minikit`; app builds; no custom mock imports remain.
   - Edits: add `providers/MiniKitProvider.tsx` that re-exports doc pattern; wrap app in it from `app/layout.tsx`.

2) Implement frame lifecycle
   - Success: `setFrameReady()` called when UI loaded; in Farcaster the splash hides; a simple badge shows Frame/Web context.
   - Edits: `app/page.tsx` use `{ useMiniKit }` and call `setFrameReady()` when `!isFrameReady`.

3) Use official hooks for interactions
   - Success: "+ Add to Apps" uses `useAddFrame()`; optional share uses `useOpenUrl()`; remove console stubs.

4) Manifest route per docs
   - Success: `/.well-known/farcaster.json` returns env-driven JSON with `accountAssociation` and `frame` fields; includes `noindex: true` while testing; URLs come from envs.
   - Edits: implement `withValidProperties` helper and env reads as in docs; keep `public/farcaster.json` in sync or deprecate.

5) Env normalization
   - Success: Vercel has: `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`, `NEXT_PUBLIC_ONCHAINKIT_API_KEY` (or CDP key), `NEXT_PUBLIC_URL`, `FARCASTER_HEADER|PAYLOAD|SIGNATURE`, optional image/meta envs.
   - Code reads `NEXT_PUBLIC_ONCHAINKIT_API_KEY || NEXT_PUBLIC_CDP_CLIENT_API_KEY`.

6) Debugging/validation
   - Success: No console errors; manifest validates; frame context detected; `noindex` removed before public launch.

7) Social pressure test (for next iteration)
   - Viral: one-tap `useAddFrame`, post-share prompt, invites via `useOpenUrl` [thinking-social].
   - Retention: `useNotification` for replies/mentions; opt-in recap.
   - Identity: anonymous-but-verified domain; lightweight reputation.

-## Project Status Board
- [x] Replace custom provider with SDK `MiniKitProvider` from `@coinbase/onchainkit/minikit`
- [x] Wrap `app/layout.tsx` with `MiniKitContextProvider` (via `ClientProviders`)
- [x] Add `setFrameReady()` in `app/page.tsx`
- [x] Swap mocked add/share → `useAddFrame()` and `useOpenUrl()`
- [x] Rework `/.well-known/farcaster.json` to env-driven with `frame` object and `noindex: true`
- [ ] Add/verify envs on Vercel:
  - [ ] `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`
  - [x] `NEXT_PUBLIC_ONCHAINKIT_API_KEY` (or `NEXT_PUBLIC_CDP_CLIENT_API_KEY`) — present
  - [x] `NEXT_PUBLIC_URL` — present
  - [x] `FARCASTER_HEADER`, `FARCASTER_PAYLOAD`, `FARCASTER_SIGNATURE` — present
  - [ ] Optional: `NEXT_PUBLIC_APP_ICON`, `NEXT_PUBLIC_APP_SPLASH_IMAGE`, `NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR`, `NEXT_PUBLIC_APP_HERO_IMAGE`, `NEXT_PUBLIC_APP_TAGLINE`
- [ ] Validate with Base tools; keep `noindex: true` while testing

## Current Status / Progress Tracking
- Official MiniKit provider and hooks are integrated; `setFrameReady()` is called.
- `/.well-known/farcaster.json` now env-driven with `frame` and `noindex: true`.
- `useAddFrame()` and `useOpenUrl()` wired for add/share.
- Build and production deploy successful.
- Remaining: add `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME` and optional image envs; validate in Base tools.

## Executor's Feedback or Assistance Requests
- Confirm whether to add `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME` (defaults to "Openbands" now) and provide final icon/splash/hero asset URLs for envs or continue using current public assets.
- After you confirm assets and project name, we will set envs on Vercel and remove `noindex` when ready for discovery.

## Next Moves (Planner)
1) Frame metadata in `app/layout.tsx` [existing-app-integration]
   - Add `generateMetadata()` with `fc:frame` JSON so casts linking to our URL show a Launch button.
   - Success: Warpcast preview shows “Launch Openbands” with splash image and background color.

2) Environment finalization
   - Set `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME` on Vercel.
   - Optional visuals: `NEXT_PUBLIC_APP_ICON`, `NEXT_PUBLIC_APP_SPLASH_IMAGE`, `NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR`, `NEXT_PUBLIC_APP_HERO_IMAGE`, `NEXT_PUBLIC_APP_TAGLINE`.
   - Success: Manifest route reflects envs; images load via HTTPS.

3) Validation and rollout
   - Validate in Base Mini App tool, then remove `noindex: true` when public ready.
   - Success: Tool passes; app launches from Farcaster; no console errors.

4) Observability & QA
   - Add minimal client logging toggled by env (only non-PII): frame context, addFrame result, openUrl action.
   - Add a `/health` route returning version & commit (optional).

5) Product loops (Thinking Social)
   - After posting, show share prompt (we already have Share button; consider auto-prompt modal once).
   - Add gentle prompt to “Add to Apps” until added.
   - Plan notifications with `useNotification` (later iteration) for replies/mentions.

## Project Status Board (new items)
- [ ] Add frame metadata via `generateMetadata()` in `app/layout.tsx`
- [ ] Set `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME` on Vercel
- [ ] Add optional visual envs (icon/splash/bg/hero/tagline) and verify URLs
- [ ] Re-validate in Base tool; when ready, set `noindex: false`
- [ ] Add lightweight client logs for frame actions (optional)

## Lessons
- Use `MiniKitProvider` from SDK to avoid custom context; it auto-configures connectors [existing-app-integration].
- Always call `setFrameReady()` to hide splash when ready [existing-app-integration, quickstart].
- Keep manifest env-driven to survive domain changes and enable `noindex` during testing [quickstart].

## Success Criteria (Planner sign-off)
- Providers/hooks come from `@coinbase/onchainkit/minikit` only.
- `/.well-known/farcaster.json` matches docs and passes validation; `noindex: true` while testing.
- In Farcaster: Frame badge shows, `useAddFrame()` works, no console errors.
- Vercel envs complete and consistent.


