'use strict';

const $ = (id) => document.getElementById(id);
const toast = $('toast');
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

async function copyText(value) {
  if (!value) return notify('لا يوجد شيء لنسخه.');
  try {
    await navigator.clipboard.writeText(value);
    notify('تم النسخ بنجاح ✓');
  } catch {
    const helper = document.createElement('textarea');
    helper.value = value;
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    const ok = document.execCommand('copy');
    helper.remove();
    notify(ok ? 'تم النسخ بنجاح ✓' : 'تعذّر النسخ؛ حدّد النص وانسخه يدويًا.');
  }
}

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', () => {
    const target = $(button.dataset.copy);
    if (target) copyText(target.value || target.textContent);
  });
});

$('menuToggle').addEventListener('click', () => $('nav').classList.toggle('open'));
$('nav').querySelectorAll('a').forEach(link => link.addEventListener('click', () => $('nav').classList.remove('open')));
$('year').textContent = new Date().getFullYear();

// Expanded local decoration library: 36 styles, no API or AI.
const nameStyles = [
 n=>`『${n}』`,n=>`【${n}】`,n=>`〖${n}〗`,n=>`꧁༺ ${n} ༻꧂`,n=>`╰☆☆ ${n} ☆☆╮`,n=>`༺═ ${n} ═༻`,
 n=>`◤${n}◢`,n=>`「${n}」`,n=>`《 ${n} 》`,n=>`〔${n}〕`,n=>`⟦${n}⟧`,n=>`〘${n}〙`,
 n=>`亗 ${n} 亗`,n=>`乂 ${n} 乂`,n=>`メ ${n} メ`,n=>`★彡 ${n} 彡★`,n=>`☯ ${n} ☯`,n=>`⚡${n}⚡`,
 n=>`✧･ﾟ ${n} ･ﾟ✧`,n=>`ツ ${n} ツ`,n=>`♛ ${n} ♛`,n=>`×͜× ${n}`,n=>`么 ${n} 么`,n=>`☠ ${n} ☠`,
 n=>`x${n}x`,n=>`_${n}_`,n=>`${n}.exe`,n=>`Its${n}`,n=>`Real_${n}`,n=>`${n}ツ`,
 n=>`The${n}`,n=>`${n}YT`,n=>`iAm${n}`,n=>`${n}X`,n=>`Not${n}`,n=>`${n}_OP`
];
$('makeNames').addEventListener('click', () => {
 const name=$('nameInput').value.trim(), host=$('nameResults'); host.replaceChildren();
 if(!name){notify('اكتب اسمًا أولًا.');return;}
 nameStyles.map(fn=>fn(name)).forEach(value=>{
  const row=document.createElement('div');row.className='result-row';
  const code=document.createElement('code');code.textContent=value;
  const button=document.createElement('button');button.className='copy-btn';button.textContent='نسخ';button.addEventListener('click',()=>copyText(value));
  row.append(code,button);host.append(row);
 });
 notify(`تم إنشاء ${nameStyles.length} زخرفة.`);
});

// Username ideas are assembled from built-in word lists; no AI or network calls.
const ideaWords={
 dark:{a:['Shadow','Night','Phantom','Void','Raven','Venom','Ghost','Dark','Frost','Silent'],b:['Hunter','Vortex','Blade','Specter','Wolf','Strike','Reaper','Nova','Zero','Storm']},
 cute:{a:['Mochi','Bunny','Misty','Peach','Luna','Kiki','Berry','Cloud','Mimi','Daisy'],b:['Pop','Star','Dream','Boba','Bloom','Puff','Spark','Kit','Moon','Glow']},
 pro:{a:['Pixel','Elite','Rapid','Prime','Apex','Hyper','Turbo','Alpha','Neo','Ultra'],b:['Builder','Gamer','Plays','Craft','Runner','Core','Quest','Dev','Legend','Zone']},
 fun:{a:['Oops','Banana','Goofy','Noodle','Potato','Waffle','Pickle','Bloop','Silly','Bonk'],b:['Master','Wizard','Ninja','Buddy','Jumper','Toast','Monkey','Panda','Duck','Dude']}
};
$('makeIdeas')?.addEventListener('click',()=>{
 const theme=$('ideaTheme').value, words=ideaWords[theme], host=$('ideaResults');host.replaceChildren();
 const candidates=[];
 while(candidates.length<12){const a=words.a[Math.floor(Math.random()*words.a.length)],b=words.b[Math.floor(Math.random()*words.b.length)];const n=a+b+(Math.random()<.45?Math.floor(Math.random()*99+1):'');if(!candidates.includes(n))candidates.push(n);}
 candidates.forEach(value=>{const row=document.createElement('div');row.className='result-row';const code=document.createElement('code');code.textContent=value;const btn=document.createElement('button');btn.className='copy-btn';btn.textContent='نسخ';btn.addEventListener('click',()=>copyText(value));row.append(code,btn);host.append(row);});
 notify('تم توليد 12 فكرة اسم.');
});

