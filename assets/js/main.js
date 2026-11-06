/* ==========================================================================
   main.js  =  "BỘ NÃO" CỦA TRANG: xử lý hành vi khi người xem bấm, cuộn, đổi ngôn ngữ

   Nội dung chữ và ảnh nằm ở content.js, giao diện nằm ở style.css.
   File này đọc nội dung từ content.js rồi dựng thành các thành phần trên trang.

   Các phần chính (tìm theo dấu ===):
   1. Công cụ nhỏ        2. Hình minh họa động     3. Bầu trời sao (canvas)
   4. Màn khảo sát       5. Các mục của trang      6. Thẻ nổi (modal)
   7. Form liên hệ       8. Khởi động
   ========================================================================== */
(() => {
  "use strict";

  const IMG = "assets/img/";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ALT = {
    avatarCv: { vi: "Ảnh chân dung của Huyền", en: "Portrait of Huyền" },
    avatarCasual: { vi: "Ảnh tự chụp của Huyền", en: "A selfie of Huyền" }
  };

  /* === 1. Công cụ nhỏ ==================================================== */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Ghi nhớ lựa chọn ngôn ngữ trong trình duyệt. Bọc try/catch vì có trình duyệt chặn lưu trữ.
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* bỏ qua */ } }
  };

  // h("div", {class: "a"}, "chữ", phầnTử): tạo phần tử HTML an toàn (không chèn HTML thô từ nội dung).
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value === false || value === null || value === undefined) continue;
      if (key === "class") el.className = value;
      else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      el.append(typeof child === "object" ? child : document.createTextNode(child));
    }
    return el;
  }

  // Chèn một đoạn SVG viết sẵn (chỉ dùng cho hằng số trong file này, không dùng cho chữ từ bên ngoài).
  function svgBox(className, markup) {
    const box = h("span", { class: className });
    box.innerHTML = markup;
    return box;
  }

  /* --- Trạng thái của trang --- */
  let lang = pickLanguage();
  let view = null; // "recruiter" hoặc "other"; null = đang ở màn khảo sát
  const t = () => CONTENT[lang];

  function pickLanguage() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl === "vi" || fromUrl === "en") return fromUrl;
    const saved = store.get("lang");
    if (saved === "vi" || saved === "en") return saved;
    return (navigator.language || "vi").toLowerCase().startsWith("vi") ? "vi" : "en";
  }

  /* === 2. Hình minh họa động (SVG) ======================================= */
  // Mỗi hình là một đoạn SVG nhỏ; chuyển động nằm trong style.css (các class a-spin, a-bob...).

  const SVG_OPEN = '<svg viewBox="0 0 120 120" role="presentation" aria-hidden="true" focusable="false">';
  const ART = {
    planet: SVG_OPEN + '<g class="a-bob"><ellipse cx="60" cy="62" rx="50" ry="13" class="ol" transform="rotate(-18 60 62)"/><circle cx="60" cy="60" r="27" class="f-violet"/><circle cx="50" cy="50" r="9" class="f-pink" opacity=".55"/><circle cx="72" cy="70" r="5" class="f-cyan" opacity=".5"/><path d="M10 62 A50 13 0 0 0 110 62" class="ol" transform="rotate(-18 60 62)"/></g></svg>',
    book: SVG_OPEN + '<path d="M60 38 C46 30 30 30 18 36 V90 C30 84 46 84 60 92 Z" class="f-violet"/><path d="M60 38 C74 30 90 30 102 36 V90 C90 84 74 84 60 92 Z" class="f-pink"/><path d="M60 38 V92" class="ln"/><g class="a-bob"><path d="M60 8 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" class="f-amber"/></g></svg>',
    film: SVG_OPEN + '<rect x="16" y="30" width="88" height="60" rx="12" class="ol"/><path d="M52 48 L78 60 L52 72 Z" class="f-pink a-pulse"/><circle cx="26" cy="104" r="3" class="f-cyan a-twinkle"/><circle cx="96" cy="16" r="3" class="f-amber a-twinkle d1"/></svg>',
    chat: SVG_OPEN + '<g class="a-bob"><rect x="12" y="22" width="60" height="38" rx="14" class="f-violet"/><path d="M28 58 L20 74 L44 58 Z" class="f-violet"/><circle cx="30" cy="41" r="3" class="f-white"/><circle cx="42" cy="41" r="3" class="f-white"/><circle cx="54" cy="41" r="3" class="f-white"/></g><g class="a-bob b"><rect x="48" y="54" width="60" height="38" rx="14" class="f-pink"/><path d="M92 90 L100 106 L76 90 Z" class="f-pink"/></g></svg>',
    link: SVG_OPEN + '<path d="M28 84 L60 32 L94 84 Z" class="ln"/><circle cx="28" cy="84" r="10" class="f-cyan a-pulse"/><circle cx="60" cy="32" r="10" class="f-pink a-pulse d1"/><circle cx="94" cy="84" r="10" class="f-amber a-pulse d2"/></svg>',
    spark: SVG_OPEN + '<g class="a-spin slow" style="transform-origin:60px 60px"><path d="M60 10 L69 51 L110 60 L69 69 L60 110 L51 69 L10 60 L51 51 Z" class="f-amber"/></g><circle cx="60" cy="60" r="12" class="f-pink a-pulse"/></svg>',
    wave: SVG_OPEN + '<g class="a-bob"><circle cx="60" cy="26" r="8" class="f-amber"/><path d="M54 34 L42 58 M60 34 V60 M66 34 L78 58" class="ln"/></g><path d="M-40 78 q12.5 -14 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0" class="ln-cyan a-flow"/><path d="M-40 94 q12.5 -14 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0" class="ln-pink a-flow r"/></svg>',
    compass: SVG_OPEN + '<circle cx="60" cy="60" r="46" class="ol"/><g class="a-swing" style="transform-origin:60px 60px"><path d="M60 20 L71 60 L60 100 L49 60 Z" class="f-pink"/><path d="M60 20 L71 60 H49 Z" class="f-cyan"/></g><circle cx="60" cy="60" r="4" class="f-white"/></svg>',
    moon: SVG_OPEN + '<path d="M82 20 A42 42 0 1 0 100 86 A34 34 0 1 1 82 20 Z" class="f-amber"/><circle cx="92" cy="30" r="3" class="f-white a-twinkle"/><circle cx="104" cy="52" r="2.5" class="f-cyan a-twinkle d1"/><circle cx="22" cy="24" r="2.5" class="f-pink a-twinkle d2"/></svg>',
    orbit: SVG_OPEN + '<ellipse cx="60" cy="60" rx="48" ry="18" class="ol" transform="rotate(30 60 60)"/><ellipse cx="60" cy="60" rx="48" ry="18" class="ol" transform="rotate(-30 60 60)"/><circle cx="60" cy="60" r="11" class="f-violet"/><g class="a-spin" style="transform-origin:60px 60px"><circle cx="108" cy="60" r="5" class="f-cyan"/></g><g class="a-spin rev" style="transform-origin:60px 60px"><circle cx="12" cy="60" r="4" class="f-pink"/></g></svg>'
  };
  const artEl = (name, extra) => svgBox("art" + (extra ? " " + extra : ""), ART[name] || ART.orbit);

  const ICON = {
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* === 3. Bầu trời sao (canvas) ========================================= */
  // Vẽ sao nhấp nháy trôi rất chậm. Khi người xem chọn vai trò, sao "lướt nhanh" khoảng 1 giây
  // (hiệu ứng bay qua vũ trụ) rồi chậm lại: đây là khoảnh khắc chuyển cảnh chính của trang.

  const sky = (() => {
    const canvas = $("#sky");
    const ctx = canvas.getContext("2d");
    const IDLE = reduceMotion ? 0 : 0.000008; // tốc độ trôi bình thường
    const WARP = 0.0022; // tốc độ khi lướt nhanh
    const COLORS = ["#ffffff", "#ffffff", "#d6defe", "#ffd9ee", "#cdf4ff", "#ffeab5"];
    let w = 0, hgt = 0, f = 0, stars = [], speed = IDLE, target = IDLE, last = 0, timer = 0;

    function spawn(anywhere) {
      return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: anywhere ? Math.random() * 0.97 + 0.03 : 1,
        tw: Math.random() * Math.PI * 2,
        color: COLORS[(Math.random() * COLORS.length) | 0]
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      hgt = window.innerHeight;
      f = Math.max(w, hgt) * 0.5;
      canvas.width = w * dpr;
      canvas.height = hgt * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = hgt + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(340, Math.max(150, (w * hgt) / 6500)));
      stars = Array.from({ length: count }, () => spawn(true));
      if (reduceMotion) draw(16);
    }

    function draw(dt) {
      ctx.clearRect(0, 0, w, hgt);
      const cx = w / 2, cy = hgt / 2;
      const streaking = speed > 0.0004;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const oldZ = s.z;
        s.z -= speed * dt;
        s.tw += dt * 0.0022;
        if (s.z <= 0.03) { stars[i] = spawn(false); continue; }
        const sx = cx + (s.x / s.z) * f * 0.55;
        const sy = cy + (s.y / s.z) * f * 0.55;
        if (sx < -40 || sx > w + 40 || sy < -40 || sy > hgt + 40) { stars[i] = spawn(false); continue; }
        const depth = 1 - s.z;
        const size = 0.4 + depth * 1.9;
        const twinkle = reduceMotion ? 1 : 0.7 + 0.3 * Math.sin(s.tw);
        ctx.globalAlpha = Math.min(1, (0.3 + depth * 0.7) * twinkle);
        ctx.strokeStyle = s.color;
        ctx.fillStyle = s.color;
        if (streaking) {
          const ox = cx + (s.x / oldZ) * f * 0.55;
          const oy = cy + (s.y / oldZ) * f * 0.55;
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      const dt = Math.min(now - last, 60);
      last = now;
      speed += (target - speed) * (1 - Math.exp(-dt / 160));
      draw(dt);
      requestAnimationFrame(frame);
    }

    function start() {
      resize();
      window.addEventListener("resize", resize);
      if (!reduceMotion) requestAnimationFrame((now) => { last = now; frame(now); });
    }

    // Lướt nhanh trong khoảng "ms" mili giây rồi trở lại bình thường.
    function warp(ms) {
      if (reduceMotion) return;
      target = WARP;
      clearTimeout(timer);
      timer = setTimeout(() => { target = IDLE; }, ms);
    }

    return { start, warp };
  })();

  /* === 4. Màn khảo sát ================================================== */

  function renderGate() {
    const L = t().ui;
    const option = (value, title, note, art) =>
      h("button", { class: "gate-option", type: "button", "data-view": value, onclick: () => chooseView(value) },
        artEl(art, "gate-art"),
        h("span", { class: "gate-option-title" }, title),
        h("span", { class: "gate-option-note" }, note));

    $("#gate").replaceChildren(
      h("button", { class: "lang-btn gate-lang", type: "button", "aria-label": L.langToggleLabel, onclick: toggleLang }, L.langToggle),
      h("div", { class: "gate-inner" },
        h("img", { class: "gate-logo", src: IMG + "logo.png", alt: "", width: "96", height: "96" }),
        h("h1", { id: "gate-title", class: "gate-title" }, L.gateTitle),
        h("p", { class: "gate-slogan" }, t().slogan),
        h("p", { class: "gate-question", id: "gate-question" }, L.gateQuestion),
        h("div", { class: "gate-options", role: "group", "aria-labelledby": "gate-question" },
          option("recruiter", L.gateRecruiter, L.gateRecruiterNote, "orbit"),
          option("other", L.gateOther, L.gateOtherNote, "planet"))));
  }

  function chooseView(value) {
    view = value;
    document.body.classList.add("is-warping");
    sky.warp(1000);
    const delay = reduceMotion ? 0 : 750;
    setTimeout(() => {
      showSite();
      window.scrollTo(0, 0);
      document.body.classList.remove("is-warping");
    }, delay);
  }

  function showSite() {
    $("#gate").hidden = true;
    $("#site").hidden = false;
    document.body.dataset.view = view;
    renderSite();
  }

  function showGate() {
    closeCard();
    view = null;
    delete document.body.dataset.view;
    $("#site").hidden = true;
    $("#gate").hidden = false;
    renderGate();
    window.scrollTo(0, 0);
    document.title = t().docTitle;
    sky.warp(600);
  }

  function toggleLang() {
    lang = lang === "vi" ? "en" : "vi";
    store.set("lang", lang);
    closeCard();
    applyLanguageToDocument();
    if (view) {
      const y = window.scrollY;
      renderSite();
      window.scrollTo(0, y);
    } else {
      renderGate();
    }
  }

  function applyLanguageToDocument() {
    document.documentElement.lang = t().htmlLang;
    document.title = t().docTitle;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", t().metaDesc);
  }

  /* === 5. Các mục của trang ============================================== */

  function renderSite() {
    const T = t();
    applyLanguageToDocument();

    // Thanh trên cùng
    $("#brand-name").textContent = SITE.shortName;
    $("#brand").setAttribute("aria-label", T.ui.backHome);
    const switchBtn = $("#switch-view");
    switchBtn.textContent = T.ui.switchView;
    const langBtn = $("#lang-toggle");
    langBtn.textContent = T.ui.langToggle;
    langBtn.setAttribute("aria-label", T.ui.langToggleLabel);
    $("#skip-link").textContent = T.ui.skip;

    renderNav();
    renderRail();

    const builders = { about: sectionAbout, education: sectionEducation, skills: sectionSkills, experience: sectionExperience, projects: sectionProjects, activities: sectionActivities, languages: sectionLanguages, hobbies: sectionHobbies, life: sectionLife, contact: sectionContact };
    const main = $("#main");
    main.replaceChildren(renderHero(), ...T.nav[view].map((item) => builders[item.id]()));

    $("#footer-text").textContent = T.ui.footer;
    watchSections();
  }

  function renderNav() {
    const nav = $("#nav");
    nav.setAttribute("aria-label", t().ui.navLabel);
    nav.replaceChildren(...t().nav[view].map((item) =>
      h("button", { class: "nav-btn", type: "button", "data-target": item.id, onclick: () => goTo(item.id) }, item.label)));
  }

  function goTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }

  // Đánh dấu mục đang xem trên thanh menu khi người xem cuộn trang.
  let spy = null;
  function watchSections() {
    if (spy) spy.disconnect();
    spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        $$(".nav-btn").forEach((btn) => {
          const on = btn.dataset.target === entry.target.id;
          btn.classList.toggle("is-active", on);
          if (on) {
            btn.setAttribute("aria-current", "true");
            btn.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
          } else btn.removeAttribute("aria-current");
        });
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => { if (s.id !== "top") spy.observe(s); });
  }

  /* --- Thanh kênh liên lạc bên trái --- */
  function phoneText() { return SITE.phoneParts.join(" "); }
  function phoneHref() { return "tel:+84" + SITE.phoneParts.join("").replace(/\D/g, "").replace(/^0/, ""); }

  function revealPhone() {
    const slot = $("#phone-slot");
    if (!slot) return;
    slot.replaceChildren(h("a", { class: "channel-link", href: phoneHref() }, phoneText()));
  }

  function renderRail() {
    const C = t().contact.channels;
    const link = (href, label, inner, key) =>
      h("a", { class: "rail-btn rail-" + key, href, target: href.startsWith("http") ? "_blank" : null, rel: "noopener", "aria-label": label, title: label }, inner);
    const glyph = (text) => h("span", { class: "glyph", "aria-hidden": "true" }, text);
    const rail = $("#rail");
    rail.setAttribute("aria-label", t().ui.railLabel);
    rail.replaceChildren(
      link(SITE.linkedin, C.linkedin, glyph("in"), "linkedin"),
      link(SITE.facebook, C.facebook, glyph("f"), "facebook"),
      link("mailto:" + SITE.email, C.email, svgBox("icon", ICON.mail), "mail"),
      h("button", {
        class: "rail-btn rail-phone", type: "button", "aria-label": C.phone, title: C.phone,
        onclick: () => { goTo("contact"); revealPhone(); }
      }, svgBox("icon", ICON.phone)));
  }

  /* --- Phần đầu trang (hero) --- */
  function renderHero() {
    const T = t();
    const H = T.hero[view];
    const isRecruiter = view === "recruiter";
    const cta = (item, cls) => h("button", { class: "btn " + cls, type: "button", onclick: () => goTo(item.target) }, item.label);
    return h("section", { id: "top", class: "hero", tabindex: "-1", "aria-labelledby": "hero-name" },
      h("div", { class: "wrap hero-grid" },
        h("div", { class: "hero-text" },
          h("h1", { id: "hero-name", class: "hero-name" }, SITE.shortName),
          h("p", { class: "hero-slogan" }, T.slogan),
          h("p", { class: "hero-sub" }, H.sub),
          h("div", { class: "hero-cta" },
            cta(H.primary, "btn-primary"),
            cta(H.secondary, "btn-ghost"),
            isRecruiter && SITE.cvFile ? h("a", { class: "btn btn-ghost", href: SITE.cvFile, download: "" }, T.ui.cv) : null)),
        h("div", { class: "hero-photo" },
          h("span", { class: "hero-ring", "aria-hidden": "true" }),
          h("img", {
            src: IMG + (isRecruiter ? "avatar-cv.jpg" : "avatar-casual.jpg"),
            alt: ALT[isRecruiter ? "avatarCv" : "avatarCasual"][lang],
            width: "400", height: "533", decoding: "async"
          }))),
      h("button", { class: "scroll-hint", type: "button", onclick: () => goTo(T.nav[view][0].id) },
        h("span", {}, T.ui.scrollHint), svgBox("icon", ICON.down)));
  }

  /* --- Khung chung của mỗi mục --- */
  function section(id, title, intro, ...content) {
    return h("section", { id, class: "section", tabindex: "-1", "aria-labelledby": id + "-title" },
      h("div", { class: "wrap" },
        h("h2", { id: id + "-title", class: "section-title" }, title),
        intro ? h("p", { class: "section-intro" }, intro) : null,
        ...content));
  }

  const chipList = (items, cls) => h("ul", { class: "chips" + (cls ? " " + cls : "") }, items.map((c) => h("li", { class: "chip" }, c)));

  function sectionAbout() {
    const A = t().about[view];
    return section("about", A.title, null,
      h("div", { class: "panel about-panel" },
        h("div", { class: "prose" }, A.paragraphs.map((p) => h("p", {}, p))),
        chipList(A.chips, "chips-lg")));
  }

  function sectionEducation() {
    const E = t().education;
    return section("education", E.title, null,
      h("div", { class: "card-grid" }, E.items.map((item) => itemCard(item))),
      h("h3", { class: "subtitle" }, E.certTitle),
      h("ul", { class: "cert-list" }, E.certs.map((c) => h("li", { class: "cert" }, c))));
  }

  function sectionSkills() {
    const S = t().skills;
    return section("skills", S.title, null,
      h("div", { class: "skill-grid" }, S.groups.map((g) =>
        h("div", { class: "panel skill" },
          h("h3", { class: "skill-title" }, g.title),
          chipList(g.items),
          g.note ? h("p", { class: "skill-note" }, g.note) : null))));
  }

  function sectionExperience() {
    const E = t().experience;
    return section("experience", E.title, null,
      h("ol", { class: "constellation" }, E.items.map((item) =>
        h("li", { class: "star-item" + (item.current ? " is-current" : "") },
          h("span", { class: "star-node", "aria-hidden": "true" }),
          itemCard(item)))));
  }

  function sectionProjects() {
    const P = t().projects;
    return section("projects", P.title, null, h("div", { class: "card-grid" }, P.items.map((item) => itemCard(item))));
  }

  function sectionActivities() {
    const A = t().activities;
    return section("activities", A.title, null, h("div", { class: "card-grid" }, A.items.map((item) => itemCard(item))));
  }

  function sectionLanguages() {
    const L = t().languages;
    return section("languages", L.title, null,
      h("ul", { class: "lang-grid" }, L.items.map((item) =>
        h("li", { class: "lang-card" },
          h("span", { class: "lang-ring", "aria-hidden": "true" }),
          h("span", { class: "lang-name" }, item.name),
          h("span", { class: "lang-level" }, item.level)))));
  }

  function sectionHobbies() {
    const H = t().hobbies;
    return section("hobbies", H.title, H.intro,
      h("div", { class: "tile-grid" }, H.items.map((item) => itemCard(item, "tile"))));
  }

  function sectionLife() {
    const L = t().life;
    return section("life", L.title, L.intro,
      h("div", { class: "card-grid" }, L.items.map((item) => itemCard(item, "wide"))));
  }

  /* --- Thẻ nhỏ trong danh sách: bấm vào thì mở thẻ nổi --- */
  function itemCard(item, mode) {
    let thumb = null;
    if (item.cover) thumb = h("img", { src: IMG + item.cover, alt: "", loading: "lazy", decoding: "async" });
    else if (item.logo) thumb = h("img", { class: "thumb-logo", src: IMG + item.logo, alt: "", loading: "lazy", decoding: "async" });
    else if (item.art) thumb = artEl(item.art);
    else if (item.media) thumb = h("img", { src: IMG + MEDIA[item.media][0].src, alt: "", loading: "lazy", decoding: "async" });

    const subline = item.org || item.sub;
    return h("button", {
      class: "card-btn" + (mode ? " card-" + mode : ""),
      type: "button", "aria-haspopup": "dialog", "data-id": item.id,
      onclick: () => openCard(item)
    },
      h("span", { class: "card-thumb" }, thumb),
      h("span", { class: "card-body" },
        item.period ? h("span", { class: "card-meta" }, item.period + (item.tag ? ", " + item.tag : "")) : null,
        h("span", { class: "card-title" }, item.title),
        subline ? h("span", { class: "card-sub" }, subline) : null,
        mode === "wide" && item.text ? h("span", { class: "card-sub" }, item.text) : null));
  }

  /* === 6. Thẻ nổi (modal) =============================================== */
  // Dùng thẻ <dialog> có sẵn của trình duyệt: tự có nút Esc để đóng, tự khóa phần nền phía sau.

  const dlg = $("#card");

  function openCard(item) {
    const T = t();
    const media = item.media ? MEDIA[item.media] : null;

    const head = h("header", { class: "card-head" },
      item.logo ? h("img", { class: "card-logo", src: IMG + item.logo, alt: "" }) : item.art ? artEl(item.art, "card-art") : null,
      h("div", { class: "card-headtext" },
        h("h3", { id: "card-title", class: "card-heading" }, item.title),
        item.org || item.sub ? h("p", { class: "card-org" }, item.org || item.sub) : null,
        item.period ? h("p", { class: "card-period" }, item.period + (item.tag ? ", " + item.tag : "")) : null));

    const body = h("div", { class: "card-content" },
      item.text ? h("p", { class: "card-text" }, item.text) : null,
      item.bullets ? h("ul", { class: "card-bullets" }, item.bullets.map((b) => h("li", {}, b))) : null,
      item.chips ? chipList(item.chips) : null,
      media ? h("ul", { class: "gallery" }, media.map((m) =>
        h("li", {}, h("a", { href: IMG + m.src, target: "_blank", rel: "noopener" },
          h("img", { src: IMG + m.src, alt: m.alt[lang], loading: "lazy", decoding: "async" })))) ) : null);

    dlg.replaceChildren(h("div", { class: "card-inner" },
      h("button", { class: "card-close", type: "button", "aria-label": T.ui.close, onclick: closeCard }, svgBox("icon", ICON.close)),
      head, body));
    dlg.setAttribute("aria-labelledby", "card-title");
    document.body.classList.add("modal-open");
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    $(".card-inner", dlg).scrollTop = 0;
  }

  function closeCard() {
    if (dlg.open) { if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open"); }
    document.body.classList.remove("modal-open");
  }

  dlg.addEventListener("close", () => document.body.classList.remove("modal-open"));
  // Bấm ra ngoài thẻ (vào vùng nền mờ) thì đóng.
  dlg.addEventListener("click", (event) => { if (event.target === dlg) closeCard(); });

  /* === 7. Form liên hệ =================================================== */

  function sectionContact() {
    const C = t().contact;
    const F = C.form;
    const isRecruiter = view === "recruiter";

    const field = (name, label, props, tag) =>
      h("label", { class: "field" }, h("span", { class: "field-label" }, label), h(tag || "input", Object.assign({ name, id: "f-" + name }, props)));

    const form = h("form", { class: "panel contact-form", novalidate: false, onsubmit: submitForm },
      field("name", F.name, { type: "text", required: true, autocomplete: "name" }),
      isRecruiter
        ? field("email", F.email, { type: "email", required: true, autocomplete: "email" })
        : field("facebook", F.facebook, { type: "text", required: true }),
      field("phone", F.phone, { type: "tel", autocomplete: "tel" }),
      field("message", F.message, { required: true, rows: "5" }, "textarea"),
      // Ô bẫy cho bot: người thật không thấy, bot thường tự điền vào.
      h("div", { class: "hp", "aria-hidden": "true" }, h("input", { type: "text", name: "company", tabindex: "-1", autocomplete: "off" })),
      h("button", { class: "btn btn-primary", type: "submit" }, F.send),
      h("p", { class: "form-status", role: "status", "aria-live": "polite" }));

    const channel = (href, text, external) =>
      h("li", {}, h("a", { class: "channel-link", href, target: external ? "_blank" : null, rel: "noopener" }, text));

    const channels = h("div", { class: "panel channels" },
      h("ul", { class: "channel-list" },
        channel(SITE.linkedin, C.channels.linkedin, true),
        channel(SITE.facebook, C.channels.facebook, true),
        channel("mailto:" + SITE.email, SITE.email, false),
        h("li", { id: "phone-slot" }, h("button", { class: "channel-link as-button", type: "button", onclick: revealPhone }, C.showPhone))),
      isRecruiter && SITE.cvFile ? h("a", { class: "btn btn-ghost", href: SITE.cvFile, download: "" }, t().ui.cv) : null);

    return section("contact", isRecruiter ? C.titleRecruiter : C.titleOther, isRecruiter ? C.introRecruiter : C.introOther,
      h("div", { class: "contact-grid" }, form, channels));
  }

  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const F = t().contact.form;
    const status = $(".form-status", form);
    const button = $("button[type=submit]", form);
    status.className = "form-status";
    status.textContent = "";
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    if (data.company) { // bot điền vào ô bẫy: giả vờ thành công rồi bỏ qua
      status.textContent = F.sent;
      form.reset();
      return;
    }
    delete data.company;
    data.role = view;
    data.language = lang;
    data._subject = view === "recruiter" ? F.subjectRecruiter : F.subjectOther;

    if (SITE.formEndpoint) {
      button.disabled = true;
      button.textContent = F.sending;
      try {
        const res = await fetch(SITE.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        status.textContent = F.sent;
        status.classList.add("is-ok");
        form.reset();
      } catch (err) {
        status.textContent = F.failed;
        status.classList.add("is-error");
      } finally {
        button.disabled = false;
        button.textContent = F.send;
      }
      return;
    }

    // Chưa cấu hình dịch vụ nhận form: mở email của người xem với nội dung điền sẵn.
    const lines = [F.name + ": " + data.name];
    if (data.email) lines.push(F.email + ": " + data.email);
    if (data.facebook) lines.push(F.facebook + ": " + data.facebook);
    if (data.phone) lines.push(F.phone + ": " + data.phone);
    lines.push("", data.message);
    location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    status.textContent = F.mailto;
    status.classList.add("is-ok");
  }

  /* === 8. Khởi động ====================================================== */

  function init() {
    sky.start();
    applyLanguageToDocument();

    $("#brand").addEventListener("click", () => goTo("top"));
    $("#switch-view").addEventListener("click", showGate);
    $("#lang-toggle").addEventListener("click", toggleLang);

    // Có thể gửi đường link thẳng vào một giao diện, ví dụ: ...github.io/?as=recruiter
    const direct = new URLSearchParams(location.search).get("as");
    if (direct === "recruiter" || direct === "other") {
      view = direct;
      showSite();
    } else {
      renderGate();
    }
  }

  init();
})();
