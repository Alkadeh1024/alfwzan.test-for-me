/* Admin dashboard (v2) — IndexedDB media + GitHub publish */
document.addEventListener('DOMContentLoaded', async ()=>{
  await initCommon('home');
  document.body.classList.remove('editing');
  if(isAdmin()){ showDash() } else { showLogin() }
  document.getElementById('loginBtn').addEventListener('click', doLogin);
  document.getElementById('pass').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
});

function doLogin(){
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value;
  if(u===ADMIN_USER && p===ADMIN_PASS){ setAuth('admin'); showDash(); }
  else if(u===TEACHER_USER && p===TEACHER_PASS){ setAuth('teacher'); location.href='teacher.html'; }
  else document.getElementById('loginErr').style.display='block';
}
function showLogin(){ document.getElementById('loginView').style.display=''; document.getElementById('dashView').style.display='none'; }
function showDash(){
  document.getElementById('loginView').style.display='none';
  document.getElementById('dashView').style.display='';
  bindTabs();
  renderAboutAdmin();
  renderAchAdmin();
  renderActAdmin();
  renderHalaqatAdmin();
  renderStudentsAdmin();
  renderTextsAdmin();
  bindData();
  bindPublish();
  document.getElementById('logoutLink').addEventListener('click', e=>{e.preventDefault();logout();});
}
function bindTabs(){
  const links = document.querySelectorAll('.dash-side a[data-tab]');
  links.forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      links.forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.getElementById('tab-'+a.dataset.tab).classList.add('active');
    });
  });
}

/* ====== Generic media tab (about + achievements share helpers) ====== */
async function buildMediaThumb(item){
  const card = document.createElement('div'); card.className='achievement-card';
  const media = document.createElement('div'); media.className='media';
  const url = await mediaUrl(item);
  if(!url){ media.innerHTML='<div class="empty" style="margin:0">ملف مفقود</div>'; }
  else if(item.type==='video'){
    const v=document.createElement('video'); v.src=url; v.controls=true; v.preload='metadata'; media.appendChild(v);
  } else {
    const i=document.createElement('img'); i.src=url; i.alt=item.caption||item.title||''; media.appendChild(i);
  }
  card.appendChild(media);
  return card;
}

/* ---- About media ---- */
async function renderAboutAdmin(){
  const list = document.getElementById('aboutList'); list.innerHTML='';
  for(const m of DATA.aboutMedia){
    const card = await buildMediaThumb(m);
    card.classList.add('admin-card');
    const body = document.createElement('div'); body.className='body';
    body.innerHTML = `
      <label class="inline-edit-label">${getLang()==='en'?'Caption':'الوصف'}</label>
      <textarea class="inline-edit" rows="2" data-testid="about-caption-edit">${escapeHTML(m.caption||'')}</textarea>
      <div class="card-status">${m.src?'<span class="badge-pub">منشور</span>':'<span class="badge-local">محلي — اضغط نشر</span>'}</div>
    `;
    card.appendChild(body);
    const actions = document.createElement('div'); actions.className='actions';
    actions.innerHTML = `
      <button class="btn btn-sm btn-primary" data-act="save" data-testid="about-save">حفظ الوصف</button>
      <button class="btn btn-sm btn-danger" data-act="del" data-testid="about-del">حذف</button>`;
    const ta = body.querySelector('textarea');
    actions.querySelector('[data-act="save"]').onclick = ()=>{
      m.caption = ta.value;
      saveStore(DATA);
      toast('تم حفظ الوصف');
    };
    actions.querySelector('[data-act="del"]').onclick = async ()=>{
      if(!confirm('هل تريد حذف هذا الوسيط نهائيا؟')) return;
      if(m.src) addPendingDelete(m.src);
      await idbDelete(m.id);
      DATA.aboutMedia = DATA.aboutMedia.filter(x=>x.id!==m.id);
      saveStore(DATA); renderAboutAdmin(); toast('تم الحذف');
    };
    card.appendChild(actions);
    list.appendChild(card);
  }
  document.getElementById('aboutAdd').onclick = async ()=>{
    const files = document.getElementById('aboutFiles').files;
    const caption = document.getElementById('aboutCaption').value.trim();
    if(!files.length){ toast('اختر ملفات أولا'); return; }
    showOverlay('جاري معالجة الملفات...');
    try{
      let i=0;
      for(const f of files){
        i++;
        document.getElementById('busyMsg').textContent = `معالجة ${i}/${files.length}: ${f.name}`;
        const id = uid();
        await idbPut(id, f);
        DATA.aboutMedia.push({id, type:f.type.startsWith('video')?'video':'image', caption, ext:fileExt(f)});
      }
      saveStore(DATA);
      document.getElementById('aboutFiles').value='';
      document.getElementById('aboutCaption').value='';
      hideOverlay(); renderAboutAdmin(); toast('تمت الإضافة — لا تنس النشر');
    }catch(e){ hideOverlay(); toast('فشل: '+e.message); }
  };
}

