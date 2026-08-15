*This is a submission for [Weekend Challenge: Dog Days Edition](https://dev.to/challenges/weekend-2026-08-13)*

## What I Built

I love dogs.

There, I said it.

And yet, I am also scared of them.

It is a strange combination. I can happily watch dog videos for hours, admire every dog I see on the street, and still instinctively tense up when one suddenly runs towards me.

A lot of that comes from a traumatic experience I had with a dog as a child. You can grow up knowing that one experience doesn't define every dog you will ever meet, but sometimes your instincts don't get the memo.

While thinking about this challenge, I started wondering if the problem was partly **not understanding what I was seeing**.

If a dog is wagging its tail, what does that actually mean? If it is staring at me, should I move away? If it is barking, is it excited, nervous, protective, or something else? And if a dog is approaching me on a footpath, what should I actually do?


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/tzqsrlvhjvy28htga0lu.png)



That question became **Pawsitive**.

Pawsitive is an interactive learning app for people who feel nervous around dogs. Instead of telling people not to be afraid, it tries to make encounters feel less unpredictable by teaching them how to recognise common body-language signals, understand situations, and make calmer decisions.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/d9fuoglo2dh69twmpygy.png)


But then I realised there was another side to the interaction.

A dog owner might see their dog happily walking towards someone and think:

> "Don't worry, he's friendly!"

The person approaching might be thinking:

> "Please don't let that dog come any closer."

Both people can be looking at the same dog while experiencing completely different situations.

![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/4ar7kdacgs5xisqer6ue.png)



So Pawsitive has two learning paths: **people who are nervous around dogs and dog owners**.

The first helps people understand dogs and build confidence. The second helps owners recognise when someone might be uncomfortable, why giving people space matters, and why "my dog is friendly" doesn't necessarily make an approaching dog less intimidating.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/s1pbkdocgokwga6hutbp.png)


That became the idea behind the whole app:

> **Two perspectives. One better interaction.**

## Demo

Github link: https://github.com/ujjavala/pawsitive

Vercel deployment: https://pawsitive-nine.vercel.app/

> Note: The Vercel deployment does not include a Gemini API key. On supported desktop Chrome devices, **Understand This Dog** falls back to Chrome's built-in Gemini Nano model and analyses the photo privately on-device. You can also run the app locally and add `GEMINI_API_KEY` to `.env.local` for server-side Gemini analysis.

The experience begins with three gentle onboarding questions: how comfortable you are around unfamiliar dogs, which situations feel most uncomfortable, and what you want to achieve. Someone who selects "Very nervous" isn't immediately thrown into a stressful scenario. They start by learning the basics, exploring relaxed and tense body language before gradually moving into realistic situations. Their answer also sets an initial confidence score, but it never locks content or forces them into an interaction.

Then comes **What Would You Do?**

You might be walking down a footpath when a dog approaches with its owner. Instead of reading instructions, you decide how you would respond and then get an explanation of why one choice may lead to a calmer interaction.

The perspective can then switch to the owner's side. The same encounter looks very different when you realise that giving someone space may be more helpful than reassuring them that your dog is friendly.

Finally, **Understand This Dog** lets users upload a dog photo and use Gemini to explore the visible body-language cues. It uses the configured server model when a Gemini key is available and falls back to Chrome's built-in Gemini Nano model when the server has no key and the browser supports multimodal on-device AI.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/tg37x4bp18330hv8iixe.png)



The entire experience is designed to be short enough to explore in a few minutes while still telling the complete story.

## How I Built It

I wanted Pawsitive to feel like something you would actually want to use, rather than a clinical safety course.

That led to a bright, playful interface, an animated SVG dog, playful scenario scenes, gentle sounds, small celebrations, and a mascot named **Pip** who follows the user through the experience.

The app is built with **React, TypeScript and Vite**, with **Tailwind CSS and Radix UI primitives** for the interface, **Motion for React** (the current Framer Motion package) for animation, SVG illustrations for Pip, and **Zustand with localStorage** for progress tracking. **Zod** validates structured AI responses at runtime, while **Lucide** provides the icon system. Server inference uses Google's `@google/genai` SDK, while private inference uses Chrome's built-in `LanguageModel` Prompt API without adding another model runtime to the application bundle.

There is deliberately no authentication or database in the MVP. You can open the app and start learning immediately.

The weekend build includes **10 lessons for nervous users, six owner lessons, eight scenarios, eight body-language signals and five gentle achievements**. Routes are lazy-loaded so the non-critical learning, scenario and AI screens do not all have to load up front.

### Making Pip feel alive

Pip changes depending on what is happening. They can tilt their head during a question, wag their tail after a correct answer, bounce when a lesson is completed, or look confused when something goes wrong.

The animations are deliberately gentle. There are no sudden dogs jumping towards the screen or unexpected barking, because an app designed for nervous dog lovers shouldn't accidentally make them nervous.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/jgoo59m0wwlggie3l1nc.png)



The same thinking shaped the sound design. The current build uses short, synthesised feedback tones for correct answers, lesson completion and soft errors. I deliberately left barking and other dog sounds out of the learning flow so the app cannot unexpectedly startle someone. Sound can be disabled, and motion can be reduced from inside the app. Pip also respects the device's own reduced-motion preference.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/x9hsmeupyco0nyflcc8n.png)



The goal is simple: **make the app feel alive without making it overwhelming.**

## 🧠 The Gemini Experiment

The most interesting part of Pawsitive is **Understand This Dog**, where I wanted AI to do something more meaningful than power another generic chatbot.

A user can upload a JPG, PNG or WebP photo of a dog, and Gemini analyses the visible signals in the image. The response is structured into five parts:

![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/untu6j691jycj4e3mmyd.png)



**What we can see** — observable cues such as posture, ears, tail visibility and body position, each with a visual-confidence level.

**What this might mean** — cautious interpretations of those signals.

**What we can't know** — because one photograph cannot tell us everything about a dog's emotional state or predict what it will do next.

**What you can do** — conservative guidance focused on giving unfamiliar dogs appropriate space.

**Safety note** — an explicit reminder not to approach an unfamiliar dog based only on an image interpretation.

That last part was especially important to me.

I didn't want to build an AI-powered "Is this dog safe?" detector. A photograph cannot reliably tell you that a dog is safe, friendly, or won't bite.

So the Gemini integration is deliberately designed to acknowledge uncertainty, using language such as "may indicate" and "can be consistent with" rather than making definitive claims.

That safety work does not rely only on the interface. In the server path, the browser sends the image to a same-origin **Vercel Function**, so the Gemini key is never exposed to client code. The function rejects unsupported files and images larger than 5 MB before calling Gemini, requests JSON matching a schema, validates the result with Zod, and rejects responses containing certainty claims such as "definitely friendly", "won't bite" or "safe to approach". The UI validates the response again before rendering it as cards, never as model-generated HTML.

The Gemini model is user-selectable from a server-validated allowlist. The current default is **Gemini 3.5 Flash-Lite**, and unsupported model IDs are rejected instead of being passed through to the provider. For local development, Vite loads only the server-side Gemini environment variables and mounts the same `/api/analyze-dog` handler used in deployment. That means `npm run dev` runs the UI and local API together without requiring the Vercel CLI or a Vercel login.

### Private on-device fallback with Gemini Nano

When the server reports that no `GEMINI_API_KEY` is configured, Pawsitive checks Chrome's built-in `LanguageModel` API with the exact text-and-image capabilities required by the feature. If the model is ready, the selected image is analysed locally. If Chrome needs to download the model first, the interface shows download progress and provides a cancel action.

The on-device session receives the same cautious system instruction as server Gemini, accepts the selected photo as an image `Blob`, and returns JSON constrained by the same schema. Its output passes through the same Zod validation and certainty checks before anything is displayed. The session is destroyed after analysis to release browser resources, and successful results are clearly labelled **analysed privately on this device**.

### What amazed me about the private mode

This became one of the most surprising parts of the whole project. I expected the private on-device mode to be a useful fallback, but I did not expect Gemini Nano to perform this well. In my testing, its observations and cautious interpretations were often remarkably close to the results produced through the API-key-powered server models.

That feels like a small glimpse of how quickly AI is advancing: a browser can now examine an image, follow a detailed instruction, produce structured output and respect the same safety constraints—all without an API key and without sending the photo to a server. The privacy benefit is not achieved by giving up the core experience; the result remains genuinely useful.

