/* ============== Alfwzan Center — Common (v2) ============== */
/* localStorage (data) + IndexedDB (media blobs) + GitHub publish + auto-pull */

const STORE_KEY = 'alfwzan_v1';
const AUTH_KEY  = 'alfwzan_auth';
const GH_KEY    = 'alfwzan_gh';
const PENDING_KEY = 'alfwzan_pending_del';
const REMOTE_FLAG = 'alfwzan_loaded_remote';
const LANG_KEY  = 'alfwzan_lang';

const ADMIN_USER   = 'alfwzan@admin';
const ADMIN_PASS   = 'Alfwzan1900';
const TEACHER_USER = 'alfwzan@msh';
const TEACHER_PASS = 'Alfwzan1999';

/* ===== i18n ===== */
function getLang(){ return localStorage.getItem(LANG_KEY) || 'ar' }
function setLang(l){ localStorage.setItem(LANG_KEY, l); location.reload() }
function applyDirection(){
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body && document.body.classList.toggle('lang-en', lang === 'en');
}
const I18N = {
  ar: {
    nav_home:'الرئيسية', nav_ach:'الإنجازات', nav_act:'الأنشطة', nav_stu:'الطلاب', nav_admin:'دخول المشرف',
    cta_register:'سجّل الآن في الحلقات', cta_about:'تعرّف علينا',
    stats_students:'طالب', stats_teachers:'معلم', stats_years:'سنة عمل',
    kicker_about:'من نحن', kicker_register:'انضم إلينا',
    register_step1:'املأ نموذج التسجيل', register_step2:'تحديد الحلقة المناسبة', register_step3:'بدء رحلة الحفظ',
    register_open:'فتح نموذج التسجيل',
    hadith:'خيرُكُم مَن تعلَّمَ القرآنَ وعلَّمَهُ', hadith_ref:'الراوي : عثمان بن عفان | المحدث : الألباني | المصدر : صحيح الترمذي',
    quick_links:'روابط سريعة', contact:'تواصل',
    about_empty:'لم تُضف صور أو فيديوهات بعد. يستطيع المشرف إضافتها من لوحة التحكم.',
    ach_empty:'لم تُضف إنجازات بعد. يستطيع المشرف إضافتها من لوحة التحكم.',
    sec_current:'الأنشطة الحالية', sec_upcoming:'الأنشطة القادمة',
    no_current:'لا توجد أنشطة جارية حاليا.', no_upcoming:'لا توجد أنشطة قادمة حاليا.',
    starts_at:'يبدأ', ends_at:'ينتهي',
    cd_day:'يوم', cd_hour:'ساعة', cd_min:'دقيقة', cd_sec:'ثانية',
    tag_now:'جارٍ الآن', tag_upcoming:'قادم',
    search:'بحث', view_details:'عرض التفاصيل', no_results:'لا توجد نتائج مطابقة.',
    fld_serial:'الرقم التسلسلي', fld_name:'اسم الطالب', fld_halaqa:'اسم الحلقة', fld_level:'المرحلة', fld_all:'الكل',
    th_serial:'الرقم', th_name:'الاسم', th_halaqa:'الحلقة', th_level:'المرحلة',
    lvl_primary:'ابتدائي', lvl_middle:'متوسط', lvl_high:'ثانوي',
    days:['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس'],
    days_full:['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
    week_label:'الأسبوع', prev_week:'السابق', next_week:'التالي', this_week:'الأسبوع الحالي',
    week_range:'من {from} إلى {to}',
    present:'حاضر', absent:'غائب', not_recorded:'لم يُسجّل',
    grade_label:'تقدير الحفظ',
    grades:['ممتاز','جيد جدا','جيد','مقبول','لم يحفظ'],
    no_attendance:'لا توجد سجلات تحضير لهذا الأسبوع.',
    student_attendance:'سجل حضور الطالب',
    halaqa_search:'ابحث بالحلقة', stu_filter:'بحث باسم الطالب',
    halaqa_picker:'اختر الحلقة لعرض التحضير الأسبوعي',
    teacher_title:'التحضير وتقدير الحفظ',
    save:'حفظ', clear:'مسح', logout:'تسجيل خروج', login:'دخول',
    saved:'تم الحفظ',
    lang_switch:'EN'
  },
  en: {
    nav_home:'Home', nav_ach:'Achievements', nav_act:'Activities', nav_stu:'Students', nav_admin:'Admin Login',
    cta_register:'Register in a Halaqa', cta_about:'About us',
    stats_students:'Students', stats_teachers:'Teachers', stats_years:'Years',
    kicker_about:'About', kicker_register:'Join us',
    register_step1:'Fill the registration form', register_step2:'Choose your halaqa', register_step3:'Begin your Quran journey',
    register_open:'Open registration form',
    hadith:'The best among you is the one who learns the Quran and teaches it',
    hadith_ref:'Narrator: Uthman ibn Affan | Source: Sahih al-Tirmidhi',
    quick_links:'Quick Links', contact:'Contact',
    about_empty:'No photos or videos yet. The admin can add them from the dashboard.',
    ach_empty:'No achievements yet. The admin can add them from the dashboard.',
    sec_current:'Current activities', sec_upcoming:'Upcoming activities',
    no_current:'No current activities.', no_upcoming:'No upcoming activities.',
    starts_at:'Starts', ends_at:'Ends',
    cd_day:'day', cd_hour:'hour', cd_min:'min', cd_sec:'sec',
    tag_now:'Live now', tag_upcoming:'Upcoming',
    search:'Search', view_details:'View details', no_results:'No matching results.',
    fld_serial:'Serial number', fld_name:'Student name', fld_halaqa:'Halaqa name', fld_level:'Stage', fld_all:'All',
    th_serial:'No.', th_name:'Name', th_halaqa:'Halaqa', th_level:'Stage',
    lvl_primary:'Primary', lvl_middle:'Intermediate', lvl_high:'High',
    days:['Sunday','Monday','Tuesday','Wednesday','Thursday'],
    days_full:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    week_label:'Week', prev_week:'Prev', next_week:'Next', this_week:'This week',
    week_range:'from {from} to {to}',
    present:'Present', absent:'Absent', not_recorded:'Not recorded',
    grade_label:'Memorization grade',
    grades:['Excellent','Very good','Good','Acceptable','Not memorized'],
    no_attendance:'No attendance records for this week.',
    student_attendance:'Attendance record',
    halaqa_search:'Search halaqa', stu_filter:'Filter by student name',
    halaqa_picker:'Pick a halaqa to view the weekly attendance',
    teacher_title:'Attendance & Memorization',
    save:'Save', clear:'Clear', logout:'Logout', login:'Login',
    saved:'Saved',
    lang_switch:'AR'
  }
};
function t(key){ const d=I18N[getLang()]||I18N.ar; return d[key]!==undefined ? d[key] : (I18N.ar[key]||key) }
function tx(key){
  if(getLang()==='en' && DATA.texts[key+'.en']) return DATA.texts[key+'.en'];
  return DATA.texts[key] || '';
}

/* Week helpers (Sunday → Thursday) */
function weekStart(d){
  const x = new Date(d); x.setHours(0,0,0,0);
  const day = x.getDay(); // 0=Sun..6=Sat
  if(day === 5) x.setDate(x.getDate()+2);       // Fri → next Sun
  else if(day === 6) x.setDate(x.getDate()+1);  // Sat → next Sun
  else x.setDate(x.getDate() - day);             // Sun..Thu → that Sunday
  return x;
}
function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x }
function fmtYMD(d){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}
function fmtDateShort(d){
  const lang = getLang();
  return new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-US', {day:'2-digit', month:'short'}).format(d);
}

