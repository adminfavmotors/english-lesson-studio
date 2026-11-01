import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import DictationLesson from './DictationLesson';
import AssignHomeworkDialog from './AssignHomeworkDialog';
import AppLink from './AppLink';
import { homeworkPath } from './app-routes';
import type { Material } from './material-model';
import type { DictationContent, DictationProgress } from './dictation-model';
export default function DictationPreview({ material, content, onBack }: { material: Material; content: DictationContent; onBack: () => void }) {
  const [progress, setProgress] = useState<DictationProgress>({}), [assign, setAssign] = useState(false), [assigned, setAssigned] = useState('');
  return <article className="dictation-preview"><div className="homework-page-heading"><div><button className="text-button" onClick={onBack}><ArrowLeft size={16}/>Back to lesson library</button><p className="eyebrow">TEACHER PREVIEW · {material.level} · {material.duration} MINUTES</p><h1>{material.title}</h1><p>{content.goal}</p></div><button className="primary" onClick={() => setAssign(true)}><Send size={17}/>Assign homework</button></div>
    <p className="dictation-notice">Preview this activity here. These answers are separate from your students’ assigned homework.</p>
    {assigned && <p role="status" className="dictation-notice">Homework assigned. <AppLink href={homeworkPath('teacher', assigned)}>Open homework and copy the student link</AppLink>.</p>}
    <p>{content.instruction}</p><DictationLesson content={content} progress={progress} onChange={setProgress}/>
    <details className="dictation-teacher-notes"><summary>Answer key and teacher notes</summary><ol>{content.sentences.map(s => <li key={s}>{s}</li>)}</ol><ul>{content.teacherNotes.map(n => <li key={n}>{n}</li>)}</ul></details>
    {assign && <AssignHomeworkDialog materialId={material.id} onClose={() => setAssign(false)} onAssigned={h => { setAssigned(h.id); setAssign(false); }}/>}</article>;
}
