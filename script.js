let gold = 0;
let gem = 100;
let stone = 0;
let level = 0;
let clickIncome = 10;
let autoIncome = 0;
let enhanceCost = 100;
let autoCost = 500;
let unlocked = [0];
let currentFilter = "ALL";
let options = [];
let growthLevel = 1;
let growthExp = 0;
let inventory = [];
let itemSeq = 1;
let equippedItemId = null;
let autoGoldGauge = 0;
let lifetimeGoldGauge = 0;

const wands = [
  { level: 0, grade: "E", name: "견습의 나무 지팡이", stars: 1, icon: "🪵", element: "나무" },
  { level: 3, grade: "D", name: "푸른 수정 지팡이", stars: 2, icon: "💧", element: "물" },
  { level: 6, grade: "C", name: "달빛 마법봉", stars: 3, icon: "🌙", element: "달" },
  { level: 9, grade: "B", name: "비전의 지팡이", stars: 4, icon: "🔮", element: "비전" },
  { level: 12, grade: "A", name: "고대의 번개 지팡이", stars: 5, icon: "⚡", element: "번개" },
  { level: 15, grade: "S", name: "별빛 대마법봉", stars: 5, icon: "⭐", element: "별" },
  { level: 20, grade: "SS", name: "차원의 왕홀", stars: 5, icon: "🌀", element: "차원" },
  { level: 25, grade: "SSS", name: "창조자의 마법봉", stars: 5, icon: "🌈", element: "창조" },
  { level: 30, grade: "SSS", name: "영원의 마도 지팡이", stars: 5, icon: "♾️", element: "영원" },

  { level: 35, grade: "SSS", name: "심연의 흑마법봉", stars: 5, icon: "🕳️", element: "심연" },
  { level: 40, grade: "SSS", name: "태양신의 성창", stars: 5, icon: "☀️", element: "태양" },
  { level: 45, grade: "SSS", name: "시간 왜곡의 지팡이", stars: 5, icon: "⏳", element: "시간" },
  { level: 50, grade: "SSS", name: "우주 균열의 마도봉", stars: 5, icon: "🌌", element: "우주" },
  { level: 55, grade: "SSS", name: "천공의 신벌 지팡이", stars: 5, icon: "🌩️", element: "천공" },
  { level: 60, grade: "SSS", name: "지옥불 군주의 홀", stars: 5, icon: "🔥", element: "화염" },
  { level: 65, grade: "SSS", name: "빛의 창조 마법봉", stars: 5, icon: "✨", element: "빛" },
  { level: 70, grade: "SSS", name: "혼돈의 근원 지팡이", stars: 5, icon: "🌪️", element: "혼돈" },
  { level: 75, grade: "SSS", name: "신들의 황혼 지팡이", stars: 5, icon: "🌘", element: "황혼" },
  { level: 80, grade: "SSS", name: "절대자의 궁극 마법봉", stars: 5, icon: "👑", element: "절대" }
];

const gradeClickMultiplier = { E: 1.0, D: 1.15, C: 1.35, B: 1.65, A: 2.05, S: 2.7, SS: 3.6, SSS: 5.0 };
const sssLevelMultiplier = [
  { level: 25, multiplier: 5.0 },
  { level: 35, multiplier: 5.7 },
  { level: 45, multiplier: 6.4 },
  { level: 55, multiplier: 7.2 },
  { level: 65, multiplier: 8.1 },
  { level: 75, multiplier: 9.0 },
  { level: 80, multiplier: 10.0 }
];

const optionTypes = [
  { key: "click", name: "클릭 수익 증가", min: 3, max: 15 },
  { key: "auto", name: "자동 수익 증가", min: 2, max: 12 },
  { key: "rate", name: "강화 성공률 보너스", min: 1, max: 6 },
  { key: "gold", name: "골드 획득량 증가", min: 4, max: 18 },
  { key: "gem", name: "보석 획득량 증가", min: 1, max: 5 }
];

const namePrefix = ["불멸의", "찬란한", "저주받은", "고대의", "폭주하는", "신성한", "심연의", "천공의", "환영의", "황금빛"];
const nameCore = ["별빛", "번개", "달그림자", "용의 심장", "태양", "서리", "혼돈", "은하", "마력", "운명"];
const nameSuffix = ["마법봉", "지팡이", "왕홀", "마도봉", "성창", "룬 스태프"];

const gradeRates = [
  { grade: "SSS", rate: 2 },
  { grade: "SS", rate: 6 },
  { grade: "S", rate: 12 },
  { grade: "A", rate: 15 },
  { grade: "B", rate: 15 },
  { grade: "C", rate: 18 },
  { grade: "D", rate: 17 },
  { grade: "E", rate: 15 }
];

const SAVE_KEY = "magicWandRpgSaveV35";
const LEGACY_SAVE_KEYS = ["magicWandFixedGamePlus", "magicWandFixedGame"];
const SAVE_VERSION = 35;

const $ = id => document.getElementById(id);
const ui = {};
function cacheDom() {
  [
    "gold", "gem", "stone", "message", "wandName", "mainWandName", "mainStars", "mainWeaponImg", "mainGrade",
    "level", "nextLevel", "clickIncome", "autoIncome", "successRate", "mainClickIncome", "mainAutoIncome", "mainSuccessRate",
    "enhanceCost", "enhanceCostMini", "autoCost", "gradeBonusText", "gradeBonusInfo", "gemDropRate", "autoGemDropRate",
    "autoGemPity", "clickBonusBadge", "failPenalty", "stars", "gradeBadge", "inventoryList", "inventoryCount"
  ].forEach(id => ui[id] = $(id));
}
function setText(id, value) {
  const el = ui[id] || $(id);
  if (el) el.innerText = value;
}
function toSafeNumber(value, fallback = 0, min = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, n) : fallback;
}


