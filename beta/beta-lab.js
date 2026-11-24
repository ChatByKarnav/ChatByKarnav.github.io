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
['Experiments','🛡️','Local privacy reset','Turn off Beta Lab visual privacy and layout effects.',()=>{['ck-compact','ck-no-avatars','ck-no-times','ck-reading','ck-privacy','ck-high-contrast','ck-calm','ck-ruler','ck-lab-focus'].forEach(c=>document.body.classList.remove(c));toast('Visual effects reset.')}],
['Experiments','🧾','Feature feedback','Prepare a beta feedback template in the composer.',()=>put('Beta feedback:\nWhat I tried:\nWhat happened:\nWhat I expected:\n\n'+txt())]
];
if(tools.length!==50)throw Error('Expected 50 features; got '+tools.length);
const css=[
'#ck-beta-lab-launch{position:fixed;right:18px;bottom:18px;z-index:10060;border:0;border-radius:999px;padding:12px 17px;background:#087cff;color:#fff;font-weight:800;box-shadow:0 8px 28px #0003}',
'#ck-beta-lab{position:fixed;inset:0;z-index:10061;background:#080d18a8;display:none;align-items:center;justify-content:center;padding:14px}#ck-beta-lab.open{display:flex}',
'#ck-beta-lab .lab-window{width:min(980px,100%);height:min(780px,94vh);background:var(--glass-strong,#fff);color:var(--text,#161821);border:1px solid var(--glass-border,#ddd);border-radius:22px;display:flex;flex-direction:column;overflow:hidden}',
'#ck-beta-lab .lab-head{padding:17px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line,#ddd)}#ck-beta-lab .lab-head h2{font-size:19px;margin:0}#ck-beta-lab .lab-sub,#ck-beta-lab .lab-foot{font-size:11px;color:var(--muted,#666)}',
'#ck-beta-lab .lab-tabs{display:flex;gap:7px;padding:12px 16px;overflow:auto;border-bottom:1px solid var(--line,#ddd)}#ck-beta-lab button{cursor:pointer}#ck-beta-lab .lab-tabs button,#ck-beta-lab .lab-close{border:1px solid var(--glass-border,#ddd);background:var(--glass-subtle,#eee);color:var(--text,#111);border-radius:12px;padding:8px 11px;font-weight:650;white-space:nowrap}#ck-beta-lab .lab-tabs button.active{background:#087cff;color:white}',
'#ck-beta-lab .lab-tools{padding:15px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}#ck-beta-lab .lab-tool{border:1px solid var(--glass-border,#ddd);background:var(--glass-subtle,#eee);color:var(--text,#111);border-radius:15px;padding:13px;text-align:left;min-height:90px}#ck-beta-lab .lab-tool strong{display:block;font-size:13px;margin-bottom:5px}#ck-beta-lab .lab-tool span{font-size:11px;color:var(--muted,#666)}#ck-beta-lab .lab-foot{padding:10px 17px;border-top:1px solid var(--line,#ddd)}',
'body.ck-compact #messages{gap:4px!important}body.ck-compact #messages .bubble{padding:6px 10px!important}body.ck-no-avatars #messages .msg-avatar{display:none!important}body.ck-no-times #messages .msg-meta{display:none!important}body.ck-reading #messages .bubble{font-size:1.08em!important;line-height:1.8!important}body.ck-privacy #messages .bubble{filter:blur(7px);transition:filter .2s}body.ck-privacy #messages .bubble:hover{filter:none}body.ck-high-contrast{--muted:#444!important;--glass-border:#777!important}body.dark.ck-high-contrast{--muted:#ddd!important;--glass-border:#aaa!important}body.ck-calm *{animation-duration:.001ms!important;transition-duration:.001ms!important}body.ck-ruler #messages .bubble:hover{outline:2px solid #087cff;outline-offset:3px}body.ck-lab-focus .sidebar{display:none!important}body.ck-lab-focus .shell{grid-template-columns:minmax(0,1fr)!important}body.ck-lab-focus .main{width:100%!important;max-width:none!important}body.ck-hide-previews .thread-preview{filter:blur(5px)}body.ck-hide-previews .thread:hover .thread-preview{filter:none}',
'@media(max-width:600px){#ck-beta-lab-launch{right:10px;bottom:10px;padding:10px 13px}#ck-beta-lab .lab-window{height:96vh;border-radius:16px}#ck-beta-lab .lab-tools{grid-template-columns:1fr 1fr;padding:10px;gap:7px}#ck-beta-lab .lab-tool{padding:10px}}'
].join('\n');
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const launch=document.createElement('button');launch.id='ck-beta-lab-launch';launch.type='button';launch.textContent='🧪 Beta Lab · 50 tools';launch.setAttribute('aria-label','Open Beta Lab with 50 experimental tools');
const panel=document.createElement('div');panel.id='ck-beta-lab';panel.innerHTML='<div class="lab-window" role="dialog" aria-modal="true" aria-label="Beta Lab"><div class="lab-head"><div><h2>🧪 Beta Lab</h2><div class="lab-sub">50 experimental tools · beta only · local preferences</div></div><button class="lab-close" type="button" aria-label="Close">✕</button></div><div class="lab-tabs" role="tablist"></div><div class="lab-tools"></div><div class="lab-foot">Local notes, drafts and appearance preferences stay in this browser. Existing chat data continues using the current chat service.</div></div>';
document.body.append(launch,panel);
const tabs=panel.querySelector('.lab-tabs'),grid=panel.querySelector('.lab-tools'),cats=['All','Messaging','Appearance','Productivity','Experiments'];let current='All';
function render(){tabs.innerHTML='';cats.forEach(c=>{let b=document.createElement('button');b.type='button';b.textContent=c+(c==='All'?' · '+tools.length:'');b.classList.toggle('active',current===c);b.onclick=()=>{current=c;render()};tabs.appendChild(b)});grid.innerHTML='';tools.filter(t=>current==='All'||t[0]===current).forEach(t=>{let b=document.createElement('button');b.type='button';b.className='lab-tool';let h=document.createElement('strong'),p=document.createElement('span');h.textContent=t[1]+' '+t[2];p.textContent=t[3];b.append(h,p);b.onclick=()=>{try{t[4]()}catch(e){console.error('Beta Lab:',e);toast('This tool could not run.')}};grid.appendChild(b)})}
render();launch.onclick=()=>{panel.classList.add('open');render()};panel.querySelector('.lab-close').onclick=()=>panel.classList.remove('open');panel.onclick=e=>{if(e.target===panel)panel.classList.remove('open')};document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.remove('open')});
let accent=read('accent',null);if(accent)document.documentElement.style.setProperty('--blue',accent);
let fs=read('fontSize',16);bubbles().forEach(x=>x.style.fontSize=fs+'px');
console.info('ChatByKarnav Beta Lab ready:',tools.length,'tools');
})();