const DEFAULT_DATA = {
  texts: {
    'hero.title': 'مركز الفوزان لتحفيظ القرآن الكريم',
    'hero.title.en': 'Alfwzan Center for Memorizing the Holy Quran',
    'hero.lead' : 'بيت يجمع القلوب على كتاب الله، يرعى الناشئة بالتلاوة والحفظ والتجويد، ويغرس فيهم محبة القرآن وأخلاقه.',
    'hero.lead.en': 'A home that gathers hearts upon the Book of Allah, nurturing youth in recitation, memorization and tajwid.',
    'stats.students':'+250','stats.teachers':'+15','stats.years':'+12',
    'about.title':'لمحة عنّا',
    'about.title.en':'About us',
    'about.paragraph1':'انطلق مركز الفوزان لتحفيظ القرآن الكريم برسالة سامية: تنشئة جيل قرآني يحمل الكتاب في صدره وعلى لسانه، ويعمل به في حياته. نقدّم برامج متدرّجة في الحفظ والتجويد لمختلف الأعمار، يشرف عليها نخبة من المعلمين المتخصصين.',
    'about.paragraph1.en':'Alfwzan Center was founded with a noble mission: raising a Quranic generation that carries the Book in their hearts and tongues, and lives by it. We offer graduated programs in memorization and tajwid for all ages, supervised by a select group of specialized teachers.',
    'about.paragraph2':'نهتم ببناء شخصية الطالب القرآنية من خلال مسابقات، رحلات، ولقاءات تربوية تثري الجانب الإيماني والأخلاقي، إلى جانب التركيز على الإتقان والمراجعة المستمرة.',
    'about.paragraph2.en':'We build the Quranic character of our students through competitions, trips and educational meetings that enrich the faith and moral aspects, alongside focus on mastery and continuous review.',
    'about.feature1':'حلقات حفظ بمستويات متعددة', 'about.feature1.en':'Multi-level memorization halaqat',
    'about.feature2':'إجازات ومراجعة بالأسانيد', 'about.feature2.en':'Ijazat and chained review',
    'about.feature3':'مسابقات وأنشطة تربوية', 'about.feature3.en':'Competitions and educational activities',
    'about.feature4':'رحلات وفعاليات سنوية', 'about.feature4.en':'Annual trips and events',
    'register.title':'سجّل في حلقات الفوزان', 'register.title.en':'Register in Alfwzan Halaqat',
    'register.text':'يسرّنا انضمامك إلى أسرة المركز. اضغط على الزر التالي لفتح نموذج التسجيل وملء بياناتك.',
    'register.text.en':'We welcome you to the family of the center. Click the button below to open the registration form.',
    'register.url':'#',
    'achievements.title':'إنجازاتنا وتكريماتنا', 'achievements.title.en':'Our achievements and honors',
    'achievements.lead':'صور للطلاب المثاليين، الشهادات، وفعاليات المسابقات.',
    'achievements.lead.en':'Photos of model students, certificates, and competition events.',
    'activities.title':'أنشطة المركز', 'activities.title.en':'Center activities',
    'activities.lead':'تابع الأنشطة الحالية والقادمة، مع عداد تنازلي لكل نشاط قادم.',
    'activities.lead.en':'Follow current and upcoming activities, with a countdown for each upcoming event.',
    'students.title':'بحث الطلاب', 'students.title.en':'Student lookup',
    'students.lead':'يمكن لولي الأمر البحث عن ابنه برقم تسلسلي أو بالاسم أو باسم الحلقة لمعرفة الحضور وتقدير الحفظ.',
    'students.lead.en':'Parents can search by serial, student name, or halaqa name to view attendance and memorization grade.',
    'footer.about':'رسالتنا أن نكون صحبة قرآنية تعين على الحفظ والعمل بكتاب الله.',
    'footer.about.en':'Our mission is to be a Quranic companionship that helps in memorizing and acting upon the Book of Allah.',
    'footer.contact':'قريبا', 'footer.contact.en':'Coming soon',
    'footer.copyright':'© مركز الفوزان لتحفيظ القرآن الكريم — جميع الحقوق محفوظة',
    'footer.copyright.en':'© Alfwzan Center for Memorizing the Holy Quran — All rights reserved'
  },
  aboutMedia: [],
  achievements: [],
  activities: [],
  halaqat: [],
  students: [],
  attendance: {}
};

