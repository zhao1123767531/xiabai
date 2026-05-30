/* 瞎掰王 — 主状态机 + 游戏逻辑 */

let _uid = 1;
const newId = () => "p" + _uid++;

function randCode() { return String(Math.floor(1000 + Math.random() * 9000)); }
const cfg = () => window.XBW_CONFIG || { minPlayers: 4, maxPlayers: 12, demoMode: false };

function pickName(used) {
  const pool = window.XBW_NAMES.filter((n) => !used.includes(n));
  const src = pool.length ? pool : window.XBW_NAMES;
  return src[Math.floor(Math.random() * src.length)];
}
function pickColor(i) {
  const c = window.XBW_AVATAR_COLORS;
  return c[i % c.length];
}
function makePlayer(used, idx, opts = {}) {
  return { id: newId(), name: opts.name || pickName(used), color: pickColor(idx),
    isHost: !!opts.isHost, isBot: !!opts.isBot, score: 0 };
}

/* 分配角色：1 老实人 + 1 大聪明 + 其余瞎掰人 */
function assignRoles(players) {
  const ids = players.map((p) => p.id);
  const shuffled = [...ids].sort(() => Math.random() - 0.5);
  const roles = {};
  roles[shuffled[0]] = "honest";
  roles[shuffled[1]] = "smart";
  for (let i = 2; i < shuffled.length; i++) roles[shuffled[i]] = "bull";
  return roles;
}
function pickWord(lastW) {
  const all = window.getActiveWords();
  const ws = all.filter((x) => x.w !== lastW);
  const pool = ws.length ? ws : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

function App() {
  const [S, setS] = useState({
    screen: "home",      // home | lobby | game
    showJoin: false,
    showAdmin: false,
    room: { code: "" },
    players: [],
    myId: null,
    round: 0,
    phase: "lobby",      // dealing | discuss | verify | reveal
    word: { w: "", py: "", def: "" },
    roles: {},
    defUsed: {},
    lastResult: null,
  });
  const patch = (o) => setS((s) => ({ ...s, ...o }));

  /* ---- 房间 ---- */
  const createRoom = () => {
    const me = makePlayer([], 0, { isHost: true, isBot: false });
    patch({ screen: "lobby", room: { code: randCode() }, players: [me], myId: me.id,
      round: 0, phase: "lobby", roles: {}, defUsed: {}, lastResult: null });
    if (!cfg().demoMode) return;
    // 演示模式：模拟其他玩家陆续加入，正式联机版由后端广播玩家列表。
    [700, 1500, 2400].forEach((ms) => setTimeout(() => {
      setS((s) => {
        if (s.screen !== "lobby" || s.players.length >= cfg().maxPlayers) return s;
        const used = s.players.map((p) => p.name);
        window.SFX && SFX.join();
        return { ...s, players: [...s.players, makePlayer(used, s.players.length, { isBot: true })] };
      });
    }, ms));
  };

  const openJoin = () => patch({ showJoin: true });
  const closeJoin = () => patch({ showJoin: false });
  const openAdmin = () => patch({ showAdmin: true });
  const closeAdmin = () => patch({ showAdmin: false });

  const joinRoom = (code) => {
    // 模拟一个已有房间：房主 + 几名玩家，我作为访客加入
    const players = [];
    const host = makePlayer([], 0, { isHost: true, isBot: true });
    players.push(host);
    for (let i = 1; i <= 3; i++) players.push(makePlayer(players.map((p) => p.name), i, { isBot: true }));
    const me = makePlayer(players.map((p) => p.name), players.length, { isBot: false });
    players.push(me);
    patch({ screen: "lobby", showJoin: false, room: { code }, players, myId: me.id,
      round: 0, phase: "lobby", roles: {}, defUsed: {}, lastResult: null });
  };

  const kick = (id) => setS((s) => ({ ...s, players: s.players.filter((p) => p.id !== id) }));
  const addBot = () => setS((s) => {
    if (!cfg().demoMode || s.players.length >= cfg().maxPlayers) return s;
    const used = s.players.map((p) => p.name);
    return { ...s, players: [...s.players, makePlayer(used, s.players.length, { isBot: true })] };
  });

  const leave = () => patch({ screen: "home", players: [], myId: null, round: 0, phase: "lobby",
    roles: {}, defUsed: {}, lastResult: null, room: { code: "" } });

  /* ---- 开局 ---- */
  const startGame = () => setS((s) => {
    if (s.players.length < cfg().minPlayers) return s;
    window.SFX && SFX.start();
    return { ...s, screen: "game", phase: "dealing", round: 1,
      roles: assignRoles(s.players), word: pickWord(""), defUsed: {}, lastResult: null,
      players: s.players.map((p) => ({ ...p, score: 0 })) };
  });

  const setViewpoint = (id) => patch({ myId: id });
  const startDiscuss = () => patch({ phase: "discuss", defUsed: {} });
  const markDefUsed = () => setS((s) => ({ ...s, defUsed: { ...s.defUsed, [s.myId]: true } }));
  const changeWord = () => setS((s) => ({ ...s, word: pickWord(s.word.w), defUsed: {} }));
  const startVerify = () => patch({ phase: "verify" });

  /* ---- 验证 + 记分 ---- */
  const verify = (pickId) => setS((s) => {
    const smartId = Object.keys(s.roles).find((id) => s.roles[id] === "smart");
    const honestId = Object.keys(s.roles).find((id) => s.roles[id] === "honest");
    const pickedRole = s.roles[pickId];
    const gains = {};
    let outcome;
    if (pickId === honestId) {           // 押中老实人 → 双赢
      outcome = "smart-honest";
      gains[smartId] = 1; gains[honestId] = 1;
    } else {                              // 押中瞎掰人 → 该瞎掰人得分
      outcome = "bull-win";
      gains[pickId] = 1;
    }
    const players = s.players.map((p) => ({ ...p, score: p.score + (gains[p.id] || 0) }));
    window.SFX && (outcome === "smart-honest" ? SFX.win() : SFX.lose());
    return { ...s, phase: "reveal", players,
      lastResult: { smartId, honestId, pickId, pickedRole, outcome, gains } };
  });

  const nextRound = () => setS((s) => ({ ...s, phase: "dealing", round: s.round + 1,
    roles: assignRoles(s.players), word: pickWord(s.word.w), defUsed: {}, lastResult: null }));

  const app = { ...S, createRoom, openJoin, closeJoin, joinRoom, kick, addBot, leave,
    startGame, setViewpoint, startDiscuss, markDefUsed, changeWord, startVerify, verify, nextRound,
    openAdmin, closeAdmin };

  return (
    <div className="phone">
      {S.screen === "home" && <HomeScreen app={app} />}
      {S.screen === "lobby" && <LobbyScreen app={app} />}
      {S.screen === "game" && <GameScreen app={app} />}
      {S.showJoin && <JoinModal app={app} />}
      {S.showAdmin && <AdminModal app={app} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
