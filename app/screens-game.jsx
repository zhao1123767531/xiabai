/* 瞎掰王 — 游戏局内各阶段 */

/* ============ 游戏外壳 ============ */
function GameScreen({ app }) {
  const [showScore, setShowScore] = useState(false);
  const me = app.players.find((p) => p.id === app.myId);
  const myRole = app.roles[app.myId];
  const demoMode = !!(window.XBW_CONFIG && XBW_CONFIG.demoMode);

  return (
    <div className="screen">
      <div className="topbar">
        <span className="role-chip chip-hidden" style={{ fontSize: 14 }}>第 {app.round} 轮</span>
        {demoMode ? (
          <ViewSwitcher app={app} />
        ) : (
          <span className="muted" style={{ fontSize: 13 }}>仅显示你的信息</span>
        )}
        <div className="row" style={{ gap: 8 }}>
          <SoundToggle style={{ width: 38, height: 38, fontSize: 16 }} />
          <Btn kind="yellow" className="btn-sm" onClick={() => setShowScore(true)}>🏆 记分</Btn>
        </div>
      </div>

      {app.phase === "dealing" && <DealPhase app={app} me={me} myRole={myRole} />}
      {app.phase === "discuss" && <DiscussPhase app={app} me={me} myRole={myRole} />}
      {app.phase === "verify" && <VerifyPhase app={app} me={me} myRole={myRole} />}
      {app.phase === "reveal" && <RevealPhase app={app} me={me} myRole={myRole} />}

      {showScore && <ScoreSheet app={app} onClose={() => setShowScore(false)} />}
    </div>
  );
}

/* ============ 阶段1：发身份（翻牌） ============ */
function DealPhase({ app, me, myRole }) {
  const [flipped, setFlipped] = useState(false);
  const r = ROLES[myRole];
  useEffect(() => { setFlipped(false); }, [app.myId]);

  return (
    <div className="screen-pad center" style={{ flex: 1, gap: 18, textAlign: "center" }}>
      <div>
        <div className="eyebrow">身份已发到你手上</div>
        <h2 style={{ fontSize: 26, marginTop: 4 }}>{me.name}，点开看看你是谁</h2>
      </div>

      <div className="pickable" onClick={() => { setFlipped(true); window.SFX && SFX.flip(); }} style={{ width: 230, height: 300 }}>
        {!flipped ? (
          /* 背面 */
          <div className="card center floaty" style={{
            width: "100%", height: "100%", background: "var(--ink)", color: "var(--yellow)", borderRadius: 22, position: "relative",
          }}>
            <div className="display" style={{ fontSize: 64 }}>?</div>
            <div style={{ position: "absolute", bottom: 18, fontSize: 14, color: "#fff", fontFamily: "var(--font-body)" }}>轻触翻开</div>
          </div>
        ) : (
          /* 正面 */
          <div className="card center" style={{
            width: "100%", height: "100%", background: r.tint, borderColor: r.color,
            flexDirection: "column", gap: 10, padding: 22,
            animation: "cardreveal .5s cubic-bezier(.2,.9,.3,1.3) both",
          }}>
            <div className="avatar" style={{ width: 76, height: 76, background: r.color, fontSize: 0 }} />
            <div className="display" style={{ fontSize: 40, color: r.color, WebkitTextStroke: "1.2px var(--ink)" }}>{r.label}</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink)", margin: 0, textAlign: "center" }}>{r.blurb}</p>
            {r.public && <span className="role-chip chip-blue" style={{ fontSize: 12 }}>身份公开</span>}
          </div>
        )}
      </div>

      <div style={{ height: 60 }} />
      <div className="dock">
        <Btn kind="ink" disabled={!flipped} onClick={app.startDiscuss}>
          {flipped ? "记住了，开始讨论 →" : "先翻开你的身份"}
        </Btn>
      </div>
    </div>
  );
}

/* ============ 阶段2：讨论（生僻词 + 查看释义） ============ */
function DiscussPhase({ app, me, myRole }) {
  const [showDef, setShowDef] = useState(false);
  const [confirmChange, setConfirmChange] = useState(false);
  const r = ROLES[myRole];
  const isHost = me.isHost;
  const isHonest = myRole === "honest";
  const used = app.defUsed[app.myId];
  const changeTopic = () => {
    app.changeWord();
    setShowDef(false);
    setConfirmChange(false);
  };

  return (
    <div className="screen-pad center" style={{ flex: 1, gap: 16 }}>
      <MyRoleBanner role={myRole} />

      <div className="eyebrow" style={{ marginTop: 4 }}>本轮生僻词</div>
      <div className="card tilt-l center" style={{ width: "100%", padding: "30px 18px", background: "var(--paper-2)", flexDirection: "column", gap: 14 }}>
        <div className="display" style={{ fontSize: 64, letterSpacing: "6px", lineHeight: 1, paddingLeft: 6, whiteSpace: "nowrap" }}>{app.word.w}</div>
        <div className="muted" style={{ fontSize: 16, letterSpacing: "2px", lineHeight: 1 }}>{app.word.py}</div>
        <DirectionChips word={app.word} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isHonest ? "1fr 1fr" : "1fr", gap: 10, width: "100%", marginTop: 4 }}>
        <Btn kind={used ? "ghost" : "blue"} disabled={used} onClick={() => setShowDef(true)} style={{ minWidth: 0, paddingLeft: 12, paddingRight: 12, fontSize: 18 }}>
          {used ? "本轮已查看过" : "👁 查看释义"}
        </Btn>
        {isHonest && (
          <Btn kind="yellow" onClick={() => setConfirmChange(true)} style={{ minWidth: 0, paddingLeft: 12, paddingRight: 12, fontSize: 18 }}>
            ↻ 换题
          </Btn>
        )}
      </div>

      <div className="card" style={{ width: "100%", background: "var(--card)", padding: "12px 16px" }}>
        <div className="row" style={{ gap: 10 }}>
          <span className="display center wiggle" style={{ width: 36, height: 36, background: "var(--yellow)", border: "var(--line)", borderRadius: "50%", fontSize: 18, flex: "none" }}>!</span>
          <span style={{ fontSize: 13.5, lineHeight: 1.5 }} className="muted">现在请大家<b style={{ color: "var(--ink)" }}>线下轮流开侃</b>——一本正经地解释这个词是什么意思。</span>
        </div>
      </div>

      <PlayerRing app={app} />

      <div className="dock">
        {isHost ? (
          <Btn kind="red" onClick={app.startVerify}>讨论完毕，进入验证 →</Btn>
        ) : (
          <Btn kind="ghost" disabled>等待房主结束讨论…</Btn>
        )}
      </div>

      {showDef && <DefModal app={app} myRole={myRole} onClose={() => setShowDef(false)} />}
      {confirmChange && <ChangeTopicModal word={app.word} onCancel={() => setConfirmChange(false)} onConfirm={changeTopic} />}
    </div>
  );
}

function DirectionChips({ word, reveal = false }) {
  const dirs = (word && word.dirs) || [];
  return (
    <div className="row" style={{ justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
      {dirs.map((d) => {
        const hit = reveal && d === word.answer;
        return (
          <span key={d} className={"role-chip " + (hit ? "chip-blue" : "chip-hidden")} style={{ fontSize: 12, padding: "4px 10px", boxShadow: "var(--shadow-sm)" }}>
            {d}{hit ? " ✓" : ""}
          </span>
        );
      })}
    </div>
  );
}

function ChangeTopicModal({ word, onCancel, onConfirm }) {
  return (
    <div className="modal-back" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: 24, textAlign: "center" }}>确认换题？</h2>
        <p className="muted tac" style={{ fontSize: 14, lineHeight: 1.6 }}>
          当前题目「{word.w}」会被换掉，所有人本轮的释义查看状态会重置。
        </p>
        <div className="col" style={{ gap: 10, marginTop: 18 }}>
          <Btn kind="yellow" onClick={onConfirm}>确认换题</Btn>
          <Btn kind="ghost" className="btn-sm" style={{ width: "100%" }} onClick={onCancel}>继续使用这题</Btn>
        </div>
      </div>
    </div>
  );
}

function MyRoleBanner({ role }) {
  const r = ROLES[role];
  return (
    <div className="row" style={{ width: "100%", justifyContent: "center", gap: 8 }}>
      <span className="muted" style={{ fontSize: 14 }}>你的身份</span>
      <span className={"role-chip " + r.chip}>{r.label}</span>
      {r.public && <span className="muted" style={{ fontSize: 12 }}>（公开）</span>}
    </div>
  );
}

