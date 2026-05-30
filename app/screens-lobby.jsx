/* 瞎掰王 — 首页 / 加入 / 大厅 / 视角切换 / 记分榜 */

/* ============ 首页 ============ */
function HomeScreen({ app }) {
  const [showHow, setShowHow] = useState(false);
  return (
    <div className="screen">
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 12 }}><SoundToggle /></div>
      <div className="screen-pad center" style={{ flex: 1, gap: 0, textAlign: "center" }}>
        <div style={{ marginTop: 24 }}><Logo size={76} /></div>
        <p className="display tilt-r" style={{
          fontSize: 19, color: "#fff", background: "var(--ink)", display: "inline-block",
          padding: "6px 16px", borderRadius: "var(--radius-pill)", marginTop: 22,
          boxShadow: "var(--shadow-sm)", whiteSpace: "nowrap",
        }}>一本正经地胡说八道</p>

        <div className="card tilt-l" style={{ marginTop: 30, width: "100%", background: "var(--paper-2)" }}>
          <div className="row" style={{ justifyContent: "center", gap: 18 }}>
            <RoleTag role="honest" />
            <RoleTag role="smart" />
            <RoleTag role="bull" />
          </div>
        </div>

        <div className="col" style={{ gap: 14, width: "100%", marginTop: 34 }}>
          <Btn kind="red" onClick={app.createRoom} style={{ fontSize: 24, minHeight: 64 }}>＋ 创建房间</Btn>
          <Btn kind="blue" onClick={() => app.openJoin()} style={{ fontSize: 24, minHeight: 64 }}>→ 加入房间</Btn>
          <Btn kind="ghost" className="btn-sm" style={{ width: "100%", marginTop: 4 }} onClick={() => setShowHow(true)}>？ 怎么玩</Btn>
        </div>

        <button onClick={app.openAdmin} style={{ marginTop: 26, background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", fontSize: 12.5, fontFamily: "var(--font-body)", opacity: .7, letterSpacing: ".05em" }}>· 管理后台 ·</button>
      </div>
      {showHow && <HowToModal onClose={() => setShowHow(false)} />}
    </div>
  );
}

function RoleTag({ role }) {
  const r = ROLES[role];
  return (
    <div className="col center" style={{ gap: 6 }}>
      <div className="avatar" style={{ width: 40, height: 40, background: r.color, fontSize: 0 }} />
      <span className="display" style={{ fontSize: 15, color: r.color, WebkitTextStroke: "0.6px var(--ink)", whiteSpace: "nowrap" }}>{r.label}</span>
    </div>
  );
}