function loadStore(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return structuredClone(DEFAULT_DATA);
    return Object.assign(structuredClone(DEFAULT_DATA), JSON.parse(raw));
  }catch(e){ return structuredClone(DEFAULT_DATA) }
}
function saveStore(data){
  // strip any legacy base64 src to keep localStorage small
  const clone = JSON.parse(JSON.stringify(data));
  ['aboutMedia','achievements'].forEach(k=>{
    (clone[k]||[]).forEach(m=>{ if(typeof m.src==='string' && m.src.startsWith('data:')) delete m.src; });
  });
  try{
    localStorage.setItem(STORE_KEY, JSON.stringify(clone));
  }catch(e){
    console.error('saveStore failed', e);
    toast('تعذّر الحفظ — مساحة المتصفح ممتلئة');
  }
}
let DATA = loadStore();

/* Auth */
function getAuth(){ try{ return JSON.parse(sessionStorage.getItem(AUTH_KEY)||'null') }catch(e){return null} }
function setAuth(role){
  sessionStorage.setItem(AUTH_KEY, JSON.stringify({role, t:Date.now()}));
  if(role === 'admin') localStorage.setItem('alfwzan_admin_device','1');
}
function logout(){ sessionStorage.removeItem(AUTH_KEY); location.href='index.html' }
function isAdmin(){ return getAuth()?.role === 'admin' }
function isTeacher(){ return getAuth()?.role === 'teacher' }
function isAdminDevice(){ return localStorage.getItem('alfwzan_admin_device')==='1' }

