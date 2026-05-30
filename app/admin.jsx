/* 瞎掰王 — 管理后台：词库导入（演示模式） + 音效开关 */

const SAMPLE_LIB = `孑孓 | jié jué | 蚊子的幼虫，体细长，在水中游动一屈一伸。 | 昆虫 | 地方/服饰
踉跄 | liàng qiàng | 走路不稳，跌跌撞撞的样子。 | 动作 | 小说/器物
忐忑 | tǎn tè | 心神不定，心里七上八下。 | 状态 | 植物/水文
睚眦 | yá zì | 发怒时瞪眼睛；借指极小的怨恨。 | 神态 | 成语/地方`;

/* —— 音效开关小按钮 —— */
function SoundToggle({ style }) {
  const [muted, setMuted] = useState(window.SFX ? SFX.muted : false);
  return (
    <button className="sound-btn" title={muted ? "开启音效" : "关闭音效"}
      onClick={() => { if (window.SFX) setMuted(SFX.toggle()); }}
      style={{
        width: 42, height: 42, flex: "none", border: "var(--line)", borderRadius: "50%",
        background: muted ? "var(--card)" : "var(--yellow)", boxShadow: "var(--shadow-sm)",
        cursor: "pointer", fontSize: 18, display: "grid", placeItems: "center", ...style,
      }}>
      {muted ? "🔇" : "🔊"}
    </button>
  );
}

/* —— 管理后台弹窗 —— */
function AdminModal({ app }) {
  const [authed, setAuthed] = useState(!window.XBW_CONFIG || XBW_CONFIG.demoMode);
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [ver, setVer] = useState(0);

  const active = window.getActiveWords();
  const usingCustom = window.isUsingCustom();

  const doParse = () => { setParsed(window.parseWordLib(text)); };

  const doImport = (mode) => {
    const res = window.parseWordLib(text);
    setParsed(res);
    if (!res.words.length) { window.SFX && SFX.err(); return; }
    let next;
    if (mode === "replace") next = res.words;
    else {
      const base = window.getCustomWords();
      const baseList = base.length ? base : window.XBW_DEFAULT_WORDS;
      const seen = new Set(baseList.map((x) => x.w));
      next = [...baseList];
      res.words.forEach((w) => { if (!seen.has(w.w)) { next.push(w); seen.add(w.w); } });
    }
    window.saveCustomWords(next);
    window.SFX && SFX.ok();
    setText(""); setParsed(null); setVer((v) => v + 1);
  };

  const reset = () => { window.clearCustomWords(); window.SFX && SFX.ok(); setVer((v) => v + 1); };

  /* ---- 正式模式：等待后端鉴权 ---- */
  if (!authed) {
    return (
      <div className="modal-back" onClick={app.closeAdmin}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="center" style={{ flexDirection: "column", gap: 6 }}>
            <div className="display center" style={{ width: 56, height: 56, background: "var(--ink)", color: "var(--yellow)", borderRadius: "50%", fontSize: 26 }}>🔒</div>
            <h2 style={{ fontSize: 24, marginTop: 8 }}>管理后台</h2>
            <p className="muted tac" style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>正式模式不在前端保存管理员密码。词库管理需要接入后端鉴权；本地演示请使用 <b style={{ color: "var(--ink)" }}>?demo=1</b> 打开。</p>
          </div>
          <div className="col" style={{ gap: 10, marginTop: 18 }}>
            <Btn kind="ghost" className="btn-sm" style={{ width: "100%" }} onClick={app.closeAdmin}>取消</Btn>
          </div>
        </div>
      </div>
    );
  }

  /* ---- 已登录：词库管理 ---- */
  return (
    <div className="modal-back" onClick={app.closeAdmin}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380, maxHeight: "88%", overflowY: "auto" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 24 }}>词库管理</h2>
          <span className={"role-chip " + (usingCustom ? "chip-orange" : "chip-blue")} style={{ fontSize: 12 }}>
            {usingCustom ? "自定义" : "默认"} · {active.length} 词
          </span>
        </div>

        {/* 当前词库预览 */}
        <div className="card" style={{ marginTop: 12, padding: 12, maxHeight: 132, overflowY: "auto", background: "var(--paper)" }}>
          {active.map((w, i) => (
            <div key={i} className="row" style={{ gap: 8, padding: "3px 0", borderBottom: i < active.length - 1 ? "1px dashed rgba(36,29,22,.15)" : "none" }}>
              <span className="display" style={{ fontSize: 15, minWidth: 48 }}>{w.w}</span>
              <span className="muted" style={{ fontSize: 11, minWidth: 56 }}>{w.py}</span>
              <span style={{ fontSize: 11.5, lineHeight: 1.35, color: "var(--ink-soft)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.def}</span>
            </div>
          ))}
        </div>

        {/* 导入区 */}
        <div className="row" style={{ justifyContent: "space-between", marginTop: 16, marginBottom: 6 }}>
          <div className="display" style={{ fontSize: 16 }}>导入词库</div>
          <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => { setText(SAMPLE_LIB); setParsed(null); }}>填入示例</button>
        </div>
        <p className="muted" style={{ fontSize: 12, margin: "0 0 8px", lineHeight: 1.5 }}>
          每行一个词，格式：<b style={{ color: "var(--ink)" }}>词 | 拼音 | 释义 | 正确方向 | 干扰方向1/干扰方向2</b><br />（方向可省略；分隔符支持 <code>|</code> <code>，</code> <code>,</code> 或制表符）
        </p>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder={"觊觎 | jì yú | 非分地希望得到不该得到的东西。 | 欲望 | 地方/工艺"}
          style={{ width: "100%", minHeight: 110, border: "var(--line)", borderRadius: "var(--radius-sm)",
            padding: 12, fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, resize: "vertical",
            background: "var(--paper)", color: "var(--ink)", boxShadow: "inset 2px 2px 0 rgba(36,29,22,.1)" }} />

        {parsed && (
          <div className="card" style={{ marginTop: 10, padding: 10, background: parsed.errors.length ? "var(--red-tint)" : "var(--blue-tint)", borderColor: parsed.errors.length ? "var(--red)" : "var(--blue)" }}>
            <div style={{ fontSize: 13 }}><b>解析到 {parsed.words.length} 个有效词</b>{parsed.errors.length ? `，${parsed.errors.length} 行有问题：` : "，可以导入了 ✓"}</div>
            {parsed.errors.slice(0, 4).map((e, i) => <div key={i} className="muted" style={{ fontSize: 11.5, marginTop: 3 }}>{e}</div>)}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <Btn kind="ghost" className="btn-sm" style={{ width: "100%" }} onClick={doParse}>预览解析</Btn>
          <Btn kind="blue" className="btn-sm" style={{ width: "100%" }} onClick={() => doImport("append")}>追加导入</Btn>
          <Btn kind="orange" className="btn-sm" style={{ width: "100%" }} onClick={() => doImport("replace")}>替换全部</Btn>
          <Btn kind="ghost" className="btn-sm" style={{ width: "100%" }} onClick={reset} disabled={!usingCustom}>重置默认</Btn>
        </div>

        <Btn kind="ink" style={{ marginTop: 14 }} onClick={app.closeAdmin}>完成</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { AdminModal, SoundToggle });
