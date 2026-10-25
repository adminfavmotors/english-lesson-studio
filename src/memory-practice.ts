import type { Choice } from './lesson.ts';
import type { Document, Value } from './store-model.ts';

export type MemoryCard = { id: string; cue: string; answer: string };
export type MemoryPhase = 'learn'|'recall'|'summary';
export type MemoryRating = 'remembered'|'again';
export function memoryCards(questions: readonly Choice[]): MemoryCard[] {
  return questions.map(question=>({id:question.id,cue:question.options[question.correct==='a'?0:1],answer:question.text}));
}
export function memoryState(id:string,document:Document,cards:readonly MemoryCard[],now:number,duration:number) {
  const get=(name:string)=>document.fields[`${id}.${name}`]?.value??null;
  const enabled=get('memory.timerEnabled')===true;
  const deadline=enabled?Number(get('deadline'))||0:0;
  const remaining=deadline?Math.min(duration,Math.max(0,Math.ceil((deadline-now)/1000))):typeof get('remaining')==='number'?Math.max(0,Math.min(duration,Number(get('remaining')))):duration;
  const stored=get('memory.phase');
  const phase:MemoryPhase=stored==='recall'||stored==='summary'?stored:deadline&&remaining===0?'recall':'learn';
  const ids=new Set(cards.map(card=>card.id));
  const savedQueue=typeof get('memory.queue')==='string'?String(get('memory.queue')).split(','):[];
  const queue=[...new Set(savedQueue)].filter(value=>ids.has(value));
  const round=queue.length?queue:cards.map(card=>card.id);
  const index=Math.max(0,Math.min(round.length-1,Math.floor(Number(get('memory.index'))||0)));
  const ratings=Object.fromEntries(cards.map(card=>{const value=get(`memory.rating.${card.id}`);return [card.id,value==='remembered'||value==='again'?value:null];})) as Record<string,MemoryRating|null>;
  return {phase,remaining,deadline,running:!!deadline&&remaining>0,timerEnabled:enabled,index,round,current:cards.find(card=>card.id===round[index]),revealed:get('memory.revealed')===true,ratings,remembered:cards.filter(card=>ratings[card.id]==='remembered').length,again:cards.filter(card=>ratings[card.id]==='again').map(card=>card.id),reviewed:cards.filter(card=>ratings[card.id]!==null).length};
}
export function beginMemoryRecall(id:string,cardIds:readonly string[]):Record<string,Value> {
  const values:Record<string,Value>={[`${id}.memory.phase`]:'recall',[`${id}.memory.queue`]:cardIds.join(','),[`${id}.memory.index`]:0,[`${id}.memory.revealed`]:false,[`${id}.deadline`]:null,[`${id}.memory.timerEnabled`]:false,[`${id}.complete`]:false};
  for(const cardId of cardIds){values[`${id}.memory.rating.${cardId}`]=null;values[`${id}.answer.recall.${cardId}`]=null;}
  return values;
}
export function rateMemoryRecall(id:string,state:ReturnType<typeof memoryState>,rating:MemoryRating):Record<string,Value> {
  if(!state.current||!state.revealed||state.phase!=='recall')return {};
  const last=state.index===state.round.length-1;
  return {[`${id}.memory.rating.${state.current.id}`]:rating,[`${id}.memory.index`]:last?state.index:state.index+1,[`${id}.memory.revealed`]:false,[`${id}.memory.phase`]:last?'summary':'recall',[`${id}.complete`]:last};
}
