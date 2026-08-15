*This is a submission for [Weekend Challenge: Dog Days Edition](https://dev.to/challenges/weekend-2026-08-13)*

## What I Built

I love dogs.

There, I said it.

And yet, I am also scared of them.

It is a strange combination. I can happily watch dog videos for hours, admire every dog I see on the street, and still instinctively tense up when one suddenly runs towards me.

A lot of that comes from a traumatic experience I had with a dog as a child. You can grow up knowing that one experience doesn't define every dog you will ever meet, but sometimes your instincts don't get the memo.

While thinking about this challenge, I started wondering if the problem was partly **not understanding what I was seeing**.

If a dog is wagging its tail, what does that actually mean? If it is staring at me, should I move away? If it is barking, is it excited, nervous, protective, or something else? And if a dog is approaching me on a footpath, what should I actually do?

That question became **Pawsitive**.

Pawsitive is an interactive learning app for people who feel nervous around dogs. Instead of telling people not to be afraid, it tries to make encounters feel less unpredictable by teaching them how to recognise common body-language signals, understand situations, and make calmer decisions.

But then I realised there was another side to the interaction.

A dog owner might see their dog happily walking towards someone and think:

> "Don't worry, he's friendly!"

The person approaching might be thinking:

> "Please don't let that dog come any closer."

Both people can be looking at the same dog while experiencing completely different situations.

So Pawsitive has two learning paths: **people who are nervous around dogs and dog owners**.

The first helps people understand dogs and build confidence. The second helps owners recognise when someone might be uncomfortable, why giving people space matters, and why "my dog is friendly" doesn't necessarily make an approaching dog less intimidating.

That became the idea behind the whole app:

> **Two perspectives. One better interaction.**

## Demo

**[Live Demo — add deployed URL here]**

The experience begins by asking how comfortable you are around unfamiliar dogs. Someone who selects "Very nervous" isn't immediately thrown into a stressful scenario. They start by learning the basics, exploring relaxed and tense body language before gradually moving into realistic situations.

Then comes **What Would You Do?**

You might be walking down a footpath when a dog approaches with its owner. Instead of reading instructions, you decide how you would respond and then get an explanation of why one choice may lead to a calmer interaction.

The perspective can then switch to the owner's side. The same encounter looks very different when you realise that giving someone space may be more helpful than reassuring them that your dog is friendly.

Finally, **Understand This Dog** lets users upload a dog photo and use Gemini to explore the visible body-language cues.

The entire experience is designed to be short enough to explore in a few minutes while still telling the complete story.

## How I Built It

I wanted Pawsitive to feel like something you would actually want to use, rather than a clinical safety course.

That led to a bright, playful interface, animated dog illustrations, gentle sounds, small celebrations, and a dog mascot named **Pip** who follows the user through the experience.

The app is built with **React, TypeScript and Vite**, with **Tailwind CSS and shadcn/ui** for the interface, **Framer Motion** for animation, SVG illustrations for the dogs, and **Zustand with localStorage** for progress tracking.

There is deliberately no authentication or database in the MVP. You can open the app and start learning immediately.

### Making Pip feel alive

Pip changes depending on what is happening. They can tilt their head during a question, wag their tail after a correct answer, bounce when a lesson is completed, or look confused when something goes wrong.

The animations are deliberately gentle. There are no sudden dogs jumping towards the screen or unexpected barking, because an app designed for nervous dog lovers shouldn't accidentally make them nervous.

The same thinking shaped the sound design. Most sounds are subtle feedback for interactions and achievements, while dog sounds only appear when they are genuinely useful for a lesson. Sound can also be disabled, and the experience respects reduced-motion preferences.

The goal is simple: **make the app feel alive without making it overwhelming.**

## 🧠 The Gemini Experiment

The most interesting part of Pawsitive is **Understand This Dog**, where I wanted AI to do something more meaningful than power another generic chatbot.

A user can upload a photo of a dog, and Gemini analyses the visible signals in the image. The response is structured into four parts:

**What we can see** — observable cues such as posture, ears, tail visibility and body position.

**What this might mean** — cautious interpretations of those signals.

**What we can't know** — because one photograph cannot tell us everything about a dog's emotional state or predict what it will do next.

**What you can do** — conservative guidance focused on giving unfamiliar dogs appropriate space.

That last part was especially important to me.

I didn't want to build an AI-powered "Is this dog safe?" detector. A photograph cannot reliably tell you that a dog is safe, friendly, or won't bite.

So the Gemini integration is deliberately designed to acknowledge uncertainty, using language such as "may indicate" and "can be consistent with" rather than making definitive claims.

AI isn't the authority here. **It is the teacher.**

## The Learning Journey

The content follows a simple progression:

**Understand → Recognise → Respond → Build Confidence**

Users first learn about relaxed and tense body language, tail movement, barking, staring, and why individual signals shouldn't be interpreted in isolation.

They then move into realistic scenarios and make decisions for themselves.

If they get something wrong, Pawsitive doesn't throw a giant red **WRONG** screen at them. Pip simply tilts their head and encourages them to look at the situation again.

That was intentional.

Someone who is already nervous doesn't need another reason to feel like they're failing.

## 🐕 The Owner Perspective

The owner experience came directly from thinking about what makes dog encounters uncomfortable.

A dog owner may genuinely have a friendly dog and genuinely believe nothing is wrong. But that doesn't necessarily change how the other person feels.

One scenario asks an owner what they should do when they notice someone moving away from their dog.

The answer isn't to follow them and explain that the dog is friendly. It's simply to create some space.

That captures what I wanted Pawsitive to teach:

> **A safe interaction isn't just about understanding the dog. It's about understanding the human too.**

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

Through **Understand This Dog**, its multimodal capabilities help users explore visible dog body-language cues while deliberately teaching the limits of what can be inferred from a single image.

That uncertainty is part of the feature, not a limitation hidden from the user.

---

## 🔮 Giving Pip a Voice with ElevenLabs

The next piece I would love to add is a voice for Pip using **ElevenLabs**.

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

**Framer Motion** brings Pip to life.

Together, they could turn Pip from an animated mascot into a genuine **dog-confidence companion**.

## What's Next?

There are plenty of directions Pawsitive could take, but the core idea would stay the same: gradually move people from illustrations to photographs, videos and increasingly realistic scenarios as their confidence grows.

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
