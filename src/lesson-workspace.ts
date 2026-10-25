import type { Document, Value } from './store-model.ts';

export const DEFAULT_LESSON_SECONDS = 60 * 60;
export const LESSON_TIME_ZONE = 'Europe/Warsaw';
export type LessonTimerState = { duration: number; remaining: number; deadline: number; running: boolean; finished: boolean; started: boolean };
export function lessonTimerState(document: Document, now: number): LessonTimerState {
  const value = (key: string) => document.fields[`lesson.timer.${key}`]?.value;
  const duration = typeof value('duration') === 'number' && Number(value('duration')) >= 60 ? Math.min(14400,Number(value('duration'))) : DEFAULT_LESSON_SECONDS;
  const deadline = Number(value('deadline')) || 0;
  const paused = value('remaining');
  const remaining = deadline ? Math.min(duration,Math.max(0,Math.ceil((deadline-now)/1000))) : typeof paused === 'number' ? Math.max(0,Math.min(duration,paused)) : duration;
  return {duration,remaining,deadline,running:deadline>0&&remaining>0,finished:remaining===0,started:!!deadline||value('state')==='paused'||value('state')==='finished'};
}
export function timerChanges(action: 'start'|'pause'|'reset'|'duration', state: LessonTimerState, now: number, minutes?: number): Record<string,Value> {
  if(action==='duration') {
    if(minutes===undefined||!Number.isInteger(minutes)||minutes<1||minutes>240) throw new Error('Choose a lesson length between 1 and 240 minutes.');
    return {'lesson.timer.duration':minutes*60,'lesson.timer.remaining':minutes*60,'lesson.timer.deadline':null,'lesson.timer.state':'idle'};
  }
  if(action==='reset') return {'lesson.timer.remaining':state.duration,'lesson.timer.deadline':null,'lesson.timer.state':'idle'};
  if(action==='pause') return {'lesson.timer.remaining':state.deadline?Math.max(0,Math.ceil((state.deadline-now)/1000)):state.remaining,'lesson.timer.deadline':null,'lesson.timer.state':'paused'};
  const seconds=state.remaining>0?state.remaining:state.duration;
  return {'lesson.timer.remaining':seconds,'lesson.timer.deadline':Math.round(now+seconds*1000),'lesson.timer.state':'running'};
}
export function formatTimer(seconds: number) { return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`; }
export function isoDate(date: Date) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function parseLessonDate(value: string): Date|null {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date=new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime())&&isoDate(date)===value?date:null;
}
export function calendarDays(year: number, month: number): (string|null)[] {
  const start=new Date(year,month,1);const offset=(start.getDay()+6)%7;const count=new Date(year,month+1,0).getDate();
  const days:(string|null)[]=Array.from({length:offset},()=>null);
  for(let day=1;day<=count;day++) days.push(isoDate(new Date(year,month,day)));
  while(days.length%7) days.push(null);
  return days;
}