/* ===== IndexedDB for media blobs ===== */
const IDB_NAME = 'alfwzan_media_v1';
function openIdb(){
  return new Promise((res,rej)=>{
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e)=>{
      const db = e.target.result;
      if(!db.objectStoreNames.contains('media')) db.createObjectStore('media',{keyPath:'id'});
    };
    req.onsuccess = ()=>res(req.result);
    req.onerror = ()=>rej(req.error);
  });
}
async function idbPut(id, blob){
  const db = await openIdb();
  return new Promise((res,rej)=>{
    const tx = db.transaction('media','readwrite');
    tx.objectStore('media').put({id, blob});
    tx.oncomplete = ()=>res();
    tx.onerror = ()=>rej(tx.error);
  });
}
async function idbGet(id){
  const db = await openIdb();
  return new Promise((res,rej)=>{
    const tx = db.transaction('media','readonly');
    const req = tx.objectStore('media').get(id);
    req.onsuccess = ()=>res(req.result?.blob || null);
    req.onerror = ()=>rej(req.error);
  });
}
async function idbDelete(id){
  const db = await openIdb();
  return new Promise((res)=>{
    const tx = db.transaction('media','readwrite');
    tx.objectStore('media').delete(id);
    tx.oncomplete = ()=>res();
    tx.onerror = ()=>res();
  });
}
async function mediaUrl(item){
  if(item.src) return item.src;             // published URL
  const blob = await idbGet(item.id);       // local blob
  if(blob) return URL.createObjectURL(blob);
  return null;
}

/* ===== GitHub publish ===== */
function getGh(){ try{ return JSON.parse(localStorage.getItem(GH_KEY)||'null') }catch(e){return null} }
function setGh(c){ localStorage.setItem(GH_KEY, JSON.stringify(c)) }
function clearGh(){ localStorage.removeItem(GH_KEY) }

/* Pending GitHub file deletions (for items removed by admin after publishing) */
function getPending(){ try{ return JSON.parse(localStorage.getItem(PENDING_KEY)||'[]') }catch(e){return []} }
function addPendingDelete(path){
  if(!path) return;
  const p = getPending();
  if(!p.includes(path)){ p.push(path); localStorage.setItem(PENDING_KEY, JSON.stringify(p)); }
}
function clearPending(){ localStorage.removeItem(PENDING_KEY) }

async function ghGetSha(cfg, path){
  const url = `https://api.github.com/repos/${encodeURIComponent(cfg.user)}/${encodeURIComponent(cfg.repo)}/contents/${path}?ref=${encodeURIComponent(cfg.branch||'main')}`;
  const r = await fetch(url, {headers:{Authorization:`token ${cfg.pat}`,Accept:'application/vnd.github+json'}});
  if(r.status===404) return null;
  if(!r.ok) throw new Error(`GET ${path}: ${r.status} ${(await r.text()).slice(0,160)}`);
  const j = await r.json();
  return j.sha;
}
function blobToBase64(blob){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=>{ const s = r.result; const i = s.indexOf(','); res(i>=0?s.slice(i+1):s); };
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}
function utf8ToB64(s){ return btoa(unescape(encodeURIComponent(s))); }

