/* 瞎掰王 — 共享 UI 组件 */
const { useState, useEffect, useRef } = React;

/* —— 角色元数据 —— */
const ROLES = {
  honest: { key: "honest", label: "老实人", color: "var(--blue)",   chip: "chip-blue",   ring: "ring-blue",   tint: "var(--blue-tint)",   public: false,
            blurb: "你知道这个词的真正意思。讨论时可以选择老实交代，也可以适当藏拙。" },
  smart:  { key: "smart",  label: "大聪明", color: "var(--orange)", chip: "chip-orange", ring: "ring-orange", tint: "var(--orange-tint)", public: true,
            blurb: "你的身份公开。你并不知道词义，可以换题，最后押一个你认为「最可信」的人。" },
  bull:   { key: "bull",   label: "瞎掰人", color: "var(--red)",    chip: "chip-red",    ring: "ring-red",    tint: "var(--red-tint)",    public: false,
            blurb: "你也不知道词义。尽情瞎掰，把大聪明忽悠到来押你，你就赢了。" },
};

/* —— 简易皇冠（简单多边形，非具象插画） —— */
function Crown({ size = 30, color = "var(--yellow)" }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 40 32" className="crown">
      <path d="M3 11 L11 18 L20 5 L29 18 L37 11 L33 28 L7 28 Z"
        fill={color} stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="3" cy="11" r="3.4" fill={color} stroke="var(--ink)" strokeWidth="2.4" />
      <circle cx="20" cy="5" r="3.6" fill={color} stroke="var(--ink)" strokeWidth="2.4" />
      <circle cx="37" cy="11" r="3.4" fill={color} stroke="var(--ink)" strokeWidth="2.4" />
    </svg>
  );
}

/* —— 头像 —— */
function Avatar({ player, size = 56, ring = "", showCrown = false, dim = false }) {
  const fontSize = Math.round(size * 0.42);
  return (
    <div className={"avatar " + ring} style={{
      width: size, height: size, background: player.color, fontSize,
      filter: dim ? "grayscale(.55) opacity(.8)" : "none",
    }}>
      {player.name.slice(0, 1)}
      {showCrown && (
        <span className="crown-badge"><Crown size={Math.max(22, size * 0.42)} /></span>
      )}
    </div>
  );
}

/* —— 角色徽标 —— */
function RoleChip({ role, hidden }) {
  if (hidden) return <span className="role-chip chip-hidden">？？？</span>;
  const r = ROLES[role];
  return <span className={"role-chip " + r.chip}>{r.label}</span>;
}

/* —— 按钮 —— */
function Btn({ kind = "", className = "", children, ...rest }) {
  return (
    <button className={"btn " + (kind ? "btn-" + kind + " " : "") + className} {...rest}>
      {children}
    </button>
  );
}

/* —— 倒计时圆环 —— */
function RingTimer({ progress, size = 76, stroke = 9, color = "var(--ink)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} className="ring-timer">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(36,29,22,.13)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - progress)}
          style={{ transition: "stroke-dashoffset .95s linear" }} />
      </svg>
      <div className="center" style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}

/* —— 撒花 —— */
function Confetti({ n = 40 }) {
  const colors = ["var(--orange)", "var(--blue)", "var(--red)", "var(--yellow)", "var(--mint)", "var(--grape)"];
  const pieces = useRef(
    Array.from({ length: n }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      dur: 1.8 + Math.random() * 1.6,
      bg: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
    }))
  ).current;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 60 }}>
      {pieces.map((p, i) => (
        <span key={i} className="confetti-piece" style={{
          left: p.left + "%", background: p.bg, transform: `rotate(${p.rot}deg)`,
          animation: `confetti-fall ${p.dur}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* —— 大 LOGO —— */
function Logo({ size = 64 }) {
  return (
    <div className="row" style={{ gap: 6, justifyContent: "center", whiteSpace: "nowrap" }}>
      <span className="display" style={{ fontSize: size, color: "var(--red)", WebkitTextStroke: "3px var(--ink)", letterSpacing: "2px", whiteSpace: "nowrap" }}>瞎掰</span>
      <span style={{ position: "relative", display: "inline-block" }}>
        <span className="display floaty" style={{ position: "absolute", top: -size * 0.46, left: "50%", transform: "translateX(-50%)" }}>
          <Crown size={size * 0.62} />
        </span>
        <span className="display" style={{ fontSize: size, color: "var(--yellow)", WebkitTextStroke: "3px var(--ink)" }}>王</span>
      </span>
    </div>
  );
}

Object.assign(window, { ROLES, Crown, Avatar, RoleChip, Btn, RingTimer, Confetti, Logo,
  useState, useEffect, useRef });