function baseWandByLevel(targetLevel) {
  let wand = wands[0];
  for (const w of wands) {
    if (targetLevel >= w.level) wand = w;
  }
  return wand;
}

function getEquippedItem() {
  return inventory.find(x => x.id === equippedItemId) || null;
}

function currentWand() {
  const equipped = getEquippedItem();
  if (equipped) {
    const base = wands[equipped.wandIndex] || baseWandByLevel(equipped.savedLevel ?? level);
    return { ...base, name: equipped.name, grade: equipped.grade, icon: equipped.icon };
  }
  return baseWandByLevel(level);
}

function getOptionBonus(key) {
  return options.filter(o => o.key === key).reduce((sum, o) => sum + o.value, 0);
}

function getSuccessRate() {
  const base = Math.max(12, 90 - level * 3);
  return Math.min(95, base + getOptionBonus("rate"));
}

function getFailPenalty() {
  if (level < 7) return 0;
  if (level < 15) return 1;
  if (level < 25) return 2;
  return 3;
}

function getGradeClickMultiplier() {
  const wand = currentWand();
  if (wand.grade === "SSS") {
    return sssLevelMultiplier.reduce((value, tier) => wand.level >= tier.level ? tier.multiplier : value, gradeClickMultiplier.SSS);
  }
  return gradeClickMultiplier[wand.grade] || 1;
}

function maxEnhanceCost() {
  return Math.floor(1200000 + Math.max(0, level) * 85000);
}

function clampEnhanceCost(value) {
  return Math.max(100, Math.min(Math.floor(value), maxEnhanceCost()));
}


function gradeImagePath(grade) {
  const key = String(grade || "E").toLowerCase();
  return "img/wand_" + key + ".png?v=27";
}

function updateWandImage() {
  const wand = currentWand();
  const img = $("wandImg");
  const frame = $("wand");
  if (!img || !frame) return;
  img.src = gradeImagePath(wand.grade);
  img.alt = wand.name + " 이미지";
  frame.className = "wand weapon-frame weapon-grade-" + String(wand.grade).toLowerCase();
}

function playSummonReveal(result, count, newCount, stoneReward, results = []) {
  const stage = $("summonStage");
  const icon = $("summonResultIcon");
  const img = $("summonResultImg");
  if (!stage || !img || !icon || !result) return;

  stage.classList.remove("reveal", "grade-s", "grade-ss", "grade-sss");
  void stage.offsetWidth;
  stage.classList.add("reveal");
  if (["S", "SS", "SSS"].includes(result.grade)) {
    stage.classList.add("grade-" + result.grade.toLowerCase());
    document.body.classList.add("rare-reveal-" + result.grade.toLowerCase());
    setTimeout(() => document.body.classList.remove("rare-reveal-s", "rare-reveal-ss", "rare-reveal-sss"), 900);
  }

  icon.innerText = result.grade === "SSS" ? "🌈" : result.grade === "SS" ? "💫" : result.grade === "S" ? "⭐" : "✨";
  img.src = gradeImagePath(result.grade);
  img.alt = result.displayName + " 이미지";

  setTimeout(() => {
    $("summonResultName").innerText = "[" + result.grade + "] " + result.displayName;
    $("summonResultDesc").innerText = count + "회 뽑기 결과 · 신규 " + newCount + "개 · 마력석 +" + stoneReward;
  }, 320);

  renderSummonResultList(results.length ? results : [result]);
}

function renderSummonResultList(results) {
  const list = $("summonResultList");
  if (!list) return;
  if (!Array.isArray(results) || results.length === 0) {
    list.innerHTML = '<div class="summon-empty">아직 뽑기 결과가 없습니다.</div>';
    return;
  }
  if (results.length === 1) {
    const r = results[0];
    const badge = r.isNew ? '신규 도감 등록' : '중복 · 마력석 +' + gradeBonusStone(r.grade);
    list.innerHTML = '<div class="summon-empty single-result">[' + r.grade + '] ' + r.displayName + ' · ' + badge + '</div>';
    return;
  }
  list.innerHTML = results.map((r, idx) => {
    const badge = r.isNew ? '신규' : '중복';
    const reward = r.isNew ? '도감 등록' : '마력석 +' + gradeBonusStone(r.grade);
    return '<div class="summon-result-card grade-card-' + String(r.grade).toLowerCase() + '">' +
      '<div class="summon-mini-img"><img src="' + gradeImagePath(r.grade) + '" alt="" /></div>' +
      '<div class="summon-mini-info"><strong>' + (idx + 1) + '. [' + r.grade + '] ' + r.displayName + '</strong>' +
      '<span>' + badge + ' · ' + reward + '</span></div>' +
      '</div>';
  }).join('');
}

function calculateIncome() {
  clickIncome = Math.floor((10 + level * 12) * getGradeClickMultiplier() * (1 + getOptionBonus("click") / 100));
  autoIncome = Math.floor((level * 4 + stone * 2) * (1 + getOptionBonus("auto") / 100));
}

function checkCollection() {
  wands.forEach((w, i) => {
    if (level >= w.level && !unlocked.includes(i)) {
      unlocked.push(i);
      $("message").innerText = "📖 도감 등록! " + w.name + " 해금!";
    }
  });
}

function renderStars(count) {
  return "★".repeat(count) + "☆".repeat(Math.max(0, 5 - count));
}