async function ghPutFile(cfg, path, base64Content, message){
  const url = `https://api.github.com/repos/${encodeURIComponent(cfg.user)}/${encodeURIComponent(cfg.repo)}/contents/${path}`;
  const sha = await ghGetSha(cfg, path);
  const body = {message: message||('update '+path), content: base64Content, branch: cfg.branch||'main'};
  if(sha) body.sha = sha;
  const r = await fetch(url, {
    method:'PUT',
    headers:{Authorization:`token ${cfg.pat}`,Accept:'application/vnd.github+json','Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  if(!r.ok) throw new Error(`PUT ${path}: ${r.status} ${(await r.text()).slice(0,200)}`);
  return r.json();
}

async function ghDeleteFile(cfg, path){
  const sha = await ghGetSha(cfg, path);
  if(!sha) return; // already gone
  const url = `https://api.github.com/repos/${encodeURIComponent(cfg.user)}/${encodeURIComponent(cfg.repo)}/contents/${path}`;
  const r = await fetch(url, {
    method:'DELETE',
    headers:{Authorization:`token ${cfg.pat}`,Accept:'application/vnd.github+json','Content-Type':'application/json'},
    body: JSON.stringify({message:`delete ${path}`, sha, branch:cfg.branch||'main'})
  });
  if(!r.ok && r.status !== 404 && r.status !== 422){
    throw new Error(`DELETE ${path}: ${r.status} ${(await r.text()).slice(0,200)}`);
  }
}

async function publishToGitHub(onProgress){
  const cfg = getGh();
  if(!cfg || !cfg.user || !cfg.repo || !cfg.pat) throw new Error('أدخل إعدادات النشر أولا');

  // Step 0: delete any pending removed files from repo
  const pending = getPending();
  for(let i=0;i<pending.length;i++){
    onProgress?.(`حذف ملفات قديمة ${i+1}/${pending.length}...`);
    try{ await ghDeleteFile(cfg, pending[i]) }catch(e){ console.warn('delete failed', pending[i], e) }
  }
  clearPending();

  // Step 1: upload media files that don't have a src yet
  const items = [...DATA.aboutMedia, ...DATA.achievements];
  const need = items.filter(m=>!m.src);
  let i = 0;
  for(const m of need){
    i++;
    onProgress?.(`رفع الوسائط ${i}/${need.length}...`);
    const blob = await idbGet(m.id);
    if(!blob){ continue; }
    const ext = m.ext || (m.type==='video'?'mp4':'jpg');
    const path = `media/${m.id}.${ext}`;
    const b64 = await blobToBase64(blob);
    await ghPutFile(cfg, path, b64, `add media ${m.id}`);
    m.src = path;
    saveStore(DATA);
  }

  // Step 2: upload site.json
  onProgress?.('رفع ملف البيانات site.json...');
  const json = JSON.stringify(DATA, null, 2);
  await ghPutFile(cfg, 'data/site.json', utf8ToB64(json), 'update site data');
  onProgress?.('تم النشر بنجاح');
}

/* Pull latest data/site.json from same origin (for visitors / teachers) */
async function tryLoadRemote(){
  // Admin device — local is the source of truth, never auto-override.
  if(isAdminDevice()) return;
  try{
    const r = await fetch('data/site.json?ts='+Date.now(), {cache:'no-store'});
    if(!r.ok) return;
    const remote = await r.json();
    if(!remote || typeof remote !== 'object') return;
    const hasLocal = !!localStorage.getItem(STORE_KEY);
    if(!hasLocal){
      // Fresh visitor / teacher: load remote into memory only (do not write localStorage)
      DATA = Object.assign(structuredClone(DEFAULT_DATA), remote);
    } else {
      // Returning teacher (has local attendance): merge remote admin-authored fields,
      // keep their local attendance data.
      const merged = Object.assign(structuredClone(DEFAULT_DATA), remote);
      merged.attendance = DATA.attendance || {};
      DATA = merged;
    }
    sessionStorage.setItem(REMOTE_FLAG,'1');
  }catch(e){ /* ignore */ }
}

/* ===== Header / footer ===== */
function buildHeader(active){
  const html = `
  <div class="bg-watermark" aria-hidden="true"></div>
  <header class="site-header">
    <div class="container nav">
      <a href="index.html" class="brand" data-testid="brand-link">
        <span class="brand-mark" aria-hidden="true">
          <img src="pectirs/alfwzan.jpeg" alt="" onerror="this.parentElement.classList.add('no-logo'); this.remove();" />
          <span class="brand-fallback"></span>
        </span>
        <span class="brand-text"><strong>${getLang()==='en'?'Alfwzan':'الفوزان'}</strong><em>${getLang()==='en'?'Quran Memorization':'لتحفيظ القرآن الكريم'}</em></span>
      </a>
      <nav class="primary-nav" id="primaryNav" data-testid="primary-nav">
        <a href="index.html" class="nav-link ${active==='home'?'active':''}" data-testid="nav-home">${t('nav_home')}</a>
        <a href="page1.html" class="nav-link ${active==='ach'?'active':''}" data-testid="nav-achievements">${t('nav_ach')}</a>
        <a href="page2.html" class="nav-link ${active==='act'?'active':''}" data-testid="nav-activities">${t('nav_act')}</a>
        <a href="page3.html" class="nav-link ${active==='stu'?'active':''}" data-testid="nav-students">${t('nav_stu')}</a>
        <a href="admin.html" class="nav-link nav-admin" data-testid="nav-admin">${t('nav_admin')}</a>
        <button class="lang-switch" id="langSwitch" data-testid="lang-switch" title="EN / AR">${t('lang_switch')}</button>
      </nav>
      <button class="menu-toggle" aria-label="القائمة" data-testid="menu-toggle" onclick="document.getElementById('primaryNav').classList.toggle('open')">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
  document.getElementById('headerSlot').innerHTML = html;
  document.getElementById('langSwitch').onclick = ()=> setLang(getLang()==='ar'?'en':'ar');
}
function buildFooter(){
  const html = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="brand brand-footer">
          <span class="brand-mark" aria-hidden="true">
            <img src="pectirs/alfwzan.jpeg" alt="" onerror="this.parentElement.classList.add('no-logo'); this.remove();" />
            <span class="brand-fallback"></span>
          </span>
          <span class="brand-text"><strong>${getLang()==='en'?'Alfwzan':'الفوزان'}</strong><em>${getLang()==='en'?'Quran Memorization':'لتحفيظ القرآن'}</em></span>
        </div>
        <p class="muted" data-edit="footer.about">${escapeHTML(tx('footer.about'))}</p>
      </div>
      <div>
        <h4>${t('quick_links')}</h4>
        <ul class="footer-links">
          <li><a href="index.html">${t('nav_home')}</a></li>
          <li><a href="page1.html">${t('nav_ach')}</a></li>
          <li><a href="page2.html">${t('nav_act')}</a></li>
          <li><a href="page3.html">${t('nav_stu')}</a></li>
        </ul>
      </div>
      <div>
        <h4>${t('contact')}</h4>
        <p class="muted" data-edit="footer.contact">${escapeHTML(tx('footer.contact'))}</p>
      </div>
    </div>
    <div class="footer-bottom"><span data-edit="footer.copyright">${escapeHTML(tx('footer.copyright'))}</span></div>
  </footer>`;
  document.getElementById('footerSlot').innerHTML = html;
}

function applyTexts(){
  document.querySelectorAll('[data-edit]').forEach(el=>{
    const key = el.getAttribute('data-edit');
    if(key === 'register.url') return;
    const v = tx(key);
    if(v) el.textContent = v;
  });
  // i18n static labels: any element with data-i18n="key"
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  const link = document.getElementById('registerLink');
  if(link){
    link.textContent = t('register_open');
    if(DATA.texts['register.url']) link.href = DATA.texts['register.url'];
  }
}

function enableEditModeIfAdmin(){
  if(!isAdmin()) return;
  document.body.classList.add('editing');
  document.querySelectorAll('[data-edit]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      const key = el.getAttribute('data-edit');
      const cur = DATA.texts[key] || el.textContent.trim();
      const v = prompt('تعديل النص:', cur);
      if(v === null) return;
      DATA.texts[key] = v;
      saveStore(DATA);
      applyTexts();
      toast('تم الحفظ');
    });
  });
}

