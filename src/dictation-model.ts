export type DictationContent = {
  schemaVersion: 3;
  kind: 'dictation';
  goal: string;
  instruction: string;
  sentences: string[];
  audioUrl: string | null;
  teacherNotes: string[];
};
export type WordAttempt = { value: string; hints: number; revealed: boolean };
export type DictationProgress = Record<string, WordAttempt>;
export type DictationWord = { id: string; answer: string; punctuation: string; sentence: number; position: number };
export function dictationWords(sentences: string[]): DictationWord[][] {
  return sentences.map((sentence, s) => sentence.split(' ').map((token, w) => {
    const match = /^([A-Za-z’']+)([.,!?;:]*)$/.exec(token);
    if (!match) throw new Error('The dictation contains an unsupported word.');
    return { id: `s${s + 1}w${w + 1}`, answer: match[1], punctuation: match[2], sentence: s + 1, position: w + 1 };
  }));
}
export const normaliseDictation = (value: string) => value.trim().toLowerCase().replace(/[’']/g, '');
export const wordCorrect = (word: DictationWord, attempt?: WordAttempt) => !!attempt?.value.trim() && normaliseDictation(attempt.value) === normaliseDictation(word.answer);
export function dictationCounts(words: DictationWord[], progress: DictationProgress) {
  const shown = words.filter(w => progress[w.id]?.revealed).length;
  const correct = words.filter(w => !progress[w.id]?.revealed && wordCorrect(w, progress[w.id])).length;
  return { total: words.length, done: shown + correct, correct, shown, hinted: words.filter(w => progress[w.id]?.hints > 0).length };
}
export function editDistance(a: string, b: string): number {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + Number(a[i - 1] !== b[j - 1]));
    row = next;
  }
  return row[b.length];
}
export function dictationMessage(word: DictationWord, value: string) {
  const answer = normaliseDictation(word.answer), typed = normaliseDictation(value);
  const distance = editDistance(typed, answer);
  return distance === 1 ? 'Almost! One letter is wrong.' : distance === 2 ? 'Close. Check the spelling.'
    : typed.length < answer.length && answer.startsWith(typed) ? 'Not finished yet.' : 'Not this word. Listen again.';
}
export function validateDictationContent(value: Record<string, unknown>): string[] {
  const text = (v: unknown, max: number) => typeof v === 'string' && !!v.trim() && v.length <= max;
  const errors: string[] = [];
  if (value.kind !== 'dictation' || !text(value.goal, 300) || !text(value.instruction, 1500)) errors.push('Complete the dictation goal and instructions.');
  if (!Array.isArray(value.sentences) || !value.sentences.length || value.sentences.length > 30 || value.sentences.some(s => !text(s, 500))) errors.push('Include 1–30 dictation sentences.');
  else {
    try { if (dictationWords(value.sentences as string[]).flat().length > 500) errors.push('Use no more than 500 words.'); }
    catch { errors.push('Use English words separated by single spaces, with punctuation after each word.'); }
  }
  if (!(value.audioUrl === null || (typeof value.audioUrl === 'string' && value.audioUrl.length <= 2000 && /^(https:\/\/|\/(?!\/))/.test(value.audioUrl)))) errors.push('Provide a hosted HTTPS audio URL, a site path, or null.');
  if (!Array.isArray(value.teacherNotes) || !value.teacherNotes.length || value.teacherNotes.length > 8 || value.teacherNotes.some(n => !text(n, 2000))) errors.push('Include 1–8 teacher notes.');
  return errors;
}
