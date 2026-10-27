import AppLink from './AppLink';
import { useEffect } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, MessageCircle, NotebookPen, Sparkles } from "lucide-react";

export default function LandingPage() {
  useEffect(()=>{document.title="Lesson Studio · English lessons, practice and conversation";},[]);
  return <div className="landing-page">
    <AppLink className="skip-link" href="#landing-main">Skip to main content</AppLink>
    <header className="landing-header">
      <AppLink className="landing-brand" href="/" aria-label="Lesson Studio home"><span><BookOpen size={23} aria-hidden="true"/></span>lesson<strong>studio</strong></AppLink>
      <nav aria-label="Main navigation"><AppLink href="#experience">The experience</AppLink><AppLink href="#how-it-works">How it works</AppLink></nav>
      <AppLink className="secondary landing-signin" href="/login">Sign in <ArrowRight size={17} aria-hidden="true"/></AppLink>
    </header>
    <main id="landing-main">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy"><span className="landing-eyebrow"><span/>ENGLISH, TOGETHER</span>
          <h1 id="landing-title">Learn English.<br/>Keep the<br/><span>conversation going.</span></h1>
          <p>A shared space for guided lessons, useful practice and feedback. Learn with your teacher, then make the language your own.</p>
          <div className="landing-hero-actions"><AppLink className="primary" href="/login">Sign in to Lesson Studio <ArrowRight size={19} aria-hidden="true"/></AppLink><AppLink className="landing-text-link" href="#how-it-works">See how it works <ArrowDown size={16} aria-hidden="true"/></AppLink></div>
          <div className="landing-hero-note"><span><Check size={15} aria-hidden="true"/></span>For focused lessons and the practice in between.</div>
        </div>
        <div className="landing-preview" role="img" aria-label="Illustration of a Lesson Studio lesson: First conversations, with reading, practice and speaking stages.">
          <div className="preview-paper preview-paper-back"/>
          <div className="preview-paper preview-paper-front"/>
          <div className="preview-window">
            <div className="preview-window-top"><span className="preview-mini-brand"><BookOpen size={17}/>Lesson Studio</span><span className="preview-window-dots"><i/><i/><i/></span></div>
            <div className="preview-lesson-head"><span className="preview-level">A1 · FIRST CONVERSATIONS</span><span className="preview-lesson-label">A glimpse inside</span><h2>Hello!<br/>Nice to meet you.</h2><p>Small steps. Real conversations.</p></div>
            <div className="preview-stage-row"><span><BookOpen size={15}/>Read</span><span className="preview-stage-active"><NotebookPen size={15}/>Practise</span><span><MessageCircle size={15}/>Speak</span></div>
            <div className="preview-conversation"><span className="preview-quote-mark">“</span><p>Every conversation<br/>starts with a hello.</p><span className="preview-conversation-line"/></div>
            <div className="preview-bottom"><span><Sparkles size={16}/>A little practice, a new perspective.</span><span className="preview-round-arrow"><ArrowRight size={18}/></span></div>
          </div>
          <span className="preview-margin-note">A place to try.<br/>A space to grow.</span>
        </div>
      </section>
      <section className="landing-experience" id="experience" aria-labelledby="experience-title">
        <div className="landing-section-heading"><span className="landing-eyebrow">THE EXPERIENCE</span><h2 id="experience-title">More than a lesson.<br/>A way to keep practising.</h2><p>Bring the lesson and the work around it into one learning space.</p></div>
        <div className="landing-feature-grid">
          <article><span className="landing-feature-icon"><MessageCircle size={25} aria-hidden="true"/></span><h3>Learn with your teacher</h3><p>Work through activities together, ask questions and use English in conversation.</p><span className="landing-feature-detail">GUIDANCE WHEN YOU NEED IT</span></article>
          <article><span className="landing-feature-icon"><NotebookPen size={25} aria-hidden="true"/></span><h3>Make time to practise</h3><p>Return to useful words and phrases. Read, write and try again at your own pace.</p><span className="landing-feature-detail">PRACTICE WITH A PURPOSE</span></article>
          <article><span className="landing-feature-icon"><BookOpen size={25} aria-hidden="true"/></span><h3>Build from a clear starting point</h3><p>Follow lessons with everyday topics, helpful examples and a practical learning goal.</p><span className="landing-feature-detail">LANGUAGE FOR EVERYDAY LIFE</span></article>
        </div>
      </section>
      <section className="landing-process" id="how-it-works" aria-labelledby="process-title"><div><span className="landing-eyebrow">HOW IT WORKS</span><h2 id="process-title">A simple rhythm<br/>for learning.</h2><p>Your account opens your own workspace, ready for the next step.</p></div><ol><li><span>01</span><div><h3>Sign in to your space</h3><p>One entrance. The right workspace for your account.</p></div></li><li><span>02</span><div><h3>Explore the lesson together</h3><p>Read, practise and speak with guidance from your teacher.</p></div></li><li><span>03</span><div><h3>Take the language with you</h3><p>Revisit what you have learnt and bring your questions to the next lesson.</p></div></li></ol></section>
      <section className="landing-closing"><div><span className="landing-eyebrow">YOUR NEXT CONVERSATION STARTS HERE</span><h2>A little practice.<br/>A little more confidence.</h2></div><AppLink className="primary" href="/login">Sign in <ArrowRight size={19} aria-hidden="true"/></AppLink></section>
    </main>
    <footer className="landing-footer"><AppLink className="landing-brand" href="/"><span><BookOpen size={21} aria-hidden="true"/></span>lesson<strong>studio</strong></AppLink><p>A space for English lessons and practice.</p><AppLink href="/login">Sign in</AppLink></footer>
  </div>;
}
