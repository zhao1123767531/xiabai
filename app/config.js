/* 瞎掰王 — 前端运行配置 */
(function () {
  const params = new URLSearchParams(window.location.search);

  window.XBW_CONFIG = {
    demoMode: params.get("demo") === "1",
    minPlayers: 4,
    maxPlayers: 12,
  };
})();
