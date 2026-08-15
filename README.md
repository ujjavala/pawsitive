# Pawsitive 🐾

> You don't have to love dogs. You just need to understand them.

Pawsitive is a calm, playful learning application for people who feel nervous around dogs and owners who want to make shared spaces easier for everyone.

## What the MVP includes

- Three-step, judgement-free onboarding and a personalised starting confidence
- 10 person-focused lessons and six owner lessons
- Eight practical scenarios, including a linked two-perspective interaction
- Gentle confidence, progress, and achievement tracking in localStorage
- Animated SVG guide dog Pip, reduced-motion support, and optional synthesized UI sound
- Gemini-powered dog-image analysis with structured output, runtime validation, and conservative safety language
- A clearly labelled seeded demo result when no API key is available
- Responsive navigation and keyboard-accessible controls

## Architecture

The browser hosts a lazy-routed React application. Zustand persists onboarding, progress, and preferences to localStorage. Static educational content remains separate from presentation. Image analysis crosses a single same-origin Vercel Function boundary, where uploads are constrained before Gemini is called and model output is validated before returning to the UI.

No authentication, profile, database, or uploaded-image storage is used.

## Local setup

Requirements: Node 20.19+, 22.13+, or 24+ and npm.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add a Gemini API key to `GEMINI_API_KEY` for live image analysis.
4. Run the React UI with `npm run dev`.
5. Use `vercel dev` when testing the UI and serverless function together.

The labelled demo-photo experience works without a Gemini key. Real uploads show an honest retry state when the API is unavailable.

## Commands

- `npm run dev` — Vite development server
- `npm run typecheck` — strict TypeScript checks
- `npm run lint` — ESLint
- `npm run test:run` — Vitest once
- `npm run build` — production build
- `npm run preview` — preview built frontend

## AI safety

The Gemini prompt is constrained to observable visual signals. It must not diagnose emotion, predict behaviour, certify safety, or instruct someone to approach an unfamiliar dog. The server validates the JSON shape and checks for prohibited certainty claims. A single image is always presented as incomplete evidence.

Images are sent only after the user explicitly selects **Help me understand**. Pawsitive does not persist uploaded images.

## Demo flow

1. Start learning from the landing page.
2. Select **Very nervous**, then choose an uncomfortable situation and goal.
3. Complete the first two-minute lesson.
4. Practise the footpath scenario.
5. Switch to the owner perspective.
6. Open **Understand a Dog** and choose the labelled demo photo or upload a real image.
7. Review structured observations, uncertainty, and conservative guidance.
8. Open Progress to see confidence and achievements update.

## Content disclaimer

Pawsitive is an educational tool, not professional animal-behaviour, medical, veterinary, or emergency advice. Never assume an unfamiliar dog is safe to approach. When in doubt, give the dog space and follow appropriate local guidance.

## Future possibilities—not in this MVP

- User-controlled exposure journeys from illustrations to real-world situations
- Optional Pip narration using a server-side voice provider
- Owner-managed dog profiles
- Community learning resources and quiet-location discovery
- A constrained educational conversation coach

## Technology

React, TypeScript, Vite, Tailwind CSS, Radix primitives, Motion for React, Lucide, Zustand, Zod, Google Gemini via `@google/genai`, Vercel Functions, Vitest, and React Testing Library.
