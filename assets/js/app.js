/* Abdelmoneim Diab | Visual & Motion Lab — Phase 1 front-end.
   Hash router (#/, #/work, #/work/<category>, #/experience, #/contact), EN/AR switch,
   GSAP + ScrollTrigger + SplitText motion with Lenis smooth scroll synced through gsap.ticker.
   Rule: nothing is ever hidden by CSS alone. Elements are only hidden by GSAP right before it animates them,
   and a timed safety net reveals anything that is still hidden. */
(function () {
  'use strict';

  var S = window.SITE;
  var root = document.documentElement;
  var view = document.getElementById('view');
  var header = document.getElementById('header');
  var curtain = document.getElementById('curtain');
  var curtainLabel = document.getElementById('curtainLabel');
  var viewer = document.getElementById('viewer');
  var cursor = document.getElementById('cursor');

  var G = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motion = !!(G && ST) && !reduce;
  if (G && ST) G.registerPlugin(ST);
  if (G && Split) G.registerPlugin(Split);

  var lang = root.lang === 'ar' ? 'ar' : 'en';
  var current = null;          // current route { name, param }
  var busy = false;
  var cleanups = [];
  var workTriggers = [];
  var pendingMorph = null;     // { clone, rect } while a client logo flies into its company page
  var returnTo = null;         // section id to land on when returning to home
  var lenis = null;
  var fontsReady = !document.fonts || document.fonts.status === 'loaded';

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ui() { return S.ui[lang]; }
  // Typographic signature: {X} in content strings becomes the italic-serif letter (or the coloured word in Arabic).
  function sig(s) { return esc(s).replace(/\{([^}]+)\}/g, '<em class="sig">$1</em>'); }
  var STAR = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.9 7.6 16.4 11.1 24 12 16.4 12.9 12.9 16.4 12 24 11.1 16.4 7.6 12.9 0 12 7.6 11.1 11.1 7.6 12 0Z"/></svg>';
  function brand(name) { return lang === 'ar' ? '<bdi dir="ltr">' + esc(name) + '</bdi>' : esc(name); }
  // A project's client is one of `companies` (by id); projects without one are independent work.
  function clientById(id) { return id ? companyById(id) : null; }
  function clientName(c) { if (!c) return esc(ui().independent); return lang === 'ar' ? esc(coName(c)) : esc(c.nameEn); }
  function rc(ratio) { return 'r-' + String(ratio).replace(':', 'x'); }
  function ratioHtml(r) { return '<bdi dir="ltr">' + esc(r) + '</bdi>'; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function catById(id) { for (var i = 0; i < S.categories.length; i++) if (S.categories[i].id === id) return S.categories[i]; return null; }
  function projectsIn(id) { return S.projects.filter(function (p) { return p.category === id; }); }
  function companyById(id) { var c = S.companies || []; for (var i = 0; i < c.length; i++) if (c[i].id === id) return c[i]; return null; }
  function L(o, k) { return o[k + (lang === 'ar' ? 'Ar' : 'En')]; }   // bilingual field: L(company, 'about')
  function projectById(id) { for (var i = 0; i < S.projects.length; i++) if (S.projects[i].id === id) return S.projects[i]; return null; }
  function countLabel(n) {
    if (lang === 'ar') return n + ' ' + (n >= 3 && n <= 10 ? 'مشاريع' : 'مشروع');
    return n + (n === 1 ? ' project' : ' projects');
  }
  // Video posters are first-frame stills saved by tools/fetch-posters.js; Drive's own thumbnail is the fallback.
  function posterFor(p) { return p.type === 'video' ? 'assets/posters/' + encodeURIComponent(p.drive) + '.jpg' : p.src; }
  function driveThumb(p) { return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(p.drive) + '&sz=w720'; }

  /* ---------- router ---------- */
  function parse() {
    var h = (location.hash || '').replace(/^#\/?/, '').split('/');
    var name = h[0] || 'home';
    if (['home', 'work', 'experience', 'contact', 'client'].indexOf(name) === -1) name = 'home';
    if (name === 'client' && !(h[1] && companyById(h[1]))) name = 'home';
    var param = name === 'work' && h[1] && catById(h[1]) ? h[1] : name === 'client' ? h[1] : null;
    return { name: name, param: param };
  }

  function onRoute() {
    if (!viewer.hidden) closeViewer(true);
    if (menuOpen) closeMenu(true);
    var r = parse();
    if (current && r.name === current.name && r.param === current.param) return;
    if (current && r.name === 'work' && current.name === 'work') { current = r; updateWork(true); return; }
    if (!current || !motion) { pendingMorph = cleanMorph(); show(r); enter(r); return; }
    if (r.name === 'client' && pendingMorph) { morphToCompany(r); return; }
    pendingMorph = cleanMorph();
    transition(r);
  }

  function transition(r) {
    if (busy) { show(r); enter(r); return; }
    busy = true;
    curtainLabel.textContent = r.name === 'client' ? coName(companyById(r.param)) : r.name === 'home' ? ui().nav.home : ui().nav[r.name];
    G.timeline({ onComplete: function () { busy = false; } })
      .set(curtain, { y: 0, yPercent: 100 })
      .fromTo(curtainLabel, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .7, ease: 'expo.out' }, .25)
      .to(curtain, { yPercent: 0, duration: .65, ease: 'expo.inOut' }, 0)
      .add(function () { show(r); })
      .to(curtainLabel, { yPercent: -40, autoAlpha: 0, duration: .45, ease: 'power2.in' }, '+=.05')
      .to(curtain, { yPercent: -100, duration: .75, ease: 'expo.inOut' }, '<.1')
      .add(function () { enter(r); }, '<.25');
  }

  function show(r) {
    runCleanups();
    current = r;
    var html = r.name === 'work' ? workView() : r.name === 'experience' ? experienceView() : r.name === 'contact' ? contactView()
      : r.name === 'client' ? companyView(companyById(r.param)) : homeView();
    view.innerHTML = html;
    window.scrollTo(0, 0);
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    // Coming back from a company page: land on the clients list, not the top.
    if (r.name === 'home' && returnTo) {
      var anchor = $('#' + returnTo);
      returnTo = null;
      if (anchor) {
        var y = anchor.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo(0, y);
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      }
    }
    header.classList.remove('is-hidden');
    setNav();
    setHeaderTone(0);
    bindView();
  }

  /* ---------- views ---------- */
  function homeView() {
    var p = S.person[lang], t = ui(), c = S.contact;
    var info = S.info.map(function (row) {
      var d = row[lang], v;
      if (row.type === 'count') {
        v = '<span class="info__num"><bdi dir="ltr" data-count="' + row.value + '" data-suffix="' + esc(row.suffix) + '">' + row.value + esc(row.suffix) + '</bdi></span>' + (d.v ? ' ' + esc(d.v) : '');
      } else if (row.type === 'clock') {
        v = esc(d.v) + ' <bdi dir="ltr" class="info__clock js-clock">--:--</bdi>';
      } else v = esc(d.v);
      return '<div class="info__row" data-reveal><dt>' + esc(d.k) + '</dt><dd>' + v + '</dd></div>';
    }).join('');
    var nameWords = p.heroNameSig.split(' ').map(function (w) { return '<span class="hero__word"><span data-split>' + sig(w) + '</span></span>'; }).join(' ');
    var socials = c.socials.slice(0, 2).map(function (s) { return '<a class="u" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + brand(s.name) + '</a>'; }).join(lang === 'ar' ? '، ' : ', ');
    var portrait = '<img src="assets/portrait/portrait.webp" srcset="assets/portrait/portrait-640.webp 640w, assets/portrait/portrait.webp 925w" sizes="(max-width: 900px) 90vw, 46vw" width="925" height="1351" alt="' + esc(p.portraitAlt) + '" decoding="async">';
    return '' +
      '<div class="home" id="home">' +
        '<section class="hero" id="hero">' +
          '<div class="hero__labels" data-rise><span>' + esc(t.hello) + '</span>' + STAR + '<span>' + esc(t.edition) + '</span></div>' +
          '<h1 class="hero__name" id="heroName" aria-label="' + esc(p.heroName) + '">' + nameWords + '</h1>' +
          '<div class="hero__copy">' +
            '<p class="hero__tagline" data-lines>' + esc(p.tagline) + '</p>' +
            '<p class="hero__title" data-rise>' + esc(p.title) + '</p>' +
            '<div class="hero__actions" data-rise>' +
              '<a class="btn btn--ink" href="#/work" data-magnetic><span class="btn__glyph" aria-hidden="true"></span>' + esc(t.seeWork) + '</a>' +
              '<a class="u link-quiet" href="#/contact">' + esc(t.available) + '</a>' +
            '</div>' +
            '<div class="hero__meta" data-rise>' +
              '<span class="hero__socials">' + socials + '</span>' +
              '<span class="hero__clock"><span>' + esc(t.city) + '</span> <bdi dir="ltr" id="cairoClock">--:--:--</bdi></span>' +
            '</div>' +
          '</div>' +
          '<div class="hero__figure" id="heroSlot">' +
            '<div id="afterEffectsHeroVideoSlot" hidden></div>' +
            '<div class="hero__img" id="heroImg">' + portrait + '</div>' +
          '</div>' +
        '</section>' +
        '<section class="about" id="about" aria-labelledby="aboutTitle">' +
          '<div class="about__grid">' +
            '<div class="about__media">' +
              '<div class="about__plate" id="aboutPlate"><div class="about__img" id="aboutSlot">' + portrait.replace('alt="' + esc(p.portraitAlt) + '"', 'alt="" loading="lazy"') + '</div></div>' +
            '</div>' +
            '<div class="about__body">' +
              '<h2 class="about__title" id="aboutTitle" data-reveal>' + esc(t.aboutTitle) + '</h2>' +
              '<div class="about__copy">' + p.about.map(function (x, i) { return i === 0 ? '<p class="about__lead" data-fill>' + x + '</p>' : '<p data-reveal>' + x + '</p>'; }).join('') + '</div>' +
              '<dl class="info">' + info + '</dl>' +
            '</div>' +
          '</div>' +
        '</section>' +
        clientsShowcase() +
        circleStrip() +
      '</div>';
  }

  // Company names: plain text for labels, and the wordmark shown when there is no logo yet.
  function coName(c) {
    if (lang === 'ar') return c.nameAr.replace(/<[^>]+>/g, '').replace(/\s*\(.*\)\s*$/, '');
    return c.nameEn;
  }
  // The company mark: in the strip, the one-colour logo with its full-colour version stacked for hover;
  // on the company page, the full-colour logo. Without a logo, the name set as a wordmark.
  function companyMark(c, cls, strip) {
    var inner;
    // .logo-mask paints the one-colour logo in the current text colour (used in dark mode).
    // (absolute URL: a url() inside a custom property resolves against the stylesheet, not the page)
    var mask = c.logo ? '<span class="logo-mask" aria-hidden="true" style="--m:url(\'' + esc(new URL(c.logoMono || c.logo, location.href).href) + '\')"></span>' : '';
    if (c.logo && strip) inner = '<img class="logo-mono" src="' + esc(c.logoMono || c.logo) + '" alt="' + esc(coName(c)) + '"><img class="logo-color" src="' + esc(c.logo) + '" alt="" aria-hidden="true">' + mask;
    else if (c.logo) inner = '<img src="' + esc(c.logo) + '" alt="' + esc(coName(c)) + '">' + mask;
    else if (strip && c.short) inner = brand(c.short);   // long names use their short form in the strip only
    else inner = lang === 'ar' ? esc(coName(c)) : esc(c.nameEn);
    return '<span class="' + cls + (c.logo ? ' has-logo' : '') + '" data-mark="' + esc(c.id) + '">' + inner + '</span>';
  }
  // Clients: an auto-scrolling strip of logos (wordmarks until the logos arrive), each one opens its company page.
  function clientsShowcase() {
    var t = ui();
    var items = function (copy) {
      return (S.companies || []).map(function (c) {
        var ind = L(c, 'industry');
        return '<li><button type="button" class="co-chip" data-company="' + esc(c.id) + '" data-cursor="' + esc(t.open) + '" aria-label="' + esc(coName(c)) + '"' + (copy ? ' tabindex="-1"' : '') + '>' +
            companyMark(c, 'co-chip__mark', true) +
            '<span class="co-chip__ind' + (ind ? '' : ' is-pending') + '">' + esc(ind || t.pending) + '</span>' +
          '</button></li>';
      }).join('');
    };
    return '' +
      '<section class="clients-show" id="clients" aria-labelledby="clientsTitle">' +
        '<div class="clients-show__head">' +
          '<h2 class="clients-show__title" id="clientsTitle" data-reveal>' + esc(t.clientsTitle) + '</h2>' +
          '<p class="clients-show__intro" data-reveal>' + esc(t.clientsIntro) + '</p>' +
        '</div>' +
        '<div class="co-strip" id="coStrip"><ul class="co-track">' + items(false) + '</ul><ul class="co-track" aria-hidden="true">' + items(true) + '</ul></div>' +
      '</section>';
  }

  // Creative Circle: an auto-scrolling strip of collaborators (display only).
  function circleStrip() {
    var t = ui();
    var people = (S.circle || []).map(function (p, i) {
      var name = lang === 'ar' ? p.nameAr : p.nameEn, role = lang === 'ar' ? p.roleAr : p.roleEn;
      return '<li class="peer" data-peer="' + i + '">' +
          '<span class="peer__av"><span class="peer__photo" data-peer-photo="' + i + '"></span><span class="peer__ht" data-peer-ht="' + i + '"></span></span>' +
          '<span class="peer__name">' + esc(name) + '</span><span class="peer__role">' + esc(role) + '</span>' +
        '</li>';
    }).join('');
    return '' +
      '<section class="circle" id="circle" aria-labelledby="circleTitle">' +
        '<h2 class="circle__title" id="circleTitle" data-reveal>' + sig(t.circleTitle) + '</h2>' +
        '<div class="circle__strip" id="circleStrip"><ul class="circle__track">' + people + '</ul><ul class="circle__track" aria-hidden="true">' + people + '</ul></div>' +
      '</section>';
  }

  /* ---------- company page ---------- */
  function companyView(c) {
    var t = ui();
    var about = L(c, 'about'), role = L(c, 'role'), ind = L(c, 'industry');
    var cats = c.categories || [];
    var tabs = cats.map(function (k, i) {
      var n = (k.items || []).length;
      return '<button type="button" data-tab="' + i + '">' + esc(L(k, 'label')) + (n ? '<sup>' + n + '</sup>' : '') + '</button>';
    }).join('');
    return '' +
      '<section class="company" data-company-page="' + esc(c.id) + '">' +
        '<div class="company__bar">' +
          '<a class="u company__back" href="#/" id="companyBack">' + esc(t.back) + '</a>' +
          '<span class="company__tag' + (ind ? '' : ' is-pending') + '">' + STAR + esc(ind || t.pending) + '</span>' +
        '</div>' +
        '<h1 class="company__head">' + companyMark(c, 'company__mark') + '</h1>' +
        '<div class="company__profile">' +
          '<h2 class="company__h" data-rise>' + esc(t.aboutCompany) + '</h2>' +
          '<div class="company__about" data-rise>' +
            // about / role are owner copy from content.js and may contain <bdi> for brand names
            '<p class="' + (about ? '' : 'is-pending') + '">' + (about || esc(t.pending)) + '</p>' +
            '<dl class="info">' +
              '<div class="info__row"><dt>' + esc(t.industry) + '</dt><dd class="' + (ind ? '' : 'is-pending') + '">' + esc(ind || t.pending) + '</dd></div>' +
              '<div class="info__row"><dt>' + esc(t.myRole) + '</dt><dd class="' + (role ? '' : 'is-pending') + '">' + (role || esc(t.pending)) + '</dd></div>' +
            '</dl>' +
          '</div>' +
        '</div>' +
        (cats.length ? '<div class="company__work">' +
          '<div class="filters company__tabs" role="tablist" data-rise>' + tabs + '<span class="filters__bar" aria-hidden="true"></span></div>' +
          '<div id="companyCat"></div>' +
        '</div>' : '<p class="company__empty" data-rise>' + esc(t.itemsPending) + '</p>') +
      '</section>';
  }

  function companyCategoryHtml(c, k) {
    var t = ui(), items = (k.items || []).map(projectById).filter(Boolean), intro = L(k, 'intro');
    var ratio = items.length ? items[0].ratio : (k.key === 'videos' ? '9:16' : k.key === 'social' ? '4:5' : '16:9');
    var body = items.length ? items.map(itemHtml).join('') : (function () {
      var g = '', n = ratio === '16:9' ? 2 : 3;
      for (var i = 0; i < n; i++) g += '<div class="item item--ghost" aria-hidden="true"><div class="item__media ' + rc(ratio) + '"></div></div>';
      return g + '<p class="empty-note">' + esc(t.itemsPending) + '</p>';
    })();
    return '' +
      '<div class="company__cat">' +
        '<div class="company__intro">' +
          '<h3 class="company__cat-title">' + esc(L(k, 'label')) + '</h3>' +
          '<p class="' + (intro ? '' : 'is-pending') + '">' + esc(intro || t.storyPending) + '</p>' +
        '</div>' +
        '<div class="grid grid--' + ratio.replace(':', 'x') + '">' + body + '</div>' +
      '</div>';
  }

  function bindCompany() {
    var c = companyById(current.param), box = $('#companyCat');
    var back = $('#companyBack');
    if (back) back.addEventListener('click', function () { returnTo = 'clients'; });
    if (!box || !c) return;
    var tabs = $$('.company__tabs button');
    var select = function (i, animate) {
      tabs.forEach(function (b, j) { b.setAttribute('aria-pressed', String(i === j)); b.setAttribute('aria-selected', String(i === j)); });
      var paint = function () {
        workTriggers.splice(0).forEach(function (st) { st.kill(); });
        box.innerHTML = companyCategoryHtml(c, c.categories[i]);
        bindItems(box);
        revealItems(box);
        moveBar(animate);
        if (ST) ST.refresh();
      };
      if (animate && motion) G.to(box, { autoAlpha: 0, y: 14, duration: .25, ease: 'power2.in', onComplete: function () {
        paint(); G.fromTo(box, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out', clearProps: 'all' });
      } });
      else paint();
    };
    var moveBar = function (animate) {
      var on = $('.company__tabs button[aria-pressed="true"]'), bar = $('.company__tabs .filters__bar');
      if (!on || !bar) return;
      var v = { x: on.offsetLeft, y: on.offsetTop + on.offsetHeight - 2, width: on.offsetWidth };
      if (G && motion && animate) G.to(bar, Object.assign({ duration: .6, ease: 'expo.out' }, v)); else if (G) G.set(bar, v);
    };
    tabs.forEach(function (b, i) { b.setAttribute('role', 'tab'); b.addEventListener('click', function () { if (b.getAttribute('aria-pressed') !== 'true') select(i, true); }); });
    select(0, false);
    var onR = function () { moveBar(false); };
    window.addEventListener('resize', onR);
    cleanups.push(function () { window.removeEventListener('resize', onR); });
  }

  /* ---------- logo morph: home row -> company header ---------- */
  function cleanMorph() {
    if (pendingMorph && pendingMorph.clone.parentNode) pendingMorph.clone.parentNode.removeChild(pendingMorph.clone);
    return null;
  }

  function startMorph(row) {
    var mark = row.querySelector('[data-mark]');
    if (!mark || !motion) return;
    var r = mark.getBoundingClientRect(), cs = getComputedStyle(mark);
    var clone = mark.cloneNode(true);
    clone.className = 'co-fly';
    clone.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;' +
      'font-size:' + cs.fontSize + ';line-height:' + cs.lineHeight + ';font-family:' + cs.fontFamily + ';font-weight:' + cs.fontWeight + ';letter-spacing:' + cs.letterSpacing + ';';
    document.body.appendChild(clone);
    mark.style.visibility = 'hidden';
    pendingMorph = { clone: clone, rect: r };
  }

  function morphToCompany(r) {
    var m = pendingMorph;
    busy = true;
    G.timeline()
      .to(view, { autoAlpha: 0, duration: .35, ease: 'power2.in' })
      .to('#foot', { autoAlpha: 0, duration: .35, ease: 'power2.in' }, 0)
      .add(function () {
        show(r);
        var target = $('.company__mark', view);
        target.style.visibility = 'hidden';
        G.set(view, { autoAlpha: 1 });
        G.set('#foot', { autoAlpha: 1 });
        var tr = target.getBoundingClientRect(), from = m.rect;
        var s = tr.width / from.width;
        G.set(m.clone, { transformOrigin: root.dir === 'rtl' ? '100% 0%' : '0% 0%' });
        var dx = root.dir === 'rtl' ? (tr.right - from.right) : (tr.left - from.left);
        G.to(m.clone, { x: dx, y: tr.top - from.top, scale: s, duration: 1, ease: 'expo.inOut', onComplete: function () {
          target.style.visibility = '';
          pendingMorph = cleanMorph();
          busy = false;
        } });
        enter(r);
      });
  }

  function workView() {
    var t = ui();
    var filters = '<button type="button" data-filter="all">' + esc(t.all) + '<sup>' + S.projects.length + '</sup></button>' +
      S.categories.map(function (c) {
        return '<button type="button" data-filter="' + c.id + '">' + esc(c[lang].name) + '<sup>' + projectsIn(c.id).length + '</sup></button>';
      }).join('');
    var reel = (S.featured || []).map(projectById).filter(Boolean).map(function (p) {
      var isVideo = p.type === 'video';
      return '<button type="button" class="reel__card" data-project="' + esc(p.id) + '" data-cursor="' + esc(isVideo ? t.play : t.view) + '">' +
          '<span class="reel__media ' + rc(p.ratio) + '"><img src="' + esc(posterFor(p)) + '" alt="" loading="lazy" decoding="async">' +
          (isVideo ? '<span class="item__play" aria-hidden="true"></span>' : '') + '</span>' +
          '<span class="reel__cap"><span>' + esc(p[lang].title) + '</span><span>' + clientName(clientById(p.client)) + '</span></span>' +
        '</button>';
    }).join('');
    var n = (S.featured || []).length;
    return '' +
      '<section class="work">' +
        '<div class="work-top">' +
          '<h1 class="work-giant" id="workGiant" aria-label="' + esc(t.workTitle) + '"><span class="work-giant__in"><span data-split>' + sig(t.workGiant) + '</span></span></h1>' +
          '<p class="page-intro" data-rise>' + esc(t.workIntro) + '</p>' +
        '</div>' +
        (n ? '<section class="reel" id="reel" aria-label="' + esc(t.selected) + '">' +
          '<div class="reel__pin">' +
            '<p class="reel__label">' + esc(t.selected) + '</p>' +
            '<div class="reel__stage"><div class="reel__track" id="reelTrack" data-lenis-prevent-touch>' + reel + '</div></div>' +
            '<p class="reel__count" aria-hidden="true"><bdi dir="ltr"><span id="reelIdx">01</span> / ' + String(n).padStart(2, '0') + '</bdi></p>' +
          '</div>' +
        '</section>' : '') +
      '<div class="page work-body">' +
        '<div class="filters" role="group" aria-label="' + esc(t.workTitle) + '" data-rise>' + filters + '<span class="filters__bar" aria-hidden="true"></span></div>' +
        '<div id="workSections"></div>' +
        '<p class="nda">' + esc(t.ndaNote) + '</p>' +
      '</div>' +
      '</section>';
  }

  function sectionHtml(c) {
    var t = ui(), items = projectsIn(c.id);
    var ratio = items.length ? items[0].ratio : c.ratio;
    var parts = ratio.split(':'), rw = +parts[0], rh = +parts[1], k = 16 / Math.max(rw, rh);
    var glyph = '<i aria-hidden="true" style="width:' + Math.round(rw * k) + 'px;height:' + Math.round(rh * k) + 'px"></i>';
    var body;
    if (items.length) {
      body = items.map(itemHtml).join('');
    } else {
      var ghosts = ratio === '16:9' ? 2 : 3, g = '';
      for (var i = 0; i < ghosts; i++) g += '<div class="item item--ghost" aria-hidden="true"><div class="item__media ' + rc(ratio) + '"></div></div>';
      body = g + '<p class="empty-note">' + esc(t.emptyCat) + '</p>';
    }
    return '' +
      '<section class="cat" id="cat-' + c.id + '" aria-labelledby="h-' + c.id + '">' +
        '<header class="cat__head">' +
          '<h2 class="cat__name" id="h-' + c.id + '">' + esc(c[lang].name) + '</h2>' +
          '<p class="cat__desc">' + esc(c[lang].desc) + '</p>' +
          '<p class="cat__meta">' + glyph + ratioHtml(ratio) + (items.length ? '<span>' + esc(countLabel(items.length)) + '</span>' : '') + '</p>' +
        '</header>' +
        '<div class="grid grid--' + ratio.replace(':', 'x') + '">' + body + '</div>' +
      '</section>';
  }

  function itemHtml(p) {
    var t = ui(), d = p[lang];
    var isVideo = p.type === 'video';
    return '' +
      '<button type="button" class="item" data-project="' + esc(p.id) + '" data-cursor="' + esc(isVideo ? t.play : t.view) + '">' +
        '<span class="item__media ' + rc(p.ratio) + '">' +
          '<img src="' + esc(posterFor(p)) + '" alt="" loading="lazy" decoding="async">' +
          (isVideo ? '<span class="item__play" aria-hidden="true"></span>' : '') +
        '</span>' +
        '<span>' +
          '<span class="item__title" style="display:block">' + esc(d.title) + '</span>' +
          '<span class="item__sub" style="display:block">' + clientName(clientById(p.client)) + '</span>' +
          '<span class="item__sub" style="display:block">' + esc(d.role) + '</span>' +
        '</span>' +
      '</button>';
  }

  function experienceView() {
    var t = ui(), p = S.person[lang];
    var jobs = S.experience.map(function (j) {
      var company = j.company ? brand(j.company) : esc(j.companyName[lang]);
      return '' +
        '<article class="job">' +
          '<p class="job__period">' + esc(j.period[lang]) + '</p>' +
          '<div>' +
            '<h2 class="job__role">' + esc(j[lang].role) + '</h2>' +
            '<p class="job__company">' + company + '</p>' +
            '<ul class="job__points">' + j[lang].points.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '</div>' +
          '<p class="job__place">' + esc(j.place[lang]) + '</p>' +
        '</article>';
    }).join('');
    return '' +
      '<section class="page experience">' +
        '<h1 class="page-title"><span class="line-mask"><span data-split>' + esc(t.experienceTitle) + '</span></span></h1>' +
        '<p class="page-intro" data-rise>' + esc(t.experienceIntro) + '</p>' +
        '<div class="timeline"><span class="timeline__rail" aria-hidden="true"><span class="timeline__fill"></span></span>' + jobs + '</div>' +
        '<div class="edu"><h2>' + esc(t.education) + '</h2><p>' + esc(p.education) + '</p></div>' +
      '</section>';
  }

  function contactView() {
    var t = ui(), c = S.contact;
    var socials = c.socials.map(function (s) {
      return '<li><a class="u" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + brand(s.name) + '</a></li>';
    }).join('') + '<li><a class="u" href="' + esc(c.reel) + '" target="_blank" rel="noopener">' + esc(t.reel) + '</a></li>';
    return '' +
      '<section class="page contact">' +
        '<h1 class="contact-title" data-lines>' + esc(t.contactTitle) + '</h1>' +
        '<p class="page-intro" data-rise>' + esc(t.contactIntro) + '</p>' +
        '<div class="contact-grid">' +
          '<div class="contact-block" data-rise><h2>' + esc(t.email) + '</h2><a class="contact-big u" href="mailto:' + esc(c.email) + '"><bdi dir="ltr">' + esc(c.email) + '</bdi></a></div>' +
          '<div class="contact-block" data-rise><h2>' + esc(t.phone) + '</h2><a class="contact-big u" href="' + esc(c.whatsapp) + '" target="_blank" rel="noopener"><bdi dir="ltr">' + esc(c.phone) + '</bdi></a></div>' +
          '<div class="contact-block" data-rise><h2>' + esc(t.elsewhere) + '</h2><ul class="contact-list">' + socials + '</ul></div>' +
        '</div>' +
        '<div class="contact-foot"><span>' + esc(t.based) + '</span><span>' + esc(S.person[lang].lab) + '</span></div>' +
      '</section>';
  }

  /* ---------- work: filter + sections ---------- */
  function updateWork(animate) {
    var box = $('#workSections');
    if (!box) return;
    var param = current.param;
    var cats = param ? [catById(param)] : S.categories;
    var paint = function () {
      workTriggers.splice(0).forEach(function (st) { st.kill(); }); // only the grid's own triggers (keep the reel pin)
      cursor.classList.remove('is-label');
      box.innerHTML = cats.map(sectionHtml).join('');
      bindItems(box);
      setFilterState(animate);
      revealItems(box);
      if (ST) ST.refresh();
    };
    if (animate && motion) {
      G.to(box, { autoAlpha: 0, y: 16, duration: .3, ease: 'power2.in', onComplete: function () {
        paint();
        G.fromTo(box, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out', clearProps: 'all' });
      } });
    } else paint();
  }

  function setFilterState(animate) {
    var active = current.param || 'all';
    var btns = $$('.filters button');
    var bar = $('.filters__bar');
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === active)); });
    var on = $('.filters button[aria-pressed="true"]');
    if (!on || !bar) return;
    var x = on.offsetLeft, w = on.offsetWidth, y = on.offsetTop + on.offsetHeight - 2;
    if (motion && animate) G.to(bar, { x: x, y: y, width: w, duration: .6, ease: 'expo.out' });
    else if (G) G.set(bar, { x: x, y: y, width: w });
    else { bar.style.transform = 'translate(' + x + 'px,' + y + 'px)'; bar.style.width = w + 'px'; }
  }

  /* ---------- binding ---------- */
  function bindView() {
    $$('.filters button', view).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        var h = f === 'all' ? '#/work' : '#/work/' + f;
        if (location.hash !== h) location.hash = h;
      });
    });
    if (current.name === 'work') { bindWork(); if (motion) workMotion(); updateWork(false); }
    if (current.name === 'home') {
      bindHome();
      buildPeers();
      $$('.co-chip', view).forEach(function (row) {
        row.addEventListener('click', function () {
          startMorph(row);
          location.hash = '#/client/' + row.getAttribute('data-company');
        });
      });
    }
    if (current.name === 'client') bindCompany();
    bindMagnetic(view);
    bindCursorTargets(view);
  }

  function bindItems(ctx) {
    $$('.item[data-project]', ctx).forEach(function (el) {
      el.addEventListener('click', function () { openViewer(el.getAttribute('data-project'), el); });
    });
    $$('.item[data-project] .item__media img', ctx).forEach(function (img) {
      var p = projectById(img.closest('.item').getAttribute('data-project'));
      img.addEventListener('error', function onErr() {
        if (p && p.type === 'video' && img.src.indexOf('drive.google.com') === -1) { img.src = driveThumb(p); return; }
        img.removeEventListener('error', onErr);
        img.style.visibility = 'hidden';
      });
    });
    bindCursorTargets(ctx);
  }

  /* ---------- entrance animations ---------- */
  function splitHeadings(ctx) {
    var targets = [];
    $$('[data-split]', ctx).forEach(function (el) {
      if (lang === 'en' && Split) {
        var s = new Split(el, { type: 'chars' });
        cleanups.push(function () { s.revert(); });
        targets.push(s.chars);
      } else {
        targets.push([el]); // Arabic: never split letters (it would break joining); move the whole line.
      }
    });
    return targets;
  }

  function enter(r) {
    if (!motion) { safety(); return; }
    if (!fontsReady) { document.fonts.ready.then(function () { fontsReady = true; if (current === r) enter(r); }); return; }
    var tl = G.timeline({ defaults: { ease: 'expo.out' } });
    var lines = splitHeadings(view);
    lines.forEach(function (chars, i) {
      tl.from(chars, { yPercent: 115, duration: 1.15, stagger: .028 }, i * .12);
    });
    var rise = $$('[data-rise]', view);
    if (rise.length) tl.from(rise, { y: 28, autoAlpha: 0, duration: 1, stagger: .09, clearProps: 'transform' }, .35);

    if (r.name === 'home') homeMotion(tl);
    if (r.name === 'experience') experienceMotion();
    linesMotion(tl);
    cleanups.push(function () { tl.kill(); });
    safety();
  }

  /* ---------- home: clock, name fit ---------- */
  function bindHome() {
    var clocks = $$('#cairoClock, .js-clock', view);
    var tick = function () {
      var now = '';
      try { now = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Cairo', hour12: false }); } catch (e) {}
      clocks.forEach(function (c) { c.textContent = c.classList.contains('js-clock') ? now.slice(0, 5) : now; });
    };
    tick();
    var iv = setInterval(tick, 1000);
    var onResize = function () { fitName(); };
    window.addEventListener('resize', onResize);
    cleanups.push(function () { clearInterval(iv); window.removeEventListener('resize', onResize); });
    fitName();
    if (document.fonts) document.fonts.ready.then(fitName);
  }

  // Desktop: the giant name is sized to fill the hero width on one line.
  function fitName() {
    var el = $('#heroName');
    if (!el) return;
    if (window.innerWidth <= 900) { el.style.removeProperty('--name-size'); return; }
    el.style.setProperty('--name-size', '100px');
    var avail = el.clientWidth;
    el.style.insetInlineEnd = 'auto';            // shrink to the text to measure it
    var natural = el.offsetWidth;
    el.style.insetInlineEnd = '';
    var size = 100 * avail / natural * .995;
    el.style.setProperty('--name-size', Math.min(size, window.innerHeight * .3) + 'px');
  }

  function setHeaderTone(y) {
    var h = current && current.name === 'home' ? $('#hero') : null;
    header.classList.toggle('on-hero', !!h && y < h.offsetHeight - header.offsetHeight);
  }

  /* ---------- home: motion ---------- */
  function homeMotion(tl) {
    var glp = setupGL();
    var hero = $('#hero');

    // Entrance: the portrait appears bottom-up as halftone dots, then resolves into the photo (WebGL);
    // the fallback simply rises in.
    if (glp) {
      tl.to(glp.state, { reveal: 1, duration: 1.8, ease: 'power2.out' }, .1);
      tl.to(glp.state, { halftone: 0, duration: 1.3, ease: 'power2.inOut' }, 1.4);
    }
    else tl.from('#heroImg', { yPercent: 14, autoAlpha: 0, duration: 1.8, ease: 'expo.out' }, 0);

    // Leaving the hero: the name drifts up, the copy lifts away.
    G.to('#heroName', { yPercent: -60, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.hero__copy', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '50% top', scrub: true } });

    // About: paragraphs and numbers arrive as they enter.
    $$('[data-reveal]', view).forEach(function (el) {
      G.from(el, { y: 44, autoAlpha: 0, duration: 1.1, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    // The lead sentence fills with colour as it scrolls through: grey, then teal at the leading edge, then ink.
    var lead = $('[data-fill]', view);
    // Arabic is never split (splitting breaks letter joins and the order of the English words inside <bdi>),
    // so it fills as one block.
    if (lead && (Split || lang === 'ar')) {
      var ls = lang === 'en' ? new Split(lead, { type: 'words,chars' }) : null;
      if (ls) cleanups.push(function () { ls.revert(); });
      var units = ls ? ls.chars : [lead];
      var ftl = G.timeline({ scrollTrigger: { trigger: lead, start: 'top 82%', end: 'bottom 42%', scrub: .5 } });
      var cv = getComputedStyle(root);
      ftl.fromTo(units, { color: cv.getPropertyValue('--fill-from').trim() }, { color: cv.getPropertyValue('--teal').trim(), stagger: .03, duration: .2, ease: 'none' })
        .to(units, { color: cv.getPropertyValue('--ink').trim(), stagger: .03, duration: .2, ease: 'none' }, .18);
    }

    var nums = $$('[data-count]', view);
    if (nums.length) {
      ST.create({ trigger: '.info', start: 'top 88%', once: true, onEnter: function () {
        nums.forEach(function (el) {
          var o = { v: 0 }, end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
          G.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v) + suf; } });
        });
      } });
    }
    // Both strips (clients, Creative Circle) run on their own and ease to a stop on hover.
    stripMotion($('#coStrip'), '.co-track', 80);
    circleMotion();
    sectionSnap();

    // Cursor depth: the portrait tilts a few degrees and drifts slightly; the name drifts the other way.
    if (fine && hero) {
      var target = glp ? glp.state : $('#heroImg');
      var kx = glp ? 'offsetX' : 'x', ky = glp ? 'offsetY' : 'y';
      var fx = G.quickTo(target, kx, { duration: 1.1, ease: 'power3.out' }), fy = G.quickTo(target, ky, { duration: 1.1, ease: 'power3.out' });
      var tx = glp ? G.quickTo(glp.state, 'tiltX', { duration: 1.2, ease: 'power3.out' }) : function () {};
      var ty = glp ? G.quickTo(glp.state, 'tiltY', { duration: 1.2, ease: 'power3.out' }) : function () {};
      var nx = G.quickTo('#heroName', 'x', { duration: 1.3, ease: 'power3.out' });
      var move = function (e) {
        var dx = e.clientX / window.innerWidth - .5, dy = e.clientY / window.innerHeight - .5;
        fx(dx * 14); fy(dy * 8); nx(dx * -24);
        ty(dx * .09); tx(-dy * .06);   // about 5° and 3.5° at the edges
      };
      var leave = function () { fx(0); fy(0); nx(0); tx(0); ty(0); };
      hero.addEventListener('pointermove', move);
      hero.addEventListener('pointerleave', leave);
    }
  }

  /* The portrait is drawn by PortraitGL on a fixed canvas without ever being warped: the pointer or a finger
     turns what it passes into print halftone, and on scroll it glides into the About frame, going halftone on
     the way and resolving back to the photo on arrival. */
  function setupGL() {
    if (!window.PortraitGL) return null;
    var heroImg = $('#heroImg'), slot = $('#aboutSlot'), plate = $('#aboutPlate');
    if (!heroImg || !slot || !plate) return null;
    // Halftone ink follows the theme (dark dots on the light theme, teal dots on the dark one).
    var hex = getComputedStyle(root).getPropertyValue('--halftone').trim().replace('#', '');
    var ink = hex.length === 6 ? [0, 2, 4].map(function (i) { return parseInt(hex.substr(i, 2), 16); }) : null;
    var p = window.PortraitGL.create({ src: 'assets/portrait/portrait.webp', from: heroImg, to: slot, ink: ink });
    if (!p) return null;
    document.body.appendChild(p.canvas);
    var tick = function () { p.render(); };
    var failed = false;
    p.onReady = function () { if (!failed) { root.classList.add('is-gl'); G.ticker.add(tick); } };
    p.onError = function () { failed = true; root.classList.remove('is-gl'); };
    var st = ST.create({
      trigger: '#hero', start: 'top top', endTrigger: plate, end: 'center 58%',
      onUpdate: function (self) {
        G.to(p.state, { progress: self.progress, duration: .8, ease: 'power3.out', overwrite: 'auto' });
      }
    });
    var plateTween = G.fromTo(plate, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out',
      scrollTrigger: { trigger: plate, start: 'top 88%', end: 'center 60%', scrub: .6 } });
    // Safety net: never leave the portrait half revealed.
    var safe = setTimeout(function () {
      if (p.state.reveal < 1 || p.state.halftone > 0) G.to(p.state, { reveal: 1, halftone: 0, duration: .6 });
    }, 4500);
    cleanups.push(function () {
      clearTimeout(safe);
      G.ticker.remove(tick);
      st.kill();
      plateTween.kill();
      p.destroy();
      root.classList.remove('is-gl');
      G.set(plate, { clearProps: 'clipPath' });
    });
    return p;
  }

  /* ---------- Creative Circle ---------- */
  // Each avatar gets two images drawn once: the photo (or a placeholder) and its print-halftone version,
  // the same language as the hero portrait. Hover scales the circle a little and wipes the halftone in.
  function halftoneFrom(src, size, cell, ink) {
    var data = src.getContext('2d').getImageData(0, 0, size, size).data;
    var out = document.createElement('canvas');
    out.width = out.height = size;
    var o = out.getContext('2d');
    o.fillStyle = ink;
    var a = Math.PI / 4, cs = Math.cos(a), sn = Math.sin(a), R = size;
    for (var gy = -R; gy < R; gy += cell) {
      for (var gx = -R; gx < R; gx += cell) {
        var cx = gx + cell / 2, cy = gy + cell / 2;
        var x = cx * cs - cy * sn + size / 2, y = cx * sn + cy * cs + size / 2;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        var i = ((y | 0) * size + (x | 0)) * 4, al = data[i + 3] / 255;
        if (al < .05) continue;
        var lum = (.299 * data[i] + .587 * data[i + 1] + .114 * data[i + 2]) / 255;
        var r = Math.sqrt(1 - lum) * cell * .72 * al;
        if (r < .35) continue;
        o.beginPath(); o.arc(x, y, r, 0, Math.PI * 2); o.fill();
      }
    }
    return out.toDataURL('image/png');
  }

  function buildPeers() {
    var SIZE = 240;
    (S.circle || []).forEach(function (p, idx) {
      var paint = function (img) {
        var c = document.createElement('canvas');
        c.width = c.height = SIZE;
        var g = c.getContext('2d');
        if (img) {
          var s = Math.max(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
          var w = img.naturalWidth * s, h = img.naturalHeight * s;
          g.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
        } else {
          // Placeholder: a stone disc with the entry number, until the real photo arrives.
          var cv = getComputedStyle(root);
          g.fillStyle = cv.getPropertyValue('--stone-3').trim() || '#CBC7BA'; g.fillRect(0, 0, SIZE, SIZE);
          g.fillStyle = cv.getPropertyValue('--ink-2').trim() || '#565C57'; g.font = '400 104px Gloock, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText(String(idx + 1).padStart(2, '0'), SIZE / 2, SIZE / 2 + 6);
        }
        var photo = c.toDataURL('image/png'), ht = halftoneFrom(c, SIZE, 7, '#1C2320');
        $$('[data-peer-photo="' + idx + '"]', view).forEach(function (el) { el.style.backgroundImage = 'url(' + photo + ')'; });
        $$('[data-peer-ht="' + idx + '"]', view).forEach(function (el) { el.style.backgroundImage = 'url(' + ht + ')'; });
      };
      if (p.image) {
        var img = new Image();
        img.onload = function () { paint(img); };
        img.onerror = function () { paint(null); };
        img.src = p.image;
      } else if (document.fonts) document.fonts.load('104px Gloock').then(function () { paint(null); }, function () { paint(null); });
      else paint(null);
    });
  }

  // The strip scrolls on its own; hovering it eases the speed down to a stop, leaving eases it back up.
  function circleMotion() { stripMotion($('#circleStrip'), '.circle__track', 46); }

  /* Home, mouse wheel: at the edge of a section, one wheel step carries you to the next (or previous) section in a
     single smooth move, and the portrait morph plays along with it. Inside a section taller than the screen, the
     wheel scrolls normally until its end. Touch scrolling is left alone. */
  function sectionSnap() {
    if (!lenis) return;
    var secs = ['#hero', '#about', '#clients', '#circle'].map(function (s) { return $(s, view); }).filter(Boolean);
    var foot = $('#foot');
    if (foot) secs.push(foot);
    var snapping = false;
    var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var topOf = function (el) { return el.getBoundingClientRect().top + window.scrollY; };
    var onWheel = function (e) {
      if (menuOpen || !viewer.hidden || e.ctrlKey || current.name !== 'home') return;
      if (snapping) { e.preventDefault(); e.stopImmediatePropagation(); return; }
      var dy = e.deltaY;
      if (Math.abs(dy) < 1) return;
      var y = window.scrollY, vh = window.innerHeight;
      var maxY = document.documentElement.scrollHeight - vh;
      var tops = secs.map(topOf), i = 0;
      for (var k = 0; k < secs.length; k++) if (tops[k] <= y + 4) i = k;
      var target = null;
      if (dy > 0) {
        var end = tops[i] + secs[i].offsetHeight;
        if ((i === 0 || end - (y + vh) <= 4) && i + 1 < secs.length) target = Math.min(tops[i + 1], maxY);
      } else if (i === 0) {
        if (y > 4) target = 0;
      } else if (y - tops[i] <= 4) {
        var p = i - 1, ph = secs[p].offsetHeight;
        target = p === 0 ? 0 : (ph > vh ? tops[p] + ph - vh : tops[p]);
      }
      if (target === null || Math.abs(target - y) < 4) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      snapping = true;
      lenis.scrollTo(target, { duration: 1.4, easing: ease, lock: true, force: true,
        onComplete: function () { setTimeout(function () { snapping = false; }, 160); } });
      setTimeout(function () { snapping = false; }, 2200);   // never stay locked
    };
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    cleanups.push(function () { window.removeEventListener('wheel', onWheel, { capture: true }); });
  }

  function stripMotion(strip, trackSel, dur) {
    if (!strip) return;
    strip.classList.add('is-js');
    var tracks = $$(trackSel, strip);
    var tw = G.to(tracks, { xPercent: root.dir === 'rtl' ? 100 : -100, ease: 'none', duration: dur, repeat: -1 });
    var slow = function () { G.to(tw, { timeScale: 0, duration: .7, ease: 'power2.out', overwrite: true }); };
    var go = function () { G.to(tw, { timeScale: 1, duration: .9, ease: 'power2.in', overwrite: true }); };
    strip.addEventListener('pointerenter', slow);
    strip.addEventListener('pointerleave', go);
    cleanups.push(function () { tw.kill(); });
  }

  function linesMotion(tl) {
    $$('[data-lines]', view).forEach(function (title, i) {
      if (lang === 'en' && Split) {
        var s = new Split(title, { type: 'lines', mask: 'lines' });
        cleanups.push(function () { s.revert(); });
        tl.from(s.lines, { yPercent: 110, duration: 1.2, stagger: .1 }, .15 + i * .1);
      } else {
        tl.from(title, { y: 40, autoAlpha: 0, duration: 1.2 }, .15 + i * .1);
      }
    });
  }

  function revealItems(box) {
    if (!motion) return;
    var medias = $$('.item__media', box);
    if (!medias.length) return;
    G.set(medias, { clipPath: 'inset(100% 0% 0% 0%)' });
    medias.forEach(function (m) { m.setAttribute('data-pending', ''); });
    var made = ST.batch(medias, {
      id: 'work', start: 'top 92%', once: true,
      onEnter: function (batch) {
        batch.forEach(function (m) { m.removeAttribute('data-pending'); });
        G.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', stagger: .07, clearProps: 'clipPath' });
        G.from(batch.map(function (m) { return m.querySelector('img'); }).filter(Boolean), { scale: 1.25, duration: 1.4, ease: 'expo.out', stagger: .07, clearProps: 'transform' });
      }
    });
    Array.prototype.push.apply(workTriggers, made);
    $$('.cat__head', box).forEach(function (h) {
      var tw = G.from(h.children, { y: 24, autoAlpha: 0, duration: .9, ease: 'expo.out', stagger: .08, clearProps: 'all',
        scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
      if (tw.scrollTrigger) workTriggers.push(tw.scrollTrigger);
    });
  }

  /* ---------- work: giant word + curved carousel ---------- */
  function fitWide(el, maxH) {
    if (!el) return;
    el.style.setProperty('--fit', '100px');
    var avail = el.parentNode.clientWidth;
    var natural = el.firstElementChild.offsetWidth;
    el.style.setProperty('--fit', Math.min(100 * avail / natural * .99, maxH) + 'px');
  }

  function bindWork() {
    var giant = $('#workGiant');
    var fit = function () { fitWide(giant, window.innerHeight * .62); };
    fit();
    if (document.fonts) document.fonts.ready.then(function () { fit(); if (ST) ST.refresh(); });
    window.addEventListener('resize', fit);
    cleanups.push(function () { window.removeEventListener('resize', fit); });
    $$('.reel__card', view).forEach(function (el) {
      el.addEventListener('click', function () { openViewer(el.getAttribute('data-project'), el); });
    });
    // Swipe mode (mobile / no motion): keep the counter on the card nearest the centre.
    var track = $('#reelTrack'), idx = $('#reelIdx');
    if (track && idx) {
      track.addEventListener('scroll', function () {
        var mid = window.innerWidth / 2, best = 0, bestD = 1e9;
        $$('.reel__card', track).forEach(function (c, i) {
          var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
        });
        idx.textContent = String(best + 1).padStart(2, '0');
      }, { passive: true });
    }
  }

  // Desktop: the section pins and vertical scroll moves the cards sideways; each card turns on a cylinder
  // according to its distance from the centre. Mobile / no motion: a plain swipeable row.
  function workMotion() {
    var giant = $('#workGiant');
    if (giant) G.to(giant, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.work-top', start: 'top top', end: 'bottom top', scrub: true } });
    var reel = $('#reel'), track = $('#reelTrack');
    if (!reel || !track || !window.matchMedia('(min-width: 901px)').matches) return;
    reel.classList.add('is-pinned');
    var cards = $$('.reel__card', track), idx = $('#reelIdx');
    var rtl = root.dir === 'rtl';
    var dist = function () { return Math.max(0, track.scrollWidth - track.parentNode.clientWidth); };
    var bend = function () {
      var vw = window.innerWidth, mid = vw / 2, best = 0, bestD = 1e9;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect(), off = (r.left + r.width / 2 - mid) / vw;
        var k = Math.max(-1, Math.min(1, off * 1.6));
        G.set(c, { rotationY: -k * 34, z: -Math.abs(k) * 220, transformOrigin: '50% 50%' });
        if (Math.abs(off) < bestD) { bestD = Math.abs(off); best = i; }
      });
      if (idx) idx.textContent = String(best + 1).padStart(2, '0');
    };
    var tw = G.to(track, {
      x: function () { return rtl ? dist() : -dist(); }, ease: 'none',
      scrollTrigger: { trigger: reel, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true, onUpdate: bend, onRefresh: bend }
    });
    bend();
    cleanups.push(function () { tw.kill(); reel.classList.remove('is-pinned'); });
  }

  function experienceMotion() {
    var fill = $('.timeline__fill', view);
    if (fill) {
      G.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'bottom 60%', scrub: .6 } });
    }
    $$('.job', view).forEach(function (j) {
      G.from(j.children, { y: 36, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: .08, clearProps: 'all',
        scrollTrigger: { trigger: j, start: 'top 88%', once: true } });
    });
    G.from('.edu', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: '.edu', start: 'top 92%', once: true } });
  }

  // Safety net: if anything is still hidden after the entrance should have finished, show it.
  function safety() {
    var t = setTimeout(function () {
      // #heroImg is hidden on purpose while the morph stands in for it.
      var figSel = root.classList.contains('is-gl') ? '.hero__copy' : '#heroImg';
      $$('[data-rise], [data-split], [data-lines], ' + figSel + ', .job > *, .edu, .cat__head > *', view.parentNode).forEach(function (el) {
        var cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || +cs.opacity < .05) { el.style.opacity = 1; el.style.visibility = 'visible'; el.style.transform = 'none'; }
      });
      $$('[data-reveal]', view).forEach(function (el) {
        var cs = getComputedStyle(el);
        if (el.getBoundingClientRect().top < window.innerHeight && (+cs.opacity < .05 || cs.visibility === 'hidden')) { el.style.opacity = 1; el.style.visibility = 'visible'; el.style.transform = 'none'; }
      });
      $$('.item__media[data-pending]', view).forEach(function (m) {
        var top = m.getBoundingClientRect().top;
        if (top < window.innerHeight) { m.style.clipPath = 'none'; m.removeAttribute('data-pending'); }
      });
    }, 3500);
    cleanups.push(function () { clearTimeout(t); });
  }

  function runCleanups() {
    cursor.classList.remove('is-label'); // the hovered element may be removed without a pointerleave
    cleanups.splice(0).forEach(function (fn) { try { fn(); } catch (e) {} });
    if (ST) ST.getAll().forEach(function (st) { st.kill(); });
  }

  /* ---------- viewer ---------- */
  var lastFocus = null;
  function openViewer(id, from) {
    var p = projectById(id);
    if (!p) return;
    var t = ui(), d = p[lang];
    lastFocus = from || document.activeElement;
    var media = p.type === 'video'
      ? '<div class="frame ' + rc(p.ratio) + '"><iframe src="https://drive.google.com/file/d/' + encodeURIComponent(p.drive) + '/preview" title="' + esc(d.title) + '" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe></div>'
      : '<div class="frame ' + rc(p.ratio) + '"><img src="' + esc(p.src) + '" alt="' + esc(d.title) + '"></div>';
    $('#viewerMedia').innerHTML = media;
    $('#viewerTitle').textContent = d.title;
    var fact = function (k, v, pending) { return '<div><dt>' + esc(k) + '</dt><dd' + (pending ? ' class="is-pending"' : '') + '>' + v + '</dd></div>'; };
    $('#viewerFacts').innerHTML =
      fact(t.client, clientName(clientById(p.client))) +
      fact(t.role, esc(d.role)) +
      fact(t.decision, d.decision ? esc(d.decision) : esc(t.toAdd), !d.decision);
    $('#viewerClose').textContent = t.close;
    viewer.hidden = false;
    cursor.classList.remove('is-label');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
    if (motion) {
      G.fromTo(viewer, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .8, ease: 'expo.inOut', clearProps: 'clipPath' });
      G.from('.viewer__info > *', { y: 24, autoAlpha: 0, duration: .8, stagger: .06, ease: 'expo.out', delay: .4, clearProps: 'all' });
    }
    $('#viewerClose').focus();
  }

  function closeViewer(instant) {
    var done = function () {
      viewer.hidden = true;
      $('#viewerMedia').innerHTML = '';
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    };
    if (motion && !instant) G.to(viewer, { clipPath: 'inset(0% 0% 100% 0%)', duration: .6, ease: 'expo.inOut', onComplete: function () { G.set(viewer, { clearProps: 'clipPath' }); done(); } });
    else done();
  }

  document.getElementById('viewerClose').addEventListener('click', function () { closeViewer(); });
  document.addEventListener('keydown', function (e) {
    if (viewer.hidden) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'Tab') { e.preventDefault(); $('#viewerClose').focus(); }
  });

  /* ---------- header, language ---------- */
  function setNav() {
    $$('.menu__link').forEach(function (a) {
      var r = a.getAttribute('data-route');
      if (current && current.name === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- full-screen menu ---------- */
  var menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
  var menuOpen = false, menuAnim = null;

  function renderMenu() {
    var t = ui(), c = S.contact;
    $('#menuNav').innerHTML = ['home', 'work', 'experience', 'contact'].map(function (r) {
      var label = sig(t.navSig[r]);
      return '<a class="menu__link" href="#/' + (r === 'home' ? '' : r) + '" data-route="' + r + '" aria-label="' + esc(t.nav[r]) + '">' +
        '<span class="menu__roll"><span class="menu__word">' + label + '</span><span class="menu__word" aria-hidden="true">' + label + '</span></span></a>';
    }).join('');
    $('#menuFoot').innerHTML =
      '<a class="u" href="mailto:' + esc(c.email) + '"><bdi dir="ltr">' + esc(c.email) + '</bdi></a>' +
      '<span class="menu__socials">' + c.socials.slice(0, 3).map(function (s) {
        return '<a class="u" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + brand(s.name) + '</a>';
      }).join('') + '</span>';
    $('#menuBtnLabel').textContent = menuOpen ? t.menuClose : t.menu;
    $$('.menu__link').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(true); });
    });
    setNav();
  }

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    $('#menuBtnLabel').textContent = ui().menuClose;
    root.classList.add('menu-open');
    header.classList.remove('is-hidden');
    if (lenis) lenis.stop();
    if (menuAnim) menuAnim.kill();
    if (motion) {
      menuAnim = G.timeline()
        .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .75, ease: 'expo.inOut' })
        .from('.menu__link .menu__roll', { yPercent: 110, duration: .9, stagger: .07, ease: 'expo.out' }, .35)
        .from('.menu__foot > *', { y: 20, autoAlpha: 0, duration: .6, stagger: .08, ease: 'expo.out', clearProps: 'all' }, .55);
    }
    var first = $('.menu__link');
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu(instant) {
    if (!menuOpen) return;
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    $('#menuBtnLabel').textContent = ui().menu;
    var done = function () {
      menu.hidden = true;
      root.classList.remove('menu-open');
      G && G.set(menu, { clearProps: 'clipPath' });
      if (lenis && viewer.hidden) lenis.start();
    };
    if (menuAnim) menuAnim.kill();
    if (motion && !instant) menuAnim = G.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: .6, ease: 'expo.inOut', onComplete: done });
    else done();
    if (!instant) menuBtn.focus();
  }

  menuBtn.addEventListener('click', function () { if (menuOpen) closeMenu(); else openMenu(); });
  document.addEventListener('keydown', function (e) { if (menuOpen && e.key === 'Escape') closeMenu(); });

  /* ---------- footer ---------- */
  function renderFooter() {
    var t = ui(), c = S.contact, p = S.person[lang];
    var run = '';
    for (var i = 0; i < 4; i++) run += '<span class="foot__name">' + sig(t.footName) + '</span>' + STAR;
    $('#foot').innerHTML =
      '<div class="foot__top"><span>' + esc(p.name.join(' ')) + '</span>' + STAR + '<span>' + esc(t.edition) + '</span></div>' +
      '<div class="foot__grid">' +
        '<div class="foot__col">' +
          '<p class="foot__k">' + esc(t.phone) + '</p><a class="u" href="' + esc(c.whatsapp) + '" target="_blank" rel="noopener"><bdi dir="ltr">' + esc(c.phone) + '</bdi></a>' +
          '<p class="foot__k">' + esc(t.email) + '</p><a class="u" href="mailto:' + esc(c.email) + '"><bdi dir="ltr">' + esc(c.email) + '</bdi></a>' +
        '</div>' +
        '<div class="foot__col foot__col--end">' +
          '<p class="foot__k">' + esc(t.elsewhere) + '</p>' +
          c.socials.map(function (s) { return '<a class="u" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + brand(s.name) + '</a>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div class="foot__marquee" aria-hidden="true"><div class="foot__track">' + run + '</div><div class="foot__track">' + run + '</div></div>' +
      '<p class="foot__legal"><span>© 2026 ' + esc(p.name.join(' ')) + '</span><span>' + esc(t.rights) + '</span></p>';
  }

  function applyChrome() {
    var t = ui(), p = S.person[lang];
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t.title;
    renderMenu();
    renderFooter();
    if (typeof themeChrome === 'function' && themeBtn) themeChrome();
    $('[data-t="markName"]').textContent = p.name.join(' ');
    $('[data-t="markLab"]').textContent = p.lab;
    $('.mark').setAttribute('aria-label', t.nav.home);
    $('.skip').textContent = lang === 'ar' ? 'انتقل للمحتوى' : 'Skip to content';
    $('#lang').setAttribute('aria-label', t.langLabel);
    $$('#lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
  }

  $$('#lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      if (l === lang) return;
      lang = l;
      try { localStorage.setItem('lang', l); } catch (e) {}
      var swap = function () { applyChrome(); var r = current; current = null; show(r); enter(r); };
      if (motion) G.to(view, { autoAlpha: 0, duration: .25, onComplete: function () { swap(); G.to(view, { autoAlpha: 1, duration: .35, clearProps: 'all' }); } });
      else swap();
    });
  });

  /* ---------- theme (light / dark) ---------- */
  var themeBtn = document.getElementById('themeBtn');
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  function theme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function themeChrome() {
    var dark = theme() === 'dark';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0C1210' : '#E7E5DE');
    var label = lang === 'ar' ? (dark ? 'الوضع الفاتح' : 'الوضع الداكن') : (dark ? 'Light mode' : 'Dark mode');
    themeBtn.setAttribute('aria-label', label);
    themeBtn.setAttribute('title', label);
  }
  // Rebuild the view so canvas-drawn pieces (portrait halftone, colour fill) pick up the new colours.
  function setTheme(t, save) {
    if (t === theme()) return;
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
    var swap = function () {
      root.setAttribute('data-theme', t);
      themeChrome();
      if (current) { var r = current; current = null; show(r); enter(r); }
    };
    if (motion && current) G.to(view, { autoAlpha: 0, duration: .25, onComplete: function () { swap(); G.to(view, { autoAlpha: 1, duration: .4, clearProps: 'all' }); } });
    else swap();
  }
  themeBtn.addEventListener('click', function () { setTheme(theme() === 'dark' ? 'light' : 'dark', true); });
  var onSystem = function (e) {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (!saved) setTheme(e.matches ? 'dark' : 'light', false);   // follow the device unless the visitor chose
  };
  if (mqDark.addEventListener) mqDark.addEventListener('change', onSystem);

  var lastY = 0;
  function onScroll(y) {
    setHeaderTone(y);
    if (y > lastY + 6 && y > 140) header.classList.add('is-hidden');
    else if (y < lastY - 6 || y < 140) header.classList.remove('is-hidden');
    lastY = y;
  }

  /* ---------- micro-interactions ---------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cx, cy;
  if (fine && G && !reduce) {
    cx = G.quickTo(cursor, 'x', { duration: .35, ease: 'power3.out' });
    cy = G.quickTo(cursor, 'y', { duration: .35, ease: 'power3.out' });
    window.addEventListener('pointermove', function (e) { cursor.classList.add('is-on'); cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('is-on'); });
  }
  function bindCursorTargets(ctx) {
    if (!cx) return;
    $$('[data-cursor]', ctx).forEach(function (el) {
      if (el._cur) return; el._cur = true;
      el.addEventListener('pointerenter', function () { $('#cursorLabel').textContent = el.getAttribute('data-cursor'); cursor.classList.add('is-label'); });
      el.addEventListener('pointerleave', function () { cursor.classList.remove('is-label'); });
    });
  }
  function bindMagnetic(ctx) {
    if (!fine || !motion) return;
    $$('[data-magnetic]', ctx).forEach(function (el) {
      var mx = G.quickTo(el, 'x', { duration: .5, ease: 'power3.out' }), my = G.quickTo(el, 'y', { duration: .5, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) {
        var b = el.getBoundingClientRect();
        mx((e.clientX - b.left - b.width / 2) * .3); my((e.clientY - b.top - b.height / 2) * .4);
      });
      el.addEventListener('pointerleave', function () { G.to(el, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, .4)' }); });
    });
  }

  /* ---------- smooth scroll ---------- */
  function initLenis() {
    if (!motion || !window.Lenis) { window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true }); return; }
    lenis = new window.Lenis({ lerp: .1, wheelMultiplier: 1 });
    lenis.on('scroll', ST.update);
    lenis.on('scroll', function (e) { onScroll(e.scroll); });
    G.ticker.add(function (time) { lenis.raf(time * 1000); });
    G.ticker.lagSmoothing(0);
  }

  /* ---------- intro (first visit per session) ---------- */
  function intro(next) {
    var el = document.getElementById('intro');
    var seen = root.classList.contains('intro-seen');
    if (seen || !motion) { el.classList.add('is-done'); next(); return; }
    el.style.animation = 'none';
    var frame = document.getElementById('introFrame'), label = document.getElementById('introRatio');
    var s = frame.parentNode.offsetWidth;
    var tl = G.timeline({ defaults: { ease: 'expo.inOut' } });
    tl.from(frame, { scaleY: 0, transformOrigin: 'bottom', duration: .8, ease: 'expo.out' })
      .to(frame, { width: s * .8, height: s, duration: .8 }, '+=.25').add(function () { label.textContent = '4:5'; }, '<.4')
      .to(frame, { width: s, height: s * .5625, duration: .8 }, '+=.2').add(function () { label.textContent = '16:9'; }, '<.4')
      .to(label, { autoAlpha: 0, duration: .3 }, '+=.15')
      .to(frame, { width: window.innerWidth * 1.02, height: window.innerHeight * 1.02, duration: .9 }, '<')
      .add(function () { el.style.background = 'transparent'; next(); })
      .to(el, parse().name === 'home' ? { autoAlpha: 0, duration: .5, ease: 'power1.out' } : { clipPath: 'inset(0% 0% 100% 0%)', duration: .9 }, '+=.05')
      .add(function () { el.classList.add('is-done'); try { sessionStorage.setItem('introSeen', '1'); } catch (e) {} });
  }

  // Crossing the desktop breakpoint switches the morph on or off, so the home view is rebuilt.
  var mqDesk = window.matchMedia('(min-width: 901px)');
  var onMq = function () { if (current && current.name === 'home' && viewer.hidden) { var r = current; current = null; show(r); enter(r); } };
  if (mqDesk.addEventListener) mqDesk.addEventListener('change', onMq);

  /* ---------- boot ---------- */
  // Each view starts at the top (or at its own anchor); the browser's own restore would desync smooth scrolling.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  applyChrome();
  initLenis();
  window.addEventListener('hashchange', onRoute);
  window.addEventListener('resize', function () { if (current && current.name === 'work') setFilterState(false); });
  intro(function () { onRoute(); });
})();
