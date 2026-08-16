# Pawsitive 🐾

> You don't have to love dogs. You just need to understand them.

Pawsitive is a calm, playful learning application for people who feel nervous around dogs and owners who want to make shared spaces easier for everyone.

## What the MVP includes

- Three-step, judgement-free onboarding and a personalised starting confidence
- 10 person-focused lessons and six owner lessons
- Eight practical scenarios, including a linked two-perspective interaction
- Gentle confidence, progress, and achievement tracking in localStorage
- Animated SVG guide dog Pip, reduced-motion support, and optional synthesized UI sound
- Server-side Gemini dog-image analysis with an environment-configured, allowlisted model
- Private on-device image analysis with Chrome's built-in Gemini Nano Prompt API when no server key is configured
- Cautious possible-breed identification with visual confidence, typical characteristics, and breed-level behavioural tendencies
- Structured output, shared runtime validation, and conservative safety language across both AI paths
- A clearly labelled seeded demo result when no API key is available
- Responsive navigation and keyboard-accessible controls

## Architecture

The browser hosts a lazy-routed React application. Zustand persists onboarding, progress, and preferences to localStorage. Static educational content remains separate from presentation.

Image analysis is server-first. When `GEMINI_API_KEY` is configured, the photo crosses a same-origin Vercel Function boundary, where uploads are constrained before Gemini is called and model output is validated before returning to the UI. During ordinary Vite development, the same handler is mounted locally at `/api/analyze-dog`; Vercel CLI and login are not required.

When the server reports that no Gemini key is configured, Pawsitive progressively checks Chrome's built-in `LanguageModel` Prompt API. On supported devices, Gemini Nano receives the image and produces constrained JSON entirely on-device. Cloud and on-device output share the same prompt, Zod schema, prohibited-certainty checks, and UI. Results include a possible breed or mix, the visual evidence and confidence behind that estimate, typical physical characteristics, and cautiously worded breed-level behavioural tendencies. Unsupported browsers retain the honest unavailable state and labelled seeded demo.

No authentication, profile, database, or uploaded-image storage is used.

## Local setup

Requirements: Node 20.19+, 22.13+, or 24+ and npm.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Optionally add a Gemini API key to `GEMINI_API_KEY` for server-side image analysis. `GEMINI_MODEL` can set the server default.
4. Run the React UI and local API with `npm run dev`.

During development, Vite loads the server-only Gemini variables and mounts the same analysis handler at `/api/analyze-dog`. The key is never exposed to browser code.

Without a Gemini key, real uploads fall back to Chrome's built-in on-device model when it is supported and installed. The labelled demo-photo experience remains available everywhere.

### On-device AI requirements

The fallback uses Chrome's web `LanguageModel` API with text and image inputs. It is a progressive enhancement rather than universal browser support:

- Chrome 148+ on a supported desktop operating system
- macOS 13+, Windows 10/11, Linux, or Chromebook Plus; Chrome on Android and iOS is not supported
- At least 22 GB free storage
- More than 4 GB GPU VRAM, or at least 16 GB RAM and four CPU cores
- An unmetered connection for the initial browser-managed model download
- A user gesture before Chrome can begin a required download

The initial model download can take time, so Pawsitive displays progress and provides a cancel action. After installation, inference is local and Chrome's documentation states that no prompt or image data is sent to Google or another third party. Local experiments can use `chrome://flags/#optimization-guide-on-device-model` and `chrome://flags/#prompt-api-for-gemini-nano`; model status is visible at `chrome://on-device-internals`.

## Commands

- `npm run dev` — Vite development server
- `npm run typecheck` — strict TypeScript checks
- `npm run lint` — ESLint
- `npm run test:run` — Vitest once
- `npm run build` — production build
- `npm run preview` — preview built frontend

## AI safety

The shared AI prompt is constrained to observable visual signals. It must not diagnose emotion, predict behaviour, certify safety, or instruct someone to approach an unfamiliar dog. A possible breed is presented as an appearance-based estimate rather than a fact, with an honest visual-confidence level and support for an explicit **Breed unclear** result. Typical characteristics and possible behaviours describe general breed-level tendencies only; the UI states that they cannot predict the individual dog's personality, emotional state, safety, or future behaviour. Both server Gemini and on-device Gemini Nano responses are constrained to JSON, validated with the same Zod schema, and checked for prohibited certainty claims. A single image is always presented as incomplete evidence.

Images are processed only after the user explicitly selects **Help me understand**. Server analysis sends the image through the same-origin function and does not persist it. On-device results are explicitly labelled and the image stays on the user's device.

## Demo flow

1. Start learning from the landing page.
2. Select **Very nervous**, then choose an uncomfortable situation and goal.
3. Complete the first two-minute lesson.
4. Practise the footpath scenario.
5. Switch to the owner perspective.
6. Open **Understand a Dog** and choose the labelled demo photo or upload a real image.
7. Review the possible breed identification, general breed characteristics, structured body-language observations, uncertainty, and conservative guidance.
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

React, TypeScript, Vite, Tailwind CSS, Radix primitives, Motion for React, Lucide, Zustand, Zod, Google Gemini via `@google/genai`, Chrome's built-in Gemini Nano Prompt API, Vercel Functions, Vitest, and React Testing Library.
