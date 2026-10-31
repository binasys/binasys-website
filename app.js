(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const running = new Set();
  const settlers = new Set();
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const page = document.body.dataset.page || 'home';
  // Keep earlier draft bookmarks useful after splitting the homepage.
  function redirectLegacyHomeHash() {
    if (page !== 'home') return false;
    const legacy = {'#work':'services.html#work','#help':'services.html','#industries':'industries.html','#about':'about.html#about','#approach':'about.html#approach',
      '#service-sales':'services.html#service-sales','#service-work':'services.html#service-work','#service-clarity':'services.html#service-clarity'}[location.hash];
    if (legacy) { location.replace(new URL(legacy, location.href)); return true; }
    return false;
  }
  if (redirectLegacyHomeHash()) return;
  addEventListener('hashchange', redirectLegacyHomeHash);
  const currentURL = new URL(location.href);
  const isPlainClick = event => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  const isSameDocument = link => {
    const url = new URL(link.href, location.href);
    return url.origin === currentURL.origin && url.pathname === currentURL.pathname && url.search === currentURL.search;
  };
  const pageForURL = url => {
    const file = url.pathname.split('/').pop();
    return ({'services.html':'services','industries.html':'industries','about.html':'about','index.html':'home','preview.html':'home','':'home'})[file];
  };
  // Cross-document transitions are initialized before paint by navigation.js.
  const canAnimate = () => !motionPreference.matches && typeof Element.prototype.animate === 'function';
  function animate(element, frames, options = {}) {
    if (!element || !canAnimate()) return null;
    const animation = element.animate(frames, {duration:600, easing:ease, ...options});
    running.add(animation);
    const forget = () => running.delete(animation);
    animation.addEventListener('finish', forget, {once:true});
    animation.addEventListener('cancel', forget, {once:true});
    return animation;
  }
  const cancel = animations => animations.forEach(animation => animation?.cancel());
  motionPreference.addEventListener('change', () => {
    if (!motionPreference.matches) return;
    settlers.forEach(settle => settle());
    running.forEach(animation => animation.cancel());
    running.clear();
  });

  // Text is always present in the document; no loader or reveal-only content.
  const headline = [...document.querySelectorAll('.hero-line > span')];
  headline.forEach((line, i) => animate(line, [
    {opacity:0, transform:'translateY(45%)'}, {opacity:1, transform:'none'}
  ], {duration:850, delay:40+i*85, fill:'backwards'}));
  [$('.hero > .eyebrow'), $('.hero-intro'), $('.hero-actions')].forEach((element,i) =>
    animate(element, [{opacity:0, transform:'translateY(12px)'},{opacity:1, transform:'none'}],
      {duration:650, delay:i===0?0:100+i*60, fill:'backwards'}));
  const heroParts = [
    ['.paper-back .paper-inner', 100, 'translateY(32px) rotate(-5deg) scale(.97)'],
    ['.paper-middle .paper-inner', 180, 'translateY(35px) rotate(-3deg) scale(.98)'],
    ['.paper-front .paper-inner', 260, 'translateY(38px) rotate(2deg) scale(.98)'],
    ['.question-one .tag-inner', 420, 'translate(-20px,9px)'],
    ['.question-two .tag-inner', 490, 'translate(20px,9px)'],
    ['.answer-tag .tag-inner', 570, 'translate(10px,16px)']
  ];
  heroParts.forEach(([selector, delay, transform]) => animate($(selector),
    [{opacity:0,transform},{opacity:1,transform:'none'}], {duration:800,delay:delay*.65,fill:'backwards'}));

  // One observer, with short sibling staggers rather than overlapping parent reveals.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const groupOrder = new Map();
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (entry.target.contains(document.activeElement)) return;
        const parent = entry.target.parentElement;
        const order = groupOrder.get(parent) || 0;
        groupOrder.set(parent,order+1);
        animate(entry.target,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],
          {duration:700,delay:Math.min(order,2)*70,fill:'backwards'});
      });
    }, {threshold:0,rootMargin:'0px 0px 16px 0px'});
    document.querySelectorAll('.brands-section,.section-top,.summary-card,.home-work,.home-about,.help-card,.work-card,.founder-card,.steps li,.contact-section > *').forEach(el=>observer.observe(el));
  }

  // Decorative depth only: pointer events schedule one frame, with no idle loop.
  const art = $('.hero-art');
  const scene = $('.hero-scene');
  // Browser-managed drift: no frame loop, and no work when the graphic is hidden.
  const motionToggle = $('.hero-motion-toggle');
  let driftPaused = false;
  let heroInView = !('IntersectionObserver' in window);
  function syncDrift() {
    const enabled = canAnimate();
    if (!art) return;
    art.classList.toggle('is-drifting', enabled && heroInView && !document.hidden && !driftPaused);
    if (!motionToggle) return;
    motionToggle.hidden = !enabled;
    motionToggle.dataset.paused = String(driftPaused);
    const label = driftPaused ? 'Play animation' : 'Pause animation';
    motionToggle.setAttribute('aria-label', label);
    motionToggle.title = label;
  }
  motionToggle?.addEventListener('click', () => { driftPaused = !driftPaused; syncDrift(); });
  motionPreference.addEventListener('change', syncDrift);
  document.addEventListener('visibilitychange', syncDrift);
  if (art && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      heroInView = entry.isIntersecting && entry.intersectionRatio > 0;
      syncDrift();
    }).observe(art);
  }
  syncDrift();
  let pointerFrame = 0;
  let artBounds;
  let pointerX = 0;
  let pointerY = 0;
  function resetDepth() {
    if(pointerFrame)cancelAnimationFrame(pointerFrame);
    pointerFrame=0;artBounds=null;
    scene?.style.removeProperty('--yaw');scene?.style.removeProperty('--pitch');
  }
  settlers.add(resetDepth);
  art?.addEventListener('pointerenter',()=>{artBounds=art.getBoundingClientRect();});
  art?.addEventListener('pointermove',event=>{
    if (!scene || !finePointer.matches || !canAnimate() || event.pointerType==='touch') return;
    artBounds ||= art.getBoundingClientRect();pointerX=event.clientX;pointerY=event.clientY;
    if(pointerFrame)return;
    pointerFrame=requestAnimationFrame(()=>{
      pointerFrame=0;
      if(!artBounds || !canAnimate())return;
      const x=Math.max(-1,Math.min(1,((pointerX-artBounds.left)/artBounds.width-.5)*2));
      const y=Math.max(-1,Math.min(1,((pointerY-artBounds.top)/artBounds.height-.5)*2));
      scene.style.setProperty('--yaw',`${x*3.2}deg`);
      scene.style.setProperty('--pitch',`${-y*2.2}deg`);
    });
  });
  art?.addEventListener('pointerleave',resetDepth);
  finePointer.addEventListener('change',resetDepth);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)resetDepth();});
  const header=$('.site-header');let scrollFrame=0;
  const sectionLinks=[...document.querySelectorAll('.header-inner nav a,#mobile-menu a')];
  const navSections=[...document.querySelectorAll('main > section')].filter(section=>sectionLinks.some(link=>isSameDocument(link)&&link.hash===`#${section.id}`));
  function markCurrentNavigation(activeSection) {
    sectionLinks.forEach(link => {
      const url = new URL(link.href, location.href);
      const route = pageForURL(url);
      const current = !url.hash && route === page ? 'page' :
        route === page && url.hash && url.hash === `#${activeSection}` ? 'location' : null;
      if (current) link.setAttribute('aria-current', current);
      else link.removeAttribute('aria-current');
    });
    const homeLink = $('.site-header .wordmark');
    if (homeLink) {
      if (page === 'home') homeLink.setAttribute('aria-current', 'page');
      else homeLink.removeAttribute('aria-current');
    }
  }
  const steps=[...document.querySelectorAll('.steps li')];
  function updateHeader(){
    const sectionPositions=navSections.map(section=>section.getBoundingClientRect().top);
    const stepPositions=steps.map(step=>step.getBoundingClientRect().top);
    let active=-1;sectionPositions.forEach((top,i)=>{if(top<innerHeight*.4)active=i;});
    let activeStep=0;stepPositions.forEach((top,i)=>{if(top<innerHeight*.58)activeStep=i;});
    header?.classList.toggle('scrolled',scrollY>16);
    markCurrentNavigation(navSections[active]?.id);
    steps.forEach((step,i)=>step.classList.toggle('is-current',i===activeStep));
    artBounds=null;scrollFrame=0;
  }
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateHeader);},{passive:true});
  updateHeader();

  const tabs=[...document.querySelectorAll('[data-industry]')];
  const panels=[...document.querySelectorAll('.industry-panel')];
  const viewport=$('.industry-panels');
  const indicator=$('.tab-indicator');
  let activeIndustry='manufacturing';
  let panelToken=0;
  let panelAnimations=[];
  function placeIndicator(){
    const tab=tabs.find(item=>item.dataset.industry===activeIndustry);
    if(!tab || !indicator)return;
    indicator.style.width=`${tab.offsetWidth}px`;indicator.style.height=`${tab.offsetHeight}px`;
    indicator.style.transform=`translate(${tab.offsetLeft}px,${tab.offsetTop}px)`;
  }
  function settlePanels(){
    panelToken++;cancel(panelAnimations);panelAnimations=[];
    panels.forEach(panel=>{
      const selected=panel.id===`panel-${activeIndustry}`;
      panel.hidden=!selected;panel.inert=!selected;
      panel.classList.remove('is-outgoing');
      if(selected)panel.removeAttribute('aria-hidden');else panel.setAttribute('aria-hidden','true');
    });
    viewport?.style.removeProperty('height');viewport?.classList.remove('is-changing');
  }
  settlers.add(settlePanels);
  function selectIndustry(id,{motion=true}={}){
    if(!viewport || !tabs.some(tab=>tab.dataset.industry===id))return;
    const old=$(`#panel-${activeIndustry}`);
    const oldHeight=viewport.getBoundingClientRect().height;
    const oldOpacity=parseFloat(getComputedStyle(old).opacity);
    settlePanels();activeIndustry=id;
    const token=++panelToken;
    const next=$(`#panel-${id}`);
    tabs.forEach(tab=>{const selected=tab.dataset.industry===id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
    panels.forEach(panel=>{const selected=panel===next;panel.hidden=!selected;panel.inert=!selected;if(selected)panel.removeAttribute('aria-hidden');else panel.setAttribute('aria-hidden','true');});
    placeIndicator();
    if(!motion || !canAnimate() || old===next)return;
    const nextHeight=next.getBoundingClientRect().height;
    viewport.style.height=`${oldHeight}px`;viewport.classList.add('is-changing');
    old.hidden=false;old.inert=true;old.setAttribute('aria-hidden','true');old.classList.add('is-outgoing');
    panelAnimations.push(animate(old,[{opacity:oldOpacity,transform:'none'},{opacity:0,transform:'translateX(-6px)'}],{duration:180,fill:'forwards'}));
    panelAnimations.push(animate(next,[{opacity:0,transform:'translateX(8px)'},{opacity:1,transform:'none'}],{duration:450,delay:35,fill:'backwards'}));
    const heightAnimation=animate(viewport,[{height:`${oldHeight}px`},{height:`${nextHeight}px`}],{duration:450,fill:'forwards'});
    panelAnimations.push(heightAnimation);
    next.querySelectorAll('.industry-icon path').forEach((path,i)=>{
      const length=path.getTotalLength();
      panelAnimations.push(animate(path,[{strokeDasharray:`${length}`,strokeDashoffset:length},{strokeDasharray:`${length}`,strokeDashoffset:0}],{duration:330,delay:60+i*40}));
    });
    // All final state is set synchronously; completions only clean visual overlays.
    const incoming=panelAnimations[1];
    incoming?.addEventListener('finish',()=>{if(token===panelToken)settlePanels();},{once:true});
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>{if(tab.dataset.industry!==activeIndustry)selectIndustry(tab.dataset.industry);});
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();tabs[next].focus();selectIndustry(tabs[next].dataset.industry);}
    });
  });
  if (tabs.length && viewport) {
    activeIndustry=tabs.find(tab=>tab.getAttribute('aria-selected')==='true')?.dataset.industry || tabs[0].dataset.industry;
    document.body.classList.add('enhanced');selectIndustry(activeIndustry,{motion:false});
    if('ResizeObserver' in window && $('.industry-tabs'))new ResizeObserver(placeIndicator).observe($('.industry-tabs'));
  }

  const disclosures=new Map();
  function settleDisclosure(details){
    const state=disclosures.get(details);if(!state)return;
    cancel(state.animations);details.open=state.target;
    details.style.removeProperty('height');details.style.removeProperty('overflow');
    details.removeAttribute('data-expanded');
    disclosures.delete(details);
  }
  function toggleDisclosure(details){
    if(viewport?.classList.contains('is-changing'))settlePanels();
    const oldState=disclosures.get(details);
    const target=!(oldState?oldState.target:details.open);
    const start=details.getBoundingClientRect().height;
    const content=details.querySelector('.example-content');
    const opacity=details.open?parseFloat(getComputedStyle(content).opacity):0;
    if(oldState){cancel(oldState.animations);disclosures.delete(details);}
    details.style.removeProperty('height');details.style.removeProperty('overflow');
    if(!canAnimate()){details.open=target;details.removeAttribute('data-expanded');return;}
    details.open=true;details.dataset.expanded=String(target);
    const end=target?details.offsetHeight:details.querySelector('summary').offsetHeight;
    const state={target,animations:[]};disclosures.set(details,state);
    details.style.height=`${start}px`;details.style.overflow='clip';
    const resize=animate(details,[{height:`${start}px`},{height:`${end}px`}],{duration:480,fill:'forwards'});
    state.animations.push(resize,animate(content,[{opacity,transform:target?'translateY(-5px)':'none'},{opacity:target?1:0,transform:target?'none':'translateY(-4px)'}],{duration:target?430:220,fill:'forwards'}));
    resize?.addEventListener('finish',()=>{if(disclosures.get(details)===state)settleDisclosure(details);},{once:true});
  }
  document.querySelectorAll('.example').forEach(details=>details.querySelector('summary').addEventListener('click',event=>{
    event.preventDefault();toggleDisclosure(details);
  }));
  const settleDisclosures=()=>[...disclosures.keys()].forEach(settleDisclosure);
  settlers.add(settleDisclosures);
  addEventListener('resize',()=>{resetDepth();settleDisclosures();settlePanels();placeIndicator();});

  const menuToggle=$('.menu-toggle');const menu=$('#mobile-menu');
  let menuOpen=false;let menuAnimation;let menuToken=0;
  function setMenu(open,{immediate=false,restoreFocus=false}={}){
    if (!menu || !menuToggle) return;
    menuOpen=open;const token=++menuToken;menuAnimation?.cancel();
    menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    menu.inert=!open;
    if(restoreFocus)menuToggle.focus();
    if(immediate || !canAnimate()){menu.hidden=!open;return;}
    menu.hidden=false;
    menuAnimation=animate(menu,open?[{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'none'}]:[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-7px)'}],{duration:open?370:230});
    menuAnimation?.addEventListener('finish',()=>{if(token===menuToken)menu.hidden=!menuOpen;},{once:true});
  }
  settlers.add(()=>setMenu(menuOpen,{immediate:true}));
  menuToggle?.addEventListener('click',()=>setMenu(!menuOpen));
  menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',event=>{
    if (isPlainClick(event) && !link.target && !link.hasAttribute('download')) setMenu(false,{immediate:true});
  }));
  document.addEventListener('pointerdown', event=>{
    if(menuOpen && !menu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false,{immediate:true});
  });
  document.addEventListener('focusin', event=>{
    if(menuOpen && !menu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false,{immediate:true});
  });
  addEventListener('pagehide',()=>{setMenu(false,{immediate:true});resetDepth();});
  matchMedia('(min-width:921px)').addEventListener('change',event=>{if(event.matches)setMenu(false,{immediate:true});});
  const dialog=$('#contact-dialog');let opener;let dialogAnimation;let closing=false;
  function finishDialogClose(){dialogAnimation?.cancel();closing=false;dialog.classList.remove('is-closing');if(dialog.open)dialog.close();}
  function closeDialog(){
    if(!dialog.open || closing)return;
    closing=true;dialogAnimation?.cancel();
    if(!canAnimate()){finishDialogClose();return;}
    dialog.classList.add('is-closing');
    dialogAnimation=animate(dialog,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(10px) scale(.99)'}],{duration:220});
    dialogAnimation?.addEventListener('finish',finishDialogClose,{once:true});
  }
  settlers.add(()=>{if(closing)finishDialogClose();});
  function openContact(button){
    opener=button;setMenu(false,{immediate:true});
    closing=false;dialog.classList.remove('is-closing');dialogAnimation?.cancel();dialog.showModal();
    dialogAnimation=animate(dialog,[{opacity:0,transform:'translateY(18px) scale(.98)'},{opacity:1,transform:'none'}],{duration:500});
  }
  document.querySelectorAll('.contact-trigger').forEach(button=>button.addEventListener('click',()=>openContact(button)));
  $('#contact-close').addEventListener('click',closeDialog);
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
  dialog.addEventListener('close',()=>{closing=false;dialog.classList.remove('is-closing');opener?.focus({preventScroll:true});});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuOpen)setMenu(false,{restoreFocus:true});});

  // Optional service details on the services page; regular page links remain native.
  const services={
  "sales": {
    "category": "STRATEGY",
    "title": "Decide what to do first.",
    "intro": "Start with how your business works and where you want it to go.",
    "offers": [
      "Review the work taking up your team’s time.",
      "Identify where AI or a simpler process could help.",
      "Agree on priorities, costs and the work involved."
    ]
  },
  "work": {
    "category": "EVERYDAY WORK",
    "title": "Cut repetitive work.",
    "intro": "Give your team tools that fit the way they work.",
    "offers": [
      "Reduce copying information between emails and files.",
      "Draft routine emails and prepare recurring reports.",
      "Build tools for the tasks your team repeats."
    ]
  },
  "clarity": {
    "category": "DATA & ANALYSIS",
    "title": "Make sense of your numbers.",
    "intro": "Use the information you already have to make better decisions.",
    "offers": [
      "Bring together sales, costs and other business records.",
      "Find patterns and work out what they mean.",
      "Turn the findings into clear reports and next steps."
    ]
  }
};
  const serviceDialog=$('#service-dialog');
  if (serviceDialog) {
  let serviceOpener=null,serviceId=null,serviceAnimation=null,serviceContentAnimation=null,serviceClosing=false,serviceCloseRequested=false;
  let afterServiceClose=null;
  const serviceFromURL=()=>location.hash.startsWith('#service-')?location.hash.slice(9):null;
  function fillService(id){
    const data=services[id];if(!data)return;
    serviceId=id;
    $('#service-category').textContent=data.category;
    $('#service-title').textContent=data.title;
    $('#service-intro').textContent=data.intro;
    $('#service-offers').replaceChildren(...data.offers.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    const art=$(`.help-card[data-kind="${id}"] .service-art`);
    $('#service-art-slot').replaceChildren(...(art ? [art.cloneNode(true)] : []));
    serviceDialog.querySelectorAll('[data-service]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.service===id)));
    serviceDialog.scrollTop=0;
  }
  function finishServiceClose(){
    serviceAnimation?.cancel();serviceContentAnimation?.cancel();serviceClosing=false;serviceCloseRequested=false;
    serviceDialog.classList.remove('is-closing');serviceDialog.inert=false;
    if(serviceDialog.open)serviceDialog.close();
    serviceOpener?.focus({preventScroll:true});
    const done=afterServiceClose;afterServiceClose=null;done?.();
  }
  function hideService(){
    if(!serviceDialog.open){const done=afterServiceClose;afterServiceClose=null;done?.();return;}
    serviceAnimation?.cancel();serviceContentAnimation?.cancel();serviceClosing=true;serviceDialog.inert=true;
    if(!canAnimate()){finishServiceClose();return;}
    serviceDialog.classList.add('is-closing');
    serviceAnimation=animate(serviceDialog,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(14px) scale(.985)'}],{duration:220});
    serviceAnimation?.addEventListener('finish',finishServiceClose,{once:true});
  }
  function showService(id){
    if(!services[id])return;
    const wasClosing=serviceClosing;
    afterServiceClose=null;serviceCloseRequested=false;
    serviceAnimation?.cancel();serviceContentAnimation?.cancel();serviceClosing=false;serviceDialog.inert=false;serviceDialog.classList.remove('is-closing');
    const wasOpen=serviceDialog.open;fillService(id);
    serviceOpener ||= $(`.service-trigger[data-service="${id}"]`);
    if(!wasOpen){
      if(dialog.open)finishDialogClose();
      serviceDialog.showModal();$('#service-close').focus({preventScroll:true});
      serviceAnimation=animate(serviceDialog,[{opacity:0,transform:'translateY(28px) scale(.965)'},{opacity:1,transform:'none'}],{duration:560});
    }else{
      serviceContentAnimation=animate($('.service-detail-layout'),[{opacity:0,transform:'translateX(12px)'},{opacity:1,transform:'none'}],{duration:430});
      if(wasClosing)$('#service-close').focus({preventScroll:true});
    }
  }
  function syncServiceRoute(){
    const id=serviceFromURL();
    if(services[id])showService(id);else hideService();
  }
  function requestServiceClose(){
    if(serviceClosing||serviceCloseRequested)return;
    serviceCloseRequested=true;
    if(history.state?.fcServiceEntry)history.back();
    else{history.replaceState(null,'',`#${serviceId || 'help'}`);hideService();}
  }
  document.querySelectorAll('.service-trigger').forEach(link=>link.addEventListener('click',event=>{
    if (!isPlainClick(event) || link.target || link.hasAttribute('download')) return;
    event.preventDefault();serviceOpener=link;
    history.pushState({fcServiceEntry:true},'',`#service-${link.dataset.service}`);showService(link.dataset.service);
  }));
  serviceDialog.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
    if(serviceId===button.dataset.service)return;
    history.replaceState(history.state,'',`#service-${button.dataset.service}`);showService(button.dataset.service);
  }));
  $('#service-close').addEventListener('click',requestServiceClose);
  serviceDialog.addEventListener('cancel',event=>{event.preventDefault();requestServiceClose();});
  $('#service-contact').addEventListener('click',()=>{afterServiceClose=()=>openContact(serviceOpener);requestServiceClose();});
  settlers.add(()=>{if(serviceClosing)finishServiceClose();});
  addEventListener('popstate',syncServiceRoute);
  if(services[serviceFromURL()])showService(serviceFromURL());
  }

  // Only same-document anchors receive scroll/focus polish; page changes stay native.
  document.querySelectorAll('a[href]:not(.service-trigger)').forEach(link=>link.addEventListener('click',event=>{
    if (!isPlainClick(event) || link.target || link.hasAttribute('download') || !link.hash || !isSameDocument(link)) return;
    let id;
    try { id=decodeURIComponent(link.hash.slice(1)); } catch { return; }
    const target=document.getElementById(id);if(!target)return;
    event.preventDefault();setMenu(false,{immediate:true});
    if(location.hash!==link.hash)history.pushState(null,'',link.hash);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:canAnimate()?'smooth':'instant',block:'start'});
  }));
})();