$('passLength').addEventListener('input', () => $('lengthValue').textContent = $('passLength').value);
$('makePassword').addEventListener('click', () => {
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  if ($('useUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if ($('useNumbers').checked) chars += '0123456789';
  if ($('useSymbols').checked) chars += '!@#$%^&*()-_=+[]{}?';
  if (chars.length === 26) { notify('فعّل خيارًا إضافيًا لكلمة مرور أقوى.'); return; }
  const length = Number($('passLength').value);
  const random = new Uint32Array(length);
  crypto.getRandomValues(random);
  $('passwordOutput').value = Array.from(random, n => chars[n % chars.length]).join('');
});

// Basic indentation helper for common Luau block keywords. It does not parse or validate Luau.
$('formatCode').addEventListener('click', () => {
  const source = $('codeInput').value;
  if (!source.trim()) { notify('الصق الكود أولًا.'); return; }
  let depth = 0;
  const out = source.split(/\r?\n/).map(original => {
    const line = original.trim();
    if (!line) return '';
    const closes = /^(end\b|until\b|else\b|elseif\b|}\s*[,;]?\s*$)/.test(line);
    if (closes) depth = Math.max(0, depth - 1);
    const formatted = '    '.repeat(depth) + line;
    const opens = /\b(then|do|function)\b/.test(line) || /^\b(repeat)\b/.test(line) || /^\s*if\b.*\bthen\s*$/.test(line);
    if (opens && !/\bend\s*$/.test(line) && !/\belseif\b/.test(line) && !/\belse\b/.test(line)) depth++;
    if (/^else\b/.test(line) || /^elseif\b/.test(line)) depth++;
    return formatted;
  }).join('\n');
  $('codeOutput').value = out;
  notify('تم التنسيق الأساسي. راجع الناتج يدويًا.');
});
$('clearCode').addEventListener('click', () => { $('codeInput').value = ''; $('codeOutput').value = ''; notify('تم مسح المحرر.'); });

// Text utilities
function updateTextStats() {
  const value = $('textInput').value;
  $('charCount').textContent = [...value].length;
  $('wordCount').textContent = value.trim() ? value.trim().split(/\s+/).length : 0;
}
$('textInput').addEventListener('input', updateTextStats);
$('toUpper').addEventListener('click', () => { $('textOutput').value = $('textInput').value.toLocaleUpperCase(); notify('تم التحويل.'); });
$('toLower').addEventListener('click', () => { $('textOutput').value = $('textInput').value.toLocaleLowerCase(); notify('تم التحويل.'); });
$('reverseText').addEventListener('click', () => { $('textOutput').value = [...$('textInput').value].reverse().join(''); notify('تم عكس النص.'); });

// Notes are stored locally in this browser only.
const NOTES_KEY = 'roblox_lab_notes_v1';
try { $('notesInput').value = localStorage.getItem(NOTES_KEY) || ''; } catch {}
$('saveNotes').addEventListener('click', () => {
  try {
    localStorage.setItem(NOTES_KEY, $('notesInput').value);
    $('notesStatus').textContent = 'تم حفظ الملاحظات على هذا الجهاز ✓';
    notify('تم حفظ الملاحظات.');
  } catch {
    $('notesStatus').textContent = 'تعذّر الحفظ في هذا المتصفح. انسخ الملاحظات للاحتفاظ بها.';
    notify('تعذّر الحفظ المحلي.');
  }
});
$('clearNotes').addEventListener('click', () => {
  $('notesInput').value = '';
  try { localStorage.removeItem(NOTES_KEY); } catch {}
  $('notesStatus').textContent = 'تم حذف الملاحظات المحلية.';
  notify('تم حذف الملاحظات.');
});

// Extra local tools for ROBLOX LAB Ultimate
const favKey='roblox_lab_favorites_v3';let favs=[];try{favs=JSON.parse(localStorage.getItem(favKey)||'[]')}catch{}
function drawFavs(){const box=$('favorites');if(!box)return;box.replaceChildren();if(!favs.length){const s=document.createElement('small');s.textContent='لم تحفظ أي اسم بعد.';box.append(s);return}favs.forEach(v=>{const b=document.createElement('button');b.className='fav-pill';b.textContent='★ '+v;b.onclick=()=>copyText(v);box.append(b)})}
const oldRenderNames=renderNames;renderNames=function(){oldRenderNames();const host=$('nameResults');host.querySelectorAll('.name-row').forEach(row=>{const code=row.querySelector('code');if(!code||row.querySelector('.favorite'))return;const b=document.createElement('button');b.className='favorite';b.textContent=favs.includes(code.textContent)?'★':'☆';b.onclick=()=>{const v=code.textContent;favs=favs.includes(v)?favs.filter(x=>x!==v):[v,...favs].slice(0,50);try{localStorage.setItem(favKey,JSON.stringify(favs))}catch{}drawFavs();renderNames()};row.append(b)})};drawFavs();if($('clearFavorites'))$('clearFavorites').onclick=()=>{favs=[];try{localStorage.removeItem(favKey)}catch{}drawFavs();renderNames();notify('تم مسح المفضلة')};
if($('toolSearch'))$('toolSearch').addEventListener('input',()=>{const q=$('toolSearch').value.trim().toLowerCase();let count=0;document.querySelectorAll('#toolGrid .tool-card').forEach(card=>{const ok=!q||card.textContent.toLowerCase().includes(q)||(card.dataset.search||'').includes(q);card.style.display=ok?'':'none';if(ok)count++})});
function msgJson(ok,msg){const e=$('jsonResult');e.className='result-message '+(ok?'good':'bad');e.textContent=msg}if($('checkJson'))$('checkJson').onclick=()=>{try{JSON.parse($('jsonInput').value);msgJson(true,'✓ JSON صحيح من ناحية الصيغة.')}catch(e){msgJson(false,'✕ خطأ: '+e.message)}};if($('formatJson'))$('formatJson').onclick=()=>{try{$('jsonInput').value=JSON.stringify(JSON.parse($('jsonInput').value),null,2);msgJson(true,'تم ترتيب JSON بنجاح.')}catch(e){msgJson(false,'تعذّر الترتيب: '+e.message)}};
let paletteColors=[];function hex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12,c=l-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,'0')};return '#'+f(0)+f(8)+f(4)}function drawPalette(){paletteColors=Array.from({length:5},(_,i)=>hex(Math.floor(Math.random()*360),60+Math.floor(Math.random()*30),30+Math.floor(Math.random()*40)));$('palette').replaceChildren();$('paletteCodes').replaceChildren();paletteColors.forEach(col=>{const b=document.createElement('button');b.className='swatch';b.style.background=col;b.title=col;b.onclick=()=>copyText(col);$('palette').append(b);const c=document.createElement('button');c.className='palette-code';c.textContent=col;c.onclick=()=>copyText(col);$('paletteCodes').append(c)})}if($('newPalette'))$('newPalette').onclick=drawPalette;if($('copyPalette'))$('copyPalette').onclick=()=>copyText(paletteColors.join(', '));if($('palette'))drawPalette();
const challenges=[['اصنع Obby من 8 مراحل','اجعل لكل مرحلة فخًا مختلفًا ونقطة حفظ.'],['أنشئ غرفة سرية','أخفِ غرفة لا يصل إليها اللاعب إلا بحل لغز.'],['صمّم مابًا بلونين','حافظ على تناسق الألوان ووضوح الطريق.'],['اصنع بابًا بكلمة سر','افتح الباب عند إدخال الكلمة الصحيحة.'],['تحدي 60 ثانية','اجعل اللاعب يصل للنهاية قبل انتهاء الوقت.'],['نظام نقاط','أضف نقاطًا عند جمع العناصر.'],['منصة متحركة','اختبر توقيت القفز والهبوط.'],['ماب رعب صغير','استخدم الإضاءة والأدلة لصناعة جو غامض.']];if($('newChallenge'))$('newChallenge').onclick=()=>{const x=challenges[Math.floor(Math.random()*challenges.length)];$('challengeCard').replaceChildren();const b=document.createElement('b'),s=document.createElement('small');b.textContent=x[0];s.textContent=x[1];$('challengeCard').append(b,s)};
const planData={'Obby وفخاخ':['حدد مسار البداية والنهاية','أنشئ نقطة ظهور آمنة','ابنِ 5 عقبات متنوعة','أضف نقاط حفظ','اختبر القفزات','أضف شاشة فوز'],'محاكاة Simulator':['حدد النشاط الأساسي','أنشئ منطقة البداية','أضف عنصرًا قابلًا للجمع','أنشئ نظام نقاط','أضف ترقية بسيطة','اختبر توازن المكافآت'],'رعب وغموض':['اكتب قصة قصيرة','حدد مسار اللاعب','اضبط الإضاءة','أضف أدلة مخفية','اختبر وضوح المسار','أضف نهاية للمهمة'],'مدينة Roleplay':['ارسم الشوارع','أنشئ أماكن عامة','وزع نقاط الظهور','أضف لوحات إرشادية','اختبر التنقل','حسّن الأداء']};const pkey='rlab_plan_v3';function loadPlan(){const type=$('mapType').value;let saved={};try{saved=JSON.parse(localStorage.getItem(pkey)||'{}')}catch{}const checked=saved[type]||[];$('planTasks').replaceChildren();planData[type].forEach((t,i)=>{const l=document.createElement('label');l.className='plan-task';const cb=document.createElement('input');cb.type='checkbox';cb.checked=checked.includes(i);const span=document.createElement('span');span.textContent=t;l.append(cb,span);if(cb.checked)l.classList.add('done');cb.onchange=()=>{let all={};try{all=JSON.parse(localStorage.getItem(pkey)||'{}')}catch{}all[type]=all[type]||[];all[type]=cb.checked?[...new Set([...all[type],i])]:all[type].filter(n=>n!==i);try{localStorage.setItem(pkey,JSON.stringify(all))}catch{}l.classList.toggle('done',cb.checked);progress()};$('planTasks').append(l)});progress()}function progress(){const a=[...$('planTasks').querySelectorAll('input')];$('planProgress').textContent+(a.filter(x=>x.checked).length)}function progress(){const a=[...$('planTasks').querySelectorAll('input')];$('planProgress').textContent=(a.length?Math.round(a.filter(x=>x.checked).length/a.length*100):0)+'% مكتمل'}if($('loadPlan'))$('loadPlan').onclick=loadPlan;if($('mapType'))$('mapType').onchange=loadPlan;if($('planTasks'))loadPlan();
const snippets={door:'local door = script.Parent\nlocal debounce = false\ndoor.Touched:Connect(function(hit)\n    if debounce then return end\n    local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")\n    if humanoid then\n        debounce = true\n        door.CanCollide = false\n        door.Transparency = 0.6\n        task.wait(2)\n        door.CanCollide = true\n        door.Transparency = 0\n        debounce = false\n    end\nend)',points:'game.Players.PlayerAdded:Connect(function(player)\n    local stats = Instance.new("Folder")\n    stats.Name = "leaderstats"\n    stats.Parent = player\n    local points = Instance.new("IntValue")\n    points.Name = "Points"\n    points.Value = 0\n    points.Parent = stats\nend)',part:'local part = script.Parent\npart.Color = Color3.fromRGB(103, 245, 163)\npart.Material = Enum.Material.Neon\npart.Transparency = 0'};document.querySelectorAll('[data-snippet]').forEach(b=>b.onclick=()=>{$('snippetOutput').value=snippets[b.dataset.snippet]||'';notify('تم تحميل المثال')});if($('copySnippet'))$('copySnippet').onclick=()=>copyText($('snippetOutput').value);
function drawCard(){const can=$('playerCanvas');if(!can)return;const ctx=can.getContext('2d'),name=$('cardName').value.trim()||'Shadow_X',sub=$('cardSubtitle').value.trim()||'Roblox Creator',col=$('cardColor').value;const g=ctx.createLinearGradient(0,0,900,500);g.addColorStop(0,'#17262e');g.addColorStop(1,'#080d12');ctx.fillStyle=g;ctx.fillRect(0,0,900,500);ctx.strokeStyle=col;ctx.lineWidth=4;ctx.strokeRect(18,18,864,464);ctx.globalAlpha=.13;ctx.fillStyle=col;ctx.beginPath();ctx.arc(740,180,180,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle=col;ctx.fillRect(62,70,8,360);ctx.fillStyle='#edf5f7';ctx.font='bold 28px monospace';ctx.fillText('ROBLOX LAB / PLAYER CARD',95,100);ctx.fillStyle=col;ctx.font='bold 60px sans-serif';ctx.fillText(name.slice(0,22),95,230);ctx.fillStyle='#a4b7c0';ctx.font='28px sans-serif';ctx.fillText(sub.slice(0,38),98,285);ctx.strokeStyle='#344650';ctx.beginPath();ctx.moveTo(95,330);ctx.lineTo(800,330);ctx.stroke();ctx.fillStyle=col;ctx.font='22px monospace';ctx.fillText('PLAYER • CREATOR • GAMER',95,380);ctx.fillStyle='#a4b7c0';ctx.font='17px monospace';ctx.fillText('ROBLOX LAB / LOCAL DESIGN',95,430)}['cardName','cardSubtitle','cardColor'].forEach(id=>{if($(id))$(id).addEventListener('input',drawCard)});drawCard();if($('downloadCard'))$('downloadCard').onclick=()=>{drawCard();const a=document.createElement('a');a.download='roblox-player-card.png';a.href=$('playerCanvas').toDataURL('image/png');a.click();notify('تم حفظ البطاقة PNG')};
