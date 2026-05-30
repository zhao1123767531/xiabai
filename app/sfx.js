/* 瞎掰王 — 音效（Web Audio 合成，无需音频文件） */
(function () {
  let ctx = null;
  let muted = localStorage.getItem("xbw_muted") === "1";

  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function blip(freq, t0, dur, type, vol) {
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }
  function seq(notes, type, vol) {
    const c = ac(); if (!c || muted) return;
    const t = c.currentTime;
    notes.forEach((n, i) => blip(n.f, t + (n.t != null ? n.t : i * 0.11), n.d || 0.14, type, vol));
  }

  const SFX = {
    get muted() { return muted; },
    toggle() {
      muted = !muted;
      localStorage.setItem("xbw_muted", muted ? "1" : "0");
      if (!muted) { const c = ac(); if (c) blip(720, c.currentTime, 0.09, "sine", 0.2); }
      return muted;
    },
    click() { const c = ac(); if (!c || muted) return; blip(430, c.currentTime, 0.05, "square", 0.08); },
    flip() { const c = ac(); if (!c || muted) return; const t = c.currentTime; blip(523, t, 0.09, "triangle", 0.2); blip(784, t + 0.09, 0.16, "triangle", 0.2); },
    tick() { const c = ac(); if (!c || muted) return; blip(900, c.currentTime, 0.04, "square", 0.09); },
    pop() { const c = ac(); if (!c || muted) return; blip(988, c.currentTime, 0.13, "sine", 0.22); },
    win() { seq([{ f: 523 }, { f: 659 }, { f: 784 }, { f: 1047 }], "triangle", 0.22); },
    lose() { const c = ac(); if (!c || muted) return; const t = c.currentTime; blip(340, t, 0.2, "sawtooth", 0.16); blip(247, t + 0.17, 0.32, "sawtooth", 0.16); },
    join() { const c = ac(); if (!c || muted) return; blip(659, c.currentTime, 0.1, "sine", 0.14); },
    start() { seq([{ f: 392 }, { f: 523 }, { f: 659 }, { f: 880 }], "triangle", 0.22); },
    ok() { const c = ac(); if (!c || muted) return; const t = c.currentTime; blip(660, t, 0.08, "sine", 0.18); blip(990, t + 0.08, 0.14, "sine", 0.18); },
    err() { const c = ac(); if (!c || muted) return; blip(180, c.currentTime, 0.22, "sawtooth", 0.16); },
  };
  window.SFX = SFX;

  // 任意按钮 / 可点元素：通用点击声
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest && e.target.closest(".btn,.pickable,.view-row,.sound-btn")) SFX.click();
  }, true);
})();