There are still differences between devices and models, so I would not call the two paths identical or treat my experiments as a formal benchmark. Even so, seeing capable multimodal AI run privately inside Chrome was a real **wow moment** for me. Gemini Nano started as a fallback and ended up feeling like one of Pawsitive's most exciting features—and a sign of the possibilities that on-device AI is beginning to unlock.

The fallback order is:

1. Use server Gemini when `GEMINI_API_KEY` is configured.
2. Use Chrome's built-in Gemini Nano model when the key is absent and the requested multimodal session is supported.
3. Show an honest unavailable message and retain the clearly labelled seeded demo when neither option is available.

### Prerequisites for private on-device analysis

Chrome's foundation-model APIs are a progressive enhancement rather than universal browser functionality. The current documented requirements are:

- **Browser:** Google Chrome 148 or newer for the web Prompt API.
- **Operating system:** Windows 10 or 11, macOS 13 or newer, Linux, or a Chromebook Plus device. Chrome on Android, iOS, and non-Plus Chromebooks is not currently supported.
- **Storage:** At least 22 GB free on the volume containing the Chrome profile. Chrome removes the model if available storage later drops below 10 GB.
- **Compute:** Strictly more than 4 GB GPU VRAM, or at least 16 GB system RAM and four CPU cores for CPU execution.
- **Network:** An unmetered connection for the initial browser-managed model download. Subsequent inference can run without a network connection.
- **User activation:** The first download must be started after a meaningful user interaction, which Pawsitive provides through the **Help me understand** button.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/h83r85dxi3bhnqdapmrz.png)



For local testing, enable `chrome://flags/#optimization-guide-on-device-model` and `chrome://flags/#prompt-api-for-gemini-nano`, then fully relaunch Chrome. Download and model errors can be inspected at `chrome://on-device-internals`. After the initial download, Chrome states that inference is local and no prompt or image data is sent to Google or another third party.

The AI feature also fails independently from the rest of the product. If neither server nor on-device analysis is available, the user sees a plain explanation and can continue learning. For challenge demos, there is a clearly labelled sample-photo experience with a seeded educational result; it never pretends to be a live result for a photo the user uploaded. Images are processed only after the user presses **Help me understand**, and Pawsitive does not add them to application storage. On-device analysis keeps the image local; server analysis does not store it.

AI isn't the authority here. **It is the teacher.**

## The Learning Journey

The product principle follows a simple progression:

**Understand → Recognise → Respond → Build Confidence**

The actual lesson content is organised into **Understanding Dogs**, **Meeting Dogs Safely**, and **Thoughtful Ownership** modules. Users first learn about relaxed and tense body language, tail movement, barking, staring, and why individual signals shouldn't be interpreted in isolation.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/cbvilh0upbdn1eay9j2s.png)


They then move into realistic scenarios and make decisions for themselves.

If they get something wrong, Pawsitive doesn't throw a giant red **WRONG** screen at them. Pip simply tilts their head and encourages them to look at the situation again.

That was intentional.

Someone who is already nervous doesn't need another reason to feel like they're failing.

Progress follows the same principle. Onboarding starts confidence at 20, 40, 50, 70 or 85 depending on the user's own answer. Completing a lesson or correctly answering a new scenario adds five points, while an incorrect answer has no penalty. Rewards are idempotent, so repeating an activity cannot inflate the score. The Progress screen keeps confidence separate from completion and explicitly describes it as a personal reflection, not a clinical measurement.

## 🐕 The Owner Perspective

The owner experience came directly from thinking about what makes dog encounters uncomfortable.

A dog owner may genuinely have a friendly dog and genuinely believe nothing is wrong. But that doesn't necessarily change how the other person feels.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/mdexqfg28x25eppmtouq.png)


One scenario asks an owner what they should do when they notice someone moving away from their dog.

The answer isn't to follow them and explain that the dog is friendly. It's simply to create some space.

That captures what I wanted Pawsitive to teach:

> **A safe interaction isn't just about understanding the dog. It's about understanding the human too.**

The paired scenario is linked in both directions in the content model. Completing the person and owner sides unlocks the **Perspective Shift** achievement, making the product's central idea visible in the progress journey rather than leaving it as marketing copy.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/84zjyxz9dyi7sy15l79e.png)



## Testing the Safety Net

Because Pawsitive mixes educational content, stateful rewards and model output, I did not want the demo to depend only on a happy-path click-through.

The project uses **Vitest and React Testing Library**. The current automated suite checks the required lesson, scenario, signal and achievement counts; unique IDs and answer keys; two-way scenario links; confidence clamping and one-time rewards; and the dog-analysis schema. It also contains regression cases for unsafe AI phrases including "definitely friendly", "won't bite", "you can approach this dog" and "safe to approach".

The on-device adapter tests cover unsupported browsers, successful structured multimodal output, browser model-download progress, session cleanup, and rejection of unsafe local-model certainty. A page-level test confirms that a missing server key selects the private path without uploading the image.

Before submission, the strict TypeScript check, all **20 automated tests**, ESLint, and the Vite production build pass.

## Why I Built It

Pawsitive started with something personal: the slightly ridiculous feeling of loving dogs while still being afraid of them.

I don't expect an app to erase that fear. That wasn't the goal.

I wanted to build something that says:

> **It's okay if you're nervous. Let's understand what's happening.**

Maybe knowing what to look for makes the next encounter feel a little less unpredictable. Maybe understanding that a wagging tail doesn't always mean "hello" gives someone a little more confidence. Maybe helping owners recognise when to create some distance makes the other person feel less alone in the situation.

And maybe, eventually, someone who currently crosses the street when they see a dog can simply keep walking.

For someone who is afraid of dogs, that might not feel like a small thing at all.

## 🏆 Prize Category: Best Use of Google AI

I'm submitting Pawsitive for **Best Use of Google AI** because Gemini is part of the core learning experience rather than simply being added as a chatbot.

Through **Understand This Dog**, Gemini's multimodal capabilities help users explore visible dog body-language cues while deliberately teaching the limits of what can be inferred from a single image. The app can use a securely configured server model or Chrome's built-in Gemini Nano model, with shared structured-output and safety controls across both paths.


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/tr3wistu9xwmam2chxjf.png)


![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/00lficr0bohhmiavuiq9.png)




That uncertainty is part of the feature, not a limitation hidden from the user.

---

## 🔮 Giving Pip a Voice with ElevenLabs

The next piece I would love to add is a voice for Pip using **ElevenLabs**. ElevenLabs is **not part of the current weekend build**; this is a deliberate next step rather than a shipped integration.

Right now, Pip is the animated companion reacting to the user's progress. With voice, Pip could become part of the learning journey itself.

Instead of simply reading instructions, Pip could say:

> *"Okay, let's take this one slowly. You can see a dog coming towards you. What would you do?"*

After an answer:

> *"Good thinking. Giving the dog and its owner a little more space can make this easier for everyone."*

And for someone who is nervous:

> *"There's no rush. Let's look at what's happening first."*

The interesting part would be connecting Pip's voice to the user's confidence journey, so the experience gradually feels more encouraging and energetic as their confidence grows.

That brings together three pieces of the experience:

**Gemini** understands the visual information.

**ElevenLabs** gives Pip a natural voice.

**Motion for React** brings Pip to life.

Together, they could turn Pip from an animated mascot into a genuine **dog-confidence companion**.

I would keep that integration server-side, accept only a small set of approved narration IDs, and cache generated clips. That would protect the API key, control cost and prevent arbitrary text from turning the feature into an open text-to-speech proxy. Narration would remain user-initiated, optional and accompanied by the same visible text.

## What's Next?

There are plenty of directions Pawsitive could take, but the core idea would stay the same: gradually move people from illustrations to photographs, videos and increasingly realistic scenarios as their confidence grows.

I also considered **Snowflake**, but deliberately did not add it to the weekend MVP simply to increase the technology count. Pawsitive does not need a warehouse to teach a lesson or remember local progress. A future opt-in analytics layer could send anonymous events such as lesson completion, perspective switching, Gemini request success and labelled-demo usage to Snowflake—never uploaded photos, model response text or personal details. For now, keeping that out made the privacy story and the architecture simpler.

For dog owners, there could eventually be more personalised guidance around their individual dogs and situations.

But the weekend version is intentionally focused.

Pawsitive is ultimately about closing the gap between two perspectives:

> "I don't know what that dog is going to do."

and

> "My dog is friendly. Why are they scared?"

There is a lot of space between those two thoughts.

I wanted to build something that helps close it.

And, perhaps selfishly, something that might one day help me stop jumping every time a dog barks. 🐾

> **You don't have to love dogs.**
>
> **You just need to understand them.**