function renderCollection() {
  const wrap = $("collection");
  wrap.innerHTML = "";

  wands
    .map((w, i) => ({ ...w, index: i }))
    .filter(w => currentFilter === "ALL" || w.grade === currentFilter)
    .forEach(w => {
      const isOpen = unlocked.includes(w.index);
      const card = document.createElement("div");
      card.className = "card grade-card-" + w.grade.toLowerCase() + " " + (isOpen ? "unlocked" : "locked");
      card.innerHTML = `
        <div class="card-grade grade-${w.grade.toLowerCase()}">${w.grade}</div>
        <div class="wand-visual">
          ${isOpen ? `<img class="card-wand-img" src="${gradeImagePath(w.grade)}" alt="${w.name} 이미지" />` : `<div class="locked-wand">❔</div>`}
        </div>
        <strong>${isOpen ? w.name : "미등록"}</strong>
        <em>${isOpen ? w.element + " 속성" : "숨겨진 마법봉"}</em>
        <span>${isOpen ? renderStars(w.stars) + "<br>Lv." + w.level : "+" + w.level + " 달성 또는 뽑기 해금"}</span>
      `;
      wrap.appendChild(card);
    });

  $("bookCount").innerText = unlocked.length + " / " + wands.length;
}

function renderOptions() {
  const list = $("optionList");
  list.innerHTML = "";

  if (options.length === 0) {
    list.innerHTML = `<div class="option-item"><span>보유 옵션 없음</span><b>강화 성공 시 획득</b></div>`;
    $("optionSummary").innerText = "없음";
    return;
  }

  options.forEach(o => {
    const row = document.createElement("div");
    row.className = "option-item";
    row.innerHTML = `<span>${o.name}</span><b>+${o.value}%</b>`;
    list.appendChild(row);
  });

  $("optionSummary").innerText = options.length + "개 적용 중";
}

function tryAddRandomOption() {
  if (options.length >= 3) return;
  if (Math.random() > 0.35) return;

  const type = optionTypes[Math.floor(Math.random() * optionTypes.length)];
  const value = Math.floor(type.min + Math.random() * (type.max - type.min + 1));
  options.push({ key: type.key, name: type.name, value });

  $("message").innerText = "🎲 랜덤 옵션 획득! " + type.name + " +" + value + "%";
}

function gradeSellPrice(grade) {
  return ({ E: 120, D: 260, C: 520, B: 1100, A: 2400, S: 5200, SS: 11000, SSS: 25000 })[grade] || 100;
}

function gradeGemSellPrice(grade) {
  return ({ E: 1, D: 2, C: 3, B: 5, A: 8, S: 15, SS: 30, SSS: 60 })[grade] || 1;
}

function growthNeed() { return growthLevel * 5; }

function resolveWandIndex(wand) {
  if (Number.isInteger(wand?.index) && wand.index >= 0 && wand.index < wands.length) return wand.index;
  const byLevelGrade = wands.findIndex(x => x.level === wand?.level && x.grade === wand?.grade && x.name === wand?.name);
  if (byLevelGrade >= 0) return byLevelGrade;
  const byLevel = wands.findIndex(x => x.level === wand?.level && x.grade === wand?.grade);
  if (byLevel >= 0) return byLevel;
  return 0;
}

function addInventoryItem(wand, customName, protectedItem = false, savedLevel = null, savedOptions = null) {
  const id = itemSeq++;
  inventory.push({
    id,
    wandIndex: resolveWandIndex(wand),
    name: customName || wand.name,
    grade: wand.grade,
    icon: wand.icon,
    protected: protectedItem,
    sellPrice: gradeSellPrice(wand.grade),
    gemSellPrice: gradeGemSellPrice(wand.grade),
    savedLevel: savedLevel ?? (wand.level ?? 0),
    savedOptions: Array.isArray(savedOptions) ? JSON.parse(JSON.stringify(savedOptions)) : []
  });
  return id;
}

function ensureStarterInventory() {
  if (!Array.isArray(inventory)) inventory = [];
  if (inventory.length === 0) {
    const starterId = addInventoryItem({ ...wands[0], index: 0 }, "초보자의 첫 마법봉", true, 0, []);
    equippedItemId = starterId;
  }
  inventory.forEach(item => {
    if (item.savedLevel === undefined) item.savedLevel = wands[item.wandIndex]?.level ?? 0;
    if (item.gemSellPrice === undefined) item.gemSellPrice = gradeGemSellPrice(item.grade);
    if (!Array.isArray(item.savedOptions)) item.savedOptions = [];
  });
  if (!inventory.some(x => x.id === equippedItemId)) equippedItemId = inventory[0]?.id ?? null;
}

function addGrowthExp(amount) {
  growthExp += amount;
  let rewards = { gold: 0, gem: 0, stone: 0, level: 0 };
  while (growthExp >= growthNeed()) {
    growthExp -= growthNeed();
    growthLevel += 1;
    rewards.gold += growthLevel * 180;
    rewards.stone += Math.floor(growthLevel / 2);
    if (growthLevel % 3 === 0) rewards.gem += 10;
    if (growthLevel % 5 === 0) rewards.level += 1;
  }
  gold += rewards.gold;
  gem += rewards.gem;
  stone += rewards.stone;
  level += rewards.level;
  return rewards;
}

function renderGrowth() {
  if (!$("growthStage")) return;
  const need = growthNeed();
  $("growthStage").innerText = growthLevel;
  $("growthExp").innerText = growthExp;
  $("growthNeed").innerText = need;
  $("growthBar").style.width = Math.min(100, Math.floor(growthExp / need * 100)) + "%";
}

