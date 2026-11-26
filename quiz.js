/* ChatByKarnav five-question subject quiz.
 * This is a learning/onboarding quiz only. It is NOT an age check,
 * identity check, parental-consent mechanism, or account eligibility gate.
 * The client-side skip code is public and must never be treated as a secret.
 */
(() => {
  'use strict';
  const subjects = {
    Biology: [
      {q:'During which stage of meiosis does crossing over normally occur?',a:['Pachytene of prophase I','Metaphase I','Anaphase II','Telophase I'],c:0},
      {q:'Which enzyme joins Okazaki fragments during DNA replication?',a:['DNA ligase','DNA helicase','RNA polymerase','Primase'],c:0},
      {q:'In the lac operon, the inducer allolactose binds to the:',a:['Repressor','Promoter','RNA polymerase','Operator DNA'],c:0},
      {q:'The final electron acceptor in aerobic respiration is:',a:['Oxygen','Carbon dioxide','NADH','Pyruvate'],c:0}
    ],
    Physics: [
      {q:'The SI unit of electric potential is:',a:['Volt','Coulomb','Farad','Tesla'],c:0},
      {q:'For a series LCR circuit at resonance, the impedance is:',a:['Equal to resistance R','Zero','Infinite','Equal to XL + XC'],c:0},
      {q:'The de Broglie wavelength of a particle is proportional to:',a:['1 / momentum','Momentum','Kinetic energy','Mass only'],c:0},
      {q:'A convex lens has focal length 20 cm. Its power is:',a:['+5 D','−5 D','+0.2 D','−0.2 D'],c:0}
    ],
    Chemistry: [
      {q:'Which complex ion is typically diamagnetic?',a:['[Ni(CN)₄]²⁻','[NiCl₄]²⁻','[CoF₆]³⁻','[FeF₆]³⁻'],c:0},
      {q:'The rate constant of a first-order reaction has the unit:',a:['s⁻¹','mol L⁻¹ s⁻¹','L mol⁻¹ s⁻¹','mol² L⁻² s⁻¹'],c:0},
      {q:'Which reagent converts a primary alcohol to an aldehyde without normally oxidising it further?',a:['PCC','Hot acidified KMnO₄','Conc. HNO₃','LiAlH₄'],c:0},
      {q:'For an ideal solution, the enthalpy of mixing is:',a:['Zero','Always positive','Always negative','Equal to entropy of mixing'],c:0}
    ],
    Mathematics: [
      {q:'If f(x)=x², then f′(3) equals:',a:['6','3','9','12'],c:0},
      {q:'The determinant of a 2×2 identity matrix is:',a:['1','0','2','−1'],c:0},
      {q:'The value of ∫₀¹ 2x dx is:',a:['1','2','1/2','0'],c:0},
      {q:'If two events A and B are independent, then P(A∩B) equals:',a:['P(A)P(B)','P(A)+P(B)','P(A)/P(B)','P(A∪B)'],c:0}
    ],
    'General Knowledge': [
      {q:'Which institution is responsible for monetary policy in India?',a:['Reserve Bank of India','NITI Aayog','SEBI','Finance Commission'],c:0},
      {q:'The headquarters of the World Trade Organization is in:',a:['Geneva','New York','Paris','Vienna'],c:0},
      {q:'Which part of the Indian Constitution deals with Fundamental Rights?',a:['Part III','Part I','Part IV','Part IVA'],c:0},
      {q:'The chemical symbol W stands for:',a:['Tungsten','Tin','Tantalum','Titanium'],c:0}
    ]
  };
  const shuffle = list => {
    const a = list.slice();
    for (let i=a.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const style = document.createElement('style');
  style.textContent = `
    #cbk-quiz-launch{border:1px solid var(--glass-border);border-radius:14px;background:var(--glass-subtle);color:var(--text);padding:9px 12px;font-weight:700}
    #cbk-quiz-overlay{position:fixed;inset:0;z-index:10050;background:rgba(0,0,0,.62);display:none;align-items:center;justify-content:center;padding:14px}
    #cbk-quiz-overlay.open{display:flex}
    #cbk-quiz-card{width:min(620px,100%);max-height:90vh;overflow:auto;padding:22px;border-radius:22px;background:var(--glass-strong,#fff);color:var(--text);border:1px solid var(--glass-border);box-shadow:0 24px 70px #0005}
    #cbk-quiz-card h2{margin:0 0 6px}
    #cbk-quiz-card .quiz-muted{color:var(--muted);font-size:13px;line-height:1.5}
    #cbk-quiz-card .quiz-option{display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border:1px solid var(--glass-border);border-radius:12px;background:var(--glass-subtle);color:var(--text)}
    #cbk-quiz-card .quiz-option:disabled{opacity:.8;cursor:default}
    #cbk-quiz-card .quiz-option.selected{border-color:var(--blue);background:rgba(10,132,255,.14)}
    #cbk-quiz-card .quiz-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
    #cbk-quiz-card .quiz-actions button{padding:10px 14px;border-radius:12px;border:1px solid var(--glass-border);font-weight:700}
    #cbk-quiz-card .quiz-primary{background:var(--blue);color:white}
    #cbk-quiz-card .quiz-secondary{background:var(--glass-subtle);color:var(--text)}
    #cbk-quiz-card input{width:100%;padding:11px;border-radius:11px;border:1px solid var(--glass-border);background:var(--glass-subtle);color:var(--text)}
    @media(max-width:520px){#cbk-quiz-card{padding:16px}}
  `;
  document.head.appendChild(style);
  const host=document.querySelector('.main-actions')||document.querySelector('.side-actions');
  if(!host || document.getElementById('cbk-quiz-launch')) return;
  const launch=document.createElement('button');
  launch.type='button';launch.id='cbk-quiz-launch';launch.textContent='🧠 Quick quiz';
  launch.setAttribute('aria-label','Open five-question subject quiz');
  host.appendChild(launch);
  const overlay=document.createElement('div');
  overlay.id='cbk-quiz-overlay';
  overlay.innerHTML=`<section id="cbk-quiz-card" role="dialog" aria-modal="true" aria-labelledby="cbk-quiz-title">
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
      <h2 id="cbk-quiz-title">Five-question challenge</h2>
      <button type="button" id="cbk-quiz-close" class="quiz-secondary" aria-label="Close quiz">✕</button>
    </div>
    <p class="quiz-muted">One question from each subject: Biology, Physics, Chemistry, Mathematics and General Knowledge. Questions and answer choices are shuffled for each attempt.</p>
    <div id="cbk-quiz-content"></div>
  </section>`;
  document.body.appendChild(overlay);
  const content=overlay.querySelector('#cbk-quiz-content');
  let attempt=null;
  let questionIndex=0;
  let score=0;
  let selected=null;
  let locked=false;
  const close=()=>{overlay.classList.remove('open');attempt=null;};
  const discard=reason=>{
    if(!attempt)return;
    attempt=null;questionIndex=0;score=0;selected=null;locked=false;
    if(overlay.classList.contains('open')) renderStart(reason||'Attempt discarded. Start again for a fresh set of five questions.');
  };
  const renderStart=message=>{
    content.innerHTML='';
    const p=document.createElement('p');p.className='quiz-muted';
    p.textContent=message||'Each attempt contains exactly five questions.';
    const codeLabel=document.createElement('label');codeLabel.className='quiz-muted';codeLabel.textContent='Optional skip code';
    const code=document.createElement('input');code.id='cbk-quiz-code';code.type='password';code.inputMode='numeric';code.autocomplete='off';code.placeholder='Enter code to skip this quiz';
    const actions=document.createElement('div');actions.className='quiz-actions';
    const start=document.createElement('button');start.className='quiz-primary';start.textContent='Start quiz';
    const skip=document.createElement('button');skip.className='quiz-secondary';skip.textContent='Use skip code';
    start.addEventListener('click',begin);
    skip.addEventListener('click',()=>{
      if(code.value.trim()!=='777'){p.textContent='That code is not correct.';return;}
      discard('Quiz skipped. This does not verify age, identity, or parental consent.');
      p.textContent='Quiz skipped. This does not verify age, identity, or parental consent.';
    });
    actions.append(start,skip);content.append(p,codeLabel,code,actions);
  };
  const begin=()=>{
    const chosen=Object.entries(subjects).map(([subject,bank])=>({subject,...bank[Math.floor(Math.random()*bank.length)]}));
    attempt=shuffle(chosen).map(item=>{
      const options=shuffle(item.a.map((text,index)=>({text,correct:index===item.c})));
      return {subject:item.subject,q:item.q,options};
    });
    questionIndex=0;score=0;selected=null;locked=false;renderQuestion();
  };
  const renderQuestion=()=>{
    if(!attempt)return;
    const item=attempt[questionIndex];
    content.innerHTML='';
    const progress=document.createElement('p');progress.className='quiz-muted';progress.textContent='Question '+(questionIndex+1)+' of 5 · '+item.subject;
    const q=document.createElement('h3');q.textContent=item.q;
    const options=document.createElement('div');
    item.options.forEach((option,index)=>{
      const b=document.createElement('button');b.type='button';b.className='quiz-option';b.textContent=String.fromCharCode(65+index)+'. '+option.text;
      b.addEventListener('click',()=>{if(locked)return;selected=index;options.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');next.disabled=false;});
      options.appendChild(b);
    });
    const actions=document.createElement('div');actions.className='quiz-actions';
    const next=document.createElement('button');next.className='quiz-primary';next.textContent=questionIndex===4?'Finish':'Next';next.disabled=true;
    next.addEventListener('click',()=>{
      if(selected===null||locked)return;
      locked=true;if(item.options[selected].correct)score++;
      questionIndex++;
      if(questionIndex===5){attempt=null;renderResult();}else{selected=null;locked=false;renderQuestion();}
    });
    actions.appendChild(next);content.append(progress,q,options,actions);
  };
  const renderResult=()=>{
    content.innerHTML='';
    const h=document.createElement('h3');h.textContent='Quiz complete';
    const p=document.createElement('p');p.className='quiz-muted';p.textContent='Your score: '+score+' / 5. This is a learning quiz only and is not an age or consent check.';
    const b=document.createElement('button');b.className='quiz-primary';b.textContent='Try a new set';
    b.addEventListener('click',begin);content.append(h,p,b);
  };
  launch.addEventListener('click',()=>{overlay.classList.add('open');renderStart();});
  overlay.querySelector('#cbk-quiz-close').addEventListener('click',()=>{discard('Attempt discarded because you left the quiz.');close();});
  overlay.addEventListener('click',e=>{if(e.target===overlay){discard('Attempt discarded because you left the quiz.');close();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)discard('Attempt discarded because you switched tabs or minimised the browser. Start again for five fresh questions.');});
  window.addEventListener('blur',()=>discard('Attempt discarded because you left the quiz window. Start again for five fresh questions.'));
  window.ChatByKarnavQuiz={version:1,questionsPerAttempt:5,subjects:Object.keys(subjects)};
})();
