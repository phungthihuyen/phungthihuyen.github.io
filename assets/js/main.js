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

  // Icon nét mảnh cho các dòng "thông tin nhanh" ở đầu trang (mỗi icon một đoạn SVG)
  const FACT_OPEN = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
  const FACT_ICON = {
    cap: FACT_OPEN + '<path d="M2 9l10-5 10 5-10 5z" fill="none"/><path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5" fill="none"/><path d="M22 9v6" fill="none"/></svg>',
    star: FACT_OPEN + '<path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z" fill="none"/></svg>',
    cake: FACT_OPEN + '<path d="M4 20h16v-6a2 2 0 00-2-2H6a2 2 0 00-2 2z" fill="none"/><path d="M4 16c2 1.5 3.5 1.5 4 0 .8 1.5 3 1.5 4 0 1 1.5 3 1.5 4 0 .5 1.5 2 1.5 4 0" fill="none"/><path d="M12 12V8M12 8c-1 0-1.5-1-1.5-2S12 3.5 12 3.5 13.5 5 13.5 6 13 8 12 8z" fill="none"/></svg>',
    sagit: FACT_OPEN + '<path d="M5 19L19 5" fill="none"/><path d="M10 5h9v9" fill="none"/><path d="M7.5 11.5l5 5" fill="none"/></svg>',
    person: FACT_OPEN + '<circle cx="12" cy="8" r="3.5" fill="none"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" fill="none"/><path d="M19 3l.7 1.6 1.6.7-1.6.7L19 7.6l-.7-1.6-1.6-.7 1.6-.7z" fill="none"/></svg>',
    rumor: FACT_OPEN + '<path d="M4 5h16v11H9l-5 4z" fill="none"/><circle cx="9" cy="10.5" r="1" fill="none"/><circle cx="12.5" cy="10.5" r="1" fill="none"/><circle cx="16" cy="10.5" r="1" fill="none"/></svg>'
  };

  /* === 3. Bầu trời sao (canvas) ========================================= */
  // Gồm 3 lớp: (1) dải ngân hà là hàng nghìn hạt bụi sao nhỏ xếp chéo màn hình, vẽ một lần;
  // (2) các ngôi sao có kích cỡ, màu và độ sáng khác nhau, mỗi sao có quầng sáng và nhấp nháy;
  // (3) khi người xem chọn vai trò, sao "lướt nhanh" khoảng 1 giây rồi chậm lại.

  const sky = (() => {
    const canvas = $("#sky");
    const ctx = canvas.getContext("2d");
    const IDLE = reduceMotion ? 0 : 0.000008; // tốc độ trôi bình thường
    const WARP = 0.0022; // tốc độ khi lướt nhanh
    const PALETTE = [[255, 255, 255], [255, 255, 255], [214, 222, 254], [255, 217, 238], [205, 244, 255], [255, 234, 181]];
    const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
    let w = 0, hgt = 0, f = 0, stars = [], speed = IDLE, target = IDLE, last = 0, timer = 0;
    let band = null;
    const sprites = PALETTE.map((c) => {
      // Một hình tròn mờ dần ra rìa: dùng làm "quầng sáng" quanh ngôi sao.
      const cv = document.createElement("canvas");
      cv.width = cv.height = 64;
      const g = cv.getContext("2d");
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},1)`);
      grad.addColorStop(0.16, `rgba(${c[0]},${c[1]},${c[2]},0.5)`);
      grad.addColorStop(0.45, `rgba(${c[0]},${c[1]},${c[2]},0.12)`);
      grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return cv;
    });

    function spawn(anywhere) {
      return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: anywhere ? Math.random() * 0.97 + 0.03 : 1,
        tw: Math.random() * Math.PI * 2,
        tws: 0.0012 + Math.random() * 0.003,
        ci: (Math.random() * PALETTE.length) | 0,
        big: Math.random() < 0.14 // một số sao lớn hơn, sáng hơn để bầu trời có chiều sâu
      };
    }

    // Dải ngân hà: nhiều hạt bụi sao dày ở giữa dải, thưa dần ra hai bên.
    function makeBand(dpr) {
      band = document.createElement("canvas");
      band.width = Math.round(w * dpr);
      band.height = Math.round(hgt * dpr);
      const b = band.getContext("2d");
      b.scale(dpr, dpr);
      const ang = (-24 * Math.PI) / 180, cos = Math.cos(ang), sin = Math.sin(ang);
      const cx = w * 0.5, cy = hgt * 0.5;
      const n = Math.round(Math.min(3200, (w * hgt) / 420));
      const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      for (let i = 0; i < n; i++) {
        const along = (Math.random() - 0.5) * (w + hgt) * 1.1;
        const across = gauss() * hgt * 0.13;
        const x = cx + along * cos - across * sin;
        const y = cy + along * sin + across * cos;
        const c = PALETTE[(Math.random() * PALETTE.length) | 0];
        b.globalAlpha = 0.14 + Math.random() * 0.5;
        b.fillStyle = rgb(c);
        b.beginPath();
        b.arc(x, y, Math.random() < 0.05 ? 1.15 : Math.random() * 0.65 + 0.22, 0, 6.2832);
        b.fill();
      }
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
      const count = Math.round(Math.min(520, Math.max(240, (w * hgt) / 3800)));
      stars = Array.from({ length: count }, () => spawn(true));
      makeBand(dpr);
      if (reduceMotion) draw(16);
    }

    function draw(dt) {
      ctx.clearRect(0, 0, w, hgt);
      if (band) { ctx.globalAlpha = 1; ctx.drawImage(band, 0, 0, w, hgt); }
      const cx = w / 2, cy = hgt / 2;
      const streaking = speed > 0.0004;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const oldZ = s.z;
        s.z -= speed * dt;
        s.tw += dt * s.tws;
        if (s.z <= 0.03) { stars[i] = spawn(false); continue; }
        const sx = cx + (s.x / s.z) * f * 0.55;
        const sy = cy + (s.y / s.z) * f * 0.55;
        if (sx < -40 || sx > w + 40 || sy < -40 || sy > hgt + 40) { stars[i] = spawn(false); continue; }
        const depth = 1 - s.z;
        const size = (0.45 + depth * 1.8) * (s.big ? 1.45 : 1);
        const twinkle = reduceMotion ? 1 : 0.62 + 0.38 * Math.sin(s.tw);
        const alpha = Math.min(1, (0.3 + depth * 0.7) * twinkle);
        const col = PALETTE[s.ci];
        if (streaking) {
          const ox = cx + (s.x / oldZ) * f * 0.55;
          const oy = cy + (s.y / oldZ) * f * 0.55;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = rgb(col);
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          // quầng sáng mờ (chỉ vừa phải để không làm chói chữ), rồi lõi sáng ở giữa
          const glow = size * (s.big ? 9 : 5);
          ctx.globalAlpha = alpha * (s.big ? 0.75 : 0.45);
          ctx.drawImage(sprites[s.ci], sx - glow, sy - glow, glow * 2, glow * 2);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = rgb(col);
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
      if (!document.hidden) draw(dt);
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

  /* --- Hành tinh bay lơ lửng: khi cuộn trang, chúng trôi chậm theo --- */
  // Mỗi hành tinh có một "điểm bắt đầu" và "điểm kết thúc" (tính theo % chiều cao màn hình).
  // Cuộn từ đầu đến cuối trang thì hành tinh trôi từ điểm bắt đầu đến điểm kết thúc, rất chậm.
  const planets = (() => {
    const route = [[10, 56], [74, 22], [38, 84], [88, 46]];
    let ticking = false;
    function update() {
      ticking = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      $$("#planets .planet").forEach((el, i) => {
        const r = route[i % route.length];
        el.style.setProperty("--py", (r[0] + (r[1] - r[0]) * p).toFixed(2) + "vh");
      });
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    function start() {
      update();
      if (reduceMotion) return;
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
    }
    return { start, update };
  })();


  /* --- Hành tinh "thật": tự vẽ bề mặt bằng canvas (dải mây, bão, ánh sáng, quầng khí quyển) --- */
  const planetArt = (() => {
    // Nhiễu giá trị 3D: tạo các vệt mây tự nhiên, không cần ảnh có sẵn.
    function hash(x, y, z) {
      let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
    }
    const fade = (t) => t * t * (3 - 2 * t);
    const mix = (a, b, t) => a + (b - a) * t;
    function noise(x, y, z) {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      const u = fade(x - xi), v = fade(y - yi), w = fade(z - zi);
      return mix(
        mix(mix(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), mix(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
        mix(mix(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), mix(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v), w);
    }
    function fbm(x, y, z, oct) {
      let a = 0.5, s = 0;
      for (let i = 0; i < oct; i++) { s += a * noise(x, y, z); x *= 2.03; y *= 2.03; z *= 2.03; a *= 0.5; }
      return s;
    }
    function palette(stops, t) {
      t = Math.min(1, Math.max(0, t));
      for (let i = 1; i < stops.length; i++) {
        if (t <= stops[i][0]) {
          const k = (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0] || 1);
          const a = stops[i - 1][1], b = stops[i][1];
          return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
        }
      }
      return stops[stops.length - 1][1];
    }

    // Mỗi hành tinh: kích thước (px), bảng màu, số dải mây, độ xoáy, nghiêng, có bão không, quầng sáng
    const SPECS = {
      saturn: { size: 150, seed: 3, bands: 9, turb: 0.55, tilt: -18, stretch: 4,
        pal: [[0, [120, 88, 52]], [0.25, [196, 154, 96]], [0.5, [232, 205, 150]], [0.75, [210, 172, 112]], [1, [246, 228, 186]]],
        rim: [255, 214, 150], ring: { tilt: -18, inner: 0.64, outer: 1.0, scale: 2.45, color: [226, 200, 150] } },
      jupiter: { size: 96, seed: 7, bands: 7, turb: 0.9, tilt: 0, stretch: 5, storm: [0.28, 0.32],
        pal: [[0, [112, 70, 44]], [0.22, [186, 120, 76]], [0.45, [238, 222, 196]], [0.7, [201, 146, 98]], [1, [246, 238, 220]]],
        rim: [255, 200, 140] },
      ice: { size: 80, seed: 11, bands: 4, turb: 0.25, tilt: 20, stretch: 3,
        pal: [[0, [20, 120, 150]], [0.5, [70, 200, 220]], [1, [170, 240, 248]]],
        rim: [140, 235, 255], ring: { tilt: 20, inner: 0.78, outer: 1.0, scale: 2.2, color: [180, 236, 246], thin: true } },
      venus: { size: 46, seed: 5, bands: 3, turb: 1.3, tilt: 0, stretch: 2.2,
        pal: [[0, [150, 100, 52]], [0.5, [224, 170, 98]], [1, [248, 214, 150]]],
        rim: [255, 205, 140] }
    };

    function drawSphere(spec, px) {
      const c = document.createElement("canvas");
      c.width = c.height = px;
      const ctx = c.getContext("2d");
      const img = ctx.createImageData(px, px);
      const d = img.data;
      const ta = (spec.tilt * Math.PI) / 180, ct = Math.cos(ta), st = Math.sin(ta);
      const L = [-0.55, -0.5, 0.67];
      const ln = Math.hypot(L[0], L[1], L[2]); L[0] /= ln; L[1] /= ln; L[2] /= ln;
      const s0 = spec.seed;
      for (let j = 0; j < px; j++) {
        for (let i = 0; i < px; i++) {
          const nx = ((i + 0.5) / px) * 2 - 1, ny = ((j + 0.5) / px) * 2 - 1;
          const r2 = nx * nx + ny * ny;
          const o = (j * px + i) * 4;
          if (r2 >= 1) { d[o + 3] = 0; continue; }
          const nz = Math.sqrt(1 - r2);
          // Quay hệ toạ độ để dải mây nghiêng giống vành đai
          const x = nx * ct + ny * st, y = -nx * st + ny * ct;
          let w = fbm(x * 2.4 + s0, y * 2.4 * 2, nz * 2.4, 4);
          let v = y * spec.bands * 1.4 + (w - 0.5) * spec.turb * 5;
          let t = 0.5 + 0.5 * Math.sin(v * 2.2);
          t = mix(t, fbm(x * 3 + s0, y * 3 * spec.stretch, nz * 3, 5), 0.35);
          let col = palette(spec.pal, t);
          if (spec.storm) {
            const sx = (x - spec.storm[0]) / 0.2, sy = (y - spec.storm[1]) / 0.1;
            const sd = Math.exp(-(sx * sx + sy * sy));
            const sc = [196, 84, 52];
            col = [mix(col[0], sc[0], sd * 0.9), mix(col[1], sc[1], sd * 0.9), mix(col[2], sc[2], sd * 0.9)];
          }
          const diff = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          let shade = 0.07 + 1.0 * Math.pow(diff, 0.85);
          shade *= 0.55 + 0.45 * nz;
          const rim = Math.pow(1 - nz, 3) * Math.min(1, diff * 1.6 + 0.15) * 0.75;
          const rimC = spec.rim;
          d[o] = Math.min(255, col[0] * shade + rimC[0] * rim);
          d[o + 1] = Math.min(255, col[1] * shade + rimC[1] * rim);
          d[o + 2] = Math.min(255, col[2] * shade + rimC[2] * rim);
          // mép mượt (khử răng cưa)
          d[o + 3] = Math.min(255, (1 - Math.sqrt(r2)) * px * 0.5 * 255);
        }
      }
      ctx.putImageData(img, 0, 0);
      return c;
    }

    function drawRing(spec, px) {
      const R = spec.ring;
      const W = Math.round(px * R.scale), H = Math.round(px * R.scale * 0.5);
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      const cx = W / 2, cy = H / 2, a = W / 2 - 2, b = a * 0.3;
      const steps = R.thin ? 6 : 90;
      for (let i = 0; i < steps; i++) {
        const f = i / steps;
        const rad = mix(R.inner, R.outer, f);
        let alpha = R.thin ? (i % 3 === 0 ? 0.7 : 0.25) : 0.25 + 0.6 * noise(f * 22, spec.seed, 1.7);
        if (!R.thin && f > 0.58 && f < 0.66) alpha *= 0.08;   // khe hở như vành đai thật
        if (!R.thin && f > 0.9) alpha *= 0.5;
        const k = 0.78 + 0.3 * noise(f * 30, 3, 9);
        ctx.strokeStyle = "rgba(" + Math.round(R.color[0] * k) + "," + Math.round(R.color[1] * k) + "," + Math.round(R.color[2] * k) + "," + alpha.toFixed(3) + ")";
        ctx.lineWidth = R.thin ? 1.6 : (a * (R.outer - R.inner)) / steps * 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, a * rad, b * rad, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      return c;
    }

    function build() {
      const map = { p1: "saturn", p2: "jupiter", p3: "ice", p4: "venus" };
      Object.keys(map).forEach((cls) => {
        const el = $("#planets ." + cls);
        if (!el) return;
        const spec = SPECS[map[cls]];
        const body = $(".planet-body", el);
        const px = Math.min(380, Math.round(spec.size * 2.2));
        const sphere = drawSphere(spec, px);
        sphere.className = "sphere";
        body.style.setProperty("--size", spec.size + "px");
        body.style.setProperty("--glow", "rgba(" + spec.rim.join(",") + ",0.35)");
        const old = $(".sphere", body);
        if (old) old.replaceWith(sphere); else body.append(sphere);
        if (spec.ring) {
          [["ring ring-back", false], ["ring ring-front", true]].forEach(([cn]) => {
            const rc = drawRing(spec, spec.size);
            rc.className = cn;
            rc.style.setProperty("--rot", spec.ring.tilt + "deg");
            body.append(rc);
          });
        }
      });
    }
    return { build };
  })();

  /* --- Hố đen: nuốt mục đang xem, rồi nhả ra mục tiếp theo --- */
  const hole = (() => {
    const cv = document.createElement("canvas");
    cv.id = "hole"; cv.setAttribute("aria-hidden", "true");
    document.body.append(cv);
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1, raf = 0, busy = false, last = 0, pending = null;
    const parts = Array.from({ length: 190 }, () => ({ a: Math.random() * 6.283, r: 0.25 + Math.random() * 1.1, s: 0.6 + Math.random() * 1.2, h: Math.random() }));
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      W = cv.width = Math.round(window.innerWidth * dpr);
      H = cv.height = Math.round(window.innerHeight * dpr);
    }
    const ease = (t) => t * t * (3 - 2 * t);

    // s: độ lớn của hố đen (0 → 1); time: để cánh đĩa quay
    function draw(s, time) {
      ctx.clearRect(0, 0, W, H);
      if (s <= 0.001) return;
      const cx = W / 2, cy = H / 2, m = Math.min(W, H);
      const R = m * 0.17 * s;                  // bán kính vùng đen
      // 1) Màn tối dần về tâm
      const dark = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, Math.max(W, H) * 0.75 * (0.35 + 0.65 * s));
      dark.addColorStop(0, "rgba(2,1,8," + (0.97 * Math.min(1, s * 1.4)).toFixed(3) + ")");
      dark.addColorStop(0.5, "rgba(8,3,24," + (0.55 * s).toFixed(3) + ")");
      dark.addColorStop(1, "rgba(8,3,24,0)");
      ctx.fillStyle = dark; ctx.fillRect(0, 0, W, H);
      // 2) Hạt vật chất bị hút theo hình xoắn ốc
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        const rr = (p.r * m * 0.5 * (1.15 - 0.55 * s)) % (m * 0.6) + R * 1.1;
        const ang = p.a + (time * 0.0016 * p.s) * (1.6 + 140 / Math.max(40, rr / dpr));
        const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr * 0.62;
        const tt = Math.min(1, R * 1.1 / rr * 1.4 + 0.15);
        const hue = 20 + p.h * 280;
        ctx.fillStyle = "hsla(" + hue + ",95%,68%," + (0.55 * s * tt).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(x, y, (1.1 + 1.6 * tt) * dpr, 0, 6.283); ctx.fill();
      }
      // 3) Đĩa bồi tụ: các vòng sáng cam – hồng – tím
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(-0.22); ctx.scale(1, 0.34);
      for (let i = 0; i < 6; i++) {
        const rr = R * (1.25 + i * 0.32), alpha = (0.75 - i * 0.11) * s;
        const g = ctx.createRadialGradient(0, 0, rr * 0.86, 0, 0, rr * 1.1);
        g.addColorStop(0, "rgba(255,170,70,0)");
        g.addColorStop(0.5, i < 2 ? "rgba(255,196,110," + alpha.toFixed(3) + ")" : i < 4 ? "rgba(255,92,170," + alpha.toFixed(3) + ")" : "rgba(130,90,255," + alpha.toFixed(3) + ")");
        g.addColorStop(1, "rgba(80,40,200,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rr * 1.1, 0, 6.283); ctx.fill();
      }
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
      // 4) Vành photon + lõi đen
      const ring = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.35);
      ring.addColorStop(0, "rgba(255,240,210,0)");
      ring.addColorStop(0.42, "rgba(255,226,170," + (0.95 * s).toFixed(3) + ")");
      ring.addColorStop(1, "rgba(255,120,60,0)");
      ctx.fillStyle = ring; ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, 6.283); ctx.fill();
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
    }

    function run(duration, curve, onFrame) {
      return new Promise((resolve) => {
        const t0 = performance.now();
        (function tick(now) {
          const k = Math.min(1, (now - t0) / duration);
          draw(curve(k), now);
          if (onFrame) onFrame(k);
          if (k < 1) raf = requestAnimationFrame(tick); else resolve();
        })(t0);
      });
    }

    // Chuyển mục kiểu "nuốt chửng": mục cũ xoáy vào hố đen → nhảy tới mục mới → mục mới trào ra
    async function swallow(jump) {
      const main = document.getElementById("main");
      if (busy) { pending = jump; return; }
      busy = true; last = performance.now();
      document.documentElement.style.overflowX = "hidden";
      const origin = () => "50% " + (window.scrollY + window.innerHeight / 2) + "px";
      main.style.transformOrigin = origin();
      const out = main.animate(
        [{ transform: "none", opacity: 1 }, { transform: "rotate(16deg) scale(0.12)", opacity: 0 }],
        { duration: 650, easing: "cubic-bezier(0.55, 0, 0.9, 0.45)", fill: "forwards" });
      await run(650, (k) => ease(Math.pow(k, 0.8)));
      out.cancel();                       // bỏ hiệu ứng thu nhỏ trước, để đo vị trí mục đích cho đúng
      main.style.transformOrigin = "";
      (pending || jump)(); pending = null;
      main.style.transformOrigin = origin();
      const inn = main.animate(
        [{ transform: "rotate(-14deg) scale(1.7)", opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration: 750, easing: "cubic-bezier(0.1, 0.6, 0.2, 1)" });
      await run(750, (k) => 1 - ease(Math.min(1, k * 1.15)));
      inn.cancel();
      draw(0, 0);
      main.style.transformOrigin = "";
      document.documentElement.style.overflowX = "";
      busy = false; last = performance.now();
    }

    // Khi đang cuộn tay sang mục khác: hố đen xuất hiện thoáng qua, không chặn việc cuộn
    async function pulse() {
      if (busy || performance.now() - last < 1600) return;
      busy = true; last = performance.now();
      await run(900, (k) => 0.62 * Math.sin(Math.PI * Math.min(1, k)));
      draw(0, 0);
      busy = false; last = performance.now();
    }
    window.addEventListener("resize", size);
    size();
    return { swallow, pulse, isBusy: () => busy };
  })();

  /* --- Bấm vào đâu thì ngôi sao tại đó phát sáng --- */
  function burst(x, y) {
    if (reduceMotion) return;
    const el = h("span", { class: "burst", "aria-hidden": "true", style: "left:" + x + "px;top:" + y + "px" });
    for (let i = 0; i < 7; i++) el.append(h("i", { style: "--a:" + Math.round(i * (360 / 7) + Math.random() * 18) + "deg" }));
    // Nếu thẻ nổi đang mở thì gắn vào đó, vì thẻ nổi nằm trên cùng của trang.
    (document.getElementById("card").open ? document.getElementById("card") : document.body).append(el);
    setTimeout(() => el.remove(), 800);
  }

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
    const jump = () => {
      window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : headerHeight())), behavior: "instant" });
      el.focus({ preventScroll: true });
    };
    if (reduceMotion) { el.scrollIntoView({ behavior: "auto", block: "start" }); el.focus({ preventScroll: true }); return; }
    hole.swallow(jump);
  }
  function headerHeight() {
    const tb = document.querySelector(".topbar");
    return tb ? tb.getBoundingClientRect().height : 0;
  }

  // Đánh dấu mục đang xem trên thanh menu khi người xem cuộn trang.
  let spy = null, lastSection = null;
  function watchSections() {
    if (spy) spy.disconnect();
    lastSection = null;
    spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (lastSection && lastSection !== entry.target.id && !reduceMotion && !hole.isBusy()) {
          hole.pulse();
          entry.target.animate([{ opacity: 0.25, transform: "translateY(34px) scale(0.97)" }, { opacity: 1, transform: "none" }], { duration: 800, easing: "cubic-bezier(0.1, 0.6, 0.2, 1)" });
        }
        lastSection = entry.target.id;
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
    planets.update();
  }

  /* --- Thanh kênh liên lạc bên trái --- */
  function renderRail() {
    const C = t().contact.channels;
    const link = (href, label, inner, key) =>
      h("a", { class: "rail-btn rail-" + key, href, target: href.startsWith("http") || key === "zalo" ? "_blank" : null, rel: "noopener", "aria-label": label, title: label }, inner);
    const glyph = (text) => h("span", { class: "glyph", "aria-hidden": "true" }, text);
    const rail = $("#rail");
    rail.setAttribute("aria-label", t().ui.railLabel);
    rail.replaceChildren(
      link(SITE.linkedin, C.linkedin, glyph("in"), "linkedin"),
      link(SITE.facebook, C.facebook, glyph("f"), "facebook"),
      link("mailto:" + SITE.email, C.email, svgBox("icon", ICON.mail), "mail"),
      // Zalo: mở một trang riêng có mã QR (zalo.html), giữ nguyên ngôn ngữ đang xem
      link("zalo.html?lang=" + lang, C.zalo, glyph("Zalo"), "zalo"));
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
          h("ul", { class: "hero-facts" }, H.facts.map((fact) =>
            h("li", {},
              svgBox("fact-icon", FACT_ICON[fact.icon]),
              h("span", { class: "fact-text" }, fact.label ? h("b", {}, fact.label + ":") : null, fact.text)))),
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

    return section("contact", isRecruiter ? C.titleRecruiter : C.titleOther, isRecruiter ? C.introRecruiter : C.introOther,
      h("div", { class: "contact-grid" }, form,
        isRecruiter && SITE.cvFile ? h("a", { class: "btn btn-ghost", href: SITE.cvFile, download: "" }, t().ui.cv) : null));
  }

  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const F = t().contact.form;
    const status = $(".form-status", form);
    const sent = view === "recruiter" ? F.sentRecruiter : F.sentOther;
    const failed = view === "recruiter" ? F.failedRecruiter : F.failedOther;
    const button = $("button[type=submit]", form);
    status.className = "form-status";
    status.textContent = "";
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    if (data.company) { // bot điền vào ô bẫy: giả vờ thành công rồi bỏ qua
      status.textContent = sent;
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
        status.textContent = sent;
        status.classList.add("is-ok");
        form.reset();
      } catch (err) {
        status.textContent = failed;
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
    planets.start();
    planetArt.build();
    document.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.button === 0) burst(e.clientX, e.clientY); }, { passive: true });
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
