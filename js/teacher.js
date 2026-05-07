/* Teacher dashboard — weekly attendance Sun→Thu */
const GRADES_KEYS = [0,1,2,3,4]; // index into I18N grades

document.addEventListener('DOMContentLoaded', async ()=>{
  await initCommon('home');
  document.body.classList.remove('editing');
  // labels
  document.getElementById('teacherTitle').textContent = t('teacher_title');
  document.getElementById('logoutLabel').textContent = t('logout');
  if(isTeacher() || isAdmin()){ showDash() } else { showLogin() }
  document.getElementById('loginBtn').addEventListener('click', doLogin);
  document.getElementById('pass').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
});
function doLogin(){
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value;
  if(u===TEACHER_USER && p===TEACHER_PASS){ setAuth('teacher'); showDash(); }
  else if(u===ADMIN_USER && p===ADMIN_PASS){ setAuth('admin'); showDash(); }
  else document.getElementById('loginErr').style.display='block';
}
function showLogin(){ document.getElementById('loginView').style.display=''; document.getElementById('dashView').style.display='none'; }

let CURRENT_HALAQA = null;
let CURRENT_WEEK_START = weekStart(new Date()); // Sunday of current week (device date)

function showDash(){
  document.getElementById('loginView').style.display='none';
  document.getElementById('dashView').style.display='';
  document.getElementById('logoutLink').addEventListener('click', e=>{e.preventDefault();logout();});
  document.getElementById('loadHalaqaBtn').addEventListener('click', renderHalaqat);
  document.getElementById('prevWeekBtn').addEventListener('click', ()=>{ CURRENT_WEEK_START = addDays(CURRENT_WEEK_START, -7); renderWeekUI(); });
  document.getElementById('nextWeekBtn').addEventListener('click', ()=>{ CURRENT_WEEK_START = addDays(CURRENT_WEEK_START, 7); renderWeekUI(); });
  document.getElementById('thisWeekBtn').addEventListener('click', ()=>{ CURRENT_WEEK_START = weekStart(new Date()); renderWeekUI(); });
  renderHalaqat();
}

