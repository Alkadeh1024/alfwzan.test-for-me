document.addEventListener('DOMContentLoaded', async ()=>{
  await initCommon('ach');
  renderAchievements();
});

async function renderAchievements(){
  const grid = document.getElementById('achGrid');
  if(!DATA.achievements.length){
    grid.innerHTML = '<div class="empty" data-testid="ach-empty">لم تُضف إنجازات بعد. يستطيع المشرف إضافتها من لوحة التحكم.</div>';
    return;
  }
  grid.innerHTML='';
  for(const item of DATA.achievements){
    const url = await mediaUrl(item);
    const card = document.createElement('div');
    card.className='achievement-card';
    card.setAttribute('data-testid','ach-card');
    const media = document.createElement('div'); media.className='media';
    if(!url){
      media.innerHTML = '<div class="empty" style="margin:0">ملف غير متوفر</div>';
    } else if(item.type==='video'){
      const v=document.createElement('video'); v.src=url; v.controls=true; v.preload='metadata';
      media.appendChild(v);
      media.appendChild(buildExpandBtn(item, url));
    } else {
      const img=document.createElement('img'); img.src=url; img.alt=item.title||'';
      media.style.cursor='zoom-in';
      media.addEventListener('click', ()=> openMediaLightbox('image', url, item.title));
      media.appendChild(img);
      media.appendChild(buildExpandBtn(item, url));
    }
    const body = document.createElement('div'); body.className='body';
    body.innerHTML = `<h3>${escapeHTML(item.title||'')}</h3><p>${escapeHTML(item.desc||'')}</p>`;
    card.appendChild(media); card.appendChild(body);
    grid.appendChild(card);
  }
}
