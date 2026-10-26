export const vocab = (...rows) =>
  rows.map(([term, meaning, example]) => ({ term, meaning, example }));
export const recall = (...rows) =>
  rows.map(([prompt, answer, fromLesson = null]) => ({
    prompt,
    answer,
    fromLesson,
  }));
export const choice = (id, title, rows) => ({
  id,
  type: "choice",
  title,
  instruction: "Choose the best answer.",
  items: rows.map(([prompt, options, index, explanation], i) => ({
    id: String(i + 1),
    prompt,
    options,
    answers: [options[index]],
    explanation,
  })),
});
export const gaps = (id, title, rows) => ({
  id,
  type: "gap",
  title,
  instruction: "Complete each gap. Write only the missing word or words.",
  items: rows.map(([prompt, answer, explanation], i) => ({
    id: String(i + 1),
    prompt,
    answers: Array.isArray(answer) ? answer : [answer],
    explanation,
  })),
});
export const order = (id, title, rows) => ({
  id,
  type: "order",
  title,
  instruction:
    "Put the words in order. Start with the first word of the sentence.",
  items: rows.map(([answer, explanation], i) => ({
    id: String(i + 1),
    prompt: "Build the sentence.",
    tokens: answer.split(" "),
    answers: [answer],
    explanation,
  })),
});
export const match = (id, title, rows) => ({
  id,
  type: "match",
  title,
  instruction: "Match each phrase with its meaning or reply.",
  items: rows.map(([prompt, answer, explanation], i) => ({
    id: String(i + 1),
    prompt,
    answers: [answer],
    options: rows.map((row) => row[1]),
    explanation,
  })),
});
export const model = (title, format, text, questions) => ({
  title,
  format,
  text,
  instruction:
    "Read the text, or listen to your teacher first. Then answer the questions.",
  questions: choice("understand", "Understand the message", questions),
});
export function makeLesson(u) {
  return {
    schemaVersion: 1,
    title: u.title,
    subtitle: u.subtitle,
    level: "A1",
    topic: u.topic,
    skills: u.skills,
    duration: 45,
    sequence: u.n,
    goal: u.goal,
    vocabulary: u.vocabulary,
    language: u.language,
    input: u.input,
    retrieval: u.retrieval,
    practice: u.practice,
    speaking: u.speaking,
    writing: u.writing,
    exit: u.exit,
    homework: {
      ...u.homework,
      review:
        u.homework.review ||
        "Review these phrases tomorrow, then about 3 and 7 days later. Try without help first, then check. Review sooner if it is difficult.",
    },
    teacherNotes: u.teacherNotes,
  };
}