/* ---- Achievements ---- */
async function renderAchAdmin(){
  const list = document.getElementById('achList'); list.innerHTML='';
  for(const a of DATA.achievements){
    const card = await buildMediaThumb(a);
    card.classList.add('admin-card');
    const body = document.createElement('div'); body.className='body';
    body.innerHTML = `
      <label class="inline-edit-label">العنوان</label>
      <input type="text" class="inline-edit ach-title" value="${escapeHTML(a.title||'')}" data-testid="ach-title-edit"/>
      <label class="inline-edit-label">الوصف</label>
      <textarea class="inline-edit ach-desc" rows="2" data-testid="ach-desc-edit">${escapeHTML(a.desc||'')}</textarea>
      <div class="card-status">${a.src?'<span class="badge-pub">منشور</span>':'<span class="badge-local">محلي — اضغط نشر</span>'}</div>
    `;
    card.appendChild(body);
    const actions = document.createElement('div'); actions.className='actions';
    actions.innerHTML = `
      <button class="btn btn-sm btn-primary" data-act="save" data-testid="ach-save">حفظ التعديلات</button>
      <button class="btn btn-sm btn-danger" data-act="del" data-testid="ach-del">حذف</button>`;
    const ti = body.querySelector('.ach-title');
    const td = body.querySelector('.ach-desc');
    actions.querySelector('[data-act="save"]').onclick = ()=>{
      a.title = ti.value;
      a.desc = td.value;
      saveStore(DATA);
      toast('تم الحفظ');
    };
    actions.querySelector('[data-act="del"]').onclick = async ()=>{
      if(!confirm('هل تريد حذف هذا الإنجاز نهائيا؟')) return;
      if(a.src) addPendingDelete(a.src);
      await idbDelete(a.id);
      DATA.achievements = DATA.achievements.filter(x=>x.id!==a.id);
      saveStore(DATA); renderAchAdmin(); toast('تم الحذف');
    };
    card.appendChild(actions);
    list.appendChild(card);
  }
  document.getElementById('achAdd').onclick = async ()=>{
    const files = document.getElementById('achFile').files;
    const title = document.getElementById('achTitle').value.trim();
    const desc  = document.getElementById('achDesc').value.trim();
    if(!files.length){ toast('اختر ملف'); return; }
    showOverlay('جاري معالجة الملفات...');
    try{
      let i=0;
      for(const f of files){
        i++;
        document.getElementById('busyMsg').textContent = `معالجة ${i}/${files.length}: ${f.name}`;
        const id = uid();
        await idbPut(id, f);
        DATA.achievements.push({id, type:f.type.startsWith('video')?'video':'image', title, desc, ext:fileExt(f)});
      }
      saveStore(DATA);
      document.getElementById('achFile').value='';
      document.getElementById('achTitle').value='';
      document.getElementById('achDesc').value='';
      hideOverlay(); renderAchAdmin(); toast('تمت الإضافة — لا تنس النشر');
    }catch(e){ hideOverlay(); toast('فشل: '+e.message); }
  };
}

