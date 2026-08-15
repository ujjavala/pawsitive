import type { Achievement, Lesson, Scenario, Signal } from '../types'

const choices = (correct: string) => [
  { id: 'a', label: correct === 'a' ? 'Stay calm and create comfortable space' : 'Move quickly toward the dog' },
  { id: 'b', label: correct === 'b' ? 'Stay calm and create comfortable space' : 'Run or shout' },
  { id: 'c', label: correct === 'c' ? 'Stay calm and create comfortable space' : 'Reach over the dog’s head' },
  { id: 'd', label: correct === 'd' ? 'Stay calm and create comfortable space' : 'Stare directly at the dog' },
]

const personLessons: Lesson[] = [
  ['dogs-communicate', 'Understanding Dogs', 'Dogs communicate differently', 'Start with the whole picture—not one clue.', 'You notice a dog using its body, face, movement and sound.', ['Body position', 'Movement', 'Face and ears', 'The surrounding context'], 'No single sign tells the full story. Signals can have different meanings in different moments.', 'Pause, notice several cues, and keep an appropriate distance.', 'Looking at several signals and the context gives you more useful information.'],
  ['relaxed-vs-tense', 'Understanding Dogs', 'Relaxed vs tense body language', 'Learn to notice movement and muscle tension.', 'Two dogs stand at a distance: one moves loosely, while the other is very still.', ['Loose or stiff posture', 'Natural or reduced movement', 'Where the dog is looking'], 'Loose movement can be consistent with relaxation; stiffness can mean the dog needs more space.', 'Give either dog space and let the owner manage the interaction.', 'Body tension is one useful clue, but it still needs context.'],
  ['wagging-tail', 'Understanding Dogs', 'A wagging tail is not always “happy”', 'Look beyond the wag.', 'A dog’s tail is moving while the rest of its body looks stiff.', ['Tail height and speed', 'Body tension', 'Movement through the whole body'], 'A wag shows arousal or engagement, not a guaranteed emotion or intention.', 'Read the whole dog and avoid assuming a wag is an invitation.', 'A moving tail alone cannot tell you a dog is friendly or safe.'],
  ['barking', 'Understanding Dogs', 'What can barking mean?', 'Sound is only one part of the message.', 'A dog barks from behind a fence.', ['Distance', 'Fence or barrier', 'Body movement', 'What happened just before'], 'Barking can be consistent with excitement, alarm, frustration, or many other states.', 'Keep your distance and continue calmly without approaching the fence.', 'Context and the whole dog matter more than the sound alone.'],
  ['staring', 'Understanding Dogs', 'Why dogs stare', 'Notice attention without guessing intent.', 'An unfamiliar dog is looking steadily in your direction.', ['Stillness', 'Distance', 'Other body signals', 'Possible triggers nearby'], 'A fixed look may indicate focused attention, but a glance alone cannot predict behaviour.', 'Avoid staring back, create space, and let the owner redirect the dog.', 'Creating space is a calm response when signals are unclear.'],
  ['needs-space', 'Understanding Dogs', 'When a dog may need space', 'Recognise clusters of signals.', 'A dog turns away, licks its lips and shifts backwards.', ['Turning away', 'Lip licking', 'Weight shifting', 'Available escape route'], 'Together, these cues can be consistent with discomfort or uncertainty.', 'Stop moving closer and give the dog an easy route away.', 'Respecting distance is useful even when you cannot know exactly how the dog feels.'],
  ['should-approach', 'Meeting Dogs Safely', 'Should I approach?', 'Interaction is always optional.', 'You see an unfamiliar dog with its owner.', ['Leash and distance', 'Owner’s attention', 'Your own comfort', 'Dog’s whole body'], 'Neither a calm appearance nor an owner’s reassurance guarantees how an interaction will go.', 'You can choose not to approach. If in doubt, simply give space.', 'You never need to greet or touch an unfamiliar dog.'],
  ['owner-guides', 'Meeting Dogs Safely', 'Let the owner guide the interaction', 'Boundaries work both ways.', 'An owner asks whether you would like to say hello.', ['Dog’s movement', 'Lead control', 'Your comfort level'], 'An introduction should only happen when both people are comfortable and the dog is managed.', 'It is okay to say “No thanks, I need some space.”', 'A clear boundary is a safe and considerate response.'],
  ['dog-approaches', 'Meeting Dogs Safely', 'When a dog approaches', 'Stay steady and make room.', 'A leashed dog and owner are approaching on a footpath.', ['Available passing space', 'Owner’s position', 'Dog’s speed and body'], 'The owner may be preparing to pass, but you do not need to interact.', 'Move aside if safe, keep movements calm, and let the owner manage the dog.', 'Space makes the interaction more predictable for everyone.'],
  ['walk-away', 'Meeting Dogs Safely', 'When to walk away', 'Leaving is a valid choice.', 'The situation feels too close or unpredictable for you.', ['Your comfort', 'An open route away', 'Changes in the dog’s movement'], 'You do not need certainty about the dog to decide that you want more distance.', 'Move away calmly using a safe route and seek local help if there is immediate danger.', 'Choosing distance is not failure—it is a practical boundary.'],
].map(([id, module, title, description, situation, observations, meaning, action, explanation]) => ({ id: String(id), perspective: 'person', module: String(module), title: String(title), description: String(description), durationMinutes: 2, situation: String(situation), observations: observations as string[], meaning: String(meaning), action: String(action), options: choices('c'), answer: 'c', explanation: String(explanation) }))

const ownerSeed = [
  ['friendly-not-approachable', 'Friendly does not always mean approachable', 'A stranger cannot know your dog as you do.'],
  ['give-space', 'Give nervous people space', 'Distance can make a shared path feel safer.'],
  ['optional-hello', 'Do not assume everyone wants to say hello', 'A greeting is an invitation, never an obligation.'],
  ['control-movement', 'Keep control of your dog’s movement', 'Prevent rushing, jumping, and blocked pathways.'],
  ['stress-signals', 'Learn your dog’s stress signals', 'Notice patterns and respond before pressure builds.'],
  ['optional-introductions', 'Make introductions optional', 'A considerate “no problem” supports clear boundaries.'],
]
export const lessons: Lesson[] = [...personLessons, ...ownerSeed.map(([id, title, description]) => ({ id: `owner-${id}`, perspective: 'owner' as const, module: 'Thoughtful Ownership', title, description, durationMinutes: 2, situation: 'You and your dog are sharing a public space with someone who may be uncomfortable.', observations: ['The person’s movement and distance', 'Your dog’s position', 'Available space'], meaning: 'People communicate boundaries through movement as well as words. Your dog may also benefit from less pressure.', action: 'Shorten the lead when appropriate, create space, and make interaction optional.', options: choices('b'), answer: 'b', explanation: 'Giving space respects the person and helps you keep the situation calm and controlled.' }))]

export const scenarios: Scenario[] = [
  { id: 'footpath-person', perspective: 'person', title: 'Meeting on a footpath', description: 'A dog is walking toward you with its owner.', difficulty: 'Beginner', options: choices('c'), answer: 'c', explanation: 'A comfortable distance gives both you and the owner room to manage the passing interaction.', pairedScenarioId: 'footpath-owner' },
  { id: 'footpath-owner', perspective: 'owner', title: 'Someone moves away', description: 'You notice someone creating distance from your dog.', difficulty: 'Beginner', options: choices('b'), answer: 'b', explanation: 'Shortening the lead and creating space respects their boundary.', pairedScenarioId: 'footpath-person' },
  { id: 'fence-bark', perspective: 'person', title: 'Barking behind a fence', description: 'A dog starts barking as you walk past a garden.', difficulty: 'Beginner', options: choices('c'), answer: 'c', explanation: 'Continue calmly and avoid approaching or staring at the dog.' },
  { id: 'loose-dog', perspective: 'person', title: 'A loose dog approaches', description: 'An unfamiliar dog without an owner in sight is coming closer.', difficulty: 'Intermediate', options: choices('c'), answer: 'c', explanation: 'Avoid sudden movement, give yourself space, and look for a safe route or the owner.', safetyNote: 'If you believe there is immediate danger, move to safety and contact the appropriate local service.' },
  { id: 'jumping', perspective: 'person', title: 'A dog begins jumping', description: 'A leashed dog pulls toward you and jumps.', difficulty: 'Intermediate', options: choices('c'), answer: 'c', explanation: 'Create distance and ask the owner to keep the dog close. You do not need to interact.' },
  { id: 'asked-to-pet', perspective: 'person', title: 'Asked to say hello', description: 'An owner asks whether you want to pet their dog.', difficulty: 'Beginner', options: choices('c'), answer: 'c', explanation: 'It is always okay to decline and request space.' },
  { id: 'cross-road-owner', perspective: 'owner', title: 'Someone crosses the road', description: 'A person sees your dog and immediately crosses away.', difficulty: 'Beginner', options: choices('b'), answer: 'b', explanation: 'Continue calmly and give them space rather than following or questioning them.' },
  { id: 'busy-path-owner', perspective: 'owner', title: 'A narrow, busy path', description: 'Your dog is excited as several people approach.', difficulty: 'Intermediate', options: choices('b'), answer: 'b', explanation: 'Create room, keep control of movement, and let people pass without a greeting.' },
]

export const signals: Signal[] = [
  ['loose-body', 'Loose body', 'Fluid movement can be consistent with relaxation, considered with the whole dog.', 'mint'],
  ['stiff-body', 'Stiff body', 'Reduced movement or tension may mean more space is helpful.', 'coral'],
  ['tail-wag', 'Tail wagging', 'A wag shows arousal or engagement—not guaranteed friendliness.', 'yellow'],
  ['tail-tucked', 'Tail tucked', 'This may be consistent with uncertainty, fear, or physical factors.', 'lavender'],
  ['ears-forward', 'Ears forward', 'The dog may be attending to something; context matters.', 'blue'],
  ['ears-back', 'Ears pinned or back', 'This can occur in several emotional and physical contexts.', 'peach'],
  ['lip-lick', 'Lip licking or yawning', 'Outside food or tiredness, these can sometimes occur with tension.', 'mint'],
  ['barking', 'Barking', 'Barks vary in purpose; sound alone cannot tell us why.', 'yellow'],
].map(([id, name, description, tone]) => ({ id, name, description, tone }))

export const achievements: Achievement[] = [
  { id: 'first-step', icon: '🌱', title: 'First Step', description: 'Completed your first lesson.' },
  { id: 'dog-detective', icon: '👀', title: 'Dog Detective', description: 'Completed five body-language lessons.' },
  { id: 'situation-ready', icon: '🧠', title: 'Situation Ready', description: 'Completed five scenarios.' },
  { id: 'perspective-shift', icon: '🐾', title: 'Perspective Shift', description: 'Completed both sides of one interaction.' },
  { id: 'growing-confidence', icon: '💛', title: 'Growing Confidence', description: 'Completed the beginner learning journey.' },
]
