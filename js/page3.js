document.addEventListener('DOMContentLoaded', async ()=>{
  await initCommon('stu');
  document.getElementById('searchBtn').addEventListener('click', runSearch);
  ['qSerial','qName','qHalaqa','qLevel'].forEach(id=>{
    document.getElementById(id).addEventListener('keydown', e=>{ if(e.key==='Enter') runSearch(); });
  });
});

function runSearch(){
  const serial = document.getElementById('qSerial').value.trim();
  const name   = document.getElementById('qName').value.trim();
  const halaqa = document.getElementById('qHalaqa').value.trim();
  const level  = document.getElementById('qLevel').value;
  const out = document.getElementById('results');
  const detail = document.getElementById('studentDetail'); detail.innerHTML='';

  let list = DATA.students.slice();
  if(serial) list = list.filter(s => (s.serial||'').toString().includes(serial));
  if(name)   list = list.filter(s => (s.name||'').includes(name));
  if(halaqa){
    const hIds = DATA.halaqat.filter(h=>h.name.includes(halaqa)).map(h=>h.id);
    list = list.filter(s => hIds.includes(s.halaqaId));
  }
  if(level) list = list.filter(s => s.level === level);

  if(!list.length){ out.innerHTML=`<div class="empty">${t('no_results')}</div>`; return; }

  out.innerHTML = `<div class="table-wrap"><table class="tbl" data-testid="results-table">
    <thead><tr><th>${t('th_serial')}</th><th>${t('th_name')}</th><th>${t('th_halaqa')}</th><th>${t('th_level')}</th><th></th></tr></thead>
    <tbody>${list.map(s=>{
      const h = DATA.halaqat.find(x=>x.id===s.halaqaId);
      return `<tr><td>${escapeHTML(s.serial)}</td><td>${escapeHTML(s.name)}</td><td>${escapeHTML(h?.name||'-')}</td><td>${escapeHTML(s.level||'-')}</td>
        <td><button class="btn btn-sm btn-ghost" data-id="${s.id}" data-testid="view-student">${t('view_details')}</button></td></tr>`;
    }).join('')}</tbody></table></div>`;

  out.querySelectorAll('button[data-id]').forEach(b=>{
    b.addEventListener('click', ()=> showStudent(b.dataset.id));
  });
}

function showStudent(id){
  const s = DATA.students.find(x=>x.id===id); if(!s) return;
  const h = DATA.halaqat.find(x=>x.id===s.halaqaId);
  const grades = t('grades');

  // Build last 6 weeks of attendance (Sun-Thu), most recent first
  const weeks = [];
  let anchor = weekStart(new Date());
  for(let w=0; w<6; w++){
    const start = addDays(anchor, -7*w);
    const days = [];
    let hasAny = false;
    for(let i=0;i<5;i++){
      const d = addDays(start, i);
      const ymd = fmtYMD(d);
      const rec = (DATA.attendance[ymd]||{})[id];
      if(rec) hasAny = true;
      days.push({d, ymd, rec});
    }
    if(hasAny || w === 0) weeks.push({start, days});
  }

  const dayNames = t('days');
  let html = `<div class="search-card">
    <h2 style="font-family:'Aref Ruqaa',serif;color:var(--primary);margin:0 0 6px">${escapeHTML(s.name)}</h2>
    <p class="muted" style="margin:0 0 14px">
      ${t('th_serial')}: <b>${escapeHTML(s.serial)}</b> — ${t('th_halaqa')}: <b>${escapeHTML(h?.name||'-')}</b> — ${t('th_level')}: <b>${escapeHTML(s.level||'-')}</b>
    </p>
    <h3 style="font-family:'Aref Ruqaa',serif;color:var(--primary)">${t('student_attendance')}</h3>`;

  weeks.forEach(({start, days})=>{
    const fromS = fmtDateShort(start);
    const toS   = fmtDateShort(addDays(start, 4));
    const range = t('week_range').replace('{from}', fromS).replace('{to}', toS);
    const hasRecord = days.some(x=>x.rec);
    html += `<div class="week-block" data-testid="week-block">
      <div class="week-block-head">${t('week_label')}: ${range}</div>
      ${hasRecord ? `<div class="table-wrap"><table class="tbl">
        <thead><tr>${dayNames.map((dn,i)=>`<th>${dn}<br><small class="muted">${fmtDateShort(days[i].d)}</small></th>`).join('')}</tr></thead>
        <tbody><tr>${days.map(({rec})=>{
          if(!rec) return `<td><span class="muted">${t('not_recorded')}</span></td>`;
          const gIdx = (typeof rec.gradeIdx === 'number') ? rec.gradeIdx
                      : (rec.grade ? I18N.ar.grades.indexOf(rec.grade) : -1);
          const gLabel = gIdx >=0 ? grades[gIdx] : '';
          const status = rec.present
            ? `<span class="att-present-pill">${t('present')}</span>`
            : `<span class="att-absent-pill">${t('absent')}</span>`;
          return `<td>${status}${gLabel?`<br><small class="muted">${escapeHTML(gLabel)}</small>`:''}</td>`;
        }).join('')}</tr></tbody>
      </table></div>` : `<div class="empty" style="margin:0">${t('no_attendance')}</div>`}
    </div>`;
  });

  html += `</div>`;
  document.getElementById('studentDetail').innerHTML = html;
}