function renderInventory() {
  if (!$("inventoryList")) return;
  ensureStarterInventory();
  const list = $("inventoryList");
  list.innerHTML = "";
  const invFilter = getInventoryFilter();
  const viewItems = inventory.filter(item => invFilter === "ALL" || item.grade === invFilter);
  $("inventoryCount").innerText = viewItems.length + " / " + inventory.length + "개";
  viewItems.slice().reverse().forEach(item => {
    const isEquipped = item.id === equippedItemId;
    const row = document.createElement("div");
    row.className = "inventory-item grade-card-" + item.grade.toLowerCase() + (isEquipped ? " equipped" : "");
    const optionText = item.savedOptions && item.savedOptions.length ? " · 옵션 " + item.savedOptions.length + "개" : "";
    row.innerHTML = '<div class="inventory-icon"><img src="' + gradeImagePath(item.grade) + '" alt="" /></div>' +
      '<div class="inventory-info"><strong>[' + item.grade + '] ' + item.name + (isEquipped ? ' <em>장착중</em>' : '') + '</strong>' +
      '<span>저장 강화 +' + (item.savedLevel ?? 0) + optionText + ' · ' + (item.protected ? '기본 지급 · 판매 불가' : '판매가 ' + item.sellPrice.toLocaleString() + ' 골드 · 보석 ' + (item.gemSellPrice ?? gradeGemSellPrice(item.grade))) + '</span></div>' +
      '<div class="inventory-actions">' +
      '<button class="equip-one" data-id="' + item.id + '" ' + (isEquipped ? 'disabled' : '') + '>꺼내기</button>' +
      '<button class="sell-one" data-id="' + item.id + '" ' + (item.protected || isEquipped ? 'disabled' : '') + '>판매</button>' +
      '</div>';
    list.appendChild(row);
  });
  list.querySelectorAll(".equip-one").forEach(btn => { btn.onclick = () => equipItem(Number(btn.dataset.id)); });
  list.querySelectorAll(".sell-one").forEach(btn => { btn.onclick = () => sellItem(Number(btn.dataset.id)); });
}

function saveCurrentToBag() {
  ensureStarterInventory();
  const wand = baseWandByLevel(level);
  const baseIndex = wands.findIndex(x => x.name === wand.name);
  const itemName = wand.name + " +" + level;
  const id = addInventoryItem({ ...wand, index: baseIndex }, itemName, false, level, options);
  equippedItemId = id;
  $("message").innerText = "🎒 현재 마법봉을 가방에 저장했습니다. 언제든 다시 꺼낼 수 있어요!";
  update();
}

function equipItem(id) {
  const item = inventory.find(x => x.id === id);
  if (!item) return;
  equippedItemId = id;
  level = item.savedLevel ?? level;
  options = Array.isArray(item.savedOptions) ? JSON.parse(JSON.stringify(item.savedOptions)) : [];
  $("message").innerText = "🎒 " + item.name + "을(를) 가방에서 꺼냈습니다!";
  animateWand("success");
  update();
}

function getInventoryFilter() {
  const select = $("inventoryGradeFilter");
  return select ? select.value : "ALL";
}

function sellItem(id) {
  const item = inventory.find(x => x.id === id);
  if (!item || item.protected || item.id === equippedItemId) return;
  const gemReward = item.gemSellPrice ?? gradeGemSellPrice(item.grade);
  if (!confirm("[" + item.grade + "] " + item.name + "을(를) 판매할까요?\n골드 +" + item.sellPrice.toLocaleString() + " / 보석 +" + gemReward)) return;
  gold += item.sellPrice;
  gem += gemReward;
  inventory = inventory.filter(x => x.id !== id);
  $("message").innerText = "🪙 " + item.name + " 판매 완료! 골드 +" + item.sellPrice.toLocaleString() + " · 보석 +" + gemReward;
  update();
}

