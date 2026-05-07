document.addEventListener('DOMContentLoaded', async ()=>{
  await initCommon('act');
  // i18n labels for the section headings
  document.getElementById('curHead').textContent = t('sec_current');
  document.getElementById('upHead').textContent  = t('sec_upcoming');
  renderActivities();
  setInterval(updateCountdowns, 1000);
});

function renderActivities(){
  const cur = document.getElementById('currentGrid');
  const up  = document.getElementById('upcomingGrid');
  cur.innerHTML=''; up.innerHTML='';
  const now = Date.now();
  let cCount=0, uCount=0;
  DATA.activities.forEach(a=>{
    const start = a.startISO ? new Date(a.startISO).getTime() : 0;
    const end   = a.endISO   ? new Date(a.endISO).getTime()   : 0;
    const isCurrent = (start<=now && (!end || end>=now));
    const isUpcoming = start>now;
    if(!isCurrent && !isUpcoming) return;
    const card = document.createElement('div');
    card.className = 'activity-card ' + (isCurrent?'current':'upcoming');
    card.setAttribute('data-testid', isCurrent?'activity-current':'activity-upcoming');
    card.innerHTML = `
      <span class="activity-tag">${isCurrent?t('tag_now'):t('tag_upcoming')}</span>
      <h3>${escapeHTML(a.title||'')}</h3>
      <p>${escapeHTML(a.desc||'')}</p>
      <div class="activity-meta">${t('starts_at')}: ${fmtDateTime(a.startISO)}${a.endISO?(' — '+t('ends_at')+': '+fmtDateTime(a.endISO)):''}</div>
      ${isUpcoming?`<div class="countdown" data-target="${a.startISO}" data-testid="countdown">
        <div><b class="d">0</b><span>${t('cd_day')}</span></div>
        <div><b class="h">0</b><span>${t('cd_hour')}</span></div>
        <div><b class="m">0</b><span>${t('cd_min')}</span></div>
        <div><b class="s">0</b><span>${t('cd_sec')}</span></div>
      </div>`:''}`;
    if(isCurrent){ cur.appendChild(card); cCount++ } else { up.appendChild(card); uCount++ }
  });
  if(!cCount) cur.innerHTML=`<div class="empty">${t('no_current')}</div>`;
  if(!uCount) up.innerHTML=`<div class="empty">${t('no_upcoming')}</div>`;
}

function updateCountdowns(){
  document.querySelectorAll('.countdown').forEach(c=>{
    const target = new Date(c.dataset.target).getTime();
    let diff = target - Date.now(); if(diff<0) diff=0;
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    c.querySelector('.d').textContent = d;
    c.querySelector('.h').textContent = h;
    c.querySelector('.m').textContent = m;
    c.querySelector('.s').textContent = s;
  });
}
