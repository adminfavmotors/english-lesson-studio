import { useEffect, useState } from 'react';
import { Check, CheckCheck, RotateCcw, Eye, EyeOff, Play, Headphones, MessageCircle, Info, ArrowRight } from 'lucide-react';
import type { Exercise, Question } from './lesson';
import { MemoryPractice } from './MemoryPractice';
import { resetExercise, setFields, useLessonStore } from './store';

export function AnswerFields({ exercise, questions, teacher, prefix = '', idSuffix = '' }: { exercise: Exercise; questions: Question[]; teacher: boolean; prefix?: string; idSuffix?: string }) {
  const { get, set } = useLessonStore();
  return <div className={`answer-fields ${'presentation' in exercise && exercise.presentation === 'topics' ? 'topic-grid' : ''}`}>{questions.map((q, i) => {
    const key = `${exercise.id}.answer.${prefix}${q.id}`;
    const grade = get(`${key}.grade`);
    return <div className="answer-field" key={q.id}>
      {q.group && <span className="field-group">{q.group}</span>}
      <label htmlFor={key + idSuffix}><span className="field-number">{String(i + 1).padStart(2, '0')}</span>{q.text}{exercise.type === 'gap-fill' ? ' …' : ''}</label>
      <textarea maxLength={8000} id={key + idSuffix} rows={'presentation' in exercise && exercise.presentation === 'topics' ? 3 : 2} value={String(get(key) ?? '')} placeholder={exercise.type === 'gap-fill' ? 'Complete your sentence…' : 'Write your answer…'} onChange={e => { setFields({ [key]: e.target.value, [`${key}.grade`]: null, [`${exercise.id}.complete`]: false }); }} />
      {grade && <span className={`grade ${grade === 'correct' ? 'good' : 'improve'}`}>{grade === 'correct' ? '✓ Correct' : '↗ Needs improvement'}</span>}
      {teacher && <div className="review-buttons" aria-label={`Review ${q.text}`}><button className={grade === 'correct' ? 'selected' : ''} onClick={() => set(`${key}.grade`, grade === 'correct' ? null : 'correct')}><Check size={13}/> Correct</button><button className={grade === 'improve' ? 'selected' : ''} onClick={() => set(`${key}.grade`, grade === 'improve' ? null : 'improve')}>Needs improvement</button></div>}
    </div>;
  })}</div>;
}

function MultipleChoice({ exercise, teacher }: { exercise: Extract<Exercise, { type: 'multiple-choice' }>; teacher: boolean }) {
  const { get } = useLessonStore();
  const [showKey, setShowKey] = useState(false);
  const checked = !!get(`${exercise.id}.checked`);
  const answered = exercise.questions.filter(q => get(`${exercise.id}.answer.${q.id}`)).length;
  const score = exercise.questions.filter(q => get(`${exercise.id}.answer.${q.id}`) === q.correct).length;
  return <>
    <div className="exercise-subbar"><span>CHOOSE ONE ANSWER FOR EACH SENTENCE</span><span>{answered} / {exercise.questions.length} answered</span></div>
    <div className="choice-questions">{exercise.questions.map((q, i) => <fieldset className="choice-question" key={q.id}>
      <legend><span className="question-number">{String(i + 1).padStart(2, '0')}</span>{q.text}</legend>
      <div className="choice-options">{q.options.map((option, j) => {
        const value = j === 0 ? 'a' : 'b';
        const selected = get(`${exercise.id}.answer.${q.id}`) === value;
        const correct = (checked || (teacher && showKey)) && value === q.correct;
        const wrong = checked && selected && value !== q.correct;
        return <label className={`choice-option ${selected ? 'chosen' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} key={value}>
          <input type="radio" name={`${exercise.id}-${q.id}`} value={value} checked={selected} onChange={() => setFields({ [`${exercise.id}.answer.${q.id}`]: value, [`${exercise.id}.checked`]: false, [`${exercise.id}.complete`]: false })}/>
          <span className="option-letter">{correct ? <Check size={14}/> : value.toUpperCase()}</span><span>{option}</span>
          {wrong && <span className="choice-feedback">Incorrect</span>}{correct && <span className="sr-only">Correct answer</span>}
        </label>;
      })}</div>
    </fieldset>)}</div>
    <div className="exercise-actions"><button className="primary" disabled={answered < exercise.questions.length} onClick={() => setFields({ [`${exercise.id}.checked`]: true, [`${exercise.id}.complete`]: true })}><CheckCheck size={17}/> Check answers</button><button className="text-button" onClick={() => resetExercise(exercise.id)}><RotateCcw size={15}/> Try again</button>{teacher && <button className="text-button" onClick={() => setShowKey(!showKey)}><Eye size={15}/>{showKey ? 'Hide answer key' : 'Show answer key'}</button>}<span className="result" role="status">{checked ? `${score} / ${exercise.questions.length} correct${score === exercise.questions.length ? ' · Well done!' : ' · Try the highlighted answers again.'}` : 'Choose all five answers before checking.'}</span></div>
  </>;
}

function Reading({ exercise, teacher }: { exercise: Extract<Exercise, { type: 'reading' }>; teacher: boolean }) {
  const [student, setStudent] = useState('A');
  const { get, set } = useLessonStore();
  const hidden = !!get(`${exercise.id}.hidden`);
  return <><div className="reading-toolbar"><div className="segmented"><button aria-pressed={student === 'A'} className={student === 'A' ? 'active' : ''} onClick={() => setStudent('A')}>Student A</button><button aria-pressed={student === 'B'} className={student === 'B' ? 'active' : ''} onClick={() => setStudent('B')}>Student B</button></div>{teacher && <button className="text-button" onClick={() => set(`${exercise.id}.hidden`, !hidden)}><EyeOff size={15}/>{hidden ? 'Show reading text' : 'Hide reading text'}</button>}</div>
    {student === 'B' ? <div className="notice"><Info size={18}/><p>{exercise.missingText}</p></div> : hidden ? <div className="hidden-panel"><EyeOff/><p>The teacher has hidden the reading text for speaking practice.</p></div> : <article className="reading-text"><div className="eyebrow">A STORY ABOUT STARTING OVER</div><h3>{exercise.textTitle}</h3><span className="author">{exercise.author}</span>{exercise.paragraphs.map((text, i) => <p key={i}>{text}</p>)}</article>}
    <h3 className="subheading">{exercise.followup}</h3><AnswerFields exercise={exercise} questions={exercise.questions} teacher={teacher} prefix={`${student}.`}/></>;
}

function AudioExercise({ exercise, teacher }: { exercise: Extract<Exercise, { type: 'audio-repeat' | 'dictation' }>; teacher: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (localFile) { const objectURL = URL.createObjectURL(localFile); setUrl(objectURL); return () => URL.revokeObjectURL(objectURL); }
    const controller = new AbortController();
    fetch(exercise.src, { method: 'HEAD', signal: controller.signal }).then(r => { setUrl(r.ok && r.headers.get('content-type')?.includes('audio') ? exercise.src : null); }).catch(() => {});
    return () => controller.abort();
  }, [exercise.src, localFile]);
  return <><div className="audio-panel"><div className="audio-icon"><Headphones size={24}/></div><div className="audio-content"><strong>Audio {exercise.audioNumber}</strong><p>{url ? (localFile ? `${localFile.name} · this tab only` : 'Original lesson audio') : `Audio ${exercise.audioNumber} not added`}</p>{url ? <audio controls src={url} onError={() => setError('This file could not be played. Please choose a valid audio file.')} preload="metadata"/> : <div className="empty-audio"><button disabled aria-label="Play unavailable audio"><Play size={16}/></button><div/><span>–:––</span></div>}{error && <p role="alert">{error}</p>}</div></div>
    <label className="file-upload">Open an original audio file<input type="file" accept="audio/*,.mp3" onChange={e => { setError(''); setLocalFile(e.target.files?.[0] ?? null); }}/></label><p className="helper">Selected files play in this tab. To make audio available after reload and in both tabs, add the original MP3 to <code>public{exercise.src}</code>.</p>
    {exercise.sourceNote && <div className="notice"><Info size={17}/><p>{exercise.sourceNote}</p></div>}
    {exercise.hints && <div className="word-bank">{exercise.hints.map(word => <span key={word}>{word}</span>)}</div>}
    {exercise.questions && <AnswerFields exercise={exercise} questions={exercise.questions} teacher={teacher}/>}</>;
}

function Interview({ exercise, teacher }: { exercise: Exercise & { questions?: Question[] }; teacher: boolean }) {
  const [speaker, setSpeaker] = useState('A');
  const [index, setIndex] = useState(0);
  const questions = exercise.questions ?? [];
  const question = questions[index];
  if (!question) return null;
  return <><div className="reading-toolbar"><div className="segmented"><button className={speaker === 'A' ? 'active' : ''} aria-pressed={speaker === 'A'} onClick={() => setSpeaker('A')}>Student A asks</button><button className={speaker === 'B' ? 'active' : ''} aria-pressed={speaker === 'B'} onClick={() => setSpeaker('B')}>Student B asks</button></div><span className="helper">Question {index + 1} of {questions.length}</span></div><div className="interview-prompt"><MessageCircle size={22}/><span>STUDENT {speaker} ASKS · STUDENT {speaker === 'A' ? 'B' : 'A'} ANSWERS</span><p>{question.text}</p></div><AnswerFields exercise={exercise} questions={[{...question,text:'Partner’s answer / notes'}]} teacher={teacher} prefix={`${speaker}.`}/><div className="interview-navigation"><button className="text-button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous question</button><button className="secondary" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}>Next question <ArrowRight size={14}/></button></div>{teacher && <details className="interview-review"><summary>Review all interview notes</summary>{['A','B'].map(role => <div key={role}><h3 className="subheading">Student {role} asks</h3><AnswerFields exercise={exercise} questions={questions} teacher={teacher} prefix={`${role}.`} idSuffix="-review"/></div>)}</details>}</>;
}

export function ExerciseCard({ exercise, teacher }: { exercise: Exercise; teacher: boolean }) {
  const { get, set } = useLessonStore();
  const complete = !!get(`${exercise.id}.complete`);
  const [reset, setReset] = useState(false);
  return <section className={`exercise-card ${complete ? 'is-complete' : ''}`} id={exercise.id} aria-labelledby={`${exercise.id}-title`}>
    <div className="exercise-heading"><div className="exercise-tag">EXERCISE {String(exercise.number).padStart(2, '0')}</div><span className={`status-pill ${complete ? 'done' : ''}`}>{complete ? <><Check size={12}/> Completed</> : 'To do'}</span></div>
    <h2 id={`${exercise.id}-title`}>{exercise.title}</h2><p className="instruction">{exercise.instructions}</p>
    {exercise.detail && exercise.type !== 'gap-fill' && exercise.type !== 'dictation' && <p className="detail">{exercise.detail}</p>}
    {exercise.type === 'multiple-choice' && <MultipleChoice exercise={exercise} teacher={teacher}/>}
    {exercise.type === 'memory' && <MemoryPractice exercise={exercise}/>}
    {exercise.type === 'reading' && <Reading exercise={exercise} teacher={teacher}/>}
    {exercise.type === 'grammar' && <><div className="grammar-rule"><span>GRAMMAR NOTE</span><h3>{exercise.pattern}</h3><p>{exercise.rule}</p><blockquote>{exercise.model}</blockquote></div><AnswerFields exercise={exercise} questions={exercise.questions} teacher={teacher}/><h3 className="subheading">{exercise.followup}</h3><AnswerFields exercise={exercise} questions={[{ id: 'pattern', text: 'The pattern you noticed' }]} teacher={teacher}/><p className="reference"><Info size={15}/>{exercise.reference}</p></>}
    {(exercise.type === 'short-answer' || exercise.type === 'discussion' || exercise.type === 'gap-fill') && (exercise.presentation === 'interview' ? <Interview exercise={exercise} teacher={teacher}/> : <AnswerFields exercise={exercise} questions={exercise.questions ?? [{ id: 'notes', text: 'Discussion notes' }]} teacher={teacher}/>)}
    {(exercise.type === 'audio-repeat' || exercise.type === 'dictation') && <AudioExercise exercise={exercise} teacher={teacher}/>}
    {exercise.example && <div className="example"><span>FOR EXAMPLE</span>{exercise.example.map(line => <p key={line}>{line}</p>)}</div>}
    {(exercise.type === 'gap-fill' || exercise.type === 'dictation') && exercise.detail && <p className="reference"><Info size={15}/>{exercise.detail}</p>}
    {exercise.type === 'discussion' && <div className="speaking-note"><MessageCircle size={16}/> Talk it through together. There’s no automatic score for this exercise.</div>}
    {exercise.type !== 'multiple-choice' && exercise.type !== 'memory' && <div className="exercise-actions"><button className={complete ? 'secondary' : 'primary'} onClick={() => set(`${exercise.id}.complete`, !complete)}>{complete ? <Check size={16}/> : <ArrowRight size={16}/>} {complete ? 'Completed · reopen' : 'Mark as complete'}</button><span className="helper">{teacher ? 'Teacher review is saved with the answer.' : 'Your work is saved as you go.'}</span></div>}
    {teacher && <div className="teacher-exercise-actions"><>{(exercise.type === 'multiple-choice' || exercise.type === 'memory') && <button className="text-button" onClick={() => set(`${exercise.id}.complete`, !complete)}>{complete ? 'Reopen exercise' : 'Mark completed'}</button>}</>{reset ? <><span>Clear this exercise?</span><button className="danger-button" onClick={() => { resetExercise(exercise.id); setReset(false); }}>Clear exercise</button><button className="text-button" onClick={() => setReset(false)}>Cancel</button></> : <button className="text-button" onClick={() => setReset(true)}><RotateCcw size={13}/>Reset exercise</button>}</div>}
  </section>;
}
