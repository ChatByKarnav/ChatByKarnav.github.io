(() => {
'use strict';
if(window.__ckBetaLabLoaded)return;window.__ckBetaLabLoaded=true;
const $=id=>document.getElementById(id), composer=()=>$('message-input'), messages=()=>$('messages');
const read=(k,d)=>{try{let v=localStorage.getItem('ckbeta:'+k);return v===null?d:JSON.parse(v)}catch(_){return d}};
const save=(k,v)=>{try{localStorage.setItem('ckbeta:'+k,JSON.stringify(v))}catch(_){}};
const toast=m=>{let e=$('toast');if(e){e.textContent=m;e.classList.remove('hidden');clearTimeout(window.__ckBetaToast);window.__ckBetaToast=setTimeout(()=>e.classList.add('hidden'),2400)}else console.info(m)};
const txt=()=>composer()?.value||'', put=v=>{let e=composer();if(!e){toast('Open a chat first.');return}e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.focus()};
const copy=async v=>{try{await navigator.clipboard.writeText(v);toast('Copied.')}catch(_){toast('Clipboard unavailable.')}};
const bubbles=()=>[...document.querySelectorAll('#messages .bubble')], texts=()=>bubbles().map(x=>x.innerText.trim()).filter(Boolean);
const toggle=c=>{document.body.classList.toggle(c);toast(document.body.classList.contains(c)?'Enabled.':'Disabled.')};
const font=d=>{let n=Math.max(12,Math.min(24,Number(read('fontSize',16))+d));save('fontSize',n);document.querySelectorAll('#messages .bubble').forEach(x=>x.style.fontSize=n+'px');toast('Message text '+n+'px')};
const setAccent=c=>{document.documentElement.style.setProperty('--blue',c);save('accent',c)};
const tools=[
['Messaging','📝','Quick draft','Save the unsent message on this device.',()=>{save('draft',txt());toast('Draft saved locally.')}],
['Messaging','♻️','Restore draft','Restore your locally saved draft.',()=>put(read('draft',''))],
['Messaging','🔢','Word counter','Count words in the composer.',()=>toast((txt().trim()?txt().trim().split(/\s+/).length:0)+' words')],
['Messaging','🔠','Character counter','Count characters in the composer.',()=>toast(txt().length+' characters')],
['Messaging','✂️','Trim whitespace','Clean repeated spaces and blank lines.',()=>put(txt().split('\n').map(x=>x.trim().replace(/\s+/g,' ')).filter(Boolean).join('\n'))],
['Messaging','⬆️','UPPERCASE','Convert the draft to uppercase.',()=>put(txt().toUpperCase())],
['Messaging','⬇️','lowercase','Convert the draft to lowercase.',()=>put(txt().toLowerCase())],
['Messaging','📰','Title Case','Capitalize each word.',()=>put(txt().toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()))],
['Messaging','🕒','Insert time','Append the current local date and time.',()=>put((txt()?txt()+'\n':'')+new Date().toLocaleString())],
['Messaging','🧊','Icebreaker','Insert a random conversation starter.',()=>{let a=['What are you excited about this week?','What skill would you love to learn?','What is your ideal weekend?','What made you smile recently?','Which fictional world would you visit?'];put((txt()?txt()+'\n':'')+a[Math.floor(Math.random()*a.length)])}],
['Messaging','🧹','Clear composer','Clear the current unsent message after confirmation.',()=>{if(confirm('Clear the unsent message?'))put('')}],
['Messaging','🎯','Focus composer','Jump to the message box.',()=>composer()?.focus()],
['Messaging','📋','Copy draft','Copy the unsent draft.',()=>copy(txt())],
['Messaging','📤','Export visible chat','Download loaded messages as a text file.',()=>{let a=bubbles().map(b=>(b.closest('.msg-row')?.querySelector('.msg-meta')?.innerText||'Message')+': '+b.innerText);if(!a.length)return toast('No loaded messages.');let u=URL.createObjectURL(new Blob([a.join('\n\n')],{type:'text/plain'})),x=document.createElement('a');x.href=u;x.download='chatbykarnav-beta-chat.txt';x.click();URL.revokeObjectURL(u)}],
['Messaging','📌','Copy latest message','Copy the newest loaded message.',()=>{let a=texts();a.length?copy(a[a.length-1]):toast('No messages loaded.')}],
['Messaging','🔎','Find in chat','Focus conversation search.',()=>$('message-search')?.focus()],
['Messaging','⬇️','Jump to latest','Scroll to the latest loaded message.',()=>messages()?.scrollTo({top:messages().scrollHeight,behavior:'smooth'})],
['Messaging','📖','Reading layout','Increase message line spacing.',()=>toggle('ck-reading')],
['Messaging','↔️','Compact messages','Reduce bubble padding and message gaps.',()=>toggle('ck-compact')],
['Messaging','🙈','Privacy blur','Blur messages until hovered.',()=>toggle('ck-privacy')],
['Messaging','🧑‍🚀','Hide avatars','Hide avatars in the message list.',()=>toggle('ck-no-avatars')],
['Messaging','🕶️','Hide timestamps','Hide message metadata.',()=>toggle('ck-no-times')],
['Appearance','🔎','Bigger text','Increase message font size.',()=>font(1)],
['Appearance','➖','Smaller text','Decrease message font size.',()=>font(-1)],
['Appearance','↩️','Reset text size','Restore default message text size.',()=>{save('fontSize',16);bubbles().forEach(x=>x.style.fontSize='');toast('Text size reset.')}],
['Appearance','🔵','Blue accent','Use a blue accent.',()=>setAccent('#087cff')],
['Appearance','🟣','Purple accent','Use a purple accent.',()=>setAccent('#8b5cf6')],
['Appearance','🟢','Green accent','Use a green accent.',()=>setAccent('#16a36a')],
['Appearance','🌅','Warm accent','Use a warm orange accent.',()=>setAccent('#e87932')],
['Appearance','◻️','Round bubbles','Toggle extra-rounded message bubbles.',()=>{let v=!read('round',false);save('round',v);bubbles().forEach(x=>x.style.borderRadius=v?'26px':'');toast(v?'Round bubbles on.':'Round bubbles off.')}],
['Appearance','🧘','Calm animations','Reduce interface animation.',()=>toggle('ck-calm')],
['Appearance','🌓','High contrast','Increase interface contrast.',()=>toggle('ck-high-contrast')],
['Appearance','🫥','Hide chat previews','Blur conversation preview text in the sidebar.',()=>toggle('ck-hide-previews')],
['Appearance','📐','Reading ruler','Highlight the message under your pointer.',()=>toggle('ck-ruler')],
['Productivity','📓','Private notes','Save private notes in this browser.',()=>{let v=prompt('Private notes (stored only on this device):',read('notes',''));if(v!==null){save('notes',v);toast('Notes saved locally.')}}],
['Productivity','☑️','Personal checklist','Save a one-item-per-line checklist locally.',()=>{let v=prompt('Checklist (one item per line):',read('checklist',''));if(v!==null){save('checklist',v);toast('Checklist saved locally.')}}],
['Productivity','📚','Draft library','Create and edit reusable message snippets.',()=>{let v=prompt('Snippets (separate with a line containing ---):',read('snippets',[]).join('\n---\n'));if(v!==null){save('snippets',v.split(/\n---\n/).map(x=>x.trim()).filter(Boolean));toast('Snippets saved.')}}],
['Productivity','🧩','Insert snippet','Insert one of your saved snippets.',()=>{let a=read('snippets',[]);if(!a.length)return toast('Create snippets first.');let n=Number(prompt(a.map((x,i)=>(i+1)+'. '+x.slice(0,60)).join('\n')+'\nNumber:'))-1;if(a[n])put((txt()?txt()+'\n':'')+a[n])}],
['Productivity','🧮','Reading estimate','Estimate reading time for loaded messages.',()=>{let n=texts().join(' ').trim().split(/\s+/).filter(Boolean).length;toast('About '+Math.max(1,Math.ceil(n/200))+' min · '+n+' words')}],
['Productivity','🗂️','Message count','Count currently loaded messages.',()=>toast(bubbles().length+' loaded messages')],
['Productivity','📎','Copy chat summary','Copy a quick summary of the visible conversation.',()=>{let a=texts();copy('ChatByKarnav Beta · '+a.length+' loaded messages\nLatest: '+(a[a.length-1]||'None'))}],
['Productivity','🧭','Keyboard shortcuts','Show the available Beta Lab shortcuts.',()=>alert('Beta Lab shortcuts\n\nEsc — close Beta Lab\nUse Find in chat — focus conversation search\nUse Focus composer — jump to the composer\nUse Jump to latest — scroll to newest loaded message')],
['Productivity','⏱️','Break reminder','Set a one-time reminder from 1 to 180 minutes.',()=>{let n=Number(prompt('Remind me in how many minutes? (1–180)','25'));if(n>=1&&n<=180){setTimeout(()=>alert('A quick break might feel good. — ChatByKarnav Beta'),n*60000);toast('Reminder set.')}}],
['Productivity','🧼','Clear local draft','Delete the locally saved draft.',()=>{if(confirm('Delete your saved local draft?')){save('draft','');toast('Local draft cleared.')}}],
['Experiments','🎲','Random emoji','Append a random emoji.',()=>{let a=['✨','🎉','💡','🚀','🌈','😄','🤝','🔥','💙','🌟','🙌','🧠'];put(txt()+a[Math.floor(Math.random()*a.length)])}],
['Experiments','🪄','Emoji mood','Add an emoji for your selected mood.',()=>{let m=(prompt('Mood: happy, excited, calm, thinking, grateful','happy')||'').toLowerCase(),a={happy:'😊',excited:'🤩',calm:'😌',thinking:'🤔',grateful:'🙏'};if(a[m])put(txt()+a[m])}],
['Experiments','🔁','Reverse draft','Reverse the characters in your draft.',()=>put([...txt()].reverse().join(''))],
['Experiments','🧪','Palindrome check','Check whether the draft is a palindrome.',()=>{let t=txt().toLowerCase().replace(/[^a-z0-9]/g,'');toast(t&&t===[...t].reverse().join('')?'It is a palindrome!':'Not a palindrome.')}],
['Experiments','🛡️','Local privacy reset','Turn off Beta Lab visual privacy and layout effects.',()=>{['ck-compact','ck-no-avatars','ck-no-times','ck-reading','ck-privacy','ck-high-contrast','ck-calm','ck-ruler','ck-lab-focus','ck-hide-previews'].forEach(c=>document.body.classList.remove(c));toast('Visual effects reset.')}],
['Experiments','🧾','Feature feedback','Prepare a beta feedback template in the composer.',()=>put('Beta feedback:\nWhat I tried:\nWhat happened:\nWhat I expected:\n\n'+txt())]

['Messaging','🔊','Read draft aloud','Use your browser speech engine to read the current draft.',()=>{if(!('speechSynthesis'in window))return toast('Speech is not supported in this browser.');if(!txt().trim())return toast('Write a draft first.');window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt());u.rate=1;window.speechSynthesis.speak(u);toast('Reading draft aloud.')}],
['Messaging','⏹️','Stop read aloud','Stop browser text-to-speech playback.',()=>{if('speechSynthesis'in window){window.speechSynthesis.cancel();toast('Read aloud stopped.')}else toast('Speech is not supported.')}],
['Messaging','🎙️','Voice dictation','Dictate text into the composer when your browser supports speech recognition.',()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Voice dictation is not supported in this browser.');const rec=new SR();rec.lang=navigator.language||'en-US';rec.interimResults=false;rec.maxAlternatives=1;rec.onresult=e=>put((txt()?txt()+' ':'')+e.results[0][0].transcript);rec.onerror=e=>toast('Dictation error: '+e.error);rec.onend=()=>toast('Dictation finished.');rec.start();toast('Listening… allow microphone access if asked.')}],
['Messaging','🧽','Remove duplicate lines','Remove repeated lines from your draft while preserving their first occurrence.',()=>{const seen=new Set();put(txt().split(/\r?\n/).filter(line=>{const k=line.trim().toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true}).join('\n'))}],
['Messaging','Aa','Sentence case','Convert the draft to sentence case.',()=>{const v=txt().toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g,(_,a,b)=>a+b.toUpperCase());put(v)}],
['Productivity','🧠','Keyword snapshot','Show the most-used words in the loaded chat, excluding common filler words.',()=>{const stop=new Set('the a an and or but to of in on at for is are was were be been it this that i you we they he she me my your our with from as not so if do did have has had'.split(' '));const words=texts().join(' ').toLowerCase().match(/[a-z0-9']{3,}/g)||[];const counts={};words.forEach(w=>{if(!stop.has(w))counts[w]=(counts[w]||0)+1});const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);alert(top.length?'Most-used words in loaded messages:\n\n'+top.map(([w,n])=>w+' — '+n).join('\n'):'Not enough message text to analyse.')}],
['Productivity','🗓️','Meeting agenda','Build a simple meeting agenda in the composer.',()=>{const topic=prompt('Meeting topic:','Project update');if(topic===null)return;const mins=Number(prompt('Meeting length in minutes:','30'));if(!Number.isFinite(mins)||mins<5||mins>240)return toast('Choose 5–240 minutes.');put('Agenda: '+topic+' ('+mins+' minutes)\n\n1. Welcome and goals — '+Math.max(2,Math.round(mins*.1))+' min\n2. Updates and discussion — '+Math.round(mins*.4)+' min\n3. Decisions and action items — '+Math.round(mins*.35)+' min\n4. Wrap-up — '+Math.max(2,Math.round(mins*.15))+' min')}],
['Productivity','🧩','Flashcard maker','Turn a topic and key facts into a simple flashcard template.',()=>{const topic=prompt('Flashcard topic:','');if(topic===null)return;const facts=prompt('Enter facts, one per line:','');if(facts===null)return;const cards=facts.split(/\r?\n/).map((x,i)=>x.trim()?('Card '+(i+1)+' · '+topic+'\nQ: '+x+'\nA: ____________________'): '').filter(Boolean);put(cards.join('\n\n'))}],
['Productivity','⏳','Focus sprint','Start a 25-minute focus sprint with a browser notification-style alert when it ends.',()=>{if(window.__ckBetaSprint){clearTimeout(window.__ckBetaSprint);window.__ckBetaSprint=null}if(!confirm('Start a 25-minute focus sprint? Keep this beta tab open.'))return;const end=Date.now()+25*60000;save('sprintEnd',end);window.__ckBetaSprint=setTimeout(()=>{window.__ckBetaSprint=null;save('sprintEnd',null);alert('Your 25-minute focus sprint is complete. Take a short break!')},25*60000);toast('Focus sprint started · 25 minutes.')}],
['Experiments','🎨','Emoji palette','Choose an emoji to append to the current draft.',()=>{const a=['😀','😎','🥳','🤔','😊','😂','❤️','💙','✨','🔥','🚀','🎯','👏','🙏','🌱','📚','💡','🎉'];const pick=prompt('Choose an emoji by number:\n'+a.map((x,i)=>(i+1)+'. '+x).join('   '));const n=Number(pick)-1;if(a[n])put(txt()+a[n])}]
]; 
if(tools.length!==60)throw Error('Expected 60 features; got '+tools.length);
const css=[
'#ck-beta-lab-launch{position:fixed;right:18px;bottom:18px;z-index:10060;border:0;border-radius:999px;padding:12px 17px;background:#087cff;color:#fff;font-weight:800;box-shadow:0 8px 28px #0003}',
'#ck-beta-lab{position:fixed;inset:0;z-index:10061;background:#080d18a8;display:none;align-items:center;justify-content:center;padding:14px}#ck-beta-lab.open{display:flex}',
'#ck-beta-lab .lab-window{width:min(980px,100%);height:min(780px,94vh);background:var(--glass-strong,#fff);color:var(--text,#161821);border:1px solid var(--glass-border,#ddd);border-radius:22px;display:flex;flex-direction:column;overflow:hidden}',
'#ck-beta-lab .lab-head{padding:17px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line,#ddd)}#ck-beta-lab .lab-head h2{font-size:19px;margin:0}#ck-beta-lab .lab-sub,#ck-beta-lab .lab-foot{font-size:11px;color:var(--muted,#666)}',
'#ck-beta-lab .lab-tabs{display:flex;gap:7px;padding:12px 16px;overflow:auto;border-bottom:1px solid var(--line,#ddd)}#ck-beta-lab button{cursor:pointer}#ck-beta-lab .lab-tabs button,#ck-beta-lab .lab-close{border:1px solid var(--glass-border,#ddd);background:var(--glass-subtle,#eee);color:var(--text,#111);border-radius:12px;padding:8px 11px;font-weight:650;white-space:nowrap}#ck-beta-lab .lab-tabs button.active{background:#087cff;color:white}',
'#ck-beta-lab .lab-tools{padding:15px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}#ck-beta-lab .lab-tool{border:1px solid var(--glass-border,#ddd);background:var(--glass-subtle,#eee);color:var(--text,#111);border-radius:15px;padding:13px;text-align:left;min-height:90px}#ck-beta-lab .lab-tool strong{display:block;font-size:13px;margin-bottom:5px}#ck-beta-lab .lab-tool span{font-size:11px;color:var(--muted,#666)}#ck-beta-lab .lab-report{padding:16px;overflow:auto;flex:1}.lab-report-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}.lab-report-head h3{font-size:17px;margin:0;flex:1}.lab-report-back{border:1px solid var(--glass-border);background:var(--glass-subtle);color:var(--text);border-radius:10px;padding:8px 12px}.lab-report-note{font-size:12px;color:var(--muted);margin:0 0 12px}.lab-report-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px}.lab-report-metric,.lab-report-item{padding:12px;border:1px solid var(--glass-border);border-radius:13px;background:var(--glass-subtle);margin-bottom:8px}.lab-report-metric strong{display:block;font-size:18px}.lab-report-metric span,.lab-report-item small{display:block;color:var(--muted);font-size:11px;margin-top:4px}.lab-report-item strong{display:block;font-size:13px}.lab-report-bar{height:7px;border-radius:8px;background:var(--glass-border);overflow:hidden;margin-top:7px}.lab-report-bar i{display:block;height:100%;background:var(--blue);border-radius:8px}.lab-report-empty{padding:18px;text-align:center;color:var(--muted);font-size:13px}#ck-beta-lab .lab-foot{padding:10px 17px;border-top:1px solid var(--line,#ddd)}',
'body.ck-compact #messages{gap:4px!important}body.ck-compact #messages .bubble{padding:6px 10px!important}body.ck-no-avatars #messages .msg-avatar{display:none!important}body.ck-no-times #messages .msg-meta{display:none!important}body.ck-reading #messages .bubble{font-size:1.08em!important;line-height:1.8!important}body.ck-privacy #messages .bubble{filter:blur(7px);transition:filter .2s}body.ck-privacy #messages .bubble:hover{filter:none}body.ck-high-contrast{--muted:#444!important;--glass-border:#777!important}body.dark.ck-high-contrast{--muted:#ddd!important;--glass-border:#aaa!important}body.ck-calm *{animation-duration:.001ms!important;transition-duration:.001ms!important}body.ck-ruler #messages .bubble:hover{outline:2px solid #087cff;outline-offset:3px}body.ck-lab-focus .sidebar{display:none!important}body.ck-lab-focus .shell{grid-template-columns:minmax(0,1fr)!important}body.ck-lab-focus .main{width:100%!important;max-width:none!important}body.ck-hide-previews .thread-preview{filter:blur(5px)}body.ck-hide-previews .thread:hover .thread-preview{filter:none}',
'@media(max-width:600px){#ck-beta-lab-launch{right:10px;bottom:10px;padding:10px 13px}#ck-beta-lab .lab-window{height:96vh;border-radius:16px}#ck-beta-lab .lab-tools{grid-template-columns:1fr 1fr;padding:10px;gap:7px}#ck-beta-lab .lab-tool{padding:10px}}'
].join('\n');
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const launch=document.createElement('button');launch.id='ck-beta-lab-launch';launch.type='button';launch.textContent='🧪 Beta Lab · 64 tools';launch.setAttribute('aria-label','Open Beta Lab with 50 local tools and 4 live KNet Insights');
const panel=document.createElement('div');panel.id='ck-beta-lab';panel.innerHTML='<div class="lab-window" role="dialog" aria-modal="true" aria-label="Beta Lab"><div class="lab-head"><div><h2>🧪 Beta Lab</h2><div class="lab-sub">60 local tools + 4 live KNet insights · beta only</div></div><button class="lab-close" type="button" aria-label="Close">✕</button></div><div class="lab-tabs" role="tablist"></div><div class="lab-tools"></div><div class="lab-report hidden"></div><div class="lab-foot">60 local tools + 4 live KNet insights. Notes and drafts stay on this device; insights read existing beta chat data.</div></div>';
document.body.append(launch,panel);
const tabs=panel.querySelector('.lab-tabs'),grid=panel.querySelector('.lab-tools'),report=panel.querySelector('.lab-report'),cats=['All','Messaging','Appearance','Productivity','Experiments','KNet Insights'];let current='All';
const backendTools=[
['Live Insights','📊','Conversation analytics','Analyse the latest 100 messages stored in KNet.','analytics'],
['Live Insights','✓','Read receipt explorer','See which members received and read your sent messages.','receipts'],
['Live Insights','🟢','Member activity board','See live and last-seen activity for conversation members.','activity'],
['Live Insights','🗳️','Poll results dashboard','Review live poll totals and option percentages from chat data.','polls']
];
function reportNode(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n}
async function openBackendReport(key,title){
 grid.classList.add('hidden');tabs.classList.add('hidden');report.classList.remove('hidden');report.innerHTML='';
 const head=reportNode('div','lab-report-head');const back=reportNode('button','lab-report-back','← Back');back.type='button';back.onclick=()=>{report.classList.add('hidden');tabs.classList.remove('hidden');grid.classList.remove('hidden')};const h=reportNode('h3','',title);head.append(back,h);report.append(head);
 const note=reportNode('p','lab-report-note','Loading the latest data from KNet…');report.append(note);
 const content=reportNode('div','');report.append(content);
 try{
  const api=window.CBKBetaBackend;if(!api||typeof api[key]!=='function')throw new Error('Live insights are not available. Reload the beta page and try again.');
  const data=await api[key]();note.textContent='Live data · '+(data.title||'Current conversation');
  if(key==='analytics'){
   const gridNode=reportNode('div','lab-report-grid');(data.metrics||[]).forEach(([label,value])=>{const card=reportNode('div','lab-report-metric');card.append(reportNode('strong','',String(value)),reportNode('span','',label));gridNode.append(card)});content.append(gridNode);
   content.append(reportNode('p','lab-report-note','Counts are based on up to the latest 100 messages visible to your account. Deleted-for-you messages and blocked senders are excluded.'));
  }else if(key==='receipts'){
   const items=data.items||[];if(!items.length)content.append(reportNode('div','lab-report-empty','No messages sent by you were found in the latest 100 messages.'));
   items.forEach(item=>{const card=reportNode('div','lab-report-item');card.append(reportNode('strong','',item.message||'Message'));card.append(reportNode('small','',item.when||''));const total=Number(item.total)||0;card.append(reportNode('small','','Read by '+item.read.length+'/'+total+': '+(item.read.join(', ')||'Nobody yet')));card.append(reportNode('small','','Delivered to '+item.delivered.length+'/'+total+': '+(item.delivered.join(', ')||'Not confirmed yet')));content.append(card)});
  }else if(key==='activity'){
   const members=data.members||[];if(!members.length)content.append(reportNode('div','lab-report-empty','No member activity is available.'));
   members.forEach(member=>{const card=reportNode('div','lab-report-item');card.append(reportNode('strong','',member.avatar+' '+member.name));card.append(reportNode('small','',member.status));content.append(card)});
  }else if(key==='polls'){
   const polls=data.polls||[];if(!polls.length)content.append(reportNode('div','lab-report-empty','No polls found in the latest 100 messages.'));
   polls.forEach(poll=>{const card=reportNode('div','lab-report-item');card.append(reportNode('strong','',poll.question));card.append(reportNode('small','',poll.total+' total votes'));(poll.options||[]).forEach(option=>{const label=reportNode('small','',''+option.option+' · '+option.count+' votes ('+option.percent+'%)');const bar=reportNode('div','lab-report-bar');const fill=document.createElement('i');fill.style.width=Math.max(0,Math.min(100,Number(option.percent)||0))+'%';bar.append(fill);card.append(label,bar)});content.append(card)});
  }
 }catch(error){note.textContent='Could not load live data.';content.append(reportNode('div','lab-report-empty',error.message||'Please try again.'))}
}
function render(){
 tabs.innerHTML='';cats.forEach(c=>{let b=document.createElement('button');b.type='button';b.textContent=c+(c==='All'?' · '+(tools.length+backendTools.length):c==='Live Insights'?' · '+backendTools.length:'');b.classList.toggle('active',current===c);b.onclick=()=>{current=c;report.classList.add('hidden');tabs.classList.remove('hidden');grid.classList.remove('hidden');render()};tabs.appendChild(b)});
 grid.innerHTML='';const visible=current==='All'?[...tools,...backendTools]:current==='Live Insights'?backendTools:tools.filter(t=>t[0]===current);
 visible.forEach(t=>{let b=document.createElement('button');b.type='button';b.className='lab-tool';let h=document.createElement('strong'),p=document.createElement('span');h.textContent=t[1]+' '+t[2];p.textContent=t[3];b.append(h,p);b.onclick=()=>{if(typeof t[4]==='string'){openBackendReport(t[4],t[2]);return}try{t[4]()}catch(e){console.error('Beta Lab:',e);toast('This tool could not run.')}};grid.appendChild(b)});
}
render();launch.onclick=()=>{panel.classList.add('open');render()};
document.getElementById('beta-lab-open-profile')?.addEventListener('click',()=>launch.click());panel.querySelector('.lab-close').onclick=()=>panel.classList.remove('open');panel.onclick=e=>{if(e.target===panel)panel.classList.remove('open')};document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.remove('open')});
let accent=read('accent',null);if(accent)document.documentElement.style.setProperty('--blue',accent);
let fs=read('fontSize',16);bubbles().forEach(x=>x.style.fontSize=fs+'px');
console.info('ChatByKarnav Beta Lab ready:',tools.length+backendTools.length,'tools');
})();