/* Lightbox */
function ensureLightbox(){
  if(document.getElementById('lb')) return;
  const lb = document.createElement('div');
  lb.id='lb'; lb.className='lb'; lb.setAttribute('data-testid','lightbox');
  lb.innerHTML = `<button class="lb-close" data-testid="lb-close" aria-label="إغلاق">×</button><div id="lbBody"></div>`;
  document.body.appendChild(lb);
  const close = ()=>{
    const body = document.getElementById('lbBody');
    body.querySelectorAll('video').forEach(v=>{ try{ v.pause() }catch(e){} });
    body.innerHTML = '';
    lb.classList.remove('open');
  };
  lb.addEventListener('click',(e)=>{ if(e.target===lb || e.target.classList.contains('lb-close')) close() });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && lb.classList.contains('open')) close() });
}
function openLightbox(node){
  ensureLightbox();
  const body = document.getElementById('lbBody');
  body.innerHTML='';
  body.appendChild(node);
  document.getElementById('lb').classList.add('open');
}

/* Open image or video in lightbox with caption */
function openMediaLightbox(type, url, caption){
  ensureLightbox();
  const body = document.getElementById('lbBody');
  body.innerHTML = '';
  let el;
  if(type === 'video'){
    el = document.createElement('video');
    el.src = url; el.controls = true; el.autoplay = true; el.playsInline = true;
  } else {
    el = document.createElement('img');
    el.src = url; el.alt = caption||'';
  }
  body.appendChild(el);
  if(caption){
    const cap = document.createElement('div');
    cap.className = 'lb-caption';
    cap.textContent = caption;
    body.appendChild(cap);
  }
  document.getElementById('lb').classList.add('open');
}