/* ---- Activities ---- */
function renderActAdmin(){
  const list = document.getElementById('actList'); list.innerHTML='';
  DATA.activities.forEach(a=>{
    const card = document.createElement('div'); card.className='activity-card upcoming admin-card';
    const startVal = a.startISO ? new Date(a.startISO).toISOString().slice(0,16) : '';
    const endVal   = a.endISO   ? new Date(a.endISO).toISOString().slice(0,16)   : '';
    card.innerHTML = `
      <label class="inline-edit-label">عنوان النشاط</label>
      <input type="text" class="inline-edit act-title" value="${escapeHTML(a.title||'')}"/>
      <label class="inline-edit-label">الوصف</label>
      <textarea class="inline-edit act-desc" rows="2">${escapeHTML(a.desc||'')}</textarea>
      <div class="row" style="gap:8px">
        <div class="field" style="margin:0"><label class="inline-edit-label">البداية</label>
          <input type="datetime-local" class="inline-edit act-start" value="${startVal}"/></div>
        <div class="field" style="margin:0"><label class="inline-edit-label">النهاية (اختياري)</label>
          <input type="datetime-local" class="inline-edit act-end" value="${endVal}"/></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-sm btn-primary" data-act="save" data-testid="act-save">حفظ التعديلات</button>
        <button class="btn btn-sm btn-danger" data-act="del" data-testid="act-del">حذف النشاط</button>
      </div>`;
    card.querySelector('[data-act="save"]').onclick = ()=>{
      a.title = card.querySelector('.act-title').value.trim();
      a.desc  = card.querySelector('.act-desc').value.trim();
      const s = card.querySelector('.act-start').value;
      const e = card.querySelector('.act-end').value;
      if(s) a.startISO = new Date(s).toISOString();
      a.endISO = e ? new Date(e).toISOString() : '';
      saveStore(DATA); renderActAdmin(); toast('تم الحفظ');
    };
    card.querySelector('[data-act="del"]').onclick = ()=>{
      if(!confirm('هل تريد حذف هذا النشاط نهائيا؟')) return;
      DATA.activities = DATA.activities.filter(x=>x.id!==a.id);
      saveStore(DATA); renderActAdmin(); toast('تم حذف النشاط');
    };
    list.appendChild(card);
  });
  document.getElementById('actAdd').onclick = ()=>{
    const title = document.getElementById('actTitle').value.trim();
    const desc  = document.getElementById('actDesc').value.trim();
    const start = document.getElementById('actStart').value;
    const end   = document.getElementById('actEnd').value;
    if(!title || !start){ toast('املأ العنوان وتاريخ البداية'); return; }
    DATA.activities.push({id:uid(), title, desc, startISO:new Date(start).toISOString(), endISO:end?new Date(end).toISOString():''});
    saveStore(DATA);
    ['actTitle','actDesc','actStart','actEnd'].forEach(id=>document.getElementById(id).value='');
    renderActAdmin(); toast('تمت إضافة النشاط');
  };
}

/* ---- Halaqat ---- */
function renderHalaqatAdmin(){
  const list = document.getElementById('halaqaList');
  list.innerHTML = `<div class="table-wrap"><table class="tbl">
    <thead><tr><th>الحلقة</th><th>المرحلة</th><th>عدد الطلاب</th><th></th></tr></thead><tbody>
    ${DATA.halaqat.map(h=>`<tr><td>${escapeHTML(h.name)}</td><td>${escapeHTML(h.level)}</td>
      <td>${DATA.students.filter(s=>s.halaqaId===h.id).length}</td>
      <td>
        <button class="btn btn-sm btn-ghost" data-act="edit" data-id="${h.id}">تعديل</button>
        <button class="btn btn-sm btn-danger" data-act="del" data-id="${h.id}">حذف</button>
      </td></tr>`).join('')}
    ${!DATA.halaqat.length?'<tr><td colspan="4" style="text-align:center;color:var(--muted)">لا توجد حلقات بعد.</td></tr>':''}
    </tbody></table></div>`;
  list.querySelectorAll('button[data-act="del"]').forEach(b=>{
    b.onclick = ()=>{
      if(!confirm('سيتم حذف الحلقة وكل طلابها. متأكد؟')) return;
      DATA.halaqat = DATA.halaqat.filter(x=>x.id!==b.dataset.id);
      DATA.students = DATA.students.filter(s=>s.halaqaId!==b.dataset.id);
      saveStore(DATA); renderHalaqatAdmin(); renderStudentsAdmin(); toast('تم الحذف');
    };
  });
  list.querySelectorAll('button[data-act="edit"]').forEach(b=>{
    b.onclick = ()=>{
      const h = DATA.halaqat.find(x=>x.id===b.dataset.id); if(!h) return;
      const n = prompt('اسم الحلقة:', h.name); if(n===null||!n.trim()) return;
      const lv = prompt('المرحلة (ابتدائي/متوسط/ثانوي):', h.level); if(lv===null) return;
      h.name = n.trim(); if(['ابتدائي','متوسط','ثانوي'].includes(lv.trim())) h.level = lv.trim();
      saveStore(DATA); renderHalaqatAdmin(); renderStudentsAdmin(); toast('تم');
    };
  });
  document.getElementById('halaqaAdd').onclick = ()=>{
    const name = document.getElementById('halaqaName').value.trim();
    const level = document.getElementById('halaqaLevel').value;
    if(!name){ toast('أدخل اسم الحلقة'); return; }
    DATA.halaqat.push({id:uid(), name, level});
    saveStore(DATA);
    document.getElementById('halaqaName').value='';
    renderHalaqatAdmin(); renderStudentsAdmin(); toast('تمت إضافة الحلقة');
  };
}