function sellItems(mode) {
  ensureStarterInventory();
  let targets = inventory.filter(x => !x.protected && x.id !== equippedItemId);
  if (mode === "grade") {
    const grade = getInventoryFilter();
    if (grade === "ALL") {
      $("message").innerText = "등급을 선택한 뒤 등급 판매를 눌러주세요.";
      return;
    }
    targets = targets.filter(x => x.grade === grade);
  }
  if (mode === "dups") {
    const seen = new Set();
    targets = inventory.filter(x => {
      if (x.protected || x.id === equippedItemId) return false;
      const key = x.wandIndex;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
  }
  if (targets.length === 0) {
    $("message").innerText = mode === "dups" ? "판매할 중복 마법봉이 없습니다." : (mode === "grade" ? "선택한 등급에 판매 가능한 마법봉이 없습니다." : "판매 가능한 마법봉이 없습니다.");
    return;
  }
  const ids = new Set(targets.map(x => x.id));
  const total = targets.reduce((sum, x) => sum + x.sellPrice, 0);
  const totalGem = targets.reduce((sum, x) => sum + (x.gemSellPrice ?? gradeGemSellPrice(x.grade)), 0);
  gold += total;
  gem += totalGem;
  inventory = inventory.filter(x => !ids.has(x.id));
  $("message").innerText = "🪙 마법봉 " + targets.length + "개 판매! 골드 +" + total.toLocaleString() + " · 보석 +" + totalGem;
  update();
}

function makeRandomName() {
  const p = namePrefix[Math.floor(Math.random() * namePrefix.length)];
  const c = nameCore[Math.floor(Math.random() * nameCore.length)];
  const s = nameSuffix[Math.floor(Math.random() * nameSuffix.length)];
  return p + " " + c + " " + s;
}

function pickGrade() {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const item of gradeRates) {
    acc += item.rate;
    if (roll <= acc) return item.grade;
  }
  return "E";
}

function summonOnce() {
  const grade = pickGrade();
  const candidates = wands
    .map((w, i) => ({ ...w, index: i }))
    .filter(w => w.grade === grade);

  const pool = candidates.length ? candidates : wands.map((w, i) => ({ ...w, index: i }));
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const isNew = !unlocked.includes(picked.index);

  if (isNew) unlocked.push(picked.index);

  const randomName = makeRandomName();
  addInventoryItem(picked, isNew ? picked.name : randomName, false);
  return {
    ...picked,
    isNew,
    displayName: isNew ? picked.name : randomName,
    desc: isNew ? "신규 도감 등록!" : "중복 보상: 마력석 +" + gradeBonusStone(picked.grade)
  };
}

function gradeBonusStone(grade) {
  return ({ E: 1, D: 2, C: 3, B: 5, A: 8, S: 12, SS: 18, SSS: 30 })[grade] || 1;
}

function summon(count) {
  const cost = count === 10 ? 270 : 30;
  if (gem < cost) {
    $("message").innerText = "보석이 부족합니다.";
    return;
  }

  gem -= cost;
  let last = null;
  let newCount = 0;
  let stoneReward = 0;
  const results = [];

  for (let i = 0; i < count; i++) {
    const result = summonOnce();
    last = result;
    results.push(result);
    if (result.isNew) newCount++;
    else stoneReward += gradeBonusStone(result.grade);
  }

  stone += stoneReward;

  playSummonReveal(last, count, newCount, stoneReward, results);
  $("message").innerText = newCount > 0 ? "🎁 신규 마법봉 " + newCount + "개 도감 등록! 결과 목록을 확인하세요." : "🎁 중복 보상으로 마력석 +" + stoneReward + " · 결과 목록을 확인하세요.";
  addEffect(newCount > 0 || last.grade === "SSS");
  update();
}

let lastRenderSignature = "";

function getRenderSignature() {
  return [
    level, currentFilter, equippedItemId, options.map(o => o.key + ":" + o.value).join("|"),
    inventory.length, inventory.map(x => x.id + ":" + x.wandIndex + ":" + x.grade).join("|"),
    unlocked.join(","), growthLevel, growthExp
  ].join(";");
}

function update(forceFullRender = false) {
  calculateIncome();
  checkCollection();

  const wand = currentWand();
  const multiplierText = getGradeClickMultiplier().toFixed(2).replace(/\.00$/, "");

  setText("gold", Math.floor(gold).toLocaleString());
  setText("gem", gem.toLocaleString());
  setText("stone", stone.toLocaleString());
  setText("wandName", wand.name);
  setText("mainWandName", wand.name);
  setText("mainStars", renderStars(wand.stars));
  const mainImg = ui.mainWeaponImg || $("mainWeaponImg");
  if (mainImg) { mainImg.src = gradeImagePath(wand.grade); mainImg.alt = wand.name + " 이미지"; }
  const mainGrade = ui.mainGrade || $("mainGrade");
  if (mainGrade) { mainGrade.className = "grade grade-" + wand.grade.toLowerCase(); mainGrade.innerText = wand.grade; }
  setText("level", level);
  setText("nextLevel", level + 1);
  setText("clickIncome", clickIncome.toLocaleString());
  setText("autoIncome", autoIncome.toLocaleString());
  setText("successRate", getSuccessRate());
  setText("mainClickIncome", clickIncome.toLocaleString());
  setText("mainAutoIncome", autoIncome.toLocaleString());
  setText("mainSuccessRate", getSuccessRate());
  setText("enhanceCost", enhanceCost.toLocaleString());
  setText("enhanceCostMini", enhanceCost.toLocaleString() + " 골드 · 성공 " + getSuccessRate() + "%");
  setText("autoCost", autoCost.toLocaleString());
  setText("gradeBonusText", "등급 x" + multiplierText);
  setText("gradeBonusInfo", "x" + multiplierText);
  setText("gemDropRate", getGemDropRatePercent().toFixed(1).replace(/\.0$/, "") + "%");
  setText("autoGemDropRate", getAutoGemDropRatePercent().toFixed(1).replace(/\.0$/, "") + "%");
  setText("autoGemPity", Math.max(0, 30000 - Math.floor(lifetimeGoldGauge)).toLocaleString());
  setText("clickBonusBadge", "x" + getGradeClickMultiplier().toFixed(1).replace(/\.0$/, ""));
  setText("failPenalty", getFailPenalty() === 0 ? "없음" : "-" + getFailPenalty());
  setText("stars", renderStars(wand.stars));
  updateWandImage();

  const badge = ui.gradeBadge || $("gradeBadge");
  if (badge) {
    badge.className = "grade grade-" + wand.grade.toLowerCase();
    badge.innerText = wand.grade;
  }

  ensureStarterInventory();
  const signature = getRenderSignature();
  if (forceFullRender || signature !== lastRenderSignature) {
    renderCollection();
    renderOptions();
    renderInventory();
    lastRenderSignature = signature;
  }
  renderGrowth();
  save();
}

function playSfx(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = playSfx.ctx || (playSfx.ctx = new AudioCtx());
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type === "fail" ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(type === "fail" ? 150 : 520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(type === "fail" ? 85 : 920, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {}
}

function animateWand(type) {
  const wand = $("wand");
  wand.classList.remove("success", "fail");
  void wand.offsetWidth;
  wand.classList.add(type);
  playSfx(type);
}

function addEffect(success) {
  const layer = $("effectLayer");
  const text = document.createElement("div");
  text.className = "effect-text " + (success ? "success-effect" : "fail-effect");
  text.innerText = success ? "대박!" : "아쉽다!";
  layer.appendChild(text);

  const count = success ? 36 : 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.background = success ? "#facc15" : "#fb7185";
    p.style.boxShadow = success ? "0 0 18px #facc15" : "0 0 18px #fb7185";
    const angle = Math.random() * Math.PI * 2;
    const dist = success ? 80 + Math.random() * 220 : 55 + Math.random() * 130;
    p.style.setProperty("--x", Math.cos(angle) * dist + "px");
    p.style.setProperty("--y", Math.sin(angle) * dist + "px");
    layer.appendChild(p);
  }

  setTimeout(() => {
    text.remove();
    layer.querySelectorAll(".particle").forEach(el => el.remove());
  }, 850);
}


function getGemDropRatePercent() {
  return Math.min(22, 2.5 + (getGradeClickMultiplier() - 1) * 1.8 + getOptionBonus("gem") / 10);
}

function getAutoGemDropRatePercent() {
  const stoneBonus = Math.min(3.5, stone * 0.035);
  return Math.min(12, 1.2 + (getGradeClickMultiplier() - 1) * 1.05 + stoneBonus + getOptionBonus("gem") / 20);
}

function getAutoGemPityNeed() {
  return Math.min(50000, 8000 + Math.floor(level / 5) * 3500);
}

function grantGuaranteedGemByTotalGold() {
  if (lifetimeGoldGauge < 30000) return 0;
  const reward = Math.floor(lifetimeGoldGauge / 30000);
  lifetimeGoldGauge = lifetimeGoldGauge % 30000;
  gem += reward;
  return reward;
}

function grantAutoGemByBalance() {
  if (autoIncome <= 0) return { gem: 0, pity: false };
  const chance = getAutoGemDropRatePercent() / 100;
  let reward = 0;
  let pity = false;
  if (Math.random() < chance) reward += currentWand().grade === "SSS" ? 2 : 1;
  while (autoGoldGauge >= getAutoGemPityNeed()) {
    autoGoldGauge -= getAutoGemPityNeed();
    reward += 1;
    pity = true;
  }
  if (reward > 0) gem += reward;
  return { gem: reward, pity };
}

function playMineFx(goldAmount, gemAmount) {
  const area = $("mineArea");
  if (!area) return;

  area.classList.remove("clicked", "rare-gem-drop");
  void area.offsetWidth;
  area.classList.add("clicked");
  if (gemAmount > 0) area.classList.add("rare-gem-drop");

  const goldText = document.createElement("div");
  goldText.className = "v20-floating-drop gold";
  goldText.style.setProperty("--dx", "-38px");
  goldText.innerText = "🪙 +" + goldAmount.toLocaleString();
  area.appendChild(goldText);

  if (gemAmount > 0) {
    const gemText = document.createElement("div");
    gemText.className = "v20-floating-drop gem";
    gemText.style.setProperty("--dx", "44px");
    gemText.innerText = "💎 +" + gemAmount;
    area.appendChild(gemText);
  }

  const count = gemAmount > 0 ? 26 : 16;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "v20-click-burst" + (gemAmount > 0 && i % 3 === 0 ? " gem" : "");
    const angle = Math.random() * Math.PI * 2;
    const dist = (gemAmount > 0 ? 70 : 48) + Math.random() * (gemAmount > 0 ? 105 : 82);
    p.style.setProperty("--x", Math.cos(angle) * dist + "px");
    p.style.setProperty("--y", Math.sin(angle) * dist + "px");
    area.appendChild(p);
  }

  setTimeout(() => {
    area.classList.remove("clicked", "rare-gem-drop");
    goldText.remove();
    area.querySelectorAll(".v20-floating-drop, .v20-click-burst").forEach(el => el.remove());
  }, 940);
}

function playAutoGemFx(gemAmount) {
  const area = $("mineArea");
  if (!area || gemAmount <= 0) return;
  const gemText = document.createElement("div");
  gemText.className = "v20-floating-drop gem auto-gem-float";
  gemText.style.setProperty("--dx", "0px");
  gemText.innerText = "💎 자동 +" + gemAmount;
  area.appendChild(gemText);
  area.classList.add("rare-gem-drop");
  setTimeout(() => {
    gemText.remove();
    area.classList.remove("rare-gem-drop");
  }, 1000);
}

function mineGold() {
  const earned = Math.floor(clickIncome * (1 + getOptionBonus("gold") / 100));
  const wand = currentWand();
  const gemChance = Math.min(0.22, 0.025 + (getGradeClickMultiplier() - 1) * 0.018 + getOptionBonus("gem") / 1000);
  let randomGem = 0;
  gold += earned;
  lifetimeGoldGauge += earned;
  const guaranteedGem = grantGuaranteedGemByTotalGold();
  addGrowthExp(1);
  if (Math.random() < gemChance) {
    randomGem = (wand.grade === "SSS" ? 3 : (wand.grade === "SS" || wand.grade === "S" ? 2 : 1)) + Math.floor(getOptionBonus("gem") / 3);
    gem += randomGem;
  }
  const shownGem = guaranteedGem + randomGem;
  $("message").innerText = shownGem > 0
    ? "💎 보석 획득! 골드 +" + earned.toLocaleString() + " · 보석 +" + shownGem + (guaranteedGem > 0 ? "(확정 +" + guaranteedGem + ")" : "") + " · 성장 EXP +1"
    : "💰 마법봉 채굴! 골드 +" + earned.toLocaleString() + " · 성장 EXP +1";
  playMineFx(earned, shownGem);
  animateWand("success");
  const area = $("mineArea");
  if (area) {
    area.classList.add("mining");
    setTimeout(() => area.classList.remove("mining"), 180);
  }
  update();
}

if ($("workBtn")) $("workBtn").onclick = mineGold;
if ($("mineArea")) {
  $("mineArea").onclick = mineGold;
  $("mineArea").onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      mineGold();
    }
  };
}

