const MIN_PLAYERS = 4;
const MAX_PLAYERS = 12;
const ROOM_TTL_SECONDS = 6 * 60 * 60;

const AVATAR_COLORS = [
  "#9b6bff", "#34d6a8", "#ff9fc4", "#5bc0ff", "#ffb03f",
  "#7ad44f", "#ff7a59", "#c08bff", "#3fc7c2", "#ffce4d",
  "#8aa0ff", "#ff8fa3"
];

const NAME_POOL = [
  "阿强", "小美", "老王", "二狗", "大头", "球球", "团子", "阿杰",
  "莉莉", "胖虎", "西西", "蛋黄", "麻辣烫", "奥利奥", "土豆", "可乐",
  "花卷", "毛毛", "阿May", "诺诺"
];

const WORDS = [
  { w: "饕餮", py: "tāo tiè", answer: "神兽", dirs: ["神兽", "地方", "乐器"], def: "传说中贪食的凶兽；也常用来比喻贪得无厌或特别能吃的人。" },
  { w: "氤氲", py: "yīn yūn", answer: "天象", dirs: ["天象", "成语", "官职"], def: "烟气、云雾、水汽等弥漫交融的样子，常带朦胧柔和的感觉。" },
  { w: "缱绻", py: "qiǎn quǎn", answer: "情感", dirs: ["情感", "地名", "器物"], def: "情意深厚、缠绵难舍，也可形容关系亲密不易分开。" },
  { w: "龃龉", py: "jǔ yǔ", answer: "关系", dirs: ["关系", "服饰", "水文"], def: "本指牙齿上下不齐；引申为意见不合、彼此抵触。" },
  { w: "耄耋", py: "mào dié", answer: "年龄", dirs: ["年龄", "植物", "兵器"], def: "指八九十岁的高龄，泛称年纪很大的人。" },
  { w: "踟蹰", py: "chí chú", answer: "动作", dirs: ["动作", "小说", "地方"], def: "犹豫徘徊、想走又不走的样子。" },
  { w: "旖旎", py: "yǐ nǐ", answer: "景色", dirs: ["景色", "成语", "刑罚"], def: "柔和美好，多用来形容风光秀丽或姿态婉转。" },
  { w: "饾饤", py: "dòu dìng", answer: "文辞", dirs: ["文辞", "昆虫", "官职"], def: "原指把食品堆叠陈设；后常比喻文章堆砌典故、罗列辞藻。" },
  { w: "踽踽", py: "jǔ jǔ", answer: "状态", dirs: ["状态", "地方", "乐器"], def: "孤零零地独自行走的样子，常见于“踽踽独行”。" },
  { w: "葳蕤", py: "wēi ruí", answer: "植物", dirs: ["植物", "成语", "服饰"], def: "草木枝叶繁盛、纷披下垂；也可形容华美繁盛。" },
  { w: "觊觎", py: "jì yú", answer: "欲望", dirs: ["欲望", "地名", "工艺"], def: "非分地希望得到不该得到的东西。" },
  { w: "臧否", py: "zāng pǐ", answer: "评论", dirs: ["评论", "神兽", "水文"], def: "评论人物或事情的好坏、褒贬。" },
  { w: "睥睨", py: "pì nì", answer: "神态", dirs: ["神态", "地方", "植物"], def: "斜着眼看人，常形容傲慢、轻视、目中无人。" },
  { w: "肯綮", py: "kěn qìng", answer: "关键", dirs: ["关键", "小说", "器物"], def: "筋骨结合处；比喻事情最要害、最关键的地方。" },
  { w: "踅摸", py: "xué mo", answer: "方言", dirs: ["方言", "天象", "服饰"], def: "方言词，指到处寻找、来回探看。" },
  { w: "氅衣", py: "chǎng yī", answer: "服饰", dirs: ["服饰", "成语", "水文"], def: "宽大的外衣，也指大氅一类披在外面的衣服。" },
  { w: "轇轕", py: "jiāo gé", answer: "状态", dirs: ["状态", "地方", "神兽"], def: "纠缠交错、混杂不清的样子。" },
  { w: "觳觫", py: "hú sù", answer: "神态", dirs: ["神态", "工艺", "地名"], def: "因恐惧而发抖，形容惊惧不安。" },
  { w: "狴犴", py: "bì àn", answer: "神兽", dirs: ["神兽", "植物", "小说"], def: "传说中像虎、好诉讼的兽名，古代常装饰在牢狱或衙门上。" },
  { w: "赑屃", py: "bì xì", answer: "神兽", dirs: ["神兽", "水文", "服饰"], def: "传说中力大善负重的神兽，常见作驮碑的石兽形象。" },
  { w: "蒹葭", py: "jiān jiā", answer: "植物", dirs: ["植物", "成语", "地方"], def: "芦苇一类的水边植物，也因《诗经》名篇而带有文学意味。" },
  { w: "菡萏", py: "hàn dàn", answer: "植物", dirs: ["植物", "器物", "官职"], def: "荷花的别称，常用于古典诗文。" },
  { w: "缟素", py: "gǎo sù", answer: "服饰", dirs: ["服饰", "天象", "神兽"], def: "白色的衣服，多指丧服或素服。" },
  { w: "圭臬", py: "guī niè", answer: "准则", dirs: ["准则", "昆虫", "地名"], def: "本为古代测日影的器具；后比喻标准、法度或准则。" },
  { w: "踔厉", py: "chuō lì", answer: "状态", dirs: ["状态", "地方", "小说"], def: "精神振奋、意气昂扬，常与“奋发”连用。" },
  { w: "赧然", py: "nǎn rán", answer: "神态", dirs: ["神态", "水文", "工艺"], def: "因羞愧、难为情而脸红的样子。" },
  { w: "滂沱", py: "pāng tuó", answer: "天象", dirs: ["天象", "成语", "器物"], def: "雨下得很大，也可形容眼泪流得很多。" },
  { w: "魑魅", py: "chī mèi", answer: "鬼怪", dirs: ["鬼怪", "植物", "服饰"], def: "山林中的妖怪鬼魅，常与“魍魉”并称。" },
  { w: "螽斯", py: "zhōng sī", answer: "昆虫", dirs: ["昆虫", "地方", "乐器"], def: "一种鸣虫名，古诗文中也借指子孙众多。" },
  { w: "觥筹", py: "gōng chóu", answer: "宴饮", dirs: ["宴饮", "成语", "地方"], def: "酒器和酒令筹码，常用来指宴席上饮酒交酬的场面。" },
  { w: "沆瀣", py: "hàng xiè", answer: "天象", dirs: ["天象", "小说", "官职"], def: "夜间的水气、露气；也常因“沆瀣一气”表示气味相投但含贬义。" },
  { w: "潋滟", py: "liàn yàn", answer: "水文", dirs: ["水文", "服饰", "成语"], def: "水波荡漾、波光闪动的样子。" },
  { w: "倥偬", py: "kǒng zǒng", answer: "状态", dirs: ["状态", "地名", "植物"], def: "事情急迫繁忙，也可形容困苦窘迫。" },
  { w: "蹀躞", py: "dié xiè", answer: "动作", dirs: ["动作", "神兽", "地方"], def: "小步来回走动，也可指徘徊不前。" },
  { w: "璎珞", py: "yīng luò", answer: "饰物", dirs: ["饰物", "天象", "水文"], def: "用珠玉串成的颈饰或身饰，佛像和古装形象中常见。" },
  { w: "觌面", py: "dí miàn", answer: "交际", dirs: ["交际", "植物", "工艺"], def: "当面、面对面相见。" },
  { w: "酩酊", py: "mǐng dǐng", answer: "宴饮", dirs: ["宴饮", "地方", "神兽"], def: "醉得很厉害，常说“酩酊大醉”。" },
  { w: "罅隙", py: "xià xì", answer: "空隙", dirs: ["空隙", "小说", "民俗"], def: "裂缝、缝隙，也可比喻事情中的漏洞或隔阂。" },
  { w: "窈窕", py: "yǎo tiǎo", answer: "人物", dirs: ["人物", "成语", "器物"], def: "形容女子文静美好，也可形容幽深曲折。" },
  { w: "擘画", py: "bò huà", answer: "行动", dirs: ["行动", "水文", "服饰"], def: "筹划、安排，多用于较大的计划或布局。" },
  { w: "掊击", py: "pǒu jī", answer: "言论", dirs: ["言论", "植物", "地名"], def: "抨击、批评、攻击某种观点或行为。" },
  { w: "跬步", py: "kuǐ bù", answer: "距离", dirs: ["距离", "神兽", "小说"], def: "古称半步；常用来比喻很小的一步或一点积累。" },
  { w: "祓除", py: "fú chú", answer: "民俗", dirs: ["民俗", "成语", "水文"], def: "古代用祭祀、沐浴等方式除灾去邪。" },
  { w: "旌旆", py: "jīng pèi", answer: "军旅", dirs: ["军旅", "植物", "地方"], def: "旗帜的统称，常出现在军旅或仪仗场景。" },
  { w: "舳舻", py: "zhú lú", answer: "船舶", dirs: ["船舶", "服饰", "官职"], def: "船头和船尾；也用来形容船只很多、首尾相接。" },
  { w: "埏埴", py: "shān zhí", answer: "工艺", dirs: ["工艺", "神兽", "天象"], def: "揉和黏土制作陶器，常借指陶冶、造就。" },
  { w: "瓠落", py: "hù luò", answer: "状态", dirs: ["状态", "地名", "昆虫"], def: "大而无用、空阔不实的样子。" },
  { w: "蕞尔", py: "zuì ěr", answer: "状态", dirs: ["状态", "水文", "服饰"], def: "形容地方小、规模小或数量少。" },
  { w: "剀切", py: "kǎi qiè", answer: "言论", dirs: ["言论", "神兽", "地方"], def: "切实恳切，说话或文章直中要害。" },
  { w: "谲诡", py: "jué guǐ", answer: "状态", dirs: ["状态", "植物", "宴饮"], def: "怪异多变，或诡诈难测。" },
  { w: "瓦釜雷鸣", py: "wǎ fǔ léi míng", answer: "成语", dirs: ["成语", "地方", "小说"], def: "瓦锅发出雷鸣般的声响；比喻平庸者声势显赫。" },
  { w: "弹铗而歌", py: "tán jiá ér gē", answer: "成语", dirs: ["成语", "乐器", "民俗"], def: "敲着剑把唱歌；常借指有才之人求取知遇或待遇。" },
  { w: "涸辙之鲋", py: "hé zhé zhī fù", answer: "成语", dirs: ["成语", "水文", "地方"], def: "干车辙里的鲫鱼；比喻处境极其困难、急需救助的人。" },
  { w: "怙恶不悛", py: "hù è bù quān", answer: "成语", dirs: ["成语", "植物", "服饰"], def: "坚持作恶而不肯悔改。" },
  { w: "鳞次栉比", py: "lín cì zhì bǐ", answer: "成语", dirs: ["成语", "器物", "昆虫"], def: "像鱼鳞和梳齿一样密密排列，多形容房屋、船只等排列很密。" },
  { w: "纡尊降贵", py: "yū zūn jiàng guì", answer: "成语", dirs: ["成语", "地方", "小说"], def: "地位高的人降低身份去接近或迁就别人。" }
];

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function redisReady() {
  return redisUrl() && redisToken();
}

function redisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
}

function redisToken() {
  return process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
}

async function redis(command) {
  if (!redisReady()) throw Object.assign(new Error("Redis is not configured"), { statusCode: 503 });
  const response = await fetch(redisUrl(), {
    method: "POST",
    headers: {
      authorization: `Bearer ${redisToken()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const data = await response.json();
  if (!response.ok || data.error) {
    throw Object.assign(new Error(data.error || "Redis request failed"), { statusCode: 500 });
  }
  return data.result;
}

const keyFor = (code) => `xbw:room:${code}`;
const now = () => Date.now();
const id = () => (crypto.randomUUID ? crypto.randomUUID() : `${now()}-${Math.random().toString(16).slice(2)}`);
const cleanName = (name) => String(name || "").trim().slice(0, 12);

function randCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function pickWord(lastW) {
  const pool = WORDS.filter((w) => w.w !== lastW);
  return (pool.length ? pool : WORDS)[Math.floor(Math.random() * (pool.length ? pool.length : WORDS.length))];
}

function makePlayer(name, idx, isHost = false) {
  const safeName = cleanName(name) || NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
  return { id: id(), name: safeName, color: AVATAR_COLORS[idx % AVATAR_COLORS.length], isHost, score: 0 };
}

function assignRoles(players) {
  const shuffled = players.map((p) => p.id).sort(() => Math.random() - 0.5);
  const roles = { [shuffled[0]]: "honest", [shuffled[1]]: "smart" };
  shuffled.slice(2).forEach((playerId) => { roles[playerId] = "bull"; });
  return roles;
}

async function getRoom(code) {
  if (!/^\d{4}$/.test(String(code || ""))) throw Object.assign(new Error("房间号不正确"), { statusCode: 400 });
  const raw = await redis(["GET", keyFor(code)]);
  if (!raw) throw Object.assign(new Error("房间不存在或已过期"), { statusCode: 404 });
  return JSON.parse(raw);
}

async function saveRoom(room) {
  room.updatedAt = now();
  await redis(["SET", keyFor(room.code), JSON.stringify(room), "EX", ROOM_TTL_SECONDS]);
}

async function deleteRoom(code) {
  await redis(["DEL", keyFor(code)]);
}

function requirePlayer(room, playerId) {
  const player = room.players.find((p) => p.id === playerId);
  if (!player) throw Object.assign(new Error("你已不在这个房间"), { statusCode: 410 });
  return player;
}

function requireHost(room, playerId) {
  const player = requirePlayer(room, playerId);
  if (!player.isHost) throw Object.assign(new Error("只有房主可以操作"), { statusCode: 403 });
  return player;
}

function visibleWord(room, playerId) {
  if (!room.word) return { w: "", py: "", dirs: [] };
  const role = room.roles[playerId];
  const revealed = room.phase === "reveal";
  const word = { w: room.word.w, py: room.word.py, dirs: room.word.dirs || [] };
  if (revealed || role === "honest") {
    word.def = room.word.def;
    word.answer = room.word.answer;
  }
  return word;
}

function visibleRoles(room, playerId) {
  const roles = {};
  const honestId = Object.keys(room.roles || {}).find((id) => room.roles[id] === "honest");
  if (honestId) roles[honestId] = "honest";
  if (room.roles && room.roles[playerId]) roles[playerId] = room.roles[playerId];
  if (room.phase === "reveal") return { ...room.roles };
  return roles;
}

function visibleRoom(room, playerId) {
  requirePlayer(room, playerId);
  return {
    room: { code: room.code },
    players: room.players,
    myId: playerId,
    round: room.round || 0,
    phase: room.phase,
    word: visibleWord(room, playerId),
    roles: visibleRoles(room, playerId),
    defUsed: room.defUsed || {},
    lastResult: room.phase === "reveal" ? room.lastResult : null,
  };
}

async function createRoom(name) {
  for (let i = 0; i < 20; i++) {
    const code = randCode();
    const existing = await redis(["GET", keyFor(code)]);
    if (existing) continue;
    const host = makePlayer(name, 0, true);
    const room = {
      code,
      hostPlayerId: host.id,
      players: [host],
      phase: "lobby",
      round: 0,
      roles: {},
      defUsed: {},
      lastResult: null,
      createdAt: now(),
      updatedAt: now(),
    };
    await saveRoom(room);
    return visibleRoom(room, host.id);
  }
  throw Object.assign(new Error("房间号生成失败，请重试"), { statusCode: 500 });
}

async function joinRoom(code, name) {
  const room = await getRoom(code);
  if (room.players.length >= MAX_PLAYERS) throw Object.assign(new Error("房间已满"), { statusCode: 409 });
  if (room.phase !== "lobby") throw Object.assign(new Error("游戏已开始，暂时不能加入"), { statusCode: 409 });
  const player = makePlayer(name, room.players.length, false);
  room.players.push(player);
  await saveRoom(room);
  return visibleRoom(room, player.id);
}

function startGame(room, playerId) {
  requireHost(room, playerId);
  if (room.players.length < MIN_PLAYERS) throw Object.assign(new Error(`至少 ${MIN_PLAYERS} 人才能开始`), { statusCode: 400 });
  room.phase = "dealing";
  room.round = 1;
  room.roles = assignRoles(room.players);
  room.word = pickWord("");
  room.defUsed = {};
  room.lastResult = null;
  room.players = room.players.map((p) => ({ ...p, score: 0 }));
}

function nextRound(room, playerId) {
  requireHost(room, playerId);
  if (room.phase !== "reveal") throw Object.assign(new Error("当前不能进入下一轮"), { statusCode: 400 });
  room.phase = "dealing";
  room.round += 1;
  room.roles = assignRoles(room.players);
  room.word = pickWord(room.word && room.word.w);
  room.defUsed = {};
  room.lastResult = null;
}

function verify(room, playerId, pickId) {
  requirePlayer(room, playerId);
  if (room.roles[playerId] !== "smart") throw Object.assign(new Error("只有大聪明可以验证"), { statusCode: 403 });
  if (room.phase !== "verify") throw Object.assign(new Error("当前还不能验证"), { statusCode: 400 });
  if (!room.players.some((p) => p.id === pickId) || pickId === playerId) {
    throw Object.assign(new Error("请选择有效玩家"), { statusCode: 400 });
  }
  const smartId = Object.keys(room.roles).find((id) => room.roles[id] === "smart");
  const honestId = Object.keys(room.roles).find((id) => room.roles[id] === "honest");
  const pickedRole = room.roles[pickId];
  const gains = {};
  let outcome = "bull-win";
  if (pickId === honestId) {
    outcome = "smart-honest";
    gains[smartId] = 1;
    gains[honestId] = 1;
  } else {
    gains[pickId] = 1;
  }
  room.players = room.players.map((p) => ({ ...p, score: p.score + (gains[p.id] || 0) }));
  room.phase = "reveal";
  room.lastResult = { smartId, honestId, pickId, pickedRole, outcome, gains };
}

async function mutate(action, body) {
  if (action === "create") return createRoom(body.name);
  if (action === "join") return joinRoom(body.code, body.name);

  const room = await getRoom(body.code);
  const playerId = body.playerId;
  requirePlayer(room, playerId);

  if (action === "leave") {
    room.players = room.players.filter((p) => p.id !== playerId);
    if (!room.players.length) {
      await deleteRoom(room.code);
      return { left: true };
    }
    if (!room.players.some((p) => p.isHost)) {
      room.players[0].isHost = true;
      room.hostPlayerId = room.players[0].id;
    }
  } else if (action === "kick") {
    requireHost(room, playerId);
    room.players = room.players.filter((p) => p.id !== body.targetId || p.isHost);
  } else if (action === "start") {
    startGame(room, playerId);
  } else if (action === "discuss") {
    room.phase = "discuss";
    room.defUsed = {};
  } else if (action === "viewDef") {
    room.defUsed = { ...(room.defUsed || {}), [playerId]: true };
  } else if (action === "changeWord") {
    if (room.phase !== "discuss" || room.roles[playerId] !== "honest") {
      throw Object.assign(new Error("只有老实人可以在讨论阶段换题"), { statusCode: 403 });
    }
    room.word = pickWord(room.word && room.word.w);
    room.defUsed = {};
  } else if (action === "verifyPhase") {
    requireHost(room, playerId);
    room.phase = "verify";
  } else if (action === "verify") {
    verify(room, playerId, body.pickId);
  } else if (action === "next") {
    nextRound(room, playerId);
  } else {
    throw Object.assign(new Error("未知操作"), { statusCode: 400 });
  }

  await saveRoom(room);
  return action === "leave" ? { left: true } : visibleRoom(room, playerId);
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { code, playerId } = req.query || {};
      const room = await getRoom(code);
      return json(res, 200, visibleRoom(room, playerId));
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const data = await mutate(body.action, body);
      return json(res, 200, data);
    }
    return json(res, 405, { error: "Method not allowed" });
  } catch (err) {
    return json(res, err.statusCode || 500, { error: err.message || "服务器错误" });
  }
}
