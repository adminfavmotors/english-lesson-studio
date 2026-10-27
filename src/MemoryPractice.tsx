import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Check, CheckCheck, Clock3, Eye, Pause, Play, RotateCcw, UserRound } from 'lucide-react';
import type { Exercise } from './lesson';
import { exercises } from './lesson';
import { beginMemoryRecall, memoryCards, memoryState, rateMemoryRecall } from './memory-practice';
import { formatTimer } from './lesson-workspace';
import { lessonNow, resetExercise, setFields, useLessonStore } from './store';

export function MemoryPractice({exercise}:{exercise:Extract<Exercise,{type:'memory'}>}) {
  const {doc,get,set}=useLessonStore();const [now,setNow]=useState(lessonNow);
  const source=exercises.find(item=>item.id===exercise.sourceExercise);
  const cards=memoryCards(source?.type==='multiple-choice'?source.questions:[]);
  const state=memoryState(exercise.id,doc,cards,now,exercise.duration);
  useEffect(()=>{
    setNow(lessonNow());
    if(!state.deadline||state.phase!=='learn')return;
    const interval=window.setInterval(()=>{const current=lessonNow();setNow(current);if(current>=state.deadline)clearInterval(interval);},250);
    return ()=>clearInterval(interval);
  },[state.deadline,state.phase]);
  const focusStage=(id=exercise.id)=>requestAnimationFrame(()=>{
    const element=document.getElementById(id);element?.scrollIntoView({behavior:'instant',block:'start'});
    if(id!==exercise.id)element?.focus({preventScroll:true});
  });
  const recall=(ids:readonly string[])=>{setFields(beginMemoryRecall(exercise.id,ids));focusStage();};
  const rate=(rating:'remembered'|'again')=>{
    setFields(rateMemoryRecall(exercise.id,state,rating));
    focusStage(`${exercise.id}-memory-${state.index===state.round.length-1?'summary':'prompt'}`);
  };
  const toggleTimer=()=>{
    const current=lessonNow();setNow(current);
    if(state.running)setFields({[`${exercise.id}.remaining`]:Math.max(0,Math.ceil((state.deadline-current)/1000)),[`${exercise.id}.deadline`]:null});
    else setFields({[`${exercise.id}.memory.timerEnabled`]:true,[`${exercise.id}.memory.phase`]:'learn',[`${exercise.id}.memory.index`]:0,[`${exercise.id}.memory.queue`]:cards.map(card=>card.id).join(','),[`${exercise.id}.memory.revealed`]:false,[`${exercise.id}.complete`]:false,[`${exercise.id}.deadline`]:Math.round(current+(state.remaining>0?state.remaining:exercise.duration)*1000)});
  };
  if(!cards.length)return <p className="notice">Add the source sentence pairs to use this activity.</p>;
  const steps=[{id:'learn',label:'Review',icon:BookOpen},{id:'recall',label:'Recall',icon:Brain},{id:'summary',label:'Self-check',icon:CheckCheck}];
  return <div className="memory-practice">
    <span className="memory-adaptation"><UserRound size={14}/> Individual practice</span>
    <ol className="memory-steps" aria-label="Memory practice steps">{steps.map((step,index)=>{const Icon=step.icon;return <li key={step.id} className={state.phase===step.id?'current':''} aria-current={state.phase===step.id?'step':undefined}><span><Icon size={16}/></span><div><small>STEP {index+1}</small><strong>{step.label}</strong></div></li>;})}</ol>
    {state.phase==='learn'&&<>
      <h3 className="memory-stage-title">First, connect the two ideas.</h3><p className="memory-stage-description">Read each pair. Notice how the second sentence supports the statement.</p>
      <div className="memory-pairs">{cards.map((card,index)=><div className="memory-review-pair" key={card.id}><span className="memory-pair-number">{String(index+1).padStart(2,'0')}</span><div><strong>{card.answer}</strong><p>{card.cue}</p></div></div>)}</div>
      <details className="memory-optional-timer"><summary><Clock3 size={16}/>Use a {exercise.duration/60}-minute review timer <span>(optional)</span></summary><div className="memory-review-clock"><span role="timer" aria-label={`${state.remaining} seconds of optional review remaining`}>{formatTimer(state.remaining)}</span><button className="secondary" onClick={toggleTimer}>{state.running?<Pause size={15}/>:<Play size={15}/>} {state.running?'Pause review':state.remaining<exercise.duration?'Resume review':`Start ${exercise.duration/60}-minute review`}</button><button className="icon-button" aria-label="Reset review timer" onClick={()=>setFields({[`${exercise.id}.deadline`]:null,[`${exercise.id}.remaining`]:exercise.duration,[`${exercise.id}.memory.timerEnabled`]:false})}><RotateCcw size={15}/></button></div><p>The sentence pairs will be hidden when the timer ends. You can start recalling whenever you feel ready.</p></details>
      <div className="memory-stage-actions"><button className="primary" onClick={()=>recall(cards.map(card=>card.id))}>Start recall <ArrowRight size={17}/></button><span className="helper">The answers will be hidden.</span></div>
    </>}
    {state.phase==='recall'&&state.current&&<>
      <div className="memory-round-heading" id={`${exercise.id}-memory-prompt`} tabIndex={-1}><span>RECALL FROM MEMORY</span><strong>Card {state.index+1} of {state.round.length}</strong></div><progress max={state.round.length} value={state.index} aria-label="Memory cards reviewed in this round"/>
      <div className="memory-recall-card"><span className="eyebrow">WHICH STATEMENT MATCHES THIS SENTENCE?</span><blockquote>{state.current.cue}</blockquote><p>Say the matching statement aloud, or write it below in your own words.</p></div>
      <div className="answer-field memory-response"><label htmlFor={`${exercise.id}-recall-answer`}>Your answer <span>(optional)</span></label><textarea id={`${exercise.id}-recall-answer`} maxLength={8000} rows={2} value={String(get(`${exercise.id}.answer.recall.${state.current.id}`)??'')} placeholder="Write what you remember…" onChange={event=>setFields({[`${exercise.id}.answer.recall.${state.current!.id}`]:event.target.value,[`${exercise.id}.memory.rating.${state.current!.id}`]:null,[`${exercise.id}.complete`]:false})}/></div>
      {state.revealed?<div className="memory-revealed-answer" aria-live="polite"><span><BookOpen size={16}/> ORIGINAL STATEMENT</span><p>{state.current.answer}</p><small>Similar wording is fine. Check whether you remembered the same idea.</small></div>:<button className="secondary memory-reveal-button" onClick={()=>set(`${exercise.id}.memory.revealed`,true)}><Eye size={17}/>Reveal answer</button>}
      {state.revealed&&<div className="memory-self-check"><p>How did you do?</p><div><button className="memory-remembered" onClick={()=>rate('remembered')}><Check size={17}/>I remembered</button><button className="memory-again" onClick={()=>rate('again')}><RotateCcw size={16}/>Practise again</button></div><small>Check your own answer. This activity is not marked automatically.</small></div>}
      <div className="memory-recall-navigation"><button className="text-button" disabled={state.index===0} onClick={()=>{setFields({[`${exercise.id}.memory.index`]:state.index-1,[`${exercise.id}.memory.revealed`]:false});focusStage(`${exercise.id}-memory-prompt`);}}><ArrowLeft size={15}/>Previous card</button><span className="helper">{state.reviewed} of {cards.length} self-checked</span></div>
      <button className="text-button memory-back-to-review" onClick={()=>{setFields({[`${exercise.id}.memory.phase`]:'learn',[`${exercise.id}.memory.revealed`]:false,[`${exercise.id}.deadline`]:null,[`${exercise.id}.remaining`]:exercise.duration,[`${exercise.id}.memory.timerEnabled`]:false,[`${exercise.id}.complete`]:false});focusStage();}}><BookOpen size={15}/>Review sentence pairs</button>
    </>}
    {state.phase==='summary'&&<>
      <div className="memory-summary-heading" id={`${exercise.id}-memory-summary`} tabIndex={-1}><span><CheckCheck size={24}/></span><h3>Your self-check</h3><p>{state.remembered} remembered{state.again.length?` · ${state.again.length} to revisit`:'. You’ve reviewed every pair.'}</p></div>
      <div className="memory-summary-list">{cards.map(card=><div key={card.id}><p>{card.answer}</p><span className={state.ratings[card.id]==='remembered'?'remembered':'again'}>{state.ratings[card.id]==='remembered'?<><Check size={14}/>Remembered</>:state.ratings[card.id]==='again'?<><RotateCcw size={14}/>Revisit</>:'Not checked'}</span></div>)}</div>
      <div className="memory-stage-actions">{state.again.length>0&&<button className="primary" onClick={()=>recall(state.again)}>Practise {state.again.length} {state.again.length===1?'card':'cards'} again <ArrowRight size={16}/></button>}<button className={state.again.length?'secondary':'primary'} onClick={()=>recall(cards.map(card=>card.id))}>Practise all {cards.length} cards again</button><button className="text-button" onClick={()=>resetExercise(exercise.id)}><RotateCcw size={15}/>Start over</button></div>
    </>}
    {exercise.originalInstructions&&<details className="memory-source-instruction"><summary>Original textbook instructions</summary><p>{exercise.originalInstructions}</p><small>Adapted above for one student. The sentence pairs come from Exercise {source?.number}.</small></details>}
  </div>;
}