/* Floating expand button overlay for media tiles */
function buildExpandBtn(item, url){
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'expand-btn';
  btn.setAttribute('data-testid','expand-btn');
  btn.title = 'تكبير';
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    openMediaLightbox(item.type === 'video' ? 'video' : 'image', url, item.caption || item.title || '');
  });
  return btn;
}

/* Toast */
function toast(msg){
  let t = document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t) }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 2200);
}
function showOverlay(msg){
  let o = document.getElementById('busyOverlay');
  if(!o){
    o = document.createElement('div'); o.id='busyOverlay'; o.className='busy';
    o.innerHTML='<div class="busy-card"><div class="spinner"></div><p id="busyMsg"></p></div>';
    document.body.appendChild(o);
  }
  document.getElementById('busyMsg').textContent = msg||'يرجى الانتظار...';
  o.classList.add('show');
}
function hideOverlay(){ document.getElementById('busyOverlay')?.classList.remove('show') }

/* Helpers */
function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4) }
function escapeHTML(s){ return (s??'').toString().replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])) }
function fmtDateTime(iso){
  if(!iso) return '';
  try{ return new Date(iso).toLocaleString('ar-EG',{dateStyle:'medium', timeStyle:'short'}) }catch(e){ return iso }
}
function fileExt(file){
  const n = file.name||'';
  const i = n.lastIndexOf('.');
  if(i>=0) return n.slice(i+1).toLowerCase();
  if(file.type.startsWith('image/')) return file.type.split('/')[1];
  if(file.type.startsWith('video/')) return file.type.split('/')[1];
  return 'bin';
}

/* Init common (async to allow remote pull) */
async function initCommon(active){
  applyDirection();
  buildHeader(active);
  await tryLoadRemote();
  buildFooter();
  ensureLightbox();
  applyTexts();
  enableEditModeIfAdmin();
}