/* ---- Students ---- */
function renderStudentsAdmin(){
  const sel = document.getElementById('stuHalaqa');
  sel.innerHTML = DATA.halaqat.length
    ? '<option value="">— اختر الحلقة —</option>' + DATA.halaqat.map(h=>`<option value="${h.id}">${escapeHTML(h.name)} — ${escapeHTML(h.level)}</option>`).join('')
    : '<option value="">— أضف حلقة أولا من تبويب الحلقات —</option>';

  const list = document.getElementById('stuList');
  list.innerHTML = `<div class="table-wrap"><table class="tbl">
    <thead><tr><th>الرقم</th><th>الاسم</th><th>الحلقة</th><th>المرحلة</th><th></th></tr></thead><tbody>
    ${DATA.students.map(s=>{
      const h = DATA.halaqat.find(x=>x.id===s.halaqaId);
      return `<tr><td>${escapeHTML(s.serial)}</td><td>${escapeHTML(s.name)}</td><td>${escapeHTML(h?.name||'-')}</td><td>${escapeHTML(s.level)}</td>
        <td>
          <button class="btn btn-sm btn-ghost" data-act="edit" data-id="${s.id}">تعديل</button>
          <button class="btn btn-sm btn-danger" data-act="del" data-id="${s.id}">حذف</button>
        </td></tr>`;
    }).join('')}
    ${!DATA.students.length?'<tr><td colspan="5" style="text-align:center;color:var(--muted)">لا يوجد طلاب بعد.</td></tr>':''}
    </tbody></table></div>`;
  list.querySelectorAll('button[data-act="del"]').forEach(b=>{
    b.onclick = ()=>{
      if(!confirm('حذف الطالب؟')) return;
      DATA.students = DATA.students.filter(x=>x.id!==b.dataset.id);
      saveStore(DATA); renderStudentsAdmin(); toast('تم الحذف');
    };
  });
  list.querySelectorAll('button[data-act="edit"]').forEach(b=>{
    b.onclick = ()=>{
      const s = DATA.students.find(x=>x.id===b.dataset.id); if(!s) return;
      const n = prompt('اسم الطالب:', s.name); if(n===null||!n.trim()) return;
      const sr = prompt('الرقم التسلسلي:', s.serial); if(sr===null||!sr.trim()) return;
      const lv = prompt('المرحلة (ابتدائي/متوسط/ثانوي):', s.level); if(lv===null) return;
      s.name = n.trim(); s.serial = sr.trim();
      if(['ابتدائي','متوسط','ثانوي'].includes(lv.trim())) s.level = lv.trim();
      saveStore(DATA); renderStudentsAdmin(); toast('تم');
    };
  });
  document.getElementById('stuAdd').onclick = ()=>{
    const name = document.getElementById('stuName').value.trim();
    const serial = document.getElementById('stuSerial').value.trim();
    const halaqaId = document.getElementById('stuHalaqa').value;
    const level = document.getElementById('stuLevel').value;
    if(!DATA.halaqat.length){ toast('أضف حلقة أولا من تبويب الحلقات'); return; }
    if(!name){ toast('أدخل اسم الطالب'); return; }
    if(!serial){ toast('أدخل الرقم التسلسلي'); return; }
    if(!halaqaId){ toast('اختر الحلقة'); return; }
    if(DATA.students.some(s=>s.serial===serial)){ toast('الرقم التسلسلي مستخدم بالفعل'); return; }
    DATA.students.push({id:uid(), name, serial, halaqaId, level});
    saveStore(DATA);
    document.getElementById('stuName').value='';
    document.getElementById('stuSerial').value='';
    renderStudentsAdmin(); toast('تمت إضافة الطالب');
  };
}

