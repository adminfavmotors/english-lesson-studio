import { useEffect, useRef, useState } from 'react';
import { Eye, Headphones, Lightbulb, RotateCcw, Volume2 } from 'lucide-react';
import { APP_LOCALE } from './app-language';
import { dictationCounts, dictationMessage, dictationWords, wordCorrect } from './dictation-model';
import type { DictationContent, DictationProgress, WordAttempt } from './dictation-model';

export default function DictationLesson({ content, progress, onChange, readOnly = false }: {
  content: DictationContent; progress: DictationProgress; onChange: (value: DictationProgress) => void; readOnly?: boolean;
}) {
  const sentences = dictationWords(content.sentences), words = sentences.flat();
  const counts = dictationCounts(words, progress);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});
  const [active, setActive] = useState('');
  const [final, setFinal] = useState<Record<string, boolean>>({});
  const [localAudio, setLocalAudio] = useState('');
  const [notice, setNotice] = useState('');
  const [voice, setVoice] = useState(false);
  useEffect(() => {
    setVoice('speechSynthesis' in window);
    return () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };
  }, []);
  useEffect(() => () => { if (localAudio) URL.revokeObjectURL(localAudio); }, [localAudio]);
  const update = (id: string, patch: Partial<WordAttempt>) => {
    const previous = progress[id] ?? { value: '', hints: 0, revealed: false };
    const next = { ...progress, [id]: { ...previous, ...patch } };
    onChange(next);
    const word = words.find(w => w.id === id)!;
    if (patch.value !== undefined && wordCorrect(word, next[id]) && !readOnly) {
      const index = words.findIndex(w => w.id === id);
      const ordered = [...words.slice(index + 1), ...words.slice(0, index)];
      const unfinished = ordered.find(w => !next[w.id]?.revealed && !wordCorrect(w, next[w.id]));
      if (unfinished) requestAnimationFrame(() => inputs.current[unfinished.id]?.focus());
    }
  };
  const speak = (sentence: string) => {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    const english = voices.find(v => v.lang.toLowerCase() === APP_LOCALE.toLowerCase()) ?? voices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (voices.length && !english) { setNotice('An English browser voice is not available. Use the recording or ask your teacher for help.'); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = APP_LOCALE; utterance.rate = 0.7; utterance.voice = english ?? null;
    utterance.onerror = () => setNotice('The browser could not read this sentence. Use the recording or try again.');
    speechSynthesis.speak(utterance);
  };
  const audioUrl = localAudio || content.audioUrl || undefined;
  return <div className="dictation">
    <section className="dictation-audio" aria-label="Dictation audio">
      <h2><Headphones size={21} aria-hidden="true"/>Listen first</h2>
      <p>Play the recording. Pause and listen again when you need.</p>
      <audio key={audioUrl ?? 'no-recording'} controls preload="metadata" src={audioUrl} aria-label="Dictation recording"/>
      {!audioUrl && <p className="dictation-helper">The recording is not available yet. Use Browser voice for each sentence, or ask your teacher for the recording.</p>}
      <details><summary>Use a different audio file</summary><label>Audio from your device<input type="file" accept="audio/*,.mp3,.m4a,.aac,.mp4,.webm,.ogg,.wav" onChange={event => {
        const file = event.target.files?.[0]; if (!file) return;
        if (file.size > 30 * 1024 * 1024 || !/\.(mp3|m4a|aac|mp4|webm|ogg|wav)$/i.test(file.name)) { setNotice('Choose an MP3, M4A, AAC, MP4, WebM, OGG or WAV file up to 30 MB.'); return; }
        setLocalAudio(URL.createObjectURL(file)); setNotice('Your audio file is ready. It stays on this device.');
      }}/></label><p className="dictation-helper">This file is played on your device. It is not sent to your teacher.</p></details>
    </section>
    {notice && <p role="status" className="dictation-notice">{notice}</p>}
    <div className="dictation-status" aria-label="Dictation progress">
      <strong>Done: {counts.done}/{counts.total}</strong><span>Shown: {counts.shown}</span><span>Words with hints: {counts.hinted}</span>
      <span className="sr-only" role="status" aria-atomic="true">{counts.done} of {counts.total} words finished. {counts.shown} shown.</span>
      {!readOnly && <button className="secondary" onClick={() => { onChange({}); setFinal({}); setActive(''); }}><RotateCcw size={15} aria-hidden="true"/>Reset answers</button>}
    </div>
    {sentences.map((sentence, s) => <section key={s} className="dictation-sentence" aria-labelledby={`dictation-sentence-${s + 1}`}>
      <div className="dictation-sentence-heading"><h2 id={`dictation-sentence-${s + 1}`}><span>{s + 1}</span><span className="sr-only">Sentence {s + 1}</span></h2>
        {voice && <button className="secondary" onClick={() => speak(content.sentences[s])}><Volume2 size={16} aria-hidden="true"/>Browser voice<span className="sr-only">: sentence {s + 1}</span></button>}
        {!readOnly && <button className="text-button" onClick={() => {
          const next = { ...progress };
          for (const word of sentence) if (!wordCorrect(word, next[word.id]) && !next[word.id]?.revealed) next[word.id] = { value: word.answer, hints: next[word.id]?.hints ?? 0, revealed: true };
          onChange(next);
        }}>Show sentence<span className="sr-only"> {s + 1}</span></button>}
      </div>
      <div className="dictation-words">{sentence.map(word => {
        const attempt = progress[word.id] ?? { value: '', hints: 0, revealed: false };
        const correct = wordCorrect(word, attempt), shown = attempt.revealed;
        const bad = !correct && !shown && !!attempt.value.trim() && (readOnly || final[word.id] || attempt.value.trim().length >= word.answer.length);
        const locked = readOnly || correct || shown;
        const caption = !locked && (active === word.id || bad);
        return <div className={`dictation-word${shown ? ' shown' : correct ? ' correct' : bad ? ' incorrect' : ''}`} key={word.id}>
          <div className="dictation-word-line"><input ref={element => { inputs.current[word.id] = element; }}
            aria-label={`Sentence ${word.sentence}, word ${word.position}`} aria-invalid={bad || undefined}
            aria-describedby={caption ? `${word.id}-help` : undefined} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
            style={{ width: `${Math.max(word.answer.length, 3) + 2}ch` }} maxLength={100} value={attempt.value} readOnly={locked}
            onFocus={() => setActive(word.id)} onBlur={() => setFinal(previous => ({ ...previous, [word.id]: true }))}
            onChange={event => { setFinal(previous => ({ ...previous, [word.id]: false })); update(word.id, { value: event.target.value }); }}
            onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); setFinal(previous => ({ ...previous, [word.id]: true })); } }}/><span className="dictation-punctuation" aria-hidden="true">{word.punctuation}</span></div>
          {(correct || shown) && <span className="dictation-word-state">{shown ? 'Shown' : 'Correct'}{attempt.hints ? ` · ${attempt.hints} ${attempt.hints === 1 ? 'hint' : 'hints'}` : ''}</span>}
          {caption && <div id={`${word.id}-help`} className="dictation-caption">
            {bad && <span className="dictation-error">{dictationMessage(word, attempt.value)}</span>}
            {attempt.hints > 0 && <span className="dictation-hint">{Array.from(word.answer).map((letter, i) => i < attempt.hints ? letter : '_').join(' ')} ({word.answer.length} letters)</span>}
            <div><button className="secondary" aria-label={`Hint: sentence ${word.sentence}, word ${word.position}`} onClick={() => update(word.id, { hints: Math.min(attempt.hints + 1, word.answer.length - 1) })}><Lightbulb size={13} aria-hidden="true"/>Hint</button>
              <button className="secondary" aria-label={`Show: sentence ${word.sentence}, word ${word.position}`} onClick={() => update(word.id, { value: word.answer, revealed: true })}><Eye size={13} aria-hidden="true"/>Show</button></div>
          </div>}
        </div>;
      })}</div>
    </section>)}
  </div>;
}
