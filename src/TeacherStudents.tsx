import { ArrowRight, CalendarDays, GraduationCap, SlidersHorizontal, UserRound, Users } from 'lucide-react';
import { useLessonStore } from './store';
import { lesson } from './lesson';
import { LESSON_TIME_ZONE, parseLessonDate } from './lesson-workspace';

export function TeacherStudents({ onOpenAssignments, onEditStudent }: { onOpenAssignments: () => void; onEditStudent: () => void }) {
  const { get } = useLessonStore();
  const name = String(get('lesson.studentName') ?? '');
  const level = String(get('lesson.studentLevel') ?? '');
  const title = String(get('lesson.title') ?? lesson.title);
  const number = String(get('lesson.number') ?? '');
  const date = parseLessonDate(String(get('lesson.date') ?? ''));
  const time = String(get('lesson.time') ?? '');

  return <section className="teacher-students" aria-labelledby="current-student-title">
    <div className="service-section-heading"><span><Users size={19} /> ТЕКУЩИЙ УЧЕНИК</span><span>Индивидуальное занятие</span></div>
    <article className="current-student-card">
      <div className="current-student-heading"><span className="current-student-avatar"><UserRound size={30} /></span><div><span className="eyebrow">КАРТОЧКА УЧЕНИКА</span><h2 id="current-student-title">{name || 'Данные ученика пока не заполнены'}</h2><p>{name ? 'Ученик текущего занятия' : 'Укажите имя и уровень в панели управления уроком справа.'}</p></div></div>
      <dl className="current-student-facts">
        <div><dt><GraduationCap size={17} /> Уровень</dt><dd>{level || 'Не указан'}</dd></div>
        <div><dt><CalendarDays size={17} /> Дата занятия</dt><dd>{date ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Дата не выбрана'}{time && <small>{time} · {String(get('lesson.timeZone') ?? LESSON_TIME_ZONE)}</small>}</dd></div>
      </dl>
      <div className="current-student-lesson"><div><span className="eyebrow">МАТЕРИАЛЫ ЗАНЯТИЯ{number ? ` · № ${number}` : ''}</span><h3>{title || lesson.title}</h3><p>Unit {lesson.unit} · {lesson.title}</p></div><button className="primary" onClick={onOpenAssignments}>Открыть задания <ArrowRight size={17} /></button></div>
      <button className="text-button student-edit-button" onClick={onEditStudent}><SlidersHorizontal size={16} /> Изменить данные в панели урока</button>
    </article>
  </section>;
}