$("enhanceBtn").onclick = () => {
  if (gold < enhanceCost) {
    $("message").innerText = "강화 비용이 부족합니다.";
    return;
  }

  gold -= enhanceCost;
  const success = Math.random() * 100 < getSuccessRate();

  if (success) {
    level += 1;
    stone += Math.floor(1 + level / 5);
    if (level % 5 === 0) {
      const enhanceGem = 20 + Math.floor(level / 10) * 5;
      gem += enhanceGem;
      $("message").innerText = "⚡ 강화 성공! +" + level + " 달성 · 보석 +" + enhanceGem;
    } else {
      $("message").innerText = "⚡ 강화 성공! +" + level + " 달성";
    }
    enhanceCost = clampEnhanceCost(enhanceCost * 1.20 + 60);
    addGrowthExp(2);
    tryAddRandomOption();
    animateWand("success");
  } else {
    const penalty = getFailPenalty();
    level = Math.max(0, level - penalty);
    enhanceCost = clampEnhanceCost(enhanceCost * 1.08 + 30);
    $("message").innerText = penalty === 0 ? "💥 강화 실패... 단계는 유지됩니다." : "💥 강화 실패... 단계 -" + penalty;
    animateWand("fail");
  }

  addEffect(success);
  update();
};

$("saveBagBtn").onclick = () => saveCurrentToBag();

