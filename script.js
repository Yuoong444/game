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
let upgradeCombo = 0;
let isSummoning = false;
let lastTickTime = Date.now(); // v62_1: 모바일 백그라운드 자동수익 보상용

const wands = [
  { level: 0, grade: "E", name: "견습의 나무 지팡이", stars: 1, icon: "🪵", element: "나무" },
  { level: 3, grade: "D", name: "푸른 수정 지팡이", stars: 2, icon: "💧", element: "물" },
  { level: 6, grade: "C", name: "달빛 마법봉", stars: 3, icon: "🌙", element: "달" },
  { level: 9, grade: "B", name: "비전의 지팡이", stars: 4, icon: "🔮", element: "비전" },
  { level: 12, grade: "A", name: "고대의 번개 지팡이", stars: 5, icon: "⚡", element: "번개" },
  { level: 15, grade: "S", name: "별빛 대마법봉", stars: 5, icon: "⭐", element: "별" },
  { level: 20, grade: "SS", name: "차원의 왕홀", stars: 5, icon: "🌀", element: "차원" },
  { level: 25, grade: "SSS", name: "창조자의 마법봉", stars: 5, icon: "🌈", element: "창조" },
  { level: 30, grade: "SS", name: "영원의 마도 지팡이", stars: 5, icon: "♾️", element: "영원" },

  { level: 35, grade: "SS", name: "심연의 흑마법봉", stars: 5, icon: "🕳️", element: "심연" },
  { level: 40, grade: "S", name: "태양신의 성창", stars: 5, icon: "☀️", element: "태양" },
  { level: 45, grade: "SS", name: "시간 왜곡의 지팡이", stars: 5, icon: "⏳", element: "시간" },
  { level: 50, grade: "SS", name: "우주 균열의 마도봉", stars: 5, icon: "🌌", element: "우주" },
  { level: 55, grade: "SSS", name: "천공의 신벌 지팡이", stars: 5, icon: "🌩️", element: "천공" },
  { level: 60, grade: "SSS", name: "지옥불 군주의 홀", stars: 5, icon: "🔥", element: "화염" },
  { level: 65, grade: "SSS", name: "빛의 창조 마법봉", stars: 5, icon: "✨", element: "빛" },
  { level: 70, grade: "SSS", name: "혼돈의 근원 지팡이", stars: 5, icon: "🌪️", element: "혼돈" },
  { level: 75, grade: "SSS", name: "신들의 황혼 지팡이", stars: 5, icon: "🌘", element: "황혼" },
  { level: 80, grade: "SSS", name: "절대자의 궁극 마법봉", stars: 5, icon: "👑", element: "절대" }
];

// v59 밸런스 정리: 초중반은 답답하지 않게, SSS 후반 폭발은 완화
const gradeClickMultiplier = { E: 1.0, D: 1.22, C: 1.55, B: 2.05, A: 2.75, S: 3.75, SS: 5.15, SSS: 6.25 };
const gradeGoldBaseBonus = { E: 0, D: 50, C: 125, B: 260, A: 520, S: 980, SS: 1750, SSS: 3000 };
const gradeGoldLevelBonus = { E: 18, D: 24, C: 34, B: 48, A: 68, S: 96, SS: 132, SSS: 165 };
const gradeStartEnhanceCost = { E: 80, D: 150, C: 270, B: 490, A: 850, S: 1450, SS: 2750, SSS: 5400 };

const weaponTraits = {
  E: { name: "입문형", click: 1.00, auto: 1.00, gem: 1.00, success: 0 },
  D: { name: "균형형", click: 1.05, auto: 1.03, gem: 1.00, success: 1 },
  C: { name: "채굴형", click: 1.12, auto: 1.04, gem: 1.02, success: 1 },
  B: { name: "자동형", click: 1.08, auto: 1.18, gem: 1.05, success: 0 },
  A: { name: "보석형", click: 1.14, auto: 1.10, gem: 1.18, success: 1 },
  S: { name: "강화형", click: 1.22, auto: 1.18, gem: 1.18, success: 3 },
  SS: { name: "전설형", click: 1.35, auto: 1.28, gem: 1.30, success: 4 },
  SSS: { name: "신화형", click: 1.35, auto: 1.28, gem: 1.35, success: 5 }
};



// v62 속성 강화 시스템: 이미지 에셋과 실제 성장 보너스를 연결
const elementDefs = {
  earth: { key: "earth", name: "대지", icon: "🌿", costGem: 12, costStone: 4, click: 1.10, auto: 1.02, gem: 1.00, success: 1, desc: "클릭 골드 강화" },
  water: { key: "water", name: "물", icon: "💧", costGem: 14, costStone: 5, click: 1.03, auto: 1.04, gem: 1.14, success: 1, desc: "보석 획득 강화" },
  fire: { key: "fire", name: "화염", icon: "🔥", costGem: 16, costStone: 6, click: 1.18, auto: 1.00, gem: 1.02, success: 0, desc: "강한 클릭 수익" },
  wind: { key: "wind", name: "바람", icon: "🌪️", costGem: 15, costStone: 5, click: 1.05, auto: 1.16, gem: 1.00, success: 0, desc: "자동 수익 강화" },
  light: { key: "light", name: "빛", icon: "✨", costGem: 20, costStone: 8, click: 1.08, auto: 1.08, gem: 1.08, success: 3, desc: "강화 성공률 보정" },
  dark: { key: "dark", name: "암흑", icon: "🌑", costGem: 18, costStone: 7, click: 1.12, auto: 1.10, gem: 1.04, success: -1, desc: "후반 성장형 수익" },
  normal: { key: "normal", name: "무속성", icon: "⚪", costGem: 10, costStone: 3, click: 1.00, auto: 1.00, gem: 1.00, success: 0, desc: "기본 속성" }
};
const elementOrder = ["earth", "water", "fire", "wind", "light", "dark"];
function getElementDef(element) { return elementDefs[normalizeAssetElement(element)] || elementDefs.normal; }
function getElementLevel(item = getEquippedItem()) { return Math.max(0, Math.min(7, Math.floor(toSafeNumber(item?.elementLevel, 0)))); }
function getElementBonusMultiplier(kind, item = getEquippedItem()) {
  const def = getElementDef(getItemElement(item));
  const lv = getElementLevel(item);
  const base = kind === "click" ? def.click : kind === "auto" ? def.auto : kind === "gem" ? def.gem : 1;
  return 1 + ((base - 1) * (lv / 7));
}
function getElementSuccessBonus(item = getEquippedItem()) { return Math.round((getElementDef(getItemElement(item)).success || 0) * (getElementLevel(item) / 7)); }
function elementUpgradeCost(item = getEquippedItem()) {
  const lv = getElementLevel(item);
  const def = getElementDef(getItemElement(item));
  return { gem: Math.floor(def.costGem * (lv + 1) * (1 + lv * 0.28)), stone: Math.floor(def.costStone * (lv + 1) * (1 + lv * 0.22)) };
}
function setWeaponElement(elementKey) {
  ensureStarterInventory();
  const item = getEquippedItem();
  if (!item) return;
  const next = normalizeAssetElement(elementKey);
  const current = normalizeAssetElement(getItemElement(item));
  if (next === current) { $("message").innerText = getElementDef(next).icon + " 이미 적용 중인 속성입니다."; update(true); return; }
  const changeCost = { gem: 25, stone: 10 };
  if (gem < changeCost.gem || stone < changeCost.stone) { $("message").innerText = "속성 변경에는 보석 " + changeCost.gem + "개와 마력석 " + changeCost.stone + "개가 필요합니다."; return; }
  gem -= changeCost.gem; stone -= changeCost.stone; item.element = next; item.elementLevel = Math.max(1, getElementLevel(item));
  $("message").innerText = getElementDef(next).icon + " " + getElementDef(next).name + " 속성으로 변경되었습니다!";
  animateWand("success"); update(true);
}
function upgradeElement() {
  ensureStarterInventory();
  const item = getEquippedItem();
  if (!item) return;
  const currentLv = getElementLevel(item);
  if (currentLv >= 7) { $("message").innerText = "속성 강화가 이미 최대 단계입니다."; return; }
  const cost = elementUpgradeCost(item);
  if (gem < cost.gem || stone < cost.stone) { $("message").innerText = "속성 강화 재료가 부족합니다. 필요: 보석 " + cost.gem + " / 마력석 " + cost.stone; return; }
  gem -= cost.gem; stone -= cost.stone; item.elementLevel = currentLv + 1;
  $("message").innerText = getElementDef(getItemElement(item)).icon + " 속성 강화 성공! LV" + item.elementLevel + " 달성";
  animateWand("success"); update(true);
}
function renderElementPanel() {
  const item = getEquippedItem();
  const box = $("elementButtons");
  if (!item || !box) return;
  const current = normalizeAssetElement(getItemElement(item));
  box.innerHTML = elementOrder.map(key => { const def = elementDefs[key]; return '<button class="element-chip ' + (current === key ? 'active' : '') + '" data-element="' + key + '" type="button"><b>' + def.icon + '</b><span>' + def.name + '</span><small>' + def.desc + '</small></button>'; }).join("");
  box.querySelectorAll(".element-chip").forEach(btn => btn.onclick = () => setWeaponElement(btn.dataset.element));
  const lv = getElementLevel(item); const def = getElementDef(current); const cost = elementUpgradeCost(item);
  setText("elementName", def.icon + " " + def.name + " LV" + lv);
  setText("elementBonus", "클릭 x" + getElementBonusMultiplier("click", item).toFixed(2) + " · 자동 x" + getElementBonusMultiplier("auto", item).toFixed(2) + " · 보석 x" + getElementBonusMultiplier("gem", item).toFixed(2));
  setText("elementCost", lv >= 7 ? "MAX" : "보석 " + cost.gem + " / 마력석 " + cost.stone);
  const bar = $("elementBar"); if (bar) bar.style.width = Math.round(lv / 7 * 100) + "%";
}

const sssLevelMultiplier = [
  { level: 25, multiplier: 4.5 },
  { level: 35, multiplier: 4.9 },
  { level: 45, multiplier: 5.3 },
  { level: 55, multiplier: 5.8 },
  { level: 65, multiplier: 6.2 },
  { level: 75, multiplier: 6.6 },
  { level: 80, multiplier: 7.0 }
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

const SAVE_KEY = "magicWandRpgSaveV62";
const LEGACY_SAVE_KEYS = ["magicWandRpgSaveV61", "magicWandRpgSaveV60", "magicWandRpgSaveV59", "magicWandRpgSaveV58", "magicWandRpgSaveV57", "magicWandRpgSaveV56", "magicWandRpgSaveV55", "magicWandRpgSaveV54", "magicWandRpgSaveV53", "magicWandRpgSaveV52", "magicWandRpgSaveV51", "magicWandRpgSaveV50", "magicWandRpgSaveV49", "magicWandRpgSaveV48", "magicWandRpgSaveV47", "magicWandRpgSaveV46", "magicWandRpgSaveV45", "magicWandRpgSaveV44", "magicWandRpgSaveV35", "magicWandFixedGamePlus", "magicWandFixedGame"];
const SAVE_VERSION = 621; // v62_1 patch
const INVENTORY_LIMIT = 220;

const $ = id => document.getElementById(id);
const ui = {};
function cacheDom() {
  [
    "gold", "gem", "stone", "message", "wandName", "mainWandName", "mainStars", "mainWeaponImg", "mainGrade",
    "level", "nextLevel", "clickIncome", "autoIncome", "successRate", "mainClickIncome", "mainAutoIncome", "mainSuccessRate",
    "enhanceCost", "enhanceCostMini", "autoCost", "gradeBonusText", "gradeBonusInfo", "traitInfo", "gemDropRate", "autoGemDropRate",
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
  return inventory.find(x => x.id === equippedItemId) || inventory[0] || null;
}

function getWeaponTrait(grade = currentWand().grade) {
  return weaponTraits[grade] || weaponTraits.E;
}

function optionPower(item) {
  return (item?.savedOptions || []).reduce((sum, o) => sum + toSafeNumber(o.value, 0), 0);
}

function itemPowerScore(item) {
  return (item?.savedLevel || 0) * 1000
    + optionPower(item) * 25
    + (gradeClickMultiplier[item?.grade] || 1) * 500
    + ((item?.savedOptions || []).length * 100)
    + (item?.enhanceCost || 0) / 1000;
}

function normalizeInventoryItem(item) {
  const base = wands[item.wandIndex] || wands[0];
  if (item.savedLevel === undefined) item.savedLevel = Math.max(base.level ?? 0, Math.floor(toSafeNumber(item.level, 0)));
  if (item.enhanceCost === undefined) item.enhanceCost = gradeStartEnhanceCost[item.grade] || 100;
  item.enhanceCost = clampEnhanceCost(item.enhanceCost);
  if (item.gemSellPrice === undefined) item.gemSellPrice = gradeGemSellPrice(item.grade);
  if (item.sellPrice === undefined) item.sellPrice = gradeSellPrice(item.grade);
  if (!Array.isArray(item.savedOptions)) item.savedOptions = [];
  item.savedOptions = item.savedOptions.filter(o => o && optionTypes.some(t => t.key === o.key)).slice(0, 3);
  item.locked = Boolean(item.locked || item.protected);
  item.trait = weaponTraits[item.grade]?.name || "기본형";
  item.element = normalizeAssetElement(item.element || base.element || "normal");
  item.elementLevel = Math.max(0, Math.min(7, Math.floor(toSafeNumber(item.elementLevel, assetStageFor(item.grade, item.savedLevel)))));
  return item;
}

function syncCurrentFromEquipped() {
  const item = getEquippedItem();
  if (!item) return;
  normalizeInventoryItem(item);
  level = Math.floor(toSafeNumber(item.savedLevel, wands[item.wandIndex]?.level ?? 0));
  enhanceCost = clampEnhanceCost(toSafeNumber(item.enhanceCost, gradeStartEnhanceCost[item.grade] || 100));
  options = Array.isArray(item.savedOptions) ? JSON.parse(JSON.stringify(item.savedOptions)).slice(0, 3) : [];
}

function syncEquippedFromCurrent() {
  const item = getEquippedItem();
  if (!item) return;
  item.savedLevel = Math.floor(toSafeNumber(level, wands[item.wandIndex]?.level ?? 0));
  item.enhanceCost = clampEnhanceCost(enhanceCost);
  item.savedOptions = Array.isArray(options) ? JSON.parse(JSON.stringify(options)).slice(0, 3) : [];
}

function currentWand() {
  const equipped = getEquippedItem();
  if (equipped) {
    const base = wands[equipped.wandIndex] || baseWandByLevel(equipped.savedLevel ?? level);
    return { ...base, name: equipped.name, grade: equipped.grade, icon: equipped.icon, element: getItemElement(equipped), elementLevel: getElementLevel(equipped) };
  }
  return baseWandByLevel(level);
}

function getOptionBonus(key) {
  return options.filter(o => o.key === key).reduce((sum, o) => sum + o.value, 0);
}

function getSuccessRate() {
  const base = Math.max(18, 92 - level * 2.55);
  return Math.min(96, base + getOptionBonus("rate") + getWeaponTrait().success + getElementSuccessBonus());
}

function getFailPenalty() {
  if (level < 10) return 0;
  if (level < 22) return 1;
  return 2;
}

function getGradeClickMultiplier() {
  const wand = currentWand();
  if (wand.grade === "SSS") {
    return sssLevelMultiplier.reduce((value, tier) => level >= tier.level ? tier.multiplier : value, gradeClickMultiplier.SSS) * getElementBonusMultiplier("click");
  }
  return (gradeClickMultiplier[wand.grade] || 1) * getElementBonusMultiplier("click");
}

function maxEnhanceCost() {
  const gradeBonus = gradeGoldBaseBonus[currentWand().grade] || 0;
  return Math.floor(1200000 + gradeBonus * 120 + Math.max(0, level) * 95000);
}

function clampEnhanceCost(value) {
  return Math.max(100, Math.min(Math.floor(value), maxEnhanceCost()));
}


const assetStageByGrade = { E: 0, D: 1, C: 2, B: 3, A: 4, S: 5, SS: 6, SSS: 7 };

function normalizeAssetElement(element = "") {
  const text = String(element || "").toLowerCase();
  if (["fire", "화염", "불", "태양", "지옥불"].some(v => text.includes(v))) return "fire";
  if (["water", "물", "서리", "얼음"].some(v => text.includes(v))) return "water";
  if (["wind", "바람", "폭풍", "혼돈"].some(v => text.includes(v))) return "wind";
  if (["earth", "땅", "대지", "나무"].some(v => text.includes(v))) return "earth";
  if (["light", "빛", "번개", "천공", "별", "창조", "절대"].some(v => text.includes(v))) return "light";
  if (["dark", "어둠", "심연", "달", "황혼", "저주"].some(v => text.includes(v))) return "dark";
  return "normal";
}

function assetStageFor(grade, targetLevel = level) {
  const byGrade = assetStageByGrade[String(grade || "E").toUpperCase()];
  if (Number.isFinite(byGrade)) return byGrade;
  return Math.max(0, Math.min(7, Math.floor(toSafeNumber(targetLevel, 0) / 10)));
}

function gradeImagePath(grade, element = "normal", targetLevel = level) {
  const attr = normalizeAssetElement(element);
  const stage = assetStageFor(grade, targetLevel);
  return "img/wand/by_attribute_stage/wand_" + attr + "_lv" + stage + ".png?v=62";
}

function applyAuraClass(auraEl, grade, element, targetLevel) {
  if (!auraEl) return;
  const attr = normalizeAssetElement(element);
  const stage = assetStageFor(grade, targetLevel);
  auraEl.className = auraEl.className.replace(/\baura-\S+/g, "").trim();
  auraEl.classList.add("aura-" + attr, "aura-stage-" + stage);
  auraEl.style.backgroundImage = "";
}

function getItemElement(item) {
  const base = wands[item?.wandIndex] || wands[0];
  return item?.element || base.element || "normal";
}

function updateWandImage() {
  const wand = currentWand();
  const img = $("wandImg");
  const frame = $("wand");
  if (!img || !frame) return;
  img.src = gradeImagePath(wand.grade, wand.element, level);
  img.alt = wand.name + " 이미지";
  frame.className = "wand weapon-frame weapon-grade-" + String(wand.grade).toLowerCase() + " weapon-attr-" + normalizeAssetElement(wand.element);
  const aura = document.querySelector(".wand-aura");
  if (aura) applyAuraClass(aura, wand.grade, wand.element, level);
  frame.dataset.assetElement = normalizeAssetElement(wand.element);
  frame.dataset.assetStage = assetStageFor(wand.grade, level);
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
  img.src = gradeImagePath(result.grade, result.element, result.level);
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
      '<div class="summon-mini-img"><img src="' + gradeImagePath(r.grade, r.element, r.level) + '" alt="" /></div>' +
      '<div class="summon-mini-info"><strong>' + (idx + 1) + '. [' + r.grade + '] ' + r.displayName + '</strong>' +
      '<span>' + badge + ' · ' + reward + '</span></div>' +
      '</div>';
  }).join('');
}

function calculateIncome() {
  const wand = currentWand();
  const trait = getWeaponTrait(wand.grade);
  const gradeBase = gradeGoldBaseBonus[wand.grade] || 0;
  const gradeLevelBonus = gradeGoldLevelBonus[wand.grade] || 12;
  const newbieBoost = level < 10 ? 1.35 : level < 20 ? 1.18 : 1;
  const baseClick = 18 + gradeBase + level * gradeLevelBonus;
  clickIncome = Math.floor(baseClick * getGradeClickMultiplier() * trait.click * newbieBoost * (1 + getOptionBonus("click") / 100));

  // v46: 자동 수익도 장착 무기의 등급 특성/강화 수치가 체감되도록 조정
  const stonePower = Math.floor(Math.sqrt(Math.max(0, stone)) * (14 + getGradeClickMultiplier() * 1.4));
  const weaponPower = Math.floor((level + 1) * (8 + getGradeClickMultiplier() * 1.8));
  autoIncome = Math.floor((weaponPower + stonePower) * trait.auto * getElementBonusMultiplier("auto") * (1 + getOptionBonus("auto") / 100));
}

let lastCollectionCheckLevel = -1;
function checkCollection(force = false) {
  if (!force && lastCollectionCheckLevel === level) return;
  lastCollectionCheckLevel = level;
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
          ${isOpen ? `<img class="card-wand-img" src="${gradeImagePath(w.grade, w.element, w.level)}" alt="${w.name} 이미지" />` : `<div class="locked-wand">❔</div>`}
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
    if ($("optionSummary")) $("optionSummary").innerText = "없음";
    return;
  }

  const optionText = options.map(o => `${o.name} +${o.value}%`).join(" · ");

  options.forEach(o => {
    const row = document.createElement("div");
    row.className = "option-item";
    row.innerHTML = `<span>${o.name}</span><b>+${o.value}%</b>`;
    list.appendChild(row);
  });

  if ($("optionSummary")) {
    $("optionSummary").innerHTML = `<span class="option-summary-detail">${optionText}</span>`;
    $("optionSummary").title = optionText;
  }
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
  return ({ E: 180, D: 420, C: 900, B: 1900, A: 4200, S: 9000, SS: 20000, SSS: 48000 })[grade] || 150;
}

function gradeGemSellPrice(grade) {
  return ({ E: 1, D: 2, C: 3, B: 5, A: 8, S: 15, SS: 30, SSS: 60 })[grade] || 1;
}

function growthNeed() { return Math.max(4, growthLevel * 4); }

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
    element: normalizeAssetElement(wand.element || "normal"),
    elementLevel: assetStageFor(wand.grade, savedLevel ?? (wand.level ?? 0)),
    protected: protectedItem,
    locked: protectedItem,
    trait: weaponTraits[wand.grade]?.name || "기본형",
    sellPrice: gradeSellPrice(wand.grade),
    gemSellPrice: gradeGemSellPrice(wand.grade),
    savedLevel: savedLevel ?? (wand.level ?? 0),
    enhanceCost: gradeStartEnhanceCost[wand.grade] || 100,
    savedOptions: Array.isArray(savedOptions) ? JSON.parse(JSON.stringify(savedOptions)) : []
  });
  return id;
}

function ensureStarterInventory() {
  if (!Array.isArray(inventory)) inventory = [];
  if (inventory.length === 0) {
    const starterBase = baseWandByLevel(level || 0);
    const starterIndex = Math.max(0, wands.findIndex(x => x.name === starterBase.name));
    const starterId = addInventoryItem({ ...starterBase, index: starterIndex }, level > 0 ? starterBase.name + " +" + level : "초보자의 첫 마법봉", true, level || 0, options);
    const starter = inventory.find(x => x.id === starterId);
    if (starter) starter.enhanceCost = enhanceCost || (gradeStartEnhanceCost[starter.grade] || 100);
    equippedItemId = starterId;
  }
  inventory.forEach(item => normalizeInventoryItem(item));
  if (!inventory.some(x => x.id === equippedItemId)) equippedItemId = inventory[0]?.id ?? null;
  syncCurrentFromEquipped();
}

function addGrowthExp(amount) {
  growthExp += amount;
  let rewards = { gold: 0, gem: 0, stone: 0, level: 0 };
  while (growthExp >= growthNeed()) {
    growthExp -= growthNeed();
    growthLevel += 1;
    rewards.gold += growthLevel * 320 + Math.floor(growthLevel * growthLevel * 18);
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
  const sortMode = getInventorySort();
  let viewItems = inventory.filter(item => invFilter === "ALL" || item.grade === invFilter);
  viewItems = viewItems.slice().sort((a, b) => {
    if (sortMode === "level") return (b.savedLevel || 0) - (a.savedLevel || 0) || itemPowerScore(b) - itemPowerScore(a);
    if (sortMode === "grade") return (gradeClickMultiplier[b.grade] || 0) - (gradeClickMultiplier[a.grade] || 0) || itemPowerScore(b) - itemPowerScore(a);
    if (sortMode === "power") return itemPowerScore(b) - itemPowerScore(a);
    return (b.id || 0) - (a.id || 0);
  });
  $("inventoryCount").innerText = viewItems.length + " / " + inventory.length + "개" + (inventory.length >= INVENTORY_LIMIT ? " · 최대" : "");
  viewItems.forEach(item => {
    normalizeInventoryItem(item);
    const isEquipped = item.id === equippedItemId;
    const row = document.createElement("div");
    row.className = "inventory-item grade-card-" + item.grade.toLowerCase() + (isEquipped ? " equipped" : "") + (item.locked ? " locked" : "");
    const optionText = item.savedOptions && item.savedOptions.length ? " · 옵션 " + item.savedOptions.length + "개/점수 " + optionPower(item) : "";
    const lockText = item.locked ? "🔒 잠금" : "🔓 잠금해제";
    row.innerHTML = '<div class="inventory-icon"><img src="' + gradeImagePath(item.grade, getItemElement(item), item.savedLevel) + '" alt="" /></div>' +
      '<div class="inventory-info"><strong>[' + item.grade + '] ' + item.name + (isEquipped ? ' <em>장착중</em>' : '') + (item.locked ? ' <em>잠금</em>' : '') + '</strong>' +
      '<span>개별 강화 +' + (item.savedLevel ?? 0) + ' · ' + getElementDef(getItemElement(item)).name + ' LV' + getElementLevel(item) + ' · 특성 ' + (item.trait || getWeaponTrait(item.grade).name) + ' · 다음비용 ' + (item.enhanceCost ?? (gradeStartEnhanceCost[item.grade] || 100)).toLocaleString() + optionText + ' · ' + (item.protected ? '기본 지급 · 판매 불가' : '판매가 ' + item.sellPrice.toLocaleString() + ' 골드 · 보석 ' + (item.gemSellPrice ?? gradeGemSellPrice(item.grade))) + '</span></div>' +
      '<div class="inventory-actions">' +
      '<button class="equip-one" data-id="' + item.id + '" ' + (isEquipped ? 'disabled' : '') + '>꺼내기</button>' +
      '<button class="lock-one" data-id="' + item.id + '">' + lockText + '</button>' +
      '<button class="sell-one" data-id="' + item.id + '" ' + (item.protected || item.locked || isEquipped ? 'disabled' : '') + '>판매</button>' +
      '</div>';
    list.appendChild(row);
  });
  list.querySelectorAll(".equip-one").forEach(btn => { btn.onclick = () => equipItem(Number(btn.dataset.id)); });
  list.querySelectorAll(".sell-one").forEach(btn => { btn.onclick = () => sellItem(Number(btn.dataset.id)); });
  list.querySelectorAll(".lock-one").forEach(btn => { btn.onclick = () => toggleItemLock(Number(btn.dataset.id)); });
}

function saveCurrentToBag() {
  ensureStarterInventory();
  syncEquippedFromCurrent();
  const item = getEquippedItem();
  if (item) item.name = item.name.replace(/ \+\d+$/, "") + " +" + item.savedLevel;
  $("message").innerText = "🎒 장착 중인 마법봉 상태를 저장했습니다. 같은 무기가 중복 복사되지 않습니다.";
  update(true);
}

function equipItem(id) {
  const item = inventory.find(x => x.id === id);
  if (!item) return;
  equippedItemId = id;
  normalizeInventoryItem(item);
  level = item.savedLevel ?? level;
  enhanceCost = item.enhanceCost ?? (gradeStartEnhanceCost[item.grade] || 100);
  options = Array.isArray(item.savedOptions) ? JSON.parse(JSON.stringify(item.savedOptions)) : [];
  $("message").innerText = "🎒 " + item.name + "을(를) 가방에서 꺼냈습니다!";
  animateWand("success");
  update();
}

function getInventoryFilter() {
  const select = $("inventoryGradeFilter");
  return select ? select.value : "ALL";
}

function getInventorySort() {
  const select = $("inventorySort");
  return select ? select.value : "new";
}

function toggleItemLock(id) {
  const item = inventory.find(x => x.id === id);
  if (!item || item.protected) return;
  item.locked = !item.locked;
  $("message").innerText = (item.locked ? "🔒 " : "🔓 ") + item.name + (item.locked ? " 잠금 설정" : " 잠금 해제");
  update(true);
}

function sellItem(id) {
  const item = inventory.find(x => x.id === id);
  if (!item || item.protected || item.locked || item.id === equippedItemId) { $("message").innerText = "잠금/장착/기본 지급 마법봉은 판매할 수 없습니다."; return; }
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
  let targets = inventory.filter(x => !x.protected && !x.locked && x.id !== equippedItemId);
  if (mode === "grade") {
    const grade = getInventoryFilter();
    if (grade === "ALL") {
      $("message").innerText = "등급을 선택한 뒤 등급 판매를 눌러주세요.";
      return;
    }
    targets = targets.filter(x => x.grade === grade);
  }
  if (mode === "dups") {
    // v45: 같은 종류라도 강화/옵션이 다르면 가치가 다르므로, 종류별 최고 성장 1개는 보존
    const groups = new Map();
    inventory.forEach(x => {
      if (x.protected || x.locked || x.id === equippedItemId) return;
      const arr = groups.get(x.wandIndex) || [];
      arr.push(x);
      groups.set(x.wandIndex, arr);
    });
    targets = [];
    groups.forEach(arr => {
      if (arr.length <= 1) return;
      arr.sort((a, b) => {
        return itemPowerScore(b) - itemPowerScore(a);
      });
      targets.push(...arr.slice(1));
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


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRarityTier(grade) {
  return grade === "SSS" ? 4 : grade === "SS" ? 3 : grade === "S" ? 2 : grade === "A" ? 1 : 0;
}

function showDopamineText(text, type = "normal") {
  const layer = $("effectLayer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "dopamine-text " + type;
  el.innerText = text;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1150);
}

function flashDopamine(type = "success") {
  document.body.classList.remove("dopamine-flash-success", "dopamine-flash-rare", "dopamine-flash-fail");
  void document.body.offsetWidth;
  document.body.classList.add("dopamine-flash-" + type);
  setTimeout(() => document.body.classList.remove("dopamine-flash-success", "dopamine-flash-rare", "dopamine-flash-fail"), 520);
}

function spawnDopamineBurst(type = "success", amount = 42) {
  const layer = $("effectLayer");
  if (!layer) return;
  const count = Math.min(96, amount);
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "dopamine-particle " + type;
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * (type === "legend" ? 360 : 230);
    p.style.setProperty("--x", Math.cos(angle) * dist + "px");
    p.style.setProperty("--y", Math.sin(angle) * dist + "px");
    p.style.setProperty("--d", (Math.random() * 0.25) + "s");
    layer.appendChild(p);
  }
  setTimeout(() => layer.querySelectorAll(".dopamine-particle").forEach(el => el.remove()), 1200);
}

function playUpgradeDopamine(success, grade) {
  const tier = getRarityTier(grade);
  if (success) {
    upgradeCombo += 1;
    const comboText = upgradeCombo >= 2 ? "  COMBO x" + upgradeCombo : "";
    showDopamineText("강화 성공!" + comboText, tier >= 3 ? "legend" : "success");
    spawnDopamineBurst(tier >= 3 ? "legend" : "success", tier >= 3 ? 88 : 46 + upgradeCombo * 5);
    flashDopamine(tier >= 2 || upgradeCombo >= 4 ? "rare" : "success");
    document.body.classList.add("screen-shake-success");
    setTimeout(() => document.body.classList.remove("screen-shake-success"), 360);
  } else {
    upgradeCombo = 0;
    showDopamineText("아쉽다...", "fail");
    spawnDopamineBurst("fail", 24);
    flashDopamine("fail");
    document.body.classList.add("screen-shake-fail");
    setTimeout(() => document.body.classList.remove("screen-shake-fail"), 320);
  }
}

function showSummonCharging(count) {
  const stage = $("summonStage");
  if (!stage) return;
  stage.classList.remove("reveal", "grade-s", "grade-ss", "grade-sss");
  stage.classList.add("summon-charging");
  setText("summonResultName", count === 10 ? "10회 소환 준비 중..." : "마법진 충전 중...");
  setText("summonResultDesc", "빛이 강해질수록 높은 등급의 기운이 느껴집니다.");
}

function stopSummonCharging() {
  const stage = $("summonStage");
  if (stage) stage.classList.remove("summon-charging");
}

function playRarityDopamine(result) {
  if (!result) return;
  const tier = getRarityTier(result.grade);
  if (tier >= 2) {
    const label = result.grade === "SSS" ? "LEGENDARY" : result.grade === "SS" ? "MYTHIC" : "RARE";
    showDopamineText(label + "!", result.grade === "SSS" ? "legend" : "rare");
    spawnDopamineBurst(result.grade === "SSS" ? "legend" : "rare", result.grade === "SSS" ? 96 : 64);
    flashDopamine("rare");
  }
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

async function summon(count) {
  if (isSummoning) return;
  const cost = count === 10 ? 270 : 30;
  if (gem < cost) {
    $("message").innerText = "보석이 부족합니다.";
    return;
  }

  isSummoning = true;
  const oneBtn = $("summonOneBtn");
  const tenBtn = $("summonTenBtn");
  if (oneBtn) oneBtn.disabled = true;
  if (tenBtn) tenBtn.disabled = true;
  gem -= cost;
  showSummonCharging(count);
  $("message").innerText = "🎁 마법진이 열리고 있습니다...";
  update();

  await wait(count === 10 ? 850 : 650);

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

  results.sort((a, b) => getRarityTier(b.grade) - getRarityTier(a.grade));
  last = results[0] || last;
  stone += stoneReward;

  stopSummonCharging();
  playSummonReveal(last, count, newCount, stoneReward, results);
  playRarityDopamine(last);
  $("message").innerText = newCount > 0 ? "🎁 신규 마법봉 " + newCount + "개 도감 등록! 결과 목록을 확인하세요." : "🎁 중복 보상으로 마력석 +" + stoneReward + " · 결과 목록을 확인하세요.";
  addEffect(newCount > 0 || getRarityTier(last.grade) >= 2);
  update(true);

  setTimeout(() => {
    isSummoning = false;
    if (oneBtn) oneBtn.disabled = false;
    if (tenBtn) tenBtn.disabled = false;
  }, 250);
}

let lastRenderSignature = "";

function getRenderSignature() {
  return [
    level, currentFilter, equippedItemId, options.map(o => o.key + ":" + o.value).join("|"),
    inventory.length, getInventorySort(), inventory.map(x => x.id + ":" + x.wandIndex + ":" + x.grade + ":" + x.savedLevel + ":" + x.enhanceCost + ":" + (x.savedOptions||[]).length + ":" + (x.locked?1:0)).join("|"),
    unlocked.join(","), growthLevel, growthExp
  ].join(";");
}

function update(forceFullRender = false) {
  ensureStarterInventory();
  syncCurrentFromEquipped();
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
  if (mainImg) { mainImg.src = gradeImagePath(wand.grade, wand.element, level); mainImg.alt = wand.name + " 이미지"; }
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
  const trait = getWeaponTrait(wand.grade);
  setText("traitInfo", trait.name + " · 클릭 x" + trait.click.toFixed(2).replace(/\.00$/, "") + " · 자동 x" + trait.auto.toFixed(2).replace(/\.00$/, "") + " · 보석 x" + trait.gem.toFixed(2).replace(/\.00$/, ""));
  setText("assetInfo", getElementDef(wand.element).name + " LV" + getElementLevel(getEquippedItem()) + " · 에셋 LV" + assetStageFor(wand.grade, level));
  setText("gemDropRate", getGemDropRatePercent().toFixed(1).replace(/\.0$/, "") + "%");
  setText("autoGemDropRate", getAutoGemDropRatePercent().toFixed(1).replace(/\.0$/, "") + "%");
  setText("autoGemPity", (20000 - Math.floor(lifetimeGoldGauge % 20000)).toLocaleString());
  setText("clickBonusBadge", "x" + getGradeClickMultiplier().toFixed(1).replace(/\.0$/, ""));
  setText("failPenalty", getFailPenalty() === 0 ? "없음" : "-" + getFailPenalty());
  setText("stars", renderStars(wand.stars));
  updateWandImage();
  renderElementPanel();

  const badge = ui.gradeBadge || $("gradeBadge");
  if (badge) {
    badge.className = "grade grade-" + wand.grade.toLowerCase();
    badge.innerText = wand.grade;
  }

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
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch (e) {}
    };
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
  return Math.min(24, (2.5 + (getGradeClickMultiplier() - 1) * 1.8 + getOptionBonus("gem") / 10) * getWeaponTrait().gem * getElementBonusMultiplier("gem"));
}

function getAutoGemDropRatePercent() {
  const stoneBonus = Math.min(3.5, stone * 0.035);
  return Math.min(14, (1.2 + (getGradeClickMultiplier() - 1) * 1.05 + stoneBonus + getOptionBonus("gem") / 20) * getWeaponTrait().gem * getElementBonusMultiplier("gem"));
}

function getAutoGemPityNeed() {
  return Math.min(50000, 8000 + Math.floor(level / 5) * 3500);
}

function grantGuaranteedGemByTotalGold() {
  if (lifetimeGoldGauge < 20000) return 0;
  const reward = Math.floor(lifetimeGoldGauge / 20000);
  lifetimeGoldGauge = lifetimeGoldGauge % 20000;
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
  ensureStarterInventory();
  syncCurrentFromEquipped();
  calculateIncome();
  let earned = Math.max(1, Math.floor(clickIncome * (1 + getOptionBonus("gold") / 100)));
  if (level < 15 && gold < enhanceCost) earned = Math.floor(earned * 1.25);
  const wand = currentWand();
  const gemChance = Math.min(0.24, (0.025 + (getGradeClickMultiplier() - 1) * 0.018 + getOptionBonus("gem") / 1000) * getWeaponTrait().gem * getElementBonusMultiplier("gem"));
  let randomGem = 0;
  gold += earned;
  lifetimeGoldGauge += earned;
  const guaranteedGem = grantGuaranteedGemByTotalGold();
  addGrowthExp(2);
  if (Math.random() < gemChance) {
    randomGem = (wand.grade === "SSS" ? 3 : (wand.grade === "SS" || wand.grade === "S" ? 2 : 1)) + Math.floor(getOptionBonus("gem") / 3);
    gem += randomGem;
  }
  const shownGem = guaranteedGem + randomGem;
  $("message").innerText = shownGem > 0
    ? "💎 보석 획득! 골드 +" + earned.toLocaleString() + " · 보석 +" + shownGem + (guaranteedGem > 0 ? "(확정 +" + guaranteedGem + ")" : "") + " · 성장 EXP +2"
    : "💰 마법봉 채굴! 골드 +" + earned.toLocaleString() + " · 성장 EXP +2";
  syncEquippedFromCurrent();
  playMineFx(earned, shownGem);
  animateWand("success");
  const area = $("mineArea");
  if (area) {
    area.classList.add("mining");
    setTimeout(() => area.classList.remove("mining"), 180);
  }
  update();
  save();
}

let lastMineInputAt = 0;
function handleMineInput(e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
  }
  const now = Date.now();
  if (now - lastMineInputAt < 120) return;
  lastMineInputAt = now;
  mineGold();
}

if ($("workBtn")) $("workBtn").onclick = handleMineInput;
if ($("mineArea")) {
  const mineTarget = $("mineArea");
  ["pointerup", "touchend", "click"].forEach(evt => {
    mineTarget.addEventListener(evt, handleMineInput, { passive: false });
  });
  mineTarget.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") handleMineInput(e);
  };
}
// 모바일에서 이미지/배지 레이어가 클릭을 가로채도 채굴되도록 보조 처리
document.addEventListener("pointerup", (e) => {
  if (e.target && e.target.closest && e.target.closest("#mineArea")) handleMineInput(e);
}, true);

$("enhanceBtn").onclick = () => {
  ensureStarterInventory();
  syncCurrentFromEquipped();
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
    enhanceCost = clampEnhanceCost(enhanceCost * 1.135 + 45);
    addGrowthExp(2);
    tryAddRandomOption();
    animateWand("success");
  } else {
    const penalty = getFailPenalty();
    level = Math.max(0, level - penalty);
    enhanceCost = clampEnhanceCost(enhanceCost * 1.025 + 18);
    $("message").innerText = penalty === 0 ? "💥 강화 실패... 단계는 유지됩니다." : "💥 강화 실패... 단계 -" + penalty;
    animateWand("fail");
  }

  syncEquippedFromCurrent();
  addEffect(success);
  playUpgradeDopamine(success, currentWand().grade);
  update(true);
};

$("saveBagBtn").onclick = () => saveCurrentToBag();

$("autoBtn").onclick = () => {
  if (gold < autoCost) {
    $("message").innerText = "자동 수익 구매 비용이 부족합니다.";
    return;
  }

  gold -= autoCost;
  stone += 4;
  autoCost = Math.floor(autoCost * 1.32);
  $("message").innerText = "🔮 마력석 증가! 자동 수익이 올랐습니다.";
  update();
};

$("rerollBtn").onclick = () => {
  if (!confirm("현재 옵션이 사라지고 새 옵션으로 교체됩니다. 진행할까요?")) return;
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

  syncEquippedFromCurrent();
  $("message").innerText = "🎲 옵션이 재설정되었습니다.";
  update(true);
};

$("summonOneBtn").onclick = () => summon(1);
$("summonTenBtn").onclick = () => summon(10);
$("trainBtn").onclick = () => {
  const rewards = addGrowthExp(2);
  const trainGold = Math.max(50, clickIncome * 8);
  gold += trainGold;
  let txt = "🌱 수련 완료! 성장 EXP +2 · 골드 +" + trainGold.toLocaleString();
  if (rewards.gold || rewards.gem || rewards.stone || rewards.level) {
    txt += " · 단계 보상";
    if (rewards.gold) txt += " 골드 +" + rewards.gold.toLocaleString();
    if (rewards.gem) txt += " 보석 +" + rewards.gem;
    if (rewards.stone) txt += " 마력석 +" + rewards.stone;
    if (rewards.level) txt += " 강화 +" + rewards.level;
    addEffect(true);
  }
  $("message").innerText = txt;
  syncEquippedFromCurrent();
  animateWand("success");
  update(true);
};
$("feedBtn").onclick = () => {
  if (stone < 4) { $("message").innerText = "마력석이 부족합니다."; return; }
  stone -= 4;
  const rewards = addGrowthExp(12);
  let txt = "💎 마력 주입 완료! 성장 EXP +12";
  if (rewards.gold || rewards.gem || rewards.stone || rewards.level) txt += " · 단계 보상 획득";
  $("message").innerText = txt;
  syncEquippedFromCurrent();
  addEffect(true);
  update(true);
};
$("sellDupBtn").onclick = () => { if (!confirm("중복 마법봉을 모두 판매할까요?")) return; sellItems("dups"); };
if ($("sellGradeBtn")) $("sellGradeBtn").onclick = () => { const grade = getInventoryFilter(); if (grade === "ALL") { $("message").innerText = "등급을 먼저 선택해주세요."; return; } if (!confirm(grade + " 등급의 판매 가능한 마법봉을 모두 판매할까요?")) return; sellItems("grade"); };
if ($("inventoryGradeFilter")) $("inventoryGradeFilter").onchange = () => renderInventory();
if ($("inventorySort")) $("inventorySort").onchange = () => renderInventory();
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
  document.body.classList.remove("mobile-menu-open");
}

function openMobileMenu() {
  if (!isMobileTabs()) return;
  document.body.classList.remove("mobile-panel-open");
  document.body.classList.toggle("mobile-menu-open");
}

function openTab(name) {
  const targetTab = $("tab" + name);
  const targetPanel = $(name.charAt(0).toLowerCase() + name.slice(1) + "Panel");

  if (isMobileTabs() && targetTab && targetPanel &&
      targetTab.classList.contains("active") &&
      targetPanel.classList.contains("active") &&
      document.body.classList.contains("mobile-panel-open")) {
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

  if (isMobileTabs()) {
    document.body.classList.add("mobile-panel-open");
    document.body.classList.remove("mobile-menu-open");
  }
}

function bindUiEvents() {
  const bindClick = (id, handler, options) => {
    const el = $(id);
    if (el) el.addEventListener("click", handler, options);
  };

  bindClick("tabEnhance", () => openTab("Enhance"));
  bindClick("tabCollection", () => openTab("Collection"));
  bindClick("tabOption", () => openTab("Option"));
  bindClick("tabSummon", () => openTab("Summon"));
  bindClick("tabManage", () => openTab("Manage"));

  bindClick("mobileMenuBtn", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMobileMenu();
  });

  const returnToGameScreen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isMobileTabs()) {
      closeMobilePanel();
    } else {
      openTab("Enhance");
    }
  };

  bindClick("panelCloseBtn", returnToGameScreen, true);

  document.querySelectorAll(".inner-panel-close").forEach(btn => {
    btn.addEventListener("click", returnToGameScreen, true);
  });

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.grade;
      renderCollection();
    });
  });

  document.addEventListener("click", (e) => {
    if (!isMobileTabs()) return;
    const rightPanel = document.querySelector(".right-panel");
    const menuBtn = $("mobileMenuBtn");
    const helpModal = $("helpModal");
    const inPanel = rightPanel && rightPanel.contains(e.target);
    const inMenu = menuBtn && menuBtn.contains(e.target);
    const inHelp = helpModal && helpModal.contains(e.target);
    if (!inPanel && !inMenu && !inHelp) {
      document.body.classList.remove("mobile-menu-open");
    }
  }, true);

  window.addEventListener("resize", () => {
    if (isMobileTabs()) {
      if (!document.body.classList.contains("mobile-panel-open")) closeMobilePanel();
    } else {
      document.body.classList.remove("mobile-menu-open", "mobile-panel-open");
      openTab("Enhance");
    }
  });

  if (isMobileTabs()) closeMobilePanel();
}


if ($("elementUpgradeBtn")) $("elementUpgradeBtn").onclick = upgradeElement;

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
  if ($("summonResultImg")) $("summonResultImg").src = gradeImagePath("E", "earth", 0);
  if ($("summonStage")) $("summonStage").classList.remove("reveal", "grade-s", "grade-ss", "grade-sss");
  $("summonResultName").innerText = "뽑기를 눌러보세요";
  $("summonResultDesc").innerText = "1회 30보석 / 10회 270보석";
  renderSummonResultList([]);
  $("message").innerText = "게임이 초기화되었습니다.";
  update();
};

// v62_1: 모바일 백그라운드 자동수익 보상 처리
// setInterval은 모바일 백그라운드에서 throttle(최대 1분 간격)되므로
// lastTickTime 기반 경과 틱 수를 계산해 정확한 자동 수익을 보장합니다.
const MAX_OFFLINE_TICKS = 3600; // 최대 1시간치 오프라인 보상

function applyAutoIncomeTicks(ticks) {
  if (autoIncome <= 0 || ticks <= 0) return 0;
  const safeTickCount = Math.min(ticks, MAX_OFFLINE_TICKS);
  const earned = autoIncome * safeTickCount;
  gold += earned;
  autoGoldGauge += earned;
  lifetimeGoldGauge += earned;
  return safeTickCount;
}

setInterval(() => {
  const now = Date.now();
  const elapsedMs = now - lastTickTime;
  const ticks = Math.max(1, Math.floor(elapsedMs / 1000));
  lastTickTime = now;

  if (autoIncome > 0) {
    applyAutoIncomeTicks(ticks);
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
  save();
}, 1000);

// v62_1: Page Visibility API - 백그라운드 복귀 시 오프라인 수익 일괄 지급
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    lastTickTime = Date.now();
    save();
  } else if (document.visibilityState === "visible") {
    const now = Date.now();
    const elapsedMs = now - lastTickTime;
    const ticks = Math.floor(elapsedMs / 1000);
    lastTickTime = now;
    if (ticks > 1 && autoIncome > 0) {
      const appliedTicks = applyAutoIncomeTicks(ticks);
      const minutes = Math.floor(appliedTicks / 60);
      const seconds = appliedTicks % 60;
      const timeStr = minutes > 0 ? minutes + "분 " + seconds + "초" : seconds + "초";
      $("message").innerText = "📱 자리 비운 동안 " + timeStr + "치 자동 수익 지급! (+" + (autoIncome * appliedTicks).toLocaleString() + " 골드)";
      update();
      save();
    }
  }
});

function getStateSnapshot() {
  syncEquippedFromCurrent();
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
  const loadedInventory = Array.isArray(g.inventory) ? g.inventory.filter(x => x && x.grade && x.name) : [];
  const wasInventoryCapped = loadedInventory.length > INVENTORY_LIMIT;
  inventory = loadedInventory.slice(0, INVENTORY_LIMIT);
  if (wasInventoryCapped) setTimeout(() => setText("message", "🎒 가방 최대 " + INVENTORY_LIMIT + "개를 초과해 오래된 일부 아이템은 불러오지 않았습니다."), 0);
  itemSeq = Math.max(1, Math.floor(toSafeNumber(g.itemSeq, inventory.length + 1, 1)));
  equippedItemId = g.equippedItemId ?? null;
  autoGoldGauge = toSafeNumber(g.autoGoldGauge, 0);
  lifetimeGoldGauge = toSafeNumber(g.lifetimeGoldGauge, 0);
  ensureStarterInventory();
}

function migrateSave(g = {}) {
  const migrated = { ...g };
  const fromVersion = Number(migrated.version || 0);
  if (fromVersion < 59) {
    migrated.enhanceCost = Math.min(toSafeNumber(migrated.enhanceCost, 100), 850000);
    migrated.autoCost = Math.min(toSafeNumber(migrated.autoCost, 500), 650000);
  }
  if (!Array.isArray(migrated.inventory)) migrated.inventory = [];
  migrated.inventory = migrated.inventory.map(item => ({
    ...item,
    gemSellPrice: item.gemSellPrice ?? gradeGemSellPrice(item.grade),
    sellPrice: item.sellPrice ?? gradeSellPrice(item.grade),
    savedLevel: item.savedLevel ?? Math.max(wands[item.wandIndex || 0]?.level ?? 0, Math.floor(toSafeNumber(item.level ?? migrated.level, 0))),
    enhanceCost: item.enhanceCost ?? (gradeStartEnhanceCost[item.grade] || 100),
    savedOptions: Array.isArray(item.savedOptions) ? item.savedOptions : [],
    locked: Boolean(item.locked || item.protected),
    trait: item.trait || (weaponTraits[item.grade]?.name || "기본형"),
    element: normalizeAssetElement(item.element || wands[item.wandIndex || 0]?.element || "normal"),
    elementLevel: Math.max(0, Math.min(7, Math.floor(toSafeNumber(item.elementLevel, assetStageFor(item.grade, item.savedLevel)))))
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
if ($("menuHelpBtn")) $("menuHelpBtn").addEventListener("click", (e) => { e.stopPropagation(); document.body.classList.remove("mobile-menu-open"); openHelp(); });
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

/* v55: unified theme handling */
const THEME_KEY = "magicWandRpgThemeV55";
function getSavedTheme() {
  let saved = "light";
  try { saved = localStorage.getItem(THEME_KEY) || localStorage.getItem("magicWandRpgThemeV54") || localStorage.getItem("magicWandRpgThemeV53") || "light"; } catch (e) {}
  return saved === "dark" || saved === "light" ? saved : "light";
}
function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = nextTheme;
  const btn = $("themeToggleBtn");
  if (btn) {
    btn.innerHTML = nextTheme === "dark" ? "🌙<span>다크</span>" : "☀️<span>밝은</span>";
    btn.setAttribute("aria-label", nextTheme === "dark" ? "밝은 테마로 전환" : "다크 테마로 전환");
  }
  try { localStorage.setItem(THEME_KEY, nextTheme); } catch (e) {}
}
function toggleTheme() {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
}
function bindThemeEvent() {
  const themeBtn = $("themeToggleBtn");
  if (!themeBtn) return;
  themeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  });
}

applyTheme(getSavedTheme());
bindThemeEvent();
bindUiEvents();
cacheDom();
load();
update();
