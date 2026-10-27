export type Section = 'Vocabulary' | 'Reading' | 'Grammar' | 'Speaking' | 'Listening';
export type ExerciseType = 'multiple-choice' | 'memory' | 'short-answer' | 'discussion' | 'reading' | 'grammar' | 'gap-fill' | 'audio-repeat' | 'dictation';
export type Question = { id: string; text: string; group?: string };
export type Choice = Question & { options: [string, string]; correct: 'a' | 'b' };
type Base = { id: string; number: number; section: Section; title: string; instructions: string; detail?: string; example?: string[]; originalInstructions?: string };
export type Exercise = Base & (
  | { type: 'multiple-choice'; questions: Choice[] }
  | { type: 'memory'; duration: number; sourceExercise: string }
  | { type: 'short-answer' | 'discussion' | 'gap-fill'; questions?: Question[]; presentation?: 'topics' | 'interview' }
  | { type: 'reading'; questions: Question[]; textTitle: string; author: string; paragraphs: string[]; missingText: string; followup: string }
  | { type: 'grammar'; pattern: string; rule: string; model: string; questions: Question[]; followup: string; reference: string }
  | { type: 'audio-repeat' | 'dictation'; audioNumber: number; src: string; hints?: string[]; questions?: Question[]; sourceNote?: string }
);
export const lesson = {
  id: 'unit14', unit: 14, title: 'A Better Life', pages: '128–129', image: '/unit14.jpg',
  subtitle: 'New places. New perspectives. A world to talk about.',
  topic: 'THE WORLD AROUND US', prompt: ['What makes a', 'good place to live?'],
  introduction: 'Let’s explore life, society and the things that matter to us.',
  sourceNote: 'Text B (page 194), the extra exercises (pages 187–188) and recordings 102 and 103 are not included in this lesson. Some phonetic symbols in Exercise 13 need checking against the original textbook.',
};
export const sections: { name: Section; subtitle: string; description: string; range: string }[] = [
  { name: 'Vocabulary', subtitle: 'Life and society', description: 'Explore the words we use to talk about the world around us.', range: '01–04' },
  { name: 'Reading', subtitle: 'A new life', description: 'Read Maja’s story and talk about making a home somewhere new.', range: '05–09' },
  { name: 'Grammar', subtitle: 'Adjective + verb', description: 'Find the pattern. Then make it your own.', range: '10–11' },
  { name: 'Speaking', subtitle: 'Where we live', description: 'Share your perspective on life in your country or city.', range: '12' },
  { name: 'Listening', subtitle: 'Listen closely', description: 'Notice word endings, repeat and practise dictation.', range: '13–14' },
];
const topics = ['The economy', 'Crime', 'The people', 'The climate', 'The health system'];
const readingQuestions = ['How long have you lived here?', 'Why did you move here?', 'Do you like it here?', 'What do you think of the people?', 'What do you think of the climate?', 'What do you think of the health system?', 'How’s the economy doing?', 'Is there much crime?', 'Do you think you’ll ever go back home?'].map((text, i) => ({ id: String(i + 1), text }));
export const choices: Choice[] = [
  { id: '1', text: 'The economy is quite weak.', options: ["There’s a lot of unemployment.", "Wages are high and it’s easy to find work."], correct: 'a' },
  { id: '2', text: 'Crime is a huge problem.', options: ["I have insurance, but I’ve never needed to use it.", 'You see a lot of violence and murder on the news.'], correct: 'b' },
  { id: '3', text: 'The people are very nice and friendly.', options: ['I get on with my neighbours and we really support each other.', 'People are polite but they don’t talk to you much.'], correct: 'a' },
  { id: '4', text: 'The climate’s good.', options: ['It’s dry and warm all year round.', 'It’s really cold in winter and too hot in summer.'], correct: 'a' },
  { id: '5', text: 'I’m unhappy with the health system.', options: ['Treatment is expensive, so you need health insurance.', 'Treatment is free and the service is quite efficient.'], correct: 'a' },
];
export const exercises: Exercise[] = [
  { id: 'ex1', number: 1, section: 'Vocabulary', type: 'multiple-choice', title: 'Life and society', instructions: 'Choose the sentence (a or b) that best matches each sentence 1–5.', questions: choices },
  { id: 'ex2', number: 2, section: 'Vocabulary', type: 'memory', title: 'Recall it on your own', instructions: 'Review the sentence pairs from Exercise 1. Then recall the matching statement one card at a time and check yourself.', originalInstructions: 'Spend two minutes remembering the sentences in Exercise 1. Then work in pairs and test each other.\nStudent A: keep your book open. Say the a or b sentence in 1–5.\nStudent B: close your book. Say the correct sentence (1–5) or the opposite.', duration: 120, sourceExercise: 'ex1' },
  { id: 'ex3', number: 3, section: 'Vocabulary', type: 'short-answer', title: 'Put it into words', instructions: 'Work in pairs. Write one more sentence about each of the things in bold in Exercise 1.', questions: topics.map((text, i) => ({ id: String(i + 1), text })) },
  { id: 'ex4', number: 4, section: 'Vocabulary', type: 'discussion', title: 'Can you guess?', instructions: 'Work in groups. Read your sentences. Can the rest of the group guess what each sentence is about?', example: ['A: Everything is very expensive.', 'B: The economy.', 'A: Right.'] },
  { id: 'ex5', number: 5, section: 'Reading', type: 'discussion', title: 'Moving somewhere new', instructions: 'Work in pairs. Discuss these questions.', questions: [
    { id: '1', text: 'Are there many people from your country living abroad? Why? In which countries?' },
    { id: '2', text: 'Do you know anyone who has moved to another country or city? Why did they move?' },
    { id: '3', text: 'What other reasons are there to move to another country?' },
  ] },
  { id: 'ex6', number: 6, section: 'Reading', type: 'reading', title: 'A new life', instructions: 'Work in groups of four: two As and two Bs. Read about two people who have moved to live in a different country.', detail: 'Student As: read the text below.\nStudent Bs: read the text in File 6 on page 194.', followup: 'Decide how the writer of your text would answer these questions.', textTitle: 'A new life', author: 'Maja', missingText: 'Text B is on page 194, which is not available in this lesson. Use Text A or ask your teacher for the page.', paragraphs: [
    'I came here to work. It’s really easy to get a job in computing because there are so many tech companies here and wages are high. I’ve lived here for five years now. I love it.',
    'I don’t miss anything about my country. People here are very relaxed and open and I get on very well with my neighbours. We don’t have long, dark, cold winters here – it’s warm all year round. But if I want snow, I can go to the mountains and I can still watch ice hockey here. The only problem is, it’s difficult to find time to do those things because I work long hours.',
    'Before I came here, I heard crime was bad and that the health system was expensive, but I haven’t had any problems. In big cities, it can be dangerous to walk at night and there’s gun violence, but in my small town I’ve never seen anything like that. I don’t always lock my front door and no-one has ever stolen anything. As for the health system, the service is expensive, but my company provides health insurance, so I’ve had no problems when I’ve needed treatment.',
  ], questions: readingQuestions },
  { id: 'ex7', number: 7, section: 'Reading', type: 'discussion', title: 'Compare your ideas', instructions: 'Compare answers with the person in your group who read the same text. Which country do you think the writer is from and where do you think they are living?' },
  { id: 'ex8', number: 8, section: 'Reading', type: 'discussion', presentation: 'interview', title: 'Exchange stories', instructions: 'Now work in pairs: one Student A and one Student B. Without looking at your texts, ask and answer the questions in Exercise 6 to find out about your partner’s text.', detail: 'Student B’s source text is not supplied. You can practise Student A’s answers and return to the full exchange later.', questions: readingQuestions },
  { id: 'ex9', number: 9, section: 'Reading', type: 'discussion', title: 'A better quality of life?', instructions: 'With the same partner, discuss which of the two writers has a better quality of life.', detail: 'A comparison needs Student B’s text from page 194, which is not supplied.' },
  { id: 'ex10', number: 10, section: 'Grammar', type: 'grammar', title: 'Notice the pattern', instructions: 'Work in pairs. Look back at the texts and answer these questions.', pattern: 'Adjective + verb', rule: 'We can use an adjective and a verb together.', model: 'It’s really easy to get a job in computing.', followup: 'Can you see the same pattern in the five different sentences?', reference: 'Check your ideas on page 187 and do Exercise 1. Page 187 was not supplied.', questions: [
    { id: '1', group: 'Text A', text: 'What is difficult for the writer?' }, { id: '2', group: 'Text A', text: 'What is dangerous sometimes?' },
    { id: '3', group: 'Text B · not available', text: 'What was dangerous?' }, { id: '4', group: 'Text B · not available', text: 'What is difficult?' },
  ] },
  { id: 'ex11', number: 11, section: 'Grammar', type: 'gap-fill', title: 'Make it about you', instructions: 'Make true sentences about the place you live or work, using the pattern from Exercise 10.', detail: 'For further practice, see Exercise 2 on page 187. Page 187 was not supplied.', questions: ['It’s easy', 'It’s important', 'It’s nice', 'It’s cheap', 'It can be difficult'].map((text, i) => ({ id: String(i + 1), text })) },
  { id: 'ex12', number: 12, section: 'Speaking', type: 'discussion', presentation: 'topics', title: 'Let’s talk about life', instructions: 'Work in groups. Discuss what you think of the things in the box in your country or city. Do you think they are better or worse than other places?', questions: ['Crime', 'The climate', 'The health system', 'The quality of life', 'Politics', 'Work'].map((text, i) => ({ id: String(i + 1), text })) },
  { id: 'ex13', number: 13, section: 'Listening', type: 'audio-repeat', title: 'Listen and repeat', instructions: 'Listen and repeat these common word endings. Are any of them difficult for you to hear or say?', sourceNote: 'The word endings are not clearly visible in the textbook image. Use the original page and recording to check the sounds.', audioNumber: 102, src: '/audio/102.mp3' },
  { id: 'ex14', number: 14, section: 'Listening', type: 'dictation', title: 'Listen. Write. Compare.', instructions: 'Work in groups. Listen to eight sentences using these words. Together, try to write them down. Then listen again and finish writing them.', audioNumber: 103, src: '/audio/103.mp3', hints: ['differences', 'environment', 'situation', 'treatment', 'election', 'insurance', 'solution', 'violence'], questions: Array.from({ length: 8 }, (_, i) => ({ id: String(i + 1), text: `Sentence ${i + 1}` })), detail: 'For further revision, see Exercises 1–3 on page 188. Page 188 was not supplied.' },
];