$("autoBtn").onclick = () => {
  if (gold < autoCost) {
    $("message").innerText = "자동 수익 구매 비용이 부족합니다.";
    return;
  }

  gold -= autoCost;
  stone += 3;
  autoCost = Math.floor(autoCost * 1.55);
  $("message").innerText = "🔮 마력석 증가! 자동 수익이 올랐습니다.";
  update();
};

$("rerollBtn").onclick = () => {
  if (gem < 30) {
    $("message").innerText = "보석이 부족합니다.";
    return;
  }

  gem -= 30;
  options = [];
  const count = 1 + Math.floor(Math.random() * 3);

  for (let i = 0; i < count; i++) {
    const type = optionTypes[Math.floor(Math.random() * optionTypes.length)];
    const value = Math.floor(type.min + Math.random() * (type.max - type.min + 1));
    options.push({ key: type.key, name: type.name, value });
  }

  $("message").innerText = "🎲 옵션이 재설정되었습니다.";
  update();
};

$("summonOneBtn").onclick = () => summon(1);
$("summonTenBtn").onclick = () => summon(10);
$("trainBtn").onclick = () => {
  const rewards = addGrowthExp(1);
  let txt = "🌱 수련 완료! 성장 EXP +1";
  if (rewards.gold || rewards.gem || rewards.stone || rewards.level) {
    txt += " · 단계 보상";
    if (rewards.gold) txt += " 골드 +" + rewards.gold.toLocaleString();
    if (rewards.gem) txt += " 보석 +" + rewards.gem;
    if (rewards.stone) txt += " 마력석 +" + rewards.stone;
    if (rewards.level) txt += " 강화 +" + rewards.level;
    addEffect(true);
  }
  $("message").innerText = txt;
  animateWand("success");
  update();
};
$("feedBtn").onclick = () => {
  if (stone < 5) { $("message").innerText = "마력석이 부족합니다."; return; }
  stone -= 5;
  const rewards = addGrowthExp(10);
  let txt = "💎 마력 주입 완료! 성장 EXP +10";
  if (rewards.gold || rewards.gem || rewards.stone || rewards.level) txt += " · 단계 보상 획득";
  $("message").innerText = txt;
  addEffect(true);
  update();
};
$("sellDupBtn").onclick = () => { if (!confirm("중복 마법봉을 모두 판매할까요?")) return; sellItems("dups"); };
if ($("sellGradeBtn")) $("sellGradeBtn").onclick = () => { const grade = getInventoryFilter(); if (grade === "ALL") { $("message").innerText = "등급을 먼저 선택해주세요."; return; } if (!confirm(grade + " 등급의 판매 가능한 마법봉을 모두 판매할까요?")) return; sellItems("grade"); };
if ($("inventoryGradeFilter")) $("inventoryGradeFilter").onchange = () => renderInventory();
$("sellAllBtn").onclick = () => { if (!confirm("판매 가능한 마법봉을 모두 판매할까요?")) return; sellItems("all"); };

function isMobileTabs() {
  return window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
}

function closeMobilePanel() {
  ["Enhance", "Collection", "Option", "Summon", "Manage"].forEach(n => {
    const tab = $("tab" + n);
    const panel = $(n.charAt(0).toLowerCase() + n.slice(1) + "Panel");
    if (tab) tab.classList.remove("active");
    if (panel) panel.classList.remove("active");
  });
  document.body.classList.remove("mobile-panel-open");
}

function openTab(name) {
  const targetTab = $("tab" + name);
  const targetPanel = $(name.charAt(0).toLowerCase() + name.slice(1) + "Panel");

  // 모바일에서는 이미 열린 탭을 한 번 더 누르면 닫히고, 강화 메인 화면이 다시 보입니다.
  if (isMobileTabs() && targetTab && targetPanel && targetTab.classList.contains("active") && targetPanel.classList.contains("active") && document.body.classList.contains("mobile-panel-open")) {
    closeMobilePanel();
    return;
  }

  ["Enhance", "Collection", "Option", "Summon", "Manage"].forEach(n => {
    const tab = $("tab" + n);
    const panel = $(n.charAt(0).toLowerCase() + n.slice(1) + "Panel");
    if (tab) tab.classList.remove("active");
    if (panel) panel.classList.remove("active");
  });

  if (targetTab) targetTab.classList.add("active");
  if (targetPanel) targetPanel.classList.add("active");
  if (isMobileTabs()) document.body.classList.add("mobile-panel-open");
}

$("tabEnhance").onclick = () => openTab("Enhance");
$("tabCollection").onclick = () => openTab("Collection");
$("tabOption").onclick = () => openTab("Option");
$("tabSummon").onclick = () => openTab("Summon");
$("tabManage").onclick = () => openTab("Manage");

// 모바일 첫 화면은 무기 강화 화면을 우선 보여주고, 우측 탭은 눌렀을 때만 패널을 엽니다.
if (isMobileTabs()) closeMobilePanel();
window.addEventListener("resize", () => {
  if (isMobileTabs() && !document.body.classList.contains("mobile-panel-open")) closeMobilePanel();
});
document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.grade;
    renderCollection();
  };
});

$("resetBtn").onclick = () => {
  if (!confirm("처음부터 다시 시작할까요?")) return;
  gold = 0;
  gem = 100;
  stone = 0;
  level = 0;
  enhanceCost = 100;
  autoCost = 500;
  unlocked = [0];
  options = [];
  growthLevel = 1;
  growthExp = 0;
  inventory = [];
  itemSeq = 1;
  equippedItemId = null;
  autoGoldGauge = 0;
  lifetimeGoldGauge = 0;
  $("summonResultIcon").innerText = "🎁";
  if ($("summonResultImg")) $("summonResultImg").src = gradeImagePath("E");
  if ($("summonStage")) $("summonStage").classList.remove("reveal", "grade-s", "grade-ss", "grade-sss");
  $("summonResultName").innerText = "뽑기를 눌러보세요";
  $("summonResultDesc").innerText = "1회 30보석 / 10회 270보석";
  renderSummonResultList([]);
  $("message").innerText = "게임이 초기화되었습니다.";
  update();
};

