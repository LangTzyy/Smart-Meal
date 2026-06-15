/* ═══════════════════════════════════════════════════════════════
   SmartMeal — Sound & Animation Enhancement v2
   Fitur:
   1. AR Scan animation (efek garis scan saat AR aktif)
   2. Konfirmasi makan: sound "ding" + particle burst
   3. Semua tombol diberi sound sesuai kategori
   4. Chatbot: sound "pop" saat pesan bot masuk
   5. Animasi tab transition halus
   Semua audio pakai Web Audio API — tanpa file mp3 eksternal.
═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     AUDIO ENGINE — Web Audio API
  ───────────────────────────────────────────── */
  let _ctx = null;

  function getAudioCtx() {
    if (!_ctx) {
      try {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return null; }
    }
    if (_ctx.state === "suspended") _ctx.resume();
    return _ctx;
  }

  function playTone(freq, duration, type = "sine", vol = 0.15, freq2 = null) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (freq2 !== null) {
      osc.frequency.linearRampToValueAtTime(freq2, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  /* ── Koleksi Sound ── */
  const Sound = {
    /* Navigasi tab — klik ringan pendek */
    tabClick() {
      playTone(800, 0.07, "sine", 0.1);
    },

    /* Tombol ghost / back / kembali — nada turun */
    ghost() {
      playTone(500, 0.1, "sine", 0.1, 380);
    },

    /* Tombol primary / aksi positif — nada naik */
    primary() {
      playTone(440, 0.06, "sine", 0.12);
      setTimeout(() => playTone(550, 0.08, "sine", 0.1), 70);
    },

    /* AR start — beep sweep naik */
    arStart() {
      playTone(400, 0.12, "sine", 0.15, 900);
      setTimeout(() => playTone(900, 0.18, "sine", 0.12, 1100), 140);
    },

    /* AR stop — sweep turun */
    arStop() {
      playTone(700, 0.15, "sine", 0.1, 300);
    },

    /* Konfirmasi makan — ding-dong 3 nada */
    konfirmasi() {
      playTone(523, 0.15, "sine", 0.2);
      setTimeout(() => playTone(659, 0.15, "sine", 0.18), 160);
      setTimeout(() => playTone(784, 0.3,  "sine", 0.22), 320);
    },

    /* Hapus / danger / logout — nada turun tegas */
    danger() {
      playTone(350, 0.08, "sine", 0.13, 220);
      setTimeout(() => playTone(200, 0.15, "sine", 0.1), 90);
    },

    /* Send chat / submit — whoosh pendek */
    send() {
      playTone(600, 0.05, "sine", 0.1, 900);
    },

    /* Chat pop — bot reply */
    chatPop() {
      playTone(880, 0.06, "sine", 0.1);
      setTimeout(() => playTone(1100, 0.08, "sine", 0.08), 60);
    },

    /* Toggle / radio btn — tick */
    toggle() {
      playTone(750, 0.05, "square", 0.06);
    },

    /* Menu item / profile sub */
    menuItem() {
      playTone(620, 0.08, "sine", 0.09, 720);
    },

    /* Emoji pick — playful pop */
    emoji() {
      const notes = [523, 659, 784, 1047];
      const n = notes[Math.floor(Math.random() * notes.length)];
      playTone(n, 0.1, "sine", 0.1);
    },

    /* Info / tooltip */
    info() {
      playTone(900, 0.06, "sine", 0.08);
    },

    /* Filter btn */
    filter() {
      playTone(680, 0.07, "sine", 0.09, 750);
    },

    /* Password toggle (show/hide) */
    pwToggle() {
      playTone(1000, 0.05, "sine", 0.07);
    },

    /* Login / Register — akord kecil */
    auth() {
      playTone(440, 0.12, "sine", 0.15);
      setTimeout(() => playTone(554, 0.12, "sine", 0.12), 80);
      setTimeout(() => playTone(659, 0.18, "sine", 0.1), 160);
    },

    /* Chip chat — ringan */
    chip() {
      playTone(700, 0.06, "sine", 0.09, 820);
    },
  };

  /* ─────────────────────────────────────────────
     ANIMASI AR SCAN LINE
  ───────────────────────────────────────────── */
  const SCAN_ID = "sm-ar-scan-overlay";

  const scanCSS = `
    #${SCAN_ID} {
      position: absolute; inset: 0;
      pointer-events: none; z-index: 15; overflow: hidden;
    }
    .sm-scan-line {
      position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg,
        transparent 0%, rgba(0,229,160,0) 10%,
        rgba(0,229,160,0.9) 50%, rgba(0,229,160,0) 90%, transparent 100%);
      box-shadow: 0 0 8px 2px rgba(0,229,160,0.5);
      animation: smScanMove 2s linear infinite; top: 0;
    }
    @keyframes smScanMove {
      0%   { top: 0%;   opacity: 1; }
      85%  { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    .sm-scan-corner {
      position: absolute; width: 28px; height: 28px;
      border-color: rgba(0,229,160,0.85); border-style: solid;
    }
    .sm-scan-corner.tl { top:12px; left:12px;   border-width: 2px 0 0 2px; }
    .sm-scan-corner.tr { top:12px; right:12px;  border-width: 2px 2px 0 0; }
    .sm-scan-corner.bl { bottom:12px; left:12px;  border-width: 0 0 2px 2px; }
    .sm-scan-corner.br { bottom:12px; right:12px; border-width: 0 2px 2px 0; }
    .sm-ar-pulse {
      position: absolute; top:50%; left:50%;
      transform: translate(-50%,-50%);
      width:80px; height:80px; border-radius:50%;
      border: 2px solid rgba(0,229,160,0.7);
      animation: smArPulse 1s ease-out forwards;
    }
    @keyframes smArPulse {
      0%   { width:40px;  height:40px;  opacity:1; }
      100% { width:200px; height:200px; opacity:0; }
    }
    .sm-ar-badge {
      position: absolute; top:10px; left:50%; transform: translateX(-50%);
      background: rgba(0,229,160,0.15); border: 1px solid rgba(0,229,160,0.5);
      backdrop-filter: blur(8px); color:#00e5a0;
      font-family:'Syne',sans-serif; font-size:10px; font-weight:800;
      letter-spacing:2px; text-transform:uppercase;
      padding:4px 12px; border-radius:20px;
      animation: smFadeInDown 0.4s ease forwards; white-space:nowrap;
    }
    @keyframes smFadeInDown {
      from { opacity:0; transform: translateX(-50%) translateY(-8px); }
      to   { opacity:1; transform: translateX(-50%) translateY(0); }
    }
  `;

  function injectScanCSS() {
    if (document.getElementById("sm-scan-style")) return;
    const s = document.createElement("style");
    s.id = "sm-scan-style"; s.textContent = scanCSS;
    document.head.appendChild(s);
  }

  function showScanOverlay() {
    const vp = document.querySelector(".ar-viewport");
    if (!vp) return;
    removeScanOverlay();
    const overlay = document.createElement("div");
    overlay.id = SCAN_ID;
    overlay.innerHTML = `
      <div class="sm-ar-badge">● AR AKTIF</div>
      <div class="sm-scan-line"></div>
      <div class="sm-scan-corner tl"></div>
      <div class="sm-scan-corner tr"></div>
      <div class="sm-scan-corner bl"></div>
      <div class="sm-scan-corner br"></div>`;
    vp.appendChild(overlay);
    const pulse = document.createElement("div");
    pulse.className = "sm-ar-pulse";
    overlay.appendChild(pulse);
    setTimeout(() => pulse.remove(), 1000);
  }

  function removeScanOverlay() {
    const el = document.getElementById(SCAN_ID);
    if (el) el.remove();
  }

  /* ─────────────────────────────────────────────
     ANIMASI PARTICLE BURST — konfirmasi makan
  ───────────────────────────────────────────── */
  const particleCSS = `
    .sm-particle {
      position:fixed; pointer-events:none; border-radius:50%; z-index:9999;
      animation: smParticleFly var(--dur,0.9s) ease-out forwards;
    }
    @keyframes smParticleFly {
      0%   { transform: translate(0,0) scale(1); opacity:1; }
      100% { transform: translate(var(--tx,0px),var(--ty,-80px)) scale(0); opacity:0; }
    }
  `;

  function injectParticleCSS() {
    if (document.getElementById("sm-particle-style")) return;
    const s = document.createElement("style");
    s.id = "sm-particle-style"; s.textContent = particleCSS;
    document.head.appendChild(s);
  }

  const COLORS = ["#00e5a0","#00b4f5","#ffd700","#ff6b6b","#fff"];

  function burstParticles(originEl) {
    const rect = originEl
      ? originEl.getBoundingClientRect()
      : { left: window.innerWidth/2, top: window.innerHeight/2, width:0, height:0 };
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    for (let i = 0; i < 24; i++) {
      const p = document.createElement("div");
      p.className = "sm-particle";
      const angle = (i/24)*2*Math.PI;
      const dist  = 60 + Math.random()*80;
      const tx    = Math.cos(angle)*dist;
      const ty    = Math.sin(angle)*dist - 30;
      const size  = 5 + Math.random()*8;
      const dur   = 0.7 + Math.random()*0.5;
      const color = COLORS[Math.floor(Math.random()*COLORS.length)];
      p.style.cssText = `width:${size}px;height:${size}px;background:${color};
        left:${cx-size/2}px;top:${cy-size/2}px;
        --tx:${tx}px;--ty:${ty}px;--dur:${dur}s;
        box-shadow:0 0 6px ${color};`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), dur*1000+100);
    }
  }

  /* ─────────────────────────────────────────────
     ANIMASI TAB TRANSITION
  ───────────────────────────────────────────── */
  const tabCSS = `
    .section { transition: opacity 0.25s ease, transform 0.25s ease; }
    .section:not(.active) { opacity:0; transform:translateY(6px); pointer-events:none; }
    .section.active       { opacity:1; transform:translateY(0); }
    .nav-item:active .nav-icon { animation: smNavBounce 0.3s ease; }
    @keyframes smNavBounce {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.35); }
      100% { transform: scale(1); }
    }
    /* Ripple effect on btn click */
    .sm-ripple {
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,0.25);
      transform:scale(0); pointer-events:none;
      animation: smRipple 0.4s ease-out forwards;
    }
    @keyframes smRipple {
      to { transform:scale(4); opacity:0; }
    }
  `;

  function injectTabCSS() {
    if (document.getElementById("sm-tab-style")) return;
    const s = document.createElement("style");
    s.id = "sm-tab-style"; s.textContent = tabCSS;
    document.head.appendChild(s);
  }

  /* Ripple visual on any button */
  function addRipple(btn, e) {
    const prev = window.getComputedStyle(btn).position;
    if (prev === "static") btn.style.position = "relative";
    btn.style.overflow = "hidden";
    const circle = document.createElement("span");
    circle.className = "sm-ripple";
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const rect = btn.getBoundingClientRect();
    circle.style.cssText = `
      width:${size}px; height:${size}px;
      left:${(e.clientX - rect.left) - size/2}px;
      top:${(e.clientY - rect.top)  - size/2}px;
    `;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 450);
  }

  /* ─────────────────────────────────────────────
     GLOBAL BUTTON SOUND DELEGATION
  ───────────────────────────────────────────── */
  function handleButtonSound(e) {
    const el = e.target.closest(
      "button, .nav-item, .radio-btn, .profile-menu-item, " +
      ".chat-chip, .sub-back, .activity-info-btn, .riwayat-filter-btn"
    );
    if (!el) return;

    // Ripple visual
    addRipple(el, e);

    const onclick  = el.getAttribute("onclick") || "";
    const id       = el.id || "";
    const cls      = el.className || "";

    /* ── Urutan prioritas matching ── */

    // Tab navigasi
    if (onclick.includes("switchTab")) return Sound.tabClick();

    // AR toggle
    if (id === "btn-ar-toggle" || onclick.includes("toggleAR")) return; // ditangani patch

    // Konfirmasi makan
    if (id === "btn-konfirmasi-makan" || onclick.includes("konfirmasiMakan")) return; // ditangani patch

    // Login / Register
    if (onclick.includes("doLogin") || onclick.includes("doRegister")) return Sound.auth();

    // Logout / danger
    if (onclick.includes("Logout") || onclick.includes("logout") || cls.includes("danger"))
      return Sound.danger();

    // Hapus riwayat / clear chat
    if (onclick.includes("clearAll") || onclick.includes("clearChat")) return Sound.danger();

    // Send chat
    if (id === "chat-send-btn" || onclick.includes("sendChat") || onclick.includes("sendChip"))
      return Sound.send();

    // Chip pertanyaan cepat
    if (cls.includes("chat-chip")) return Sound.chip();

    // Simpan profil
    if (onclick.includes("saveProfile") || onclick.includes("goToResult") ||
        onclick.includes("runAnalisis") || onclick.includes("goToStep"))
      return Sound.primary();

    // Kembali / back / ghost btn
    if (cls.includes("btn-ghost") || cls.includes("sub-back") ||
        onclick.includes("backTo") || onclick.includes("navigate("))
      return Sound.ghost();

    // Tombol primary lain
    if (cls.includes("btn-primary")) return Sound.primary();

    // Radio button (gender, aktivitas)
    if (cls.includes("radio-btn")) return Sound.toggle();

    // Filter riwayat
    if (cls.includes("riwayat-filter-btn")) return Sound.filter();

    // Menu profil
    if (cls.includes("profile-menu-item")) return Sound.menuItem();

    // Info tooltip
    if (cls.includes("activity-info-btn")) return Sound.info();

    // Password toggle
    if (cls.includes("pw-toggle")) return Sound.pwToggle();

    // Welcome popup
    if (cls.includes("btn-skip") || cls.includes("btn-panduan")) return Sound.ghost();

    // Emoji picker
    if (onclick.includes("pickEmoji")) return Sound.emoji();

    // Default — klik ringan
    Sound.tabClick();
  }

  /* ─────────────────────────────────────────────
     PATCH — Hook ke fungsi yang sudah ada di Main.js
  ───────────────────────────────────────────── */
  function whenReady(fnName, cb, maxWait = 6000) {
    const start = Date.now();
    const check = () => {
      if (typeof window[fnName] === "function") cb();
      else if (Date.now() - start < maxWait) setTimeout(check, 100);
    };
    check();
  }

  function patchFunctions() {

    /* ── toggleAR ── */
    if (!window.__sm_patched_ar) {
      const origToggleAR = window.toggleAR;
      window.toggleAR = async function () {
        const result = await origToggleAR.apply(this, arguments);
        const btn = document.getElementById("btn-ar-toggle");
        const isNowActive = btn && btn.textContent.includes("Matikan");
        if (isNowActive) {
          Sound.arStart(); showScanOverlay(); window._arActiveState = true;
        } else {
          Sound.arStop(); removeScanOverlay(); window._arActiveState = false;
        }
        return result;
      };
      window.__sm_patched_ar = true;
    }

    /* ── konfirmasiMakan ── */
    if (!window.__sm_patched_konfirmasi) {
      const origKonfirmasi = window.konfirmasiMakan;
      window.konfirmasiMakan = async function () {
        const result = await origKonfirmasi.apply(this, arguments);
        const btnAfter = document.getElementById("btn-konfirmasi-makan");
        if (btnAfter && btnAfter.dataset.confirmed === "1") {
          Sound.konfirmasi();
          burstParticles(btnAfter);
        }
        return result;
      };
      window.__sm_patched_konfirmasi = true;
    }

    /* ── sendChat — sound pop saat bot reply ── */
    if (!window.__sm_patched_chat) {
      const origSendChat = window.sendChat;
      window.sendChat = async function () {
        Sound.send();
        const result = await origSendChat.apply(this, arguments);
        setTimeout(() => Sound.chatPop(), 150);
        return result;
      };
      window.__sm_patched_chat = true;
    }
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() {
    injectScanCSS();
    injectParticleCSS();
    injectTabCSS();

    // Global sound delegation — satu listener untuk semua tombol
    document.addEventListener("click", handleButtonSound, true);

    // Patch fungsi async Main.js
    whenReady("switchTab", patchFunctions);
    document.addEventListener("moduleready", () => whenReady("switchTab", patchFunctions));

    // Resume AudioContext saat interaksi pertama (mobile policy)
    document.addEventListener("touchstart", () => getAudioCtx(), { once: true });
    document.addEventListener("click",      () => getAudioCtx(), { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();