function renderHalaqat(){
  const q = document.getElementById('qHalaqa').value.trim();
  const lvl = document.getElementById('qLevel').value;
  const list = document.getElementById('halaqatList');
  let halaqat = DATA.halaqat.slice();
  if(q) halaqat = halaqat.filter(h=>h.name.includes(q));
  if(lvl) halaqat = halaqat.filter(h=>h.level===lvl);
  if(!halaqat.length){
    list.innerHTML=`<div class="empty">${t('no_results')}</div>`;
    document.getElementById('weekArea').innerHTML='';
    return;
  }
  list.innerHTML = `<div class="gallery-grid">${halaqat.map(h=>`
    <div class="achievement-card halaqa-tile" style="cursor:pointer" data-id="${h.id}" data-testid="halaqa-tile">
      <div class="body" style="padding:18px">
        <h3>${escapeHTML(h.name)}</h3>
        <p>${t('fld_level')}: ${escapeHTML(h.level)} — ${getLang()==='en'?'Students':'الطلاب'}: ${DATA.students.filter(s=>s.halaqaId===h.id).length}</p>
      </div>
    </div>`).join('')}</div>`;
  list.querySelectorAll('[data-id]').forEach(c=>{
    c.addEventListener('click', ()=>{
      CURRENT_HALAQA = c.dataset.id;
      renderWeekUI();
      document.getElementById('weekArea').scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
}

function renderWeekUI(){
  const wrap = document.getElementById('weekArea');
  if(!CURRENT_HALAQA){ wrap.innerHTML=''; return; }
  const halaqa = DATA.halaqat.find(h=>h.id===CURRENT_HALAQA);
  if(!halaqa){ wrap.innerHTML=''; return; }
  const days = [];
  for(let i=0;i<5;i++) days.push(addDays(CURRENT_WEEK_START, i));
  const students = DATA.students.filter(s=>s.halaqaId===CURRENT_HALAQA);
  const fromS = fmtDateShort(days[0]);
  const toS   = fmtDateShort(days[4]);
  const range = t('week_range').replace('{from}', fromS).replace('{to}', toS);
  const grades = t('grades');
  const dayNames = t('days');

  wrap.innerHTML = `
  <div class="search-card">
    <div class="week-bar" data-testid="week-bar">
      <div>
        <h2 style="margin:0;font-family:'Aref Ruqaa',serif;color:var(--primary)">${escapeHTML(halaqa.name)}</h2>
        <p class="muted" style="margin:4px 0 0">${t('fld_level')}: ${escapeHTML(halaqa.level)} — ${t('week_label')}: ${range}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-sm btn-ghost" id="prevWeekBtn2">‹ ${t('prev_week')}</button>
        <button class="btn btn-sm btn-accent" id="thisWeekBtn2">${t('this_week')}</button>
        <button class="btn btn-sm btn-ghost" id="nextWeekBtn2">${t('next_week')} ›</button>
      </div>
    </div>
    <div class="field" style="margin:14px 0 6px;max-width:340px">
      <label>${t('stu_filter')}</label>
      <input type="text" id="stuFilter" placeholder="${t('fld_name')}" data-testid="t-stu-filter"/>
    </div>
    ${students.length ? `<div class="table-wrap">
      <table class="tbl week-tbl" data-testid="t-week-table">
        <thead><tr>
          <th>${t('th_name')}</th>
          ${days.map((d,i)=>`<th>${dayNames[i]}<br><small class="muted">${fmtDateShort(d)}</small></th>`).join('')}
        </tr></thead>
        <tbody id="weekBody"></tbody>
      </table></div>` : `<div class="empty">${getLang()==='en'?'No students in this halaqa.':'لا يوجد طلاب في هذه الحلقة.'}</div>`}
  </div>`;

  document.getElementById('prevWeekBtn2')?.addEventListener('click', ()=>{ CURRENT_WEEK_START = addDays(CURRENT_WEEK_START, -7); renderWeekUI(); });
  document.getElementById('thisWeekBtn2')?.addEventListener('click', ()=>{ CURRENT_WEEK_START = weekStart(new Date()); renderWeekUI(); });
  document.getElementById('nextWeekBtn2')?.addEventListener('click', ()=>{ CURRENT_WEEK_START = addDays(CURRENT_WEEK_START, 7); renderWeekUI(); });

  if(!students.length) return;

  function paint(){
    const f = (document.getElementById('stuFilter').value||'').trim();
    const tbody = document.getElementById('weekBody');
    const rows = students.filter(s=>!f || s.name.includes(f) || (s.serial||'').includes(f));
    tbody.innerHTML = rows.map(s=>{
      return `<tr data-sid="${s.id}">
        <td>
          <strong>${escapeHTML(s.name)}</strong>
          <br><small class="muted">${t('th_serial')}: ${escapeHTML(s.serial||'')}</small>
        </td>
        ${days.map(d=>{
          const ymd = fmtYMD(d);
          const rec = (DATA.attendance[ymd]||{})[s.id] || {present:false, grade:''};
          return `<td class="day-cell" data-ymd="${ymd}">
            <label class="att-row">
              <input type="checkbox" class="att-present" ${rec.present?'checked':''}/>
              <span>${t('present')}</span>
            </label>
            <select class="att-grade">
              <option value="">—</option>
              ${grades.map((g,i)=>`<option value="${i}" ${rec.grade===g||rec.gradeIdx===i?'selected':''}>${g}</option>`).join('')}
            </select>
          </td>`;
        }).join('')}
      </tr>`;
    }).join('') || `<tr><td colspan="${1+days.length}" style="text-align:center;color:var(--muted)">${t('no_results')}</td></tr>`;

    tbody.querySelectorAll('tr[data-sid]').forEach(tr=>{
      const sid = tr.dataset.sid;
      tr.querySelectorAll('.day-cell').forEach(cell=>{
        const ymd = cell.dataset.ymd;
        const cb = cell.querySelector('.att-present');
        const gs = cell.querySelector('.att-grade');
        const persist = ()=>{
          DATA.attendance[ymd] = DATA.attendance[ymd] || {};
          const idx = gs.value === '' ? '' : parseInt(gs.value,10);
          DATA.attendance[ymd][sid] = {
            present: cb.checked,
            gradeIdx: idx === '' ? '' : idx,
            grade: idx === '' ? '' : I18N.ar.grades[idx] // store Arabic canonical
          };
          saveStore(DATA);
          toast(t('saved'));
        };
        cb.addEventListener('change', persist);
        gs.addEventListener('change', persist);
      });
    });
  }
  document.getElementById('stuFilter').addEventListener('input', paint);
  paint();
}
