/* ═══════════════════════════════════════════════════════════════
   SmartMeal — Sound & Animation Enhancement
   Fitur:
   1. AR Scan animation (efek garis scan saat AR aktif)
   2. Konfirmasi makan: sound "ding" + particle burst
   3. Tab switch: sound klik ringan
   4. Chatbot: sound "pop" saat pesan bot masuk
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
      } catch (e) {
        return null;
      }
    }
    // Resume jika suspended (browser policy)
    if (_ctx.state === "suspended") _ctx.resume();
    return _ctx;
  }

  /**
   * Mainkan nada sederhana
   * @param {number} freq - frekuensi Hz
   * @param {number} duration - detik
   * @param {string} type - oscillator type: sine/square/triangle/sawtooth
   * @param {number} vol - volume 0-1
   * @param {number} [freq2] - frekuensi akhir (untuk sweep)
   */
  function playTone(freq, duration, type = "sine", vol = 0.18, freq2 = null) {
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
    /** Suara klik ringan untuk tab navigation */
    tabClick() {
      playTone(800, 0.08, "sine", 0.12);
    },

    /** Suara "beep-sweep" saat AR diaktifkan */
    arStart() {
      playTone(400, 0.12, "sine", 0.15, 900);
      setTimeout(() => playTone(900, 0.18, "sine", 0.12, 1100), 140);
    },

    /** Suara "beep-down" saat AR dimatikan */
    arStop() {
      playTone(700, 0.15, "sine", 0.1, 300);
    },

    /** Suara sukses "ding-dong" saat konfirmasi makan */
    konfirmasi() {
      playTone(523, 0.15, "sine", 0.2);       // C5
      setTimeout(() => playTone(659, 0.15, "sine", 0.18), 160);  // E5
      setTimeout(() => playTone(784, 0.3, "sine", 0.22), 320);   // G5
    },

    /** Suara "pop" ringan saat pesan bot masuk */
    chatPop() {
      playTone(880, 0.06, "sine", 0.1);
      setTimeout(() => playTone(1100, 0.08, "sine", 0.08), 60);
    },
  };

  /* ─────────────────────────────────────────────
     ANIMASI AR SCAN LINE
  ───────────────────────────────────────────── */
  const SCAN_ID = "sm-ar-scan-overlay";

  const scanCSS = `
    #${SCAN_ID} {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 15;
      overflow: hidden;
    }
    .sm-scan-line {
      position: absolute;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(0,229,160,0.0) 10%,
        rgba(0,229,160,0.9) 50%,
        rgba(0,229,160,0.0) 90%,
        transparent 100%
      );
      box-shadow: 0 0 8px 2px rgba(0,229,160,0.5);
      animation: smScanMove 2s linear infinite;
      top: 0;
    }
    @keyframes smScanMove {
      0%   { top: 0%; opacity: 1; }
      85%  { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }

    /* Corner brackets */
    .sm-scan-corner {
      position: absolute;
      width: 28px;
      height: 28px;
      border-color: rgba(0,229,160,0.85);
      border-style: solid;
    }
    .sm-scan-corner.tl { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
    .sm-scan-corner.tr { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
    .sm-scan-corner.bl { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
    .sm-scan-corner.br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }

    /* Pulse ring di tengah saat AR mulai */
    .sm-ar-pulse {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 80px; height: 80px;
      border-radius: 50%;
      border: 2px solid rgba(0,229,160,0.7);
      animation: smArPulse 1s ease-out forwards;
    }
    @keyframes smArPulse {
      0%   { width:40px; height:40px; opacity:1; }
      100% { width:200px; height:200px; opacity:0; }
    }

    /* Status label "AR AKTIF" */
    .sm-ar-badge {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,229,160,0.15);
      border: 1px solid rgba(0,229,160,0.5);
      backdrop-filter: blur(8px);
      color: #00e5a0;
      font-family: 'Syne', sans-serif;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      animation: smFadeInDown 0.4s ease forwards;
      white-space: nowrap;
    }
    @keyframes smFadeInDown {
      from { opacity:0; transform: translateX(-50%) translateY(-8px); }
      to   { opacity:1; transform: translateX(-50%) translateY(0); }
    }
  `;

  function injectScanCSS() {
    if (document.getElementById("sm-scan-style")) return;
    const style = document.createElement("style");
    style.id = "sm-scan-style";
    style.textContent = scanCSS;
    document.head.appendChild(style);
  }

  function showScanOverlay() {
    const vp = document.querySelector(".ar-viewport");
    if (!vp) return;

    // Hapus yang lama jika ada
    removeScanOverlay();

    const overlay = document.createElement("div");
    overlay.id = SCAN_ID;
    overlay.innerHTML = `
      <div class="sm-ar-badge">● AR AKTIF</div>
      <div class="sm-scan-line"></div>
      <div class="sm-scan-corner tl"></div>
      <div class="sm-scan-corner tr"></div>
      <div class="sm-scan-corner bl"></div>
      <div class="sm-scan-corner br"></div>
    `;
    vp.appendChild(overlay);

    // Pulse ring muncul saat start
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
      position: fixed;
      pointer-events: none;
      border-radius: 50%;
      z-index: 9999;
      animation: smParticleFly var(--dur, 0.9s) ease-out forwards;
    }
    @keyframes smParticleFly {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(var(--tx, 0px), var(--ty, -80px)) scale(0);
        opacity: 0;
      }
    }

    /* Toast konfirmasi custom */
    .sm-konfirm-toast {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: linear-gradient(135deg, rgba(0,229,160,0.15), rgba(0,180,245,0.1));
      border: 1px solid rgba(0,229,160,0.4);
      backdrop-filter: blur(16px);
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 12px 22px;
      border-radius: 50px;
      z-index: 9998;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
      white-space: nowrap;
      box-shadow: 0 4px 30px rgba(0,229,160,0.2);
    }
    .sm-konfirm-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;

  function injectParticleCSS() {
    if (document.getElementById("sm-particle-style")) return;
    const style = document.createElement("style");
    style.id = "sm-particle-style";
    style.textContent = particleCSS;
    document.head.appendChild(style);
  }

  const COLORS = ["#00e5a0", "#00b4f5", "#ffd700", "#ff6b6b", "#fff"];

  function burstParticles(originEl) {
    const rect = originEl
      ? originEl.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 24; i++) {
      const p = document.createElement("div");
      p.className = "sm-particle";

      const angle = (i / 24) * 2 * Math.PI;
      const dist = 60 + Math.random() * 80;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 30;
      const size = 5 + Math.random() * 8;
      const dur = 0.7 + Math.random() * 0.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${cx - size / 2}px;
        top: ${cy - size / 2}px;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --dur: ${dur}s;
        box-shadow: 0 0 6px ${color};
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 100);
    }
  }

  /* ─────────────────────────────────────────────
     ANIMASI TAB TRANSITION
  ───────────────────────────────────────────── */
  const tabCSS = `
    .section {
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .section:not(.active) {
      opacity: 0;
      transform: translateY(6px);
      pointer-events: none;
    }
    .section.active {
      opacity: 1;
      transform: translateY(0);
    }
    /* Nav item bounce saat diklik */
    .nav-item:active .nav-icon {
      animation: smNavBounce 0.3s ease;
    }
    @keyframes smNavBounce {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.35); }
      100% { transform: scale(1); }
    }
  `;

  function injectTabCSS() {
    if (document.getElementById("sm-tab-style")) return;
    const style = document.createElement("style");
    style.id = "sm-tab-style";
    style.textContent = tabCSS;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────
     PATCH — Hook ke fungsi yang sudah ada di Main.js
  ───────────────────────────────────────────── */

  /**
   * Tunggu sebuah fungsi tersedia di window, lalu jalankan callback.
   */
  function whenReady(fnName, cb, maxWait = 5000) {
    const start = Date.now();
    const check = () => {
      if (typeof window[fnName] === "function") {
        cb();
      } else if (Date.now() - start < maxWait) {
        setTimeout(check, 100);
      }
    };
    check();
  }

  function patchFunctions() {
    /* ── 1. switchTab — sound klik + animasi nav ── */
    const origSwitchTab = window.switchTab;
    window.switchTab = function (tab) {
      Sound.tabClick();
      return origSwitchTab.apply(this, arguments);
    };

    /* ── 2. toggleAR — sound + scan animation ── */
    const origToggleAR = window.toggleAR;
    window.toggleAR = async function () {
      const wasActive = !!window._arActiveState;
      const result = await origToggleAR.apply(this, arguments);

      // Deteksi state AR setelah toggle
      const btn = document.getElementById("btn-ar-toggle");
      const isNowActive = btn && btn.textContent.includes("Matikan");

      if (!wasActive && isNowActive) {
        // AR baru aktif
        Sound.arStart();
        showScanOverlay();
        window._arActiveState = true;
      } else {
        // AR dimatikan
        Sound.arStop();
        removeScanOverlay();
        window._arActiveState = false;
      }
      return result;
    };

    /* ── 3. konfirmasiMakan — sound + particle ── */
    const origKonfirmasi = window.konfirmasiMakan;
    window.konfirmasiMakan = async function () {
      const btn = document.getElementById("btn-konfirmasi-makan");
      const alreadyDone = btn && btn.dataset.confirmed === "1";

      const result = await origKonfirmasi.apply(this, arguments);

      if (!alreadyDone) {
        // Cek apakah berhasil (tombol berubah ke "Sudah Ditambahkan")
        const btnAfter = document.getElementById("btn-konfirmasi-makan");
        if (btnAfter && btnAfter.dataset.confirmed === "1") {
          Sound.konfirmasi();
          burstParticles(btnAfter);
        }
      }
      return result;
    };

    /* ── 4. sendChat — sound pop saat bot reply ── */
    const origSendChat = window.sendChat;
    window.sendChat = async function () {
      const result = await origSendChat.apply(this, arguments);
      // Bot selesai reply → play pop sound
      // Sedikit delay agar pesan sudah ter-render
      setTimeout(() => Sound.chatPop(), 100);
      return result;
    };
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() {
    injectScanCSS();
    injectParticleCSS();
    injectTabCSS();

    // Patch setelah Main.js module selesai load
    document.addEventListener("moduleready", () => {
      whenReady("switchTab", patchFunctions);
    });

    // Fallback jika event sudah lewat
    whenReady("switchTab", patchFunctions);

    // Resume AudioContext saat interaksi pertama (mobile policy)
    document.addEventListener("touchstart", () => getAudioCtx(), { once: true });
    document.addEventListener("click", () => getAudioCtx(), { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