/* —— 释义弹窗（10秒倒计时） —— */
function DefModal({ app, myRole, onClose }) {
  const TOTAL = 10;
  const [left, setLeft] = useState(TOTAL);
  const isHonest = myRole === "honest";

  useEffect(() => {
    app.markDefUsed();
    const t = setInterval(() => setLeft((x) => { if (x - 1 > 0 && x - 1 <= 3 && window.SFX) SFX.tick(); return x - 1; }), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (left <= 0) onClose(); }, [left]);

  return (
    <div className="modal-back">
      <div className="modal" style={{ borderColor: isHonest ? "var(--blue)" : "var(--red)" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 22, whiteSpace: "nowrap" }}>{isHonest ? "词语释义" : "释义"}</h2>
          <RingTimer progress={left / TOTAL} size={56} stroke={7} color={isHonest ? "var(--blue)" : "var(--red)"}>
            <span className="display" style={{ fontSize: 20 }}>{left}</span>
          </RingTimer>
        </div>

        <div className="card" style={{ marginTop: 14, background: isHonest ? "var(--blue-tint)" : "var(--red-tint)", borderColor: isHonest ? "var(--blue)" : "var(--red)" }}>
          <div className="display" style={{ fontSize: 30, letterSpacing: "4px" }}>{app.word.w}
            <span className="muted" style={{ fontSize: 15, letterSpacing: 1, marginLeft: 8 }}>{app.word.py}</span>
          </div>
          {isHonest ? (
            <>
              <DirectionChips word={app.word} reveal />
              <p style={{ fontSize: 16, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>{app.word.def}</p>
            </>
          ) : (
            <p className="display" style={{ fontSize: 21, lineHeight: 1.5, marginTop: 14, marginBottom: 6, color: "var(--red-deep)", textAlign: "center" }}>
              你并不知道<br />这个词是什么意思
            </p>
          )}
        </div>
        <div className="muted tac" style={{ fontSize: 12, marginTop: 12 }}>{left} 秒后自动关闭，且本轮无法再看</div>
      </div>
    </div>
  );
}

/* —— 玩家环（讨论时只显示老实人颜色，其余隐藏） —— */
function PlayerRing({ app, pickMode = false, pickId = null, onPick = null }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, width: "100%" }}>
      {app.players.map((p) => {
        const role = app.roles[p.id];
        const revealed = app.phase === "reveal";
        const showColor = revealed || (role === "honest"); // 老实人公开
        const ring = showColor ? ROLES[role].ring : "";
        const picked = pickId === p.id;
        const self = p.id === app.myId;
        return (
          <div key={p.id} className={"col center" + (pickMode && !self ? " pickable" : "")}
            style={{ gap: 5, opacity: pickMode && self ? .4 : 1 }}
            onClick={() => pickMode && !self && onPick && onPick(p.id)}>
            <div className={picked ? "picked-glow" : ""} style={{ borderRadius: "50%" }}>
              <Avatar player={p} size={48} ring={ring} showCrown={p.isHost} dim={!showColor && !self} />
            </div>
            <span className="display" style={{ fontSize: 12, whiteSpace: "nowrap", maxWidth: 78, overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
            {showColor && <span style={{ fontSize: 10, color: ROLES[role].color, fontWeight: 700 }}>{ROLES[role].label}</span>}
            {self && !showColor && <span style={{ fontSize: 10 }} className="muted">我</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ============ 阶段3：验证（大聪明押人） ============ */
function VerifyPhase({ app, me, myRole }) {
  const [pick, setPick] = useState(null);
  const isSmart = myRole === "smart";
  const smart = app.players.find((p) => app.roles[p.id] === "smart");
  const demoMode = !!(window.XBW_CONFIG && XBW_CONFIG.demoMode);

  if (!isSmart) {
    return (
      <div className="screen-pad center" style={{ flex: 1, gap: 18, textAlign: "center" }}>
        <MyRoleBanner role={myRole} />
        <div className="display floaty" style={{ fontSize: 56 }}><span className="spin" style={{ display: "inline-block" }}>◔</span></div>
        <h2 style={{ fontSize: 24 }}>大聪明「{smart.name}」<br />正在做出选择…</h2>
        <p className="muted" style={{ fontSize: 14, maxWidth: 260 }}>TA 会押一个最可信的人。屏住呼吸，等待揭晓。</p>
        {demoMode && (
          <div className="dock">
            <Btn kind="ghost" onClick={() => app.setViewpoint(smart.id)}>切到大聪明视角去验证 →</Btn>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="screen-pad center" style={{ flex: 1, gap: 16 }}>
      <MyRoleBanner role={myRole} />
      <div className="card tilt-r center" style={{ width: "100%", background: "var(--orange-tint)", borderColor: "var(--orange)", flexDirection: "column", gap: 4, padding: "18px" }}>
        <div className="display" style={{ fontSize: 22, color: "var(--orange-deep)" }}>该你拍板了</div>
        <p className="muted tac" style={{ fontSize: 14, margin: 0 }}>谁的解释最可信？点选 TA，然后验证。<br />押中老实人＝双赢，被瞎掰人勾走＝中招。</p>
      </div>

      <PlayerRing app={app} pickMode pickId={pick} onPick={setPick} />

      <div style={{ flex: 1 }} />
      <div className="dock">
        <Btn kind="red" disabled={!pick} onClick={() => app.verify(pick)}>
          {pick ? `验证「${app.players.find((p) => p.id === pick).name}」⚖` : "请先点选一个人"}
        </Btn>
      </div>
    </div>
  );
}

/* ============ 阶段4：揭晓 ============ */
function RevealPhase({ app, me, myRole }) {
  const res = app.lastResult;
  const smart = app.players.find((p) => p.id === res.smartId);
  const picked = app.players.find((p) => p.id === res.pickId);
  const win = res.outcome === "smart-honest";
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 450); return () => clearTimeout(t); }, []);

  return (
    <div className="screen-pad center" style={{ flex: 1, gap: 16 }}>
      {show && win && <Confetti n={46} />}

      <div className="card center" style={{ width: "100%", flexDirection: "column", gap: 4, padding: "16px",
        background: win ? "var(--blue-tint)" : "var(--red-tint)", borderColor: win ? "var(--blue)" : "var(--red)" }}>
        <div className="eyebrow">验证结果</div>
        <div className="display" style={{ fontSize: 23, lineHeight: 1.2, textAlign: "center", color: win ? "var(--blue-deep)" : "var(--red-deep)" }}>
          {win ? "大聪明 + 老实人 双赢！" : "瞎掰人骗局得逞！"}
        </div>
        <p className="muted tac" style={{ fontSize: 14, margin: "2px 0 0" }}>
          大聪明「{smart.name}」押了「{picked.name}」——TA 是 <b style={{ color: ROLES[res.pickedRole].color }}>{ROLES[res.pickedRole].label}</b>
        </p>
      </div>

      {/* 词义揭晓 */}
      <div className="card" style={{ width: "100%", background: "var(--paper-2)" }}>
        <div className="display" style={{ fontSize: 28, letterSpacing: "3px" }}>{app.word.w}
          <span className="muted" style={{ fontSize: 14, marginLeft: 8 }}>{app.word.py}</span></div>
        <div style={{ marginTop: 10 }}><DirectionChips word={app.word} reveal /></div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: "8px 0 0" }}>{app.word.def}</p>
      </div>

      {/* 全员身份揭晓 */}
      <div className="eyebrow">全员身份揭晓</div>
      <RevealRing app={app} res={res} animate={show} />

      <div style={{ flex: 1 }} />
      <div className="dock">
        {me.isHost ? (
          <Btn kind="red" onClick={app.nextRound}>下一轮 ↻</Btn>
        ) : (
          <Btn kind="ghost" disabled>等待房主开下一轮…</Btn>
        )}
        <Btn kind="ghost" className="btn-sm" style={{ width: "100%" }} onClick={app.leave}>结束并返回首页</Btn>
      </div>
    </div>
  );
}

function RevealRing({ app, res, animate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, width: "100%" }}>
      {app.players.map((p) => {
        const role = app.roles[p.id];
        const gained = res.gains[p.id] || 0;
        return (
          <div key={p.id} className="col center" style={{ gap: 5, position: "relative" }}>
            {gained > 0 && animate && (
              <span className="display" style={{ position: "absolute", top: -10, right: 2, zIndex: 3,
                background: "var(--mint)", color: "#fff", border: "var(--line)", borderRadius: "50%",
                width: 30, height: 30, display: "grid", placeItems: "center", fontSize: 14,
                boxShadow: "var(--shadow-sm)", animation: "scorepop .5s ease both" }}>+{gained}</span>
            )}
            <Avatar player={p} size={48} ring={ROLES[role].ring} showCrown={p.isHost} />
            <span style={{ fontSize: 11, color: ROLES[role].color, fontWeight: 700 }}>{ROLES[role].label}</span>
            <span className="muted" style={{ fontSize: 10 }}>{p.name} · {p.score}分</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { GameScreen, DealPhase, DiscussPhase, DirectionChips, ChangeTopicModal, VerifyPhase, RevealPhase, PlayerRing, DefModal, MyRoleBanner, RevealRing });