function HowToModal({ onClose }) {
  const steps = [
    ["发身份", "每局 1 老实人(蓝)、1 大聪明(橙)、其余全是瞎掰人(红)。只有自己看得到身份；老实人公开。"],
    ["看生僻词", "中间出现一个超难的词，并给出 3 个可能方向。只有老实人能看到真释义和正确方向，其余人只会看到「你并不知道这个词是什么意思」，且只能看 10 秒。"],
    ["老实人换题", "如果老实人觉得这题不适合玩，可以点「换题」，二次确认后更换本轮词语。"],
    ["线下开侃", "大家轮流一本正经地解释这个词。老实人说真的，瞎掰人狂编忽悠。"],
    ["大聪明验证", "讨论完，大聪明押一个最可信的人并验证，全员身份揭晓。"],
    ["记分", "押中老实人 → 大聪明＋老实人各 1 分；被瞎掰人勾走 → 那个瞎掰人 1 分。"],
  ];
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "80%", overflowY: "auto" }}>
        <h2 style={{ fontSize: 28, textAlign: "center", marginBottom: 4 }}>怎么玩</h2>
        <div className="col" style={{ gap: 14, marginTop: 14 }}>
          {steps.map(([t, d], i) => (
            <div key={i} className="row" style={{ alignItems: "flex-start", gap: 12 }}>
              <span className="display center" style={{ flex: "none", width: 34, height: 34, background: "var(--yellow)", border: "var(--line)", borderRadius: "50%", fontSize: 18, boxShadow: "var(--shadow-sm)" }}>{i + 1}</span>
              <div>
                <div className="display" style={{ fontSize: 18 }}>{t}</div>
                <div className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <Btn kind="ink" style={{ marginTop: 20 }} onClick={onClose}>明白了</Btn>
      </div>
    </div>
  );
}

/* ============ 加入房间弹窗 ============ */
function JoinModal({ app }) {
  const [code, setCode] = useState("");
  const ok = code.trim().length === 4;
  return (
    <div className="modal-back" onClick={app.closeJoin}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: 26, textAlign: "center" }}>加入房间</h2>
        <p className="muted tac" style={{ fontSize: 14, marginTop: 4 }}>输入 4 位房间号</p>
        <input className="code-input" style={{ marginTop: 16 }} inputMode="numeric" maxLength={4}
          value={code} autoFocus
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="0000" />
        <div className="col" style={{ gap: 10, marginTop: 20 }}>
          <Btn kind="blue" disabled={!ok} onClick={() => app.joinRoom(code)}>进入房间</Btn>
          <Btn kind="ghost" className="btn-sm" style={{ width: "100%" }} onClick={app.closeJoin}>取消</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============ 房间大厅 ============ */
function LobbyScreen({ app }) {
  const { players, room, myId } = app;
  const me = players.find((p) => p.id === myId);
  const host = players.find((p) => p.isHost);
  const isHost = me && me.isHost;
  const minPlayers = (window.XBW_CONFIG && XBW_CONFIG.minPlayers) || 4;
  const maxPlayers = (window.XBW_CONFIG && XBW_CONFIG.maxPlayers) || 12;
  const demoMode = !!(window.XBW_CONFIG && XBW_CONFIG.demoMode);
  const enough = players.length >= minPlayers;
  const full = players.length >= maxPlayers;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(room.code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="screen">
      <div className="topbar">
        <Btn kind="ghost" className="btn-sm" onClick={app.leave}>← 退出</Btn>
        <div className="col" style={{ alignItems: "center" }}>
          <span className="eyebrow" style={{ fontSize: 11 }}>房间号</span>
          <span className="display" style={{ fontSize: 26, letterSpacing: ".18em", lineHeight: 1 }}>{room.code}</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <SoundToggle style={{ width: 38, height: 38, fontSize: 16 }} />
          <Btn kind="yellow" className="btn-sm" onClick={copy}>{copied ? "已复制!" : "复制"}</Btn>
        </div>
      </div>

      <div className="screen-pad">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 24 }}>玩家 <span style={{ color: enough ? "var(--mint)" : "var(--red)" }}>{players.length}</span><span className="muted" style={{ fontSize: 18 }}>/12</span></h2>
          <span className="role-chip chip-hidden" style={{ fontSize: 13 }}>至少 {minPlayers} 人开局</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {players.map((p) => (
            <div key={p.id} className="card" style={{ padding: "14px 8px", textAlign: "center", position: "relative", background: p.id === myId ? "var(--yellow)" : "var(--card)" }}>
              {isHost && !p.isHost && (
                <button className="avatar" onClick={() => app.kick(p.id)} title="请出房间"
                  style={{ position: "absolute", top: -10, right: -8, width: 26, height: 26, background: "var(--red)", color: "#fff", fontSize: 16, fontFamily: "var(--font-body)", cursor: "pointer", zIndex: 2 }}>×</button>
              )}
              <div className="center" style={{ marginTop: p.isHost ? 8 : 0 }}>
                <Avatar player={p} size={52} showCrown={p.isHost} />
              </div>
              <div className="display" style={{ fontSize: 15, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div className="muted" style={{ fontSize: 11 }}>{p.isHost ? "房主" : p.id === myId ? "我" : "玩家"}</div>
            </div>
          ))}
          {!full && isHost && demoMode && (
            <button className="card pickable" onClick={app.addBot}
              style={{ padding: "14px 8px", textAlign: "center", borderStyle: "dashed", background: "var(--paper-2)", cursor: "pointer", display: "grid", placeItems: "center", minHeight: 112 }}>
              <span className="display" style={{ fontSize: 30, lineHeight: 1 }}>＋</span>
              <span className="muted" style={{ fontSize: 12 }}>加人(演示)</span>
            </button>
          )}
        </div>

        <div className="card tilt-r" style={{ marginTop: 22, background: "var(--blue-tint)", borderColor: "var(--blue-deep)" }}>
          <div className="display" style={{ fontSize: 16, color: "var(--blue-deep)" }}>本局身份分配</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
            1 名 <b style={{ color: "var(--blue)" }}>老实人</b> · 1 名 <b style={{ color: "var(--orange)" }}>大聪明</b> · 其余 {Math.max(0, players.length - 2)} 名 <b style={{ color: "var(--red)" }}>瞎掰人</b>
          </div>
          {!demoMode && (
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>当前为正式界面预览：真实玩家加入需要后端房间服务。</div>
          )}
        </div>
      </div>

      <div className="dock">
        {isHost ? (
          <Btn kind="red" disabled={!enough} onClick={app.startGame} style={{ fontSize: 24, minHeight: 62 }}>
            {enough ? "开始游戏 ▶" : `还差 ${minPlayers - players.length} 人`}
          </Btn>
        ) : (
          <Btn kind="ghost" disabled style={{ fontSize: 20 }}>等待房主「{host ? host.name : ""}」开始…</Btn>
        )}
      </div>
    </div>
  );
}

/* ============ 视角切换浮层 ============ */
function ViewSwitcher({ app }) {
  const [open, setOpen] = useState(false);
  const me = app.players.find((p) => p.id === app.myId);
  return (
    <>
      <button className="btn btn-ink btn-sm" onClick={() => setOpen(true)}
        style={{ boxShadow: "var(--shadow-sm)", fontSize: 14, whiteSpace: "nowrap", maxWidth: 160, overflow: "hidden" }}>
        👁 {me ? me.name : ""} ▾
      </button>
      {open && (
        <div className="view-sheet-back" onClick={() => setOpen(false)}>
          <div className="view-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
              <h2 style={{ fontSize: 22 }}>切换玩家视角</h2>
              <span className="muted" style={{ fontSize: 12, maxWidth: 150, textAlign: "right" }}>演示用：看任意玩家的私密界面</span>
            </div>
            {app.players.map((p) => {
              const role = app.roles[p.id];
              return (
                <div key={p.id} className={"view-row" + (p.id === app.myId ? " active" : "")}
                  onClick={() => { app.setViewpoint(p.id); setOpen(false); }}>
                  <Avatar player={p} size={40} showCrown={p.isHost} />
                  <div className="grow">
                    <div className="display" style={{ fontSize: 17 }}>{p.name} {p.id === app.myId && <span className="muted" style={{ fontSize: 12 }}>· 当前</span>}</div>
                    {app.phase !== "lobby" && role && <div className="muted" style={{ fontSize: 12 }}>身份：{ROLES[role].label}</div>}
                  </div>
                  {p.id === app.myId && <span className="display" style={{ fontSize: 20 }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

/* ============ 记分榜 ============ */
function ScoreSheet({ app, onClose }) {
  const ranked = [...app.players].sort((a, b) => b.score - a.score);
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "80%", overflowY: "auto" }}>
        <h2 style={{ fontSize: 28, textAlign: "center" }}>记分榜</h2>
        <div className="muted tac" style={{ fontSize: 13 }}>第 {app.round} 轮</div>
        <div className="col" style={{ gap: 10, marginTop: 16 }}>
          {ranked.map((p, i) => (
            <div key={p.id} className="row" style={{ border: "var(--line)", borderRadius: "var(--radius-sm)", padding: "8px 12px", background: i === 0 ? "var(--yellow)" : "var(--card)", boxShadow: "var(--shadow-sm)" }}>
              <span className="display" style={{ fontSize: 18, width: 28 }}>{medals[i] || i + 1}</span>
              <Avatar player={p} size={38} showCrown={p.isHost} />
              <span className="display grow" style={{ fontSize: 17 }}>{p.name}</span>
              <span className="display" style={{ fontSize: 24, color: "var(--red)" }}>{p.score}</span>
            </div>
          ))}
        </div>
        <Btn kind="ink" style={{ marginTop: 20 }} onClick={onClose}>关闭</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, JoinModal, LobbyScreen, ViewSwitcher, ScoreSheet, HowToModal, RoleTag });