setInterval(() => {
  if (autoIncome > 0) {
    gold += autoIncome;
    autoGoldGauge += autoIncome;
    lifetimeGoldGauge += autoIncome;
    const guaranteedGem = grantGuaranteedGemByTotalGold();
    const autoReward = grantAutoGemByBalance();
    const totalGemReward = autoReward.gem + guaranteedGem;
    if (totalGemReward > 0) {
      $("message").innerText = guaranteedGem > 0
        ? "💎 보석 확정 보상! 자동 수익 포함 보석 +" + totalGemReward
        : (autoReward.pity
          ? "💎 마력석 자동 보상! 보석 +" + autoReward.gem
          : "💎 마력석 자동 수익 중 보석 발견! 보석 +" + autoReward.gem);
      playAutoGemFx(totalGemReward);
    }
  }
  update();
}, 1000);

function getStateSnapshot() {
  return { version: SAVE_VERSION, gold, gem, stone, level, enhanceCost, autoCost, unlocked, options, growthLevel, growthExp, inventory, itemSeq, equippedItemId, autoGoldGauge, lifetimeGoldGauge };
}

function applyStateSnapshot(g = {}) {
  gold = toSafeNumber(g.gold, 0);
  gem = toSafeNumber(g.gem, 100);
  stone = toSafeNumber(g.stone, 0);
  level = Math.floor(toSafeNumber(g.level, 0));
  enhanceCost = clampEnhanceCost(toSafeNumber(g.enhanceCost, 100));
  autoCost = Math.max(500, Math.floor(toSafeNumber(g.autoCost, 500)));
  unlocked = Array.isArray(g.unlocked) ? g.unlocked.map(Number).filter(i => Number.isInteger(i) && i >= 0 && i < wands.length) : [0];
  if (!unlocked.includes(0)) unlocked.unshift(0);
  options = Array.isArray(g.options) ? g.options.filter(o => o && optionTypes.some(t => t.key === o.key)).slice(0, 3) : [];
  growthLevel = Math.max(1, Math.floor(toSafeNumber(g.growthLevel, 1, 1)));
  growthExp = Math.floor(toSafeNumber(g.growthExp, 0));
  inventory = Array.isArray(g.inventory) ? g.inventory.filter(x => x && x.grade && x.name).slice(0, 500) : [];
  itemSeq = Math.max(1, Math.floor(toSafeNumber(g.itemSeq, inventory.length + 1, 1)));
  equippedItemId = g.equippedItemId ?? null;
  autoGoldGauge = toSafeNumber(g.autoGoldGauge, 0);
  lifetimeGoldGauge = toSafeNumber(g.lifetimeGoldGauge, 0);
  ensureStarterInventory();
}

function migrateSave(g = {}) {
  const migrated = { ...g };
  if (!Array.isArray(migrated.inventory)) migrated.inventory = [];
  migrated.inventory = migrated.inventory.map(item => ({
    ...item,
    gemSellPrice: item.gemSellPrice ?? gradeGemSellPrice(item.grade),
    sellPrice: item.sellPrice ?? gradeSellPrice(item.grade),
    savedOptions: Array.isArray(item.savedOptions) ? item.savedOptions : []
  }));
  migrated.version = SAVE_VERSION;
  return migrated;
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(getStateSnapshot())); }
  catch (e) { console.warn("저장 실패", e); setText("message", "저장 공간이 부족하거나 브라우저 저장소를 사용할 수 없습니다."); }
}

function load() {
  let raw = localStorage.getItem(SAVE_KEY);
  if (!raw) { for (const key of LEGACY_SAVE_KEYS) { raw = localStorage.getItem(key); if (raw) break; } }
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateSave(parsed);
    applyStateSnapshot(migrated);
    if ((parsed.version || 0) < SAVE_VERSION) localStorage.setItem(SAVE_KEY, JSON.stringify(getStateSnapshot()));
  } catch (e) {
    console.warn("세이브 데이터 복구 실패", e);
    try { localStorage.setItem(SAVE_KEY + "_broken_" + Date.now(), raw); localStorage.removeItem(SAVE_KEY); } catch (backupError) {}
    gold = 0; gem = 100; stone = 0; level = 0; enhanceCost = 100; autoCost = 500;
    unlocked = [0]; options = []; growthLevel = 1; growthExp = 0; inventory = []; itemSeq = 1; equippedItemId = null;
    autoGoldGauge = 0; lifetimeGoldGauge = 0; ensureStarterInventory();
    setTimeout(() => setText("message", "저장 데이터가 손상되어 기본값으로 복구했습니다."), 0);
  }
}

function openHelp() {
  const modal = $("helpModal");
  if (!modal) return;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("help-open");
}
function closeHelp() {
  const modal = $("helpModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("help-open");
}
if ($("helpBtn")) $("helpBtn").addEventListener("click", openHelp);
if ($("helpCloseBtn")) $("helpCloseBtn").addEventListener("click", closeHelp);
if ($("helpCloseBottomBtn")) $("helpCloseBottomBtn").addEventListener("click", closeHelp);
if ($("helpBackdrop")) $("helpBackdrop").addEventListener("click", closeHelp);
document.addEventListener("click", (e) => {
  if (e.target && (e.target.id === "helpCloseBtn" || e.target.id === "helpCloseBottomBtn" || e.target.id === "helpBackdrop")) {
    e.preventDefault();
    closeHelp();
  }
}, true);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeHelp(); });

cacheDom();
load();
update();
