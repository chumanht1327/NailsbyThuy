/* ── YEARS (dynamic, from 2011) ──────────────────────────────────── */
(function(){
  const y = new Date().getFullYear() - 2011;
  ['yearsNum','yearsStat'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent=y+'+';
  });
  const il=document.getElementById('yearsInline'); if(il) il.textContent=y;
  /* Fix 7: dynamic copyright year */
  const cy=document.getElementById('copyrightYear'); if(cy) cy.textContent=new Date().getFullYear();
})();

/* ── TICKER (JS-generated, single source of truth) ───────────────── */
(function(){
  const items=['Freehand Nail Art','Acrylic Sets','Gel X Extensions','Builder Gel · BIAB','Dipping Powder','3D Nail Art','By Appointment Only'];
  const html=items.map(t=>`<span class="ticker-item">${t}<span class="ticker-dot"> ✦ </span></span>`).join('');
  const el=document.getElementById('tickerInner');
  if(el) el.innerHTML=html+html; /* duplicate for seamless loop */
})();

/* ── CURSOR (desktop hover devices only — no CPU waste on touch) ──── */
const cur=document.getElementById('cur'), curR=document.getElementById('cur-r');
if(window.matchMedia('(hover:hover)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){
  document.body.classList.add('cursor-ready');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
  (function loop(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(loop)})();
  document.querySelectorAll('a,button,.svc-card,.showcase-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2.2)';curR.style.opacity='.2'});
    el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';curR.style.opacity='.5'});
  });
}

/* ── NAV SCROLL ──────────────────────────────────────────────────── */
(function(){
  var ticking=false, nav=document.getElementById('nav');
  window.addEventListener('scroll',function(){
    if(!ticking){
      requestAnimationFrame(function(){
        nav.classList.toggle('scrolled',window.scrollY>40);
        ticking=false;
      });
      ticking=true;
    }
  },{passive:true});
})();

/* ── HAMBURGER MENU ──────────────────────────────────────────────── */
(function(){
  const btn=document.getElementById('navHamburger');
  const drawer=document.getElementById('navDrawer');
  function toggleMenu(open){
    btn.classList.toggle('open',open);
    drawer.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',open);
    drawer.setAttribute('aria-hidden',!open);
    document.body.style.overflow=open?'hidden':'';
  }
  btn.addEventListener('click',()=>toggleMenu(!drawer.classList.contains('open')));
  drawer.querySelectorAll('.drawer-link').forEach(a=>{
    a.addEventListener('click',()=>toggleMenu(false));
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
})();

/* ── REVEAL ──────────────────────────────────────────────────────── */
const revIO=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),i*70);revIO.unobserve(e.target)}});
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>revIO.observe(el));

/* ── STAGGER service cards ───────────────────────────────────────── */
(function(){
  /* Use CSS custom property for stagger delay — avoids style.cssText forced recalc */
  const cards=document.querySelectorAll('.svc-card,.svc-hero');
  cards.forEach((c,i)=>{
    c.style.setProperty('--stagger', i*.08+'s');
    c.classList.add('stagger-hidden');
  });
  const sg=document.querySelector('.services-grid');
  if(sg) new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)cards.forEach(c=>c.classList.replace('stagger-hidden','stagger-show'))})},{threshold:.05}).observe(sg);
})();

/* ── STAGGER steps ───────────────────────────────────────────────── */
document.querySelectorAll('.steps').forEach(p=>{
  Array.from(p.children).forEach((c,i)=>{
    c.style.setProperty('--stagger', i*.09+'s');
    c.classList.add('stagger-hidden');
  });
  new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)Array.from(p.children).forEach(c=>c.classList.replace('stagger-hidden','stagger-show'))})},{threshold:.1}).observe(p);
});

/* ── FAQ ACCORDION ───────────────────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(function(item){
  var btn=item.querySelector('.faq-q');
  var ans=item.querySelector('.faq-a');
  if(!btn||!ans)return;
  btn.addEventListener('click',function(){
    var isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i){
      i.classList.remove('open');
      var q=i.querySelector('.faq-q');
      if(q) q.setAttribute('aria-expanded','false');
    });
    if(!isOpen){
      item.classList.add('open');
      btn.setAttribute('aria-expanded','true');
    }
  });
});

/* ── SHOWCASE CAROUSEL + MASONRY ─────────────────────────────────── */
const SHOWCASE_IMAGES=[
  {slug:'chrome-nails-austin-01',url:'/images/chrome-nails-austin-01-900.webp',thumb:'/images/chrome-nails-austin-01-400.webp',avif:'/nailsbythuy-showcase-seo/chrome-nails-austin-01.avif',title:'Chrome Nails — Mirror Finish',desc:'Pink chrome almond nails with mirror finish and rhinestone accents',alt:'Pink chrome almond nails with mirror chrome finish — luxury nail art in Austin TX by Nails by Thuy',category:'Chrome Nails',pos:'center 48%'},
  {slug:'chrome-nails-austin-02',url:'/images/chrome-nails-austin-02-900.webp',thumb:'/images/chrome-nails-austin-02-400.webp',avif:'/nailsbythuy-showcase-seo/chrome-nails-austin-02.avif',title:'Chrome Nails — Cat Eye',desc:'Cat eye chrome nails with reflective metallic shimmer and lustrous finish',alt:'Cat eye chrome nails with reflective metallic shimmer — luxury nail studio Austin TX by Nails by Thuy',category:'Chrome Nails',pos:'center 42%'},
  {slug:'gel-x-extensions-austin-01',url:'/images/gel-x-extensions-austin-01-900.webp',thumb:'/images/gel-x-extensions-austin-01-400.webp',avif:'/nailsbythuy-showcase-seo/gel-x-extensions-austin-01.avif',title:'Gel X Extensions — Sculpted',desc:'Sculpted Gel X soft gel extensions with French tip and lasting wear',alt:'Sculpted Gel X soft gel nail extensions with French tip free edge — nail studio Austin TX Nails by Thuy',category:'Gel X Extensions',pos:'center 32%'},
  {slug:'gel-x-extensions-austin-02',url:'/images/gel-x-extensions-austin-02-900.webp',thumb:'/images/gel-x-extensions-austin-02-400.webp',avif:'/nailsbythuy-showcase-seo/gel-x-extensions-austin-02.avif',title:'Gel X Extensions — Glossy',desc:'Gel X nail extensions in elegant square shape with mirror-glossy topcoat',alt:'Gel X nail extensions elegant square shape with glossy topcoat — Nails by Thuy Austin TX',category:'Gel X Extensions',pos:'center 40%'},
  {slug:'french-tip-nails-austin-01',url:'/images/french-tip-nails-austin-01-900.webp',thumb:'/images/french-tip-nails-austin-01-400.webp',avif:'/nailsbythuy-showcase-seo/french-tip-nails-austin-01.avif',title:'French Tip Nails — Classic',desc:'Classic French tip manicure with clean white free edge and sheer pink base',alt:'Classic French tip manicure with clean white free edge — nail art Austin TX by Nails by Thuy',category:'French Tip',pos:'center 52%'},
  {slug:'french-tip-nails-austin-02',url:'/images/french-tip-nails-austin-02-900.webp',thumb:'/images/french-tip-nails-austin-02-400.webp',avif:'/nailsbythuy-showcase-seo/french-tip-nails-austin-02.avif',title:'French Tip Nails — Modern',desc:'Modern French tip nail design with elevated color details and almond shape',alt:'Modern French tip nail design almond shape with elevated detail — nail artist Austin TX Nails by Thuy',category:'French Tip',pos:'center 35%'},
  {slug:'builder-gel-austin-01',url:'/images/builder-gel-austin-01-900.webp',thumb:'/images/builder-gel-austin-01-400.webp',avif:'/nailsbythuy-showcase-seo/builder-gel-austin-01.avif',title:'Builder Gel BIAB — Natural',desc:'Builder gel BIAB manicure with reinforced apex and natural nude finish',alt:'Builder gel BIAB nail manicure with reinforced apex and natural nude finish — Austin TX Nails by Thuy',category:'Builder Gel',pos:'center 45%'},
  {slug:'builder-gel-austin-02',url:'/images/builder-gel-austin-02-900.webp',thumb:'/images/builder-gel-austin-02-400.webp',avif:'/nailsbythuy-showcase-seo/builder-gel-austin-02.avif',title:'Builder Gel — Glossy Finish',desc:'Mirror-glossy builder gel nails with strengthened natural nail base',alt:'Mirror-glossy builder gel nails strengthened natural nail base — Nails by Thuy Austin TX',category:'Builder Gel',pos:'center 30%'},
  {slug:'pedicure-nails-austin-01',url:'/images/pedicure-nails-austin-01-900.webp',thumb:'/images/pedicure-nails-austin-01-400.webp',avif:'/nailsbythuy-showcase-seo/pedicure-nails-austin-01.avif',title:'Luxury Pedicure — Gel',desc:'Luxury gel pedicure with immaculate color and flawless finish',alt:'Luxury gel pedicure with immaculate color and flawless finish — nail salon Austin TX Nails by Thuy',category:'Pedicure',pos:'center 45%'},
  {slug:'pedicure-nails-austin-02',url:'/images/pedicure-nails-austin-02-900.webp',thumb:'/images/pedicure-nails-austin-02-400.webp',avif:'/nailsbythuy-showcase-seo/pedicure-nails-austin-02.avif',title:'Pedicure — Nail Art Detail',desc:'Pedicure with custom freehand nail art detail and premium gel finish',alt:'Pedicure with custom freehand nail art detail and premium gel finish — luxury nail studio Austin TX',category:'Pedicure',pos:'center 35%'},
  {slug:'seasonal-nail-art-austin-01',url:'/images/seasonal-nail-art-austin-01-900.webp',thumb:'/images/seasonal-nail-art-austin-01-400.webp',avif:'/nailsbythuy-showcase-seo/seasonal-nail-art-austin-01.avif',title:'Seasonal Nail Art — Editorial',desc:'Editorial seasonal nail art with hand-painted freehand details and premium finish',alt:'Editorial seasonal nail art hand-painted freehand details — nail artist Austin TX Nails by Thuy',category:'Seasonal Art',pos:'center 28%'},
  {slug:'seasonal-nail-art-austin-02',url:'/images/seasonal-nail-art-austin-02-900.webp',thumb:'/images/seasonal-nail-art-austin-02-400.webp',avif:'/nailsbythuy-showcase-seo/seasonal-nail-art-austin-02.avif',title:'Seasonal Nail Art — Bespoke',desc:'Bespoke seasonal nail art with layered techniques and custom color palette',alt:'Bespoke seasonal nail art layered techniques custom color palette — Austin TX nail art Nails by Thuy',category:'Seasonal Art',pos:'center 38%'},
];

/* ── Lazy-load showcase images as they scroll into view ──────────── */
function lazyLoadShowcase(){
  const imgs=showcaseTrack.querySelectorAll('img[data-src]');
  if(!imgs.length)return;
  const io=new IntersectionObserver((entries,obs)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const img=e.target;
        obs.unobserve(img);
        if(!img.dataset.src)return;  /* goTo() already loaded this image */
        const pic=img.parentElement;
        if(pic&&pic.tagName==='PICTURE'){
          const src=pic.querySelector('source[data-srcset]');
          if(src){src.srcset=src.dataset.srcset;src.removeAttribute('data-srcset');}
        }
        img.loading='eager';
        img.src=img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  },{rootMargin:'400px'});
  imgs.forEach(img=>io.observe(img));
}
const showcaseTrack=document.getElementById('showcaseTrack');
const showcaseDots=document.getElementById('showcaseDots');
let showcaseIdx=0, autoPlay=true, scTimer=null, scTouchX=0;

/* ── Carousel state ────────────────────────────────────────────────
   Cards are built ONCE in initShowcase().
   goTo() only swaps .active class + updates marginLeft — no innerHTML.
   INP is now < 16ms (one rAF) instead of 200ms+ (full DOM rebuild).
──────────────────────────────────────────────────────────────────── */
let _cw=0, _gap=0, _shellW=0;

function positionNavButtons(){
  /* _cw, _gap, _shellW already measured by _measureLayout() — no repeat reads needed */
  const shell   = document.getElementById('carouselView');
  const stage   = shell ? shell.querySelector('.showcase-stage') : null;
  const prevBtn = shell ? shell.querySelector('.showcase-prev')  : null;
  const nextBtn = shell ? shell.querySelector('.showcase-next')  : null;
  if(!shell||!stage||!prevBtn||!nextBtn||!_cw) return;

  /* Only 2 layout reads needed — cardH and stageTop (not cached by _measureLayout) */
  const card     = showcaseTrack.querySelector('.showcase-card.active')
                || showcaseTrack.querySelector('.showcase-card');
  const cardH    = card ? card.offsetHeight : 0;
  const stageTop = stage.offsetTop;

  const cardW    = _cw - _gap;
  const cardLeft = (_shellW - cardW) / 2;
  const cardMidY = stageTop + cardH / 2;

  prevBtn.style.left = cardLeft         + 'px';
  prevBtn.style.top  = cardMidY         + 'px';
  nextBtn.style.left = (cardLeft + cardW) + 'px';
  nextBtn.style.top  = cardMidY         + 'px';
}

function _measureLayout(){
  const card  = showcaseTrack.querySelector('.showcase-card');
  const stage = showcaseTrack.parentElement;
  if(!card||!stage) return false;
  _gap    = parseFloat(getComputedStyle(showcaseTrack).gap)||20;
  _cw     = card.offsetWidth + _gap;
  _shellW = stage.parentElement.offsetWidth;
  return _cw > _gap;
}

function cacheLayout(){  _measureLayout(); }

function applyPosition(){
  if(!_cw) return;
  showcaseTrack.style.transform = 'translateX(' + (_shellW/2 - _cw/2 - showcaseIdx*_cw) + 'px)';
}

function initShowcase(){
  const total=SHOWCASE_IMAGES.length;
  const pad=n=>String(n).padStart(2,'0');
  showcaseTrack.innerHTML=SHOWCASE_IMAGES.map((p,i)=>{
    const pos=p.pos?` style="object-position:${p.pos}"`:''
    const imgEl= i===0
      ? `<picture><source type="image/avif" srcset="${p.avif}" media="(min-width:769px)"><img src="${p.thumb}" alt="${p.alt}" loading="eager" fetchpriority="high" decoding="sync"${pos}></picture>`
      : `<picture><source type="image/avif" data-srcset="${p.avif}" media="(min-width:769px)"><img data-src="${p.thumb}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt="${p.alt}" loading="eager" decoding="async"${pos}></picture>`;
    return `<div class="showcase-card${i===0?' active':''}" data-idx="${i}">
      ${imgEl}
      <div class="showcase-overlay"></div>
      <div class="showcase-count">${pad(i+1)} <span style="font-size:1rem;opacity:.4">/ ${pad(total)}</span></div>
      <div class="showcase-content"><button class="showcase-btn" aria-label="View full photo of ${p.title}" data-idx="${i}"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:7px;opacity:.85"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="9" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>View</button></div>
    </div>`;
  }).join('');

  showcaseDots.innerHTML=SHOWCASE_IMAGES.map((_,i)=>
    `<button class="showcase-dot${i===0?' active':''}" aria-label="Go to slide ${i+1}" data-dot="${i}"></button>`
  ).join('');

  lazyLoadShowcase();

  /* Hide until positioned — prevents flash of unpositioned cards */
  showcaseTrack.style.visibility='hidden';

  /* Measure + position after browser paints — guarantees real offsetWidth */
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      if(_measureLayout()){
        positionNavButtons();
        showcaseTrack.style.transition='none'; /* snap to position, no slide-in */
        applyPosition();
      }
      showcaseTrack.style.visibility='';       /* always reveal even if measure failed */
      requestAnimationFrame(function(){
        showcaseTrack.style.transition='';     /* re-enable for user interactions */
      });
    });
  });
}

function goTo(n){
  const prev = showcaseIdx;
  showcaseIdx = (n+SHOWCASE_IMAGES.length)%SHOWCASE_IMAGES.length;
  if(prev===showcaseIdx) return;

  /* Swap active class — O(1), no DOM rebuild */
  const cards = showcaseTrack.querySelectorAll('.showcase-card');
  const dots  = showcaseDots.querySelectorAll('.showcase-dot');
  cards[prev]?.classList.remove('active');
  cards[showcaseIdx]?.classList.add('active');
  dots[prev]?.classList.remove('active');
  dots[showcaseIdx]?.classList.add('active');

  /* Slide track */
  applyPosition();

  /* Lazy-load the newly visible card and its neighbours */
  [showcaseIdx, showcaseIdx-1, showcaseIdx+1].forEach(j=>{
    const ni=(j+SHOWCASE_IMAGES.length)%SHOWCASE_IMAGES.length;
    const ci=cards[ni];
    const cimg=ci?.querySelector('img[data-src]');
    if(!cimg)return;
    cimg.loading='eager';
    cimg.src=cimg.dataset.src;
    cimg.removeAttribute('data-src');
  });
}
function startAuto(){
  clearInterval(scTimer);
  if(autoPlay) scTimer=setInterval(()=>goTo(showcaseIdx+1),5000);
}

document.getElementById('autoToggle').addEventListener('click',function(){
  autoPlay=!autoPlay;
  this.textContent=autoPlay?'Auto ON':'Auto OFF';
  startAuto();
});
document.querySelector('.showcase-next').addEventListener('click',()=>{goTo(showcaseIdx+1);startAuto()});
document.querySelector('.showcase-prev').addEventListener('click',()=>{goTo(showcaseIdx-1);startAuto()});
showcaseDots.addEventListener('click',e=>{
  const d=e.target.closest('[data-dot]');
  if(d){goTo(parseInt(d.dataset.dot));startAuto();}
});
showcaseTrack.addEventListener('click',e=>{
  const btn=e.target.closest('[data-idx].showcase-btn');
  if(btn){openPopup(parseInt(btn.dataset.idx));return;}
  const card=e.target.closest('.showcase-card');
  if(card&&parseInt(card.dataset.idx)!==showcaseIdx){goTo(parseInt(card.dataset.idx));startAuto();}
});
/* Swipe on the whole shell — larger hit area */
(function(){
  var shell=document.getElementById('carouselView');
  var tx=0,ty=0;
  shell.addEventListener('touchstart',function(e){
    tx=e.touches[0].clientX;
    ty=e.touches[0].clientY;
  },{passive:true});
  shell.addEventListener('touchend',function(e){
    var dx=tx-e.changedTouches[0].clientX;
    var dy=ty-e.changedTouches[0].clientY;
    if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>44){
      goTo(dx>0?showcaseIdx+1:showcaseIdx-1);
      startAuto();
    }
  },{passive:true});
})();
var _rsTimer;window.addEventListener('resize',function(){clearTimeout(_rsTimer);_rsTimer=setTimeout(function(){if(_measureLayout()){positionNavButtons();applyPosition();}},150);});
requestAnimationFrame(function(){ initShowcase(); startAuto(); });

/* ── Masonry Grid ────────────────────────────────────────────────── */
(function(){
  const masonry=document.getElementById('masonryView');
  /* Static <picture> HTML already in DOM for SEO — only repopulate if somehow empty */
  if(!masonry.querySelector('.gallery-masonry-item')){
    masonry.innerHTML=SHOWCASE_IMAGES.map((p,i)=>`
      <figure class="gallery-masonry-item" data-idx="${i}" role="button" tabindex="0" aria-label="View ${p.title}">
        <picture>
          <source type="image/avif" srcset="${p.avif}">
          <img src="${p.url}" alt="${p.alt}" loading="lazy" decoding="async">
        </picture>
        <div class="gm-overlay">
          <div class="gm-label">${p.title}</div>
          <div class="gm-cat">${p.category} · Austin TX</div>
        </div>
      </figure>`).join('');
  }
  masonry.addEventListener('click',e=>{
    const item=e.target.closest('[data-idx]');
    if(item) openPopup(parseInt(item.dataset.idx));
  });
  masonry.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      const item=e.target.closest('[data-idx]');
      if(item){e.preventDefault();openPopup(parseInt(item.dataset.idx));}
    }
  });
})();

/* ── View toggle ─────────────────────────────────────────────────── */
(function(){
  const carouselView=document.getElementById('carouselView');
  const masonryView=document.getElementById('masonryView');
  const dotsEl=document.getElementById('showcaseDots');
  const btnC=document.getElementById('viewCarousel');
  const btnG=document.getElementById('viewGrid');
  const autoBtn=document.getElementById('autoToggle');

  btnC.addEventListener('click',()=>{
    carouselView.classList.remove('hidden');
    dotsEl.classList.remove('hidden');
    masonryView.classList.remove('active');
    btnC.classList.add('active');btnG.classList.remove('active');
    autoBtn.style.display='';
    startAuto();
  });
  btnG.addEventListener('click',()=>{
    carouselView.classList.add('hidden');
    dotsEl.classList.add('hidden');
    masonryView.classList.add('active');
    btnG.classList.add('active');btnC.classList.remove('active');
    autoBtn.style.display='none';
    clearInterval(scTimer);
  });
})();

/* ── Lightbox ────────────────────────────────────────────────────── */
let popupIdx=0;
const _popupEl  = document.getElementById('showcasePopup');
const _popupImg = document.getElementById('showcasePopupImg');
const _popupCtr = document.getElementById('popupCounter');

function _setPopupSlide(idx){
  popupIdx = (idx + SHOWCASE_IMAGES.length) % SHOWCASE_IMAGES.length;
  const p = SHOWCASE_IMAGES[popupIdx];

  /* Update caption meta */
  const catEl=document.getElementById('popupCategory');
  const titleEl=document.getElementById('popupTitle');
  const descEl=document.getElementById('popupDesc');
  if(catEl) catEl.textContent=p.category||'';
  if(titleEl) titleEl.textContent=p.title||'';
  if(descEl) descEl.textContent=p.desc||'';

  /* Update dots */
  document.querySelectorAll('.popup-dot-item').forEach(function(d,i){
    d.classList.toggle('active', i===popupIdx);
  });

  /* Preload then scale+fade in */
  _popupImg.style.transition='none';
  _popupImg.style.opacity='0';
  _popupImg.style.transform='scale(.96)';
  const tmp=new Image();
  tmp.onload=function(){
    _popupImg.src=p.url;
    _popupImg.alt=p.alt||p.title+' — Nail Art by Thuy, Austin TX';
    requestAnimationFrame(function(){
      _popupImg.style.transition='opacity .24s ease,transform .24s ease';
      _popupImg.style.opacity='1';
      _popupImg.style.transform='scale(1)';
    });
  };
  tmp.onerror=function(){
    _popupImg.src=p.url;
    _popupImg.alt=p.alt||p.title;
    _popupImg.style.opacity='1';
    _popupImg.style.transform='scale(1)';
  };
  tmp.src=p.url;
  _popupCtr.textContent=(popupIdx+1)+' / '+SHOWCASE_IMAGES.length;
}


/* ── ARIA-HIDDEN BACKGROUND (WCAG 2.1 modal isolation) ─────────────── */
var _ariaHiddenEls = [];
function _setInertBackground(dialogEl) {
  _ariaHiddenEls = [];
  Array.prototype.forEach.call(document.body.children, function(el) {
    if (el !== dialogEl && !el.hasAttribute('aria-hidden')) {
      el.setAttribute('aria-hidden', 'true');
      _ariaHiddenEls.push(el);
    }
  });
}
function _restoreInertBackground() {
  _ariaHiddenEls.forEach(function(el) { el.removeAttribute('aria-hidden'); });
  _ariaHiddenEls = [];
}

let _popupPrevFocus = null;
function openPopup(idx){
  _popupPrevFocus = document.activeElement;
  _setPopupSlide(idx);
  _popupEl.classList.add('open');
  _popupEl.removeAttribute('aria-hidden');
  _setInertBackground(_popupEl);
  document.getElementById('showcasePopupClose').focus();
  document.body.style.overflow = 'hidden';
}

function closePopup(){
  _popupEl.classList.remove('open');
  _popupEl.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  _restoreInertBackground();
  if(_popupPrevFocus) { _popupPrevFocus.focus(); _popupPrevFocus = null; }
}

function popupNav(dir){ _setPopupSlide(popupIdx + dir); }

/* Generate nav dots for popup */
(function(){
  const dotsEl=document.getElementById('popupDots');
  if(!dotsEl)return;
  dotsEl.innerHTML=SHOWCASE_IMAGES.map(function(_,i){
    return '<button class="popup-dot-item'+(i===0?' active':'')+'" aria-label="Go to photo '+(i+1)+'" data-pdot="'+i+'"></button>';
  }).join('');
  dotsEl.addEventListener('click',function(e){
    const btn=e.target.closest('[data-pdot]');
    if(btn) _setPopupSlide(parseInt(btn.dataset.pdot));
  });
})();

/* Buttons */
document.getElementById('showcasePopupClose').addEventListener('click', closePopup);
document.getElementById('popupPrev').addEventListener('click', function(){ popupNav(-1); });
document.getElementById('popupNext').addEventListener('click', function(){ popupNav(1); });

/* Backdrop click to close */
_popupEl.addEventListener('click', function(e){ if(e.target===_popupEl) closePopup(); });

/* Keyboard + focus trap */
document.addEventListener('keydown', function(e){
  if(!_popupEl.classList.contains('open')) return;
  if(e.key==='Escape')    { closePopup(); return; }
  if(e.key==='ArrowLeft') { popupNav(-1); return; }
  if(e.key==='ArrowRight'){ popupNav(1);  return; }
  if(e.key==='Tab'){
    var focusable=Array.prototype.slice.call(
      _popupEl.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])')
    ).filter(function(el){return !el.disabled && el.offsetParent!==null});
    if(!focusable.length){e.preventDefault();return;}
    var first=focusable[0], last=focusable[focusable.length-1];
    if(e.shiftKey){if(document.activeElement===first){e.preventDefault();last.focus();}}
    else{if(document.activeElement===last){e.preventDefault();first.focus();}}
  }
});

/* Touch swipe on popup */
(function(){
  var tx=0, ty=0;
  _popupEl.addEventListener('touchstart', function(e){
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }, {passive:true});
  _popupEl.addEventListener('touchend', function(e){
    var dx = tx - e.changedTouches[0].clientX;
    var dy = ty - e.changedTouches[0].clientY;
    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) popupNav(dx > 0 ? 1 : -1);
  }, {passive:true});
})();


/* ── REVIEWS ─────────────────────────────────────────────────────── */
const FALLBACK_REVIEWS=[
  {stars:5,text:"I had such an amazing experience with Thuy! \ud83d\udc95 From the moment I walked in, the atmosphere was so cozy, welcoming, and relaxing. She was extremely professional, patient, and paid attention to every little detail. I got both my nails and toes done and I am absolutely in love with the results! \u2728 You can truly tell she has years of experience because her work is so clean, precise, and beautiful. My nails came out exactly how I wanted \u2014 honestly even better! She really takes her time to make sure everything looks perfect and that you leave happy. My toes look amazing as well and the whole appointment felt luxurious and comfortable. If you\u2019re in Austin and looking for a nail artist who genuinely cares about her craft and her clients, I highly recommend Nails by Thuy! I will definitely be coming back again and again. \ud83d\udc85 \ud83d\udc95",author:"Brittany Cook",date:"May 2026"},
  {stars:5,text:"I met Thuy back in 2021 when she was in Pflugerville and am so excited she is back in the Austin area!! She is by far the best nail technician in this area - her artistic skills are unmatched, her pricing is extremely fair for her quality and she is genuinely an amazing and kind person. I can\u2019t recommend her enough to anyone who is looking for an incredible nail artist!!",author:"Allison Mehta",date:"May 2026"},
  {stars:5,text:"I have tried sooooo many nail techs in the area and she is by far the BEST. Not only is she priced well but she is absolutely amazing. I came in with a few photos and ideas of what I wanted and she did above and beyond what I was expecting. I will not be going anywhere else and have already booked my next appointment. Seriously you don\u2019t need to go anywhere else!",author:"Jamie Hinojosa",date:"November 2025"},
  {stars:5,text:"Thuy has been my nail tech and friend for nearly 8 years. A true gem of a person. Amazing artist. I have loved every set. Sometimes I come in and get vetoed. Thuy sees my idea and says \u201cno, that\u2019s too basic, you won\u2019t be happy. I got this,\u201d and then knocks out a design that blows me away. Anyone who passes up booking with her is truly missing out and I pity you deeply.",author:"Maggie Kieffer",date:"June 2025"},
  {stars:5,text:"Thuy is amazing! If you\u2019re looking for a nail tech who is extremely talented, takes pride in their work and is friendly, then look no further! She executes every requested design with perfection. I have never been disappointed in her work. She is reasonably priced even though she provides top of the line quality designs.",author:"Ty Bush",date:"July 2025"},
];
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function showReviews(reviews){
  document.getElementById('revTrack').innerHTML=[...reviews,...reviews].map(r=>`
    <div class="review-card" itemscope itemtype="https://schema.org/Review">
      <div class="review-stars">${'★'.repeat(Math.min(5,r.stars||5))}</div>
      <div class="review-text">"${esc(r.text)}"</div>
      <div class="review-author">${esc(r.author)}${r.date?' · '+esc(r.date):''}</div>
    </div>`).join('');
}
// Defer reviews DOM build to after first paint — reviews are below the fold
requestAnimationFrame(function(){
  showReviews(FALLBACK_REVIEWS);
  // After paint, fetch live Google reviews and silently upgrade
  var ctrl=new AbortController();
  var tid=setTimeout(function(){ctrl.abort();},6000);
  fetch('/.netlify/functions/get-reviews',{signal:ctrl.signal})
    .then(function(r){clearTimeout(tid);return r.ok?r.json():null})
    .then(function(data){
      if(!data||!data.reviews||data.reviews.length<2)return;
      var strip=document.getElementById('revStrip');
      strip.style.opacity='0';
      setTimeout(function(){
        showReviews(data.reviews);
        strip.style.opacity='1';
      },350);
    })
    .catch(function(){clearTimeout(tid);});// silent fallback — FALLBACK_REVIEWS stay
});

/* Reviews pause/play (WCAG 2.2.2) */
(function(){
  var btn=document.getElementById('revPauseBtn');
  var track=document.getElementById('revTrack');
  if(!btn||!track) return;
  btn.addEventListener('click',function(){
    var paused=btn.getAttribute('aria-pressed')==='true';
    paused=!paused;
    btn.setAttribute('aria-pressed',String(paused));
    btn.setAttribute('aria-label',paused?'Play reviews carousel':'Pause reviews carousel');
    btn.textContent=paused?'▶':'⏸';
    track.style.animationPlayState=paused?'paused':'running';
  });
})();


/* ── BOOKING MODAL ───────────────────────────────────────────────
   sms: links are NEVER intercepted — they always fire natively.
   Modal is only opened by dedicated #modalTrigger buttons (desktop).
   This guarantees Text to Book and Text Us work on every device.
────────────────────────────────────────────────────────────────── */
(function(){
  var modal   = document.getElementById('desktopModal');
  var dmClose = document.getElementById('dmClose');
  var _prevFocus = null;

  function openModal(){
    if(!modal) return;
    _prevFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    _setInertBackground(modal);
    var first = modal.querySelector('button,[href],input,[tabindex]:not([tabindex="-1"])');
    if(first) first.focus();
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    _restoreInertBackground();
    if(_prevFocus) { _prevFocus.focus(); _prevFocus = null; }
  }

  /* Wire up any element with data-open-modal attribute */
  document.querySelectorAll('[data-open-modal]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      openModal();
    });
  });

  if(dmClose) dmClose.addEventListener('click', closeModal);
  if(modal)   modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(!modal.classList.contains('open')) return;
    if(e.key === 'Escape') { closeModal(); return; }
    if(e.key === 'Tab'){
      var focusable = Array.prototype.slice.call(
        modal.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')
      ).filter(function(el){ return el.offsetParent !== null; });
      if(!focusable.length){ e.preventDefault(); return; }
      var first = focusable[0], last = focusable[focusable.length-1];
      if(e.shiftKey){ if(document.activeElement===first){ e.preventDefault(); last.focus(); } }
      else{ if(document.activeElement===last){ e.preventDefault(); first.focus(); } }
    }
  });
})();


/* ── Collapse / expand toggles ─────────────────────────────────── */
(function(){
  function initToggle(btnId, panelId, openLabel, closeLabel) {
    var btn = document.getElementById(btnId);
    var panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    btn.addEventListener('click', function() {
      var isOpen = panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if(isOpen) panel.removeAttribute('inert'); else panel.setAttribute('inert','');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.classList.toggle('open', isOpen);
      btn.querySelector('.expand-label').textContent = isOpen ? closeLabel : openLabel;
    });
  }
  initToggle('svcToggle',    'svcMore',    'Show all services',   'Show fewer services');
  initToggle('guidesToggle', 'guidesMore', 'Show all 12 guides',  'Show fewer guides');
})();


/* ── FLOATING BOOKING FAB ───────────────────────────────────────── */
(function(){
  var fab=document.getElementById('fabBooking');
  var btn=document.getElementById('fabTrigger');
  var actions=document.getElementById('fabActions');
  if(!fab||!btn) return;
  var isOpen=false,hoverTimer;
  function openFab(){
    isOpen=true;fab.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    actions.removeAttribute('aria-hidden');
    actions.removeAttribute('inert');
    btn.setAttribute('aria-label','Close booking options');
  }
  function closeFab(){
    isOpen=false;fab.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    actions.setAttribute('aria-hidden','true');
    actions.setAttribute('inert','');
    btn.setAttribute('aria-label','Open booking options');
  }
  btn.addEventListener('click',function(e){e.stopPropagation();isOpen?closeFab():openFab()});
  /* Desktop: hover to expand */
  if(window.matchMedia('(hover:hover)').matches){
    fab.addEventListener('mouseenter',function(){clearTimeout(hoverTimer);openFab()});
    fab.addEventListener('mouseleave',function(){hoverTimer=setTimeout(closeFab,320)});
  }
  document.addEventListener('click',function(e){if(isOpen&&!fab.contains(e.target))closeFab()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closeFab()});
})();

/* ── Lazy-load Google Maps iframe when local-area scrolls into view ── */
(function(){
  var mapDiv=document.getElementById('mapEmbed');
  if(!mapDiv)return;
  var io=new IntersectionObserver(function(entries){
    if(!entries[0].isIntersecting)return;
    var iframe=document.createElement('iframe');
    iframe.title='Nails by Thuy — Austin TX nail art studio on Google Maps';
    iframe.src=mapDiv.dataset.src;
    iframe.style.cssText='width:100%;height:100%;border:0;display:block';
    iframe.loading='lazy';
    iframe.allowFullscreen=true;
    iframe.referrerPolicy='no-referrer-when-downgrade';
    iframe.setAttribute('aria-label',mapDiv.getAttribute('aria-label'));
    mapDiv.replaceWith(iframe);
    io.disconnect();
  },{rootMargin:'500px'});
  io.observe(mapDiv);
})();

/* CWV monitoring — runs in idle time, never on critical path */
(typeof requestIdleCallback!=='undefined'?requestIdleCallback:setTimeout)(function(){
  if(typeof PerformanceObserver==='undefined')return;
  var r=function(v){return Math.round(v*10)/10};
  try{new PerformanceObserver(function(l){var e=l.getEntries();e=e[e.length-1];if(e)console.log('[CWV] LCP:'+r(e.startTime)+'ms '+(e.startTime<2000?'✅':'⚠️'))}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){}
  try{var cls=0;new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(!e.hadRecentInput)cls+=e.value});if(cls>0.1)console.warn('[CWV] CLS:'+r(cls)+' ⚠️')}).observe({type:'layout-shift',buffered:true})}catch(e){}
  try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(e.duration>500)console.warn('[CWV] Poor INP:'+r(e.duration)+'ms');else if(e.duration>200)console.info('[CWV] INP:'+r(e.duration)+'ms')})}).observe({type:'event',durationThreshold:200,buffered:true})}catch(e){}
},{timeout:3000});