/* ---- Texts ---- */
function renderTextsAdmin(){
  const wrap = document.getElementById('textsForm'); wrap.innerHTML='';
  Object.keys(DATA.texts).forEach(k=>{
    const f = document.createElement('div'); f.className='field';
    const isLong = (DATA.texts[k]||'').length>80;
    f.innerHTML = `<label>${k}</label>${isLong
      ?`<textarea data-key="${k}" rows="3">${escapeHTML(DATA.texts[k])}</textarea>`
      :`<input type="text" data-key="${k}" value="${escapeHTML(DATA.texts[k])}"/>`}`;
    wrap.appendChild(f);
  });
  document.getElementById('textsSave').onclick = ()=>{
    wrap.querySelectorAll('[data-key]').forEach(el=>{ DATA.texts[el.dataset.key] = el.value; });
    saveStore(DATA); applyTexts(); toast('تم حفظ النصوص');
  };
}

/* ---- Data export/import ---- */
function bindData(){
  document.getElementById('exportBtn').onclick = ()=>{
    const blob = new Blob([JSON.stringify(DATA, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'site.json'; a.click();
  };
  document.getElementById('importFile').onchange = async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{
      const txt = await f.text(); const obj = JSON.parse(txt);
      DATA = Object.assign(structuredClone(DEFAULT_DATA), obj);
      saveStore(DATA); toast('تم الاستيراد'); location.reload();
    }catch(err){ toast('ملف غير صالح'); }
  };
  document.getElementById('resetBtn').onclick = async ()=>{
    if(!confirm('سيتم مسح كل التعديلات والوسائط. متأكد؟')) return;
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem('alfwzan_admin_device');
    localStorage.removeItem(PENDING_KEY);
    try{ indexedDB.deleteDatabase(IDB_NAME) }catch(e){}
    location.reload();
  };
}

/* ---- Publish to GitHub ---- */
function bindPublish(){
  const cfg = getGh() || {};
  document.getElementById('ghUser').value = cfg.user || '';
  document.getElementById('ghRepo').value = cfg.repo || '';
  document.getElementById('ghBranch').value = cfg.branch || 'main';
  document.getElementById('ghPat').value = cfg.pat || '';

  // open / close modal
  document.querySelectorAll('[data-open="ghSettings"]').forEach(b=> b.onclick = ()=> document.getElementById('ghModal').classList.add('open'));
  document.getElementById('ghClose').onclick = ()=> document.getElementById('ghModal').classList.remove('open');
  document.getElementById('ghClear').onclick = ()=>{
    ['ghUser','ghRepo','ghBranch','ghPat'].forEach(id=>document.getElementById(id).value = id==='ghBranch'?'main':'');
    clearGh(); toast('تم المسح');
  };
  document.getElementById('ghSave').onclick = ()=>{
    const c = {
      user: document.getElementById('ghUser').value.trim(),
      repo: document.getElementById('ghRepo').value.trim(),
      branch: document.getElementById('ghBranch').value.trim() || 'main',
      pat: document.getElementById('ghPat').value.trim()
    };
    if(!c.user || !c.repo || !c.pat){ toast('أكمل البيانات'); return; }
    setGh(c); toast('تم حفظ الإعدادات');
    document.getElementById('ghModal').classList.remove('open');
  };

  document.getElementById('publishBtn').onclick = async ()=>{
    const c = getGh();
    if(!c || !c.user || !c.repo || !c.pat){
      toast('افتح إعدادات النشر أولا');
      document.getElementById('ghModal').classList.add('open');
      return;
    }
    showOverlay('بدء النشر...');
    try{
      await publishToGitHub(msg=>{ document.getElementById('busyMsg').textContent = msg; });
      hideOverlay();
      toast('تم النشر بنجاح ✔');
      renderAboutAdmin(); renderAchAdmin();
    }catch(e){
      hideOverlay();
      alert('فشل النشر:\n'+e.message+'\n\nتأكد من اسم المستخدم والمستودع وصلاحيات التوكن (Contents: Read & Write).');
    }
  };

  document.getElementById('pullBtn').onclick = async ()=>{
    showOverlay('جلب آخر بيانات منشورة...');
    try{
      const r = await fetch('data/site.json?ts='+Date.now(),{cache:'no-store'});
      if(!r.ok) throw new Error('لا يوجد site.json منشور');
      const obj = await r.json();
      DATA = Object.assign(structuredClone(DEFAULT_DATA), obj);
      saveStore(DATA);
      hideOverlay(); toast('تم الجلب'); location.reload();
    }catch(e){ hideOverlay(); alert('فشل: '+e.message); }
  };
}
