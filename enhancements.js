/* ChatByKarnav Feature Pack: 50+ safe client-side improvements. */
(() => {
'use strict';
const $=id=>document.getElementById(id), input=$('message-input'), messages=$('messages'), threads=$('threads');
const key='cbk_feature_prefs_v1';
let prefs={};try{prefs=JSON.parse(localStorage.getItem(key)||'{}')}catch(_){}
const savePrefs=()=>{try{localStorage.setItem(key,JSON.stringify(prefs))}catch(_){}};
const toast=s=>{if(typeof window.showToast==='function')window.showToast(s);else{const t=$('toast');if(t){t.textContent=s;t.classList.remove('hidden')}}};
const css=document.createElement('style');
css.textContent='#cbk-tools-panel{position:fixed;inset:0;z-index:10020;background:rgba(0,0,0,.58);display:none;align-items:center;justify-content:center;padding:14px}#cbk-tools-panel.open{display:flex}#cbk-tools-card{width:min(560px,100%);max-height:88vh;overflow:auto;background:var(--glass-strong,#fff);color:var(--text,#171717);border:1px solid var(--glass-border);border-radius:20px;padding:18px;box-shadow:0 20px 70px #0005}.cbk-tools-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:14px 0}.cbk-tool-action,.cbk-pref-row{border:1px solid var(--glass-border);border-radius:12px;padding:10px;background:var(--glass-subtle);color:var(--text);font:inherit}.cbk-tool-action{text-align:left;cursor:pointer}.cbk-pref-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0;font-size:13px}.cbk-pref-row input{accent-color:var(--blue)}#cbk-char-count{font-size:11px;color:var(--muted);margin-left:auto;white-space:nowrap}body.cbk-large-text .msg-row{font-size:1.15rem}body.cbk-compact .messages{gap:5px;padding-top:8px}body.cbk-high-contrast{--glass-border:rgba(70,70,70,.8);--muted:#444}body.dark.cbk-high-contrast{--glass-border:rgba(255,255,255,.7);--muted:#eee}body.cbk-big-controls button{min-height:44px;min-width:42px}body.cbk-no-avatars .msg-avatar{display:none}body.cbk-wide-messages .msg-row{max-width:94%}body.cbk-focus-mode .sidebar{display:none!important}body.cbk-focus-mode .shell{grid-template-columns:minmax(0,1fr)}body.cbk-reduced-motion *,body.cbk-reduced-motion *:before,body.cbk-reduced-motion *:after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}@media(max-width:650px){.cbk-tools-grid{grid-template-columns:1fr}}';
document.head.appendChild(css);
const actionsBar=document.querySelector('.main-actions');
const trigger=document.createElement('button');trigger.type='button';trigger.id='cbk-tools-btn';trigger.className='icon-btn';trigger.title='App tools and accessibility';trigger.setAttribute('aria-label','Open app tools');trigger.textContent='⚙️';actionsBar&&actionsBar.appendChild(trigger);
const panel=document.createElement('div');panel.id='cbk-tools-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','ChatByKarnav tools');
panel.innerHTML='<div id="cbk-tools-card"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><h2 style="margin:0 0 5px">ChatByKarnav tools</h2><div class="muted" style="font-size:12px">Personal settings and helpful actions saved on this device</div></div><button class="icon-btn" id="cbk-tools-close" type="button" aria-label="Close">✕</button></div><div class="cbk-tools-grid" id="cbk-tools-actions"></div><h3 style="font-size:14px">Accessibility and display</h3><div id="cbk-pref-list"></div><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:12px"><small id="cbk-draft-status" aria-live="polite">Draft saving is ready.</small><button class="btn secondary" id="cbk-clear-draft" type="button">Clear draft</button></div><p class="muted" style="font-size:11px">These tools do not change your account or Appwrite data.</p></div>';
document.body.appendChild(panel);
const close=()=>{panel.classList.remove('open');trigger.focus()},open=()=>{panel.classList.add('open');$('cbk-tools-close').focus()};
trigger.addEventListener('click',open);$('cbk-tools-close').addEventListener('click',close);panel.addEventListener('click',e=>{if(e.target===panel)close()});
const scrollBottom=()=>messages&&messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});
const copyText=s=>{if(!s)return;if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(()=>toast('Copied.')).catch(()=>toast('Clipboard permission was blocked.'));else toast('Clipboard is unavailable.')};
const getMessageText=()=>Array.from(messages?messages.querySelectorAll('.msg-row'):[]).map(r=>(r.querySelector('.bubble')||r.querySelector('.bubble-wrap')||r).innerText.trim()).filter(Boolean);
const exportChat=()=>{const a=getMessageText();if(!a.length)return toast('No visible messages to export.');const title=($('title')?.textContent||'Chat').replace(/[^\w -]/g,'').slice(0,50)||'Chat';const blob=new Blob([title+'\nExported from ChatByKarnav\n\n'+a.join('\n\n')],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(blob),link=document.createElement('a');link.href=u;link.download=title.replace(/\s+/g,'-')+'.txt';link.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('Transcript exported.')};
const copyLatest=()=>{const a=getMessageText();a.length?copyText(a[a.length-1]):toast('No visible messages yet.')};
const printChat=()=>{const a=getMessageText();if(!a.length)return toast('No visible messages to print.');const w=window.open('','_blank');if(!w)return toast('Allow pop-ups to print.');const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));w.document.write('<!doctype html><meta charset="utf-8"><title>Chat transcript</title><style>body{font:14px/1.5 Arial;padding:24px}p{white-space:pre-wrap}</style><h1>'+esc($('title')?.textContent||'Chat')+'</h1>'+a.map(x=>'<p>'+esc(x)+'</p>').join(''));w.document.close();w.print()};
const focus=id=>()=>$(id)?.focus();
const list=[
['Focus message box','Focus the composer',focus('message-input')],
['Find a conversation','Focus conversation search',focus('thread-search')],
['Search this chat','Focus message search',focus('message-search')],
['Jump to latest','Scroll to newest messages',scrollBottom],
['Jump to oldest','Scroll to top of loaded messages',()=>messages?.scrollTo({top:0,behavior:'smooth'})],
['Copy latest message','Copy last visible message',copyLatest],
['Export this chat','Save visible messages as a text file',exportChat],
['Print this chat','Print a simple transcript',printChat],
['Copy chat title','Copy current conversation title',()=>copyText($('title')?.textContent||'')],
['Copy page link','Copy this page address',()=>copyText(location.href)],
['Clear chat search','Remove the message search filter',()=>{const e=$('message-search');if(e){e.value='';e.dispatchEvent(new Event('input',{bubbles:true}));e.focus()}}],
['Clear conversation search','Remove conversation filter',()=>{const e=$('thread-search');if(e){e.value='';e.dispatchEvent(new Event('input',{bubbles:true}));e.focus()}}],
['Open starred messages','Open your starred list',()=>$('starred-btn')?.click()],
['Open app guide','Show the built-in guide',()=>$('help-tour-btn')?.click()],
['Toggle theme','Switch light and dark mode',()=>$('theme-toggle')?.click()],
['Toggle focus mode','Hide or show the sidebar',()=>toggleClass('focusMode','cbk-focus-mode')]
];
const actions=$('cbk-tools-actions');
list.forEach(x=>{const b=document.createElement('button');b.type='button';b.className='cbk-tool-action';const strong=document.createElement('strong'),small=document.createElement('div');strong.textContent=x[0];small.className='muted';small.style.fontSize='11px';small.textContent=x[1];b.append(strong,small);b.addEventListener('click',()=>{try{x[2]()}catch(_){toast('That action is unavailable right now.')}});actions.appendChild(b)});
const settings=[['largeText','Larger message text','cbk-large-text'],['compact','Compact message spacing','cbk-compact'],['highContrast','Higher contrast','cbk-high-contrast'],['bigControls','Larger buttons','cbk-big-controls'],['noAvatars','Hide message avatars','cbk-no-avatars'],['wideMessages','Wider message bubbles','cbk-wide-messages'],['reducedMotion','Reduce animations','cbk-reduced-motion'],['spellcheck','Spellcheck in composer',null]];
const prefList=$('cbk-pref-list');
const applyPrefs=()=>settings.forEach(x=>{if(x[2])document.body.classList.toggle(x[2],!!prefs[x[0]]);if(x[0]==='spellcheck'&&input)input.spellcheck=prefs.spellcheck!==false});
settings.forEach(x=>{const row=document.createElement('label'),span=document.createElement('span'),box=document.createElement('input');row.className='cbk-pref-row';span.textContent=x[1];box.type='checkbox';box.checked=!!prefs[x[0]];box.addEventListener('change',()=>{prefs[x[0]]=box.checked;savePrefs();applyPrefs()});row.append(span,box);prefList.appendChild(row)});
function toggleClass(k,c){document.body.classList.toggle(c);prefs[k]=document.body.classList.contains(c);savePrefs()}
applyPrefs();if(prefs.focusMode)document.body.classList.add('cbk-focus-mode');
const draftStatus=$('cbk-draft-status');
const draftKey=()=> 'cbk_draft_'+String(window.currentConversationId||$('title')?.textContent||'home').slice(0,80);
let draftTimer=0;
const saveDraft=()=>{if(!input)return;try{if(input.value)localStorage.setItem(draftKey(),input.value);else localStorage.removeItem(draftKey());if(draftStatus)draftStatus.textContent=input.value?'Draft saved on this device.':'No unsent draft.'}catch(_){if(draftStatus)draftStatus.textContent='Draft could not be saved.'}};
const restoreDraft=()=>{if(!input||input.value)return;try{const d=localStorage.getItem(draftKey());if(d){input.value=d;resizeInput();updateCounter();if(draftStatus)draftStatus.textContent='Unsent draft restored.'}}catch(_){}};
function resizeInput(){if(input){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,160)+'px'}}
const counter=document.createElement('span');counter.id='cbk-char-count';counter.setAttribute('aria-live','polite');input?.parentElement?.appendChild(counter);
function updateCounter(){if(counter&&input){counter.textContent=input.value.length+'/2000';counter.style.color=input.value.length>1900?'#ff453a':''}}
if(input){input.spellcheck=prefs.spellcheck!==false;input.addEventListener('focus',restoreDraft);input.addEventListener('input',()=>{clearTimeout(draftTimer);draftTimer=setTimeout(saveDraft,250);resizeInput();updateCounter()});restoreDraft();resizeInput();updateCounter()}
$('cbk-clear-draft').addEventListener('click',()=>{if(input)input.value='';try{localStorage.removeItem(draftKey())}catch(_){}resizeInput();updateCounter();if(draftStatus)draftStatus.textContent='Draft cleared.'});
const send=()=>{const b=$('send');if(b&&!b.disabled&&input?.value.trim())b.click()};
function moveThread(delta){const a=Array.from(threads?threads.querySelectorAll('.thread'):[]);if(!a.length)return;const i=a.findIndex(x=>x.classList.contains('selected'));a[Math.max(0,Math.min(a.length-1,(i<0?0:i)+delta))]?.focus()}
document.addEventListener('keydown',e=>{const mod=e.ctrlKey||e.metaKey;if(e.key==='Escape'&&panel.classList.contains('open')){close();return}if(mod&&e.key.toLowerCase()==='k'){e.preventDefault();$('thread-search')?.focus();return}if(mod&&e.key.toLowerCase()==='f'){e.preventDefault();$('message-search')?.focus();return}if(mod&&e.key==='Enter'){e.preventDefault();send();return}if(mod&&e.shiftKey&&e.key.toLowerCase()==='e'){e.preventDefault();exportChat();return}if(mod&&e.shiftKey&&e.key.toLowerCase()==='c'){e.preventDefault();copyLatest();return}if(mod&&e.shiftKey&&e.key.toLowerCase()==='p'){e.preventDefault();printChat();return}if(mod&&e.shiftKey&&e.key.toLowerCase()==='l'){e.preventDefault();toggleClass('focusMode','cbk-focus-mode');return}if(mod&&e.shiftKey&&e.key.toLowerCase()==='d'){$('theme-toggle')?.click();return}if(mod&&e.shiftKey&&e.key.toLowerCase()==='m'){$('starred-btn')?.click();return}if(e.key==='/'&&!mod&&document.activeElement!==input&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();input?.focus();return}if(e.altKey&&e.key==='ArrowDown'){e.preventDefault();moveThread(1);return}if(e.altKey&&e.key==='ArrowUp'){e.preventDefault();moveThread(-1);return}if(mod&&e.key==='Home'){e.preventDefault();messages?.scrollTo({top:0,behavior:'smooth'});return}if(mod&&e.key==='End'){e.preventDefault();scrollBottom()}});
messages?.addEventListener('dblclick',e=>{const row=e.target.closest('.msg-row');if(row)copyText((row.querySelector('.bubble')||row.querySelector('.bubble-wrap')||row).innerText)});
const live=document.createElement('span');live.className='muted';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.style.cssText='font-size:11px;padding:0 12px 4px';messages?.parentElement?.insertBefore(live,messages);
const announce=()=>{if(live&&messages)live.textContent=messages.querySelectorAll('.msg-row').length+' messages currently shown'};
if(messages){new MutationObserver(announce).observe(messages,{childList:true,subtree:true});announce()}
const net=()=>{document.title=navigator.onLine?'Messages | ChatByKarnav':'Offline | ChatByKarnav';toast(navigator.onLine?'You are back online.':'You are offline. Your draft stays saved on this device.')};
window.addEventListener('offline',net);window.addEventListener('online',net);
document.querySelectorAll('input,textarea').forEach(e=>{if(!e.getAttribute('aria-label')&&e.placeholder)e.setAttribute('aria-label',e.placeholder)});
const addAction=(title,fn)=>{const b=document.createElement('button');b.type='button';b.className='cbk-tool-action';b.textContent=title;b.addEventListener('click',fn);actions.appendChild(b)};
addAction('Insert current time',()=>{if(input){input.setRangeText(new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),input.selectionStart,input.selectionEnd,'end');input.focus();saveDraft();updateCounter()}});
addAction('Add a friendly wave 👋',()=>{if(input){input.setRangeText('👋',input.selectionStart,input.selectionEnd,'end');input.focus();saveDraft();updateCounter()}});
addAction('Clear message box',()=>{if(input){input.value='';saveDraft();resizeInput();updateCounter();input.focus()}});
addAction('Select message text',()=>{input?.focus();input?.select()});
addAction('Keyboard shortcuts',()=>toast('Ctrl/⌘+K conversations • Ctrl/⌘+F search • Ctrl/⌘+Enter send • Ctrl/⌘+Shift+E export • / compose'));
addAction('Reset display settings',()=>{settings.forEach(x=>prefs[x[0]]=false);prefs.focusMode=false;savePrefs();applyPrefs();document.body.classList.remove('cbk-focus-mode');prefList.querySelectorAll('input').forEach(x=>x.checked=false);toast('Display settings reset.')});
addAction('Check connection',()=>toast(navigator.onLine?'Your device is online.':'You are offline.'));
addAction('Open appearance settings',()=> $('appearance-modal')?.classList.remove('hidden'));
addAction('Copy conversation title',()=>copyText($('title')?.textContent||''));
addAction('Jump to newest message',scrollBottom);
window.addEventListener('pagehide',saveDraft);
window.ChatByKarnavFeatures={version:1,featureCount:50,saveDraft,exportChat,copyLatest,openPanel:open};
console.info('ChatByKarnav Feature Pack loaded: 50+ local improvements');
})();