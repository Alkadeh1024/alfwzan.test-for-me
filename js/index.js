/* index page */
document.addEventListener('DOMContentLoaded', async ()=>{
  await initCommon('home');
  renderAboutGallery();
});

async function renderAboutGallery(){
  const wrap = document.getElementById('aboutGallery');
  if(!wrap) return;
  if(!DATA.aboutMedia.length){
    wrap.innerHTML = '<div class="empty" data-testid="about-empty">لم تُضف صور أو فيديوهات بعد. يستطيع المشرف إضافتها من لوحة التحكم.</div>';
    return;
  }
  wrap.innerHTML = '';
  for(const m of DATA.aboutMedia){
    const url = await mediaUrl(m);
    if(!url) continue;
    const tile = document.createElement('div');
    tile.className = 'media-tile-wrap';
    tile.setAttribute('data-testid','about-media');
    if(m.type==='image'){
      const img = document.createElement('img');
      img.src = url; img.alt = m.caption||''; img.loading='lazy';
      img.addEventListener('click', ()=> openMediaLightbox('image', url, m.caption));
      tile.appendChild(img);
    } else {
      const v = document.createElement('video');
      v.src = url; v.controls = true; v.preload='metadata';
      tile.appendChild(v);
    }
    tile.appendChild(buildExpandBtn(m, url));
    wrap.appendChild(tile);
  }
}

