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

const optionTypes = [
  { key: "click", name: "클릭 수익 증가", min: 3, max: 15 },
  { key: "auto", name: "자동 수익 증가", min: 2, max: 12 },
  { key: "rate", name: "강화 성공률 보너스", min: 1, max: 6 },
  { key: "gold", name: "골드 획득량 증가", min: 4, max: 18 }
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

const $ = id => document.getElementById(id);

function currentWand() {
  let wand = wands[0];
  for (const w of wands) {
    if (level >= w.level) wand = w;
  }
  return wand;
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

function calculateIncome() {
  clickIncome = Math.floor((10 + level * 12) * (1 + getOptionBonus("click") / 100));
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
          <div class="wand-glow">${isOpen ? w.icon : "❔"}</div>
          <div class="mini-wand"></div>
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

function growthNeed() { return growthLevel * 5; }

function addInventoryItem(wand, customName, protectedItem = false) {
  inventory.push({
    id: itemSeq++,
    wandIndex: wand.index ?? wands.findIndex(x => x.name === wand.name),
    name: customName || wand.name,
    grade: wand.grade,
    icon: wand.icon,
    protected: protectedItem,
    sellPrice: gradeSellPrice(wand.grade)
  });
}

function ensureStarterInventory() {
  if (!Array.isArray(inventory)) inventory = [];
  if (inventory.length === 0) addInventoryItem({ ...wands[0], index: 0 }, "초보자의 첫 마법봉", true);
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
  $("inventoryCount").innerText = inventory.length + "개";
  inventory.slice().reverse().forEach(item => {
    const row = document.createElement("div");
    row.className = "inventory-item grade-card-" + item.grade.toLowerCase();
    row.innerHTML = '<div class="inventory-icon">' + item.icon + '</div>' +
      '<div class="inventory-info"><strong>[' + item.grade + '] ' + item.name + '</strong>' +
      '<span>' + (item.protected ? '기본 지급 · 판매 불가' : '판매가 ' + item.sellPrice.toLocaleString() + ' 골드') + '</span></div>' +
      '<button class="sell-one" data-id="' + item.id + '" ' + (item.protected ? 'disabled' : '') + '>판매</button>';
    list.appendChild(row);
  });
  list.querySelectorAll(".sell-one").forEach(btn => { btn.onclick = () => sellItem(Number(btn.dataset.id)); });
}

function sellItem(id) {
  const item = inventory.find(x => x.id === id);
  if (!item || item.protected) return;
  gold += item.sellPrice;
  inventory = inventory.filter(x => x.id !== id);
  $("message").innerText = "🪙 " + item.name + " 판매 완료! 골드 +" + item.sellPrice.toLocaleString();
  update();
}

function sellItems(mode) {
  ensureStarterInventory();
  let targets = inventory.filter(x => !x.protected);
  if (mode === "dups") {
    const seen = new Set();
    targets = inventory.filter(x => {
      if (x.protected) return false;
      const key = x.wandIndex;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
  }
  if (targets.length === 0) {
    $("message").innerText = mode === "dups" ? "판매할 중복 마법봉이 없습니다." : "판매 가능한 마법봉이 없습니다.";
    return;
  }
  const ids = new Set(targets.map(x => x.id));
  const total = targets.reduce((sum, x) => sum + x.sellPrice, 0);
  gold += total;
  inventory = inventory.filter(x => !ids.has(x.id));
  $("message").innerText = "🪙 마법봉 " + targets.length + "개 판매! 골드 +" + total.toLocaleString();
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

  for (let i = 0; i < count; i++) {
    const result = summonOnce();
    last = result;
    if (result.isNew) newCount++;
    else stoneReward += gradeBonusStone(result.grade);
  }

  stone += stoneReward;

  $("summonResultIcon").innerText = last.icon;
  $("summonResultName").innerText = "[" + last.grade + "] " + last.displayName;
  $("summonResultDesc").innerText = count + "회 뽑기 결과 · 신규 " + newCount + "개 · 마력석 +" + stoneReward;
  $("message").innerText = newCount > 0 ? "🎁 신규 마법봉 " + newCount + "개 도감 등록!" : "🎁 중복 보상으로 마력석 +" + stoneReward;
  addEffect(newCount > 0 || last.grade === "SSS");
  update();
}

function update() {
  calculateIncome();
  checkCollection();

  const wand = currentWand();

  $("gold").innerText = Math.floor(gold).toLocaleString();
  $("gem").innerText = gem.toLocaleString();
  $("stone").innerText = stone.toLocaleString();
  $("wandName").innerText = wand.name;
  $("level").innerText = level;
  $("nextLevel").innerText = level + 1;
  $("clickIncome").innerText = clickIncome.toLocaleString();
  $("autoIncome").innerText = autoIncome.toLocaleString();
  $("successRate").innerText = getSuccessRate();
  $("enhanceCost").innerText = enhanceCost.toLocaleString();
  $("autoCost").innerText = autoCost.toLocaleString();
  $("failPenalty").innerText = getFailPenalty() === 0 ? "없음" : "-" + getFailPenalty();
  $("stars").innerText = renderStars(wand.stars);

  const badge = $("gradeBadge");
  badge.className = "grade grade-" + wand.grade.toLowerCase();
  badge.innerText = wand.grade;

  ensureStarterInventory();
  renderCollection();
  renderOptions();
  renderGrowth();
  renderInventory();
  save();
}

function animateWand(type) {
  const wand = $("wand");
  wand.classList.remove("success", "fail");
  void wand.offsetWidth;
  wand.classList.add(type);
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

$("workBtn").onclick = () => {
  const earned = Math.floor(clickIncome * (1 + getOptionBonus("gold") / 100));
  gold += earned;
  addGrowthExp(1);
  $("message").innerText = "💰 골드 +" + earned.toLocaleString() + " · 성장 EXP +1";
  animateWand("success");
  update();
};

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
      gem += 20;
      $("message").innerText = "⚡ 강화 성공! +" + level + " 달성 · 보석 +20";
    } else {
      $("message").innerText = "⚡ 강화 성공! +" + level + " 달성";
    }
    enhanceCost = Math.floor(enhanceCost * 1.28 + 60);
    addGrowthExp(2);
    tryAddRandomOption();
    animateWand("success");
  } else {
    const penalty = getFailPenalty();
    level = Math.max(0, level - penalty);
    enhanceCost = Math.floor(enhanceCost * 1.12 + 30);
    $("message").innerText = penalty === 0 ? "💥 강화 실패... 단계는 유지됩니다." : "💥 강화 실패... 단계 -" + penalty;
    animateWand("fail");
  }

  addEffect(success);
  update();
};

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
$("sellDupBtn").onclick = () => sellItems("dups");
$("sellAllBtn").onclick = () => { if (!confirm("판매 가능한 마법봉을 모두 판매할까요?")) return; sellItems("all"); };

function openTab(name) {
  ["Enhance", "Collection", "Option", "Summon", "Manage"].forEach(n => {
    $("tab" + n).classList.remove("active");
    $(n.charAt(0).toLowerCase() + n.slice(1) + "Panel").classList.remove("active");
  });

  $("tab" + name).classList.add("active");
  $(name.charAt(0).toLowerCase() + name.slice(1) + "Panel").classList.add("active");
}

$("tabEnhance").onclick = () => openTab("Enhance");
$("tabCollection").onclick = () => openTab("Collection");
$("tabOption").onclick = () => openTab("Option");
$("tabSummon").onclick = () => openTab("Summon");
$("tabManage").onclick = () => openTab("Manage");

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
  $("summonResultIcon").innerText = "🎁";
  $("summonResultName").innerText = "뽑기를 눌러보세요";
  $("summonResultDesc").innerText = "1회 30보석 / 10회 270보석";
  $("message").innerText = "게임이 초기화되었습니다.";
  update();
};

setInterval(() => {
  if (autoIncome > 0) {
    gold += autoIncome;
    update();
  }
}, 1000);

function save() {
  localStorage.setItem("magicWandFixedGamePlus", JSON.stringify({
    gold, gem, stone, level, enhanceCost, autoCost, unlocked, options, growthLevel, growthExp, inventory, itemSeq
  }));
}

function load() {
  const data = localStorage.getItem("magicWandFixedGamePlus") || localStorage.getItem("magicWandFixedGame");
  if (!data) return;

  try {
    const g = JSON.parse(data);
    gold = g.gold ?? 0;
    gem = g.gem ?? 100;
    stone = g.stone ?? 0;
    level = g.level ?? 0;
    enhanceCost = g.enhanceCost ?? 100;
    autoCost = g.autoCost ?? 500;
    unlocked = Array.isArray(g.unlocked) ? g.unlocked.filter(i => i < wands.length) : [0];
    if (!unlocked.includes(0)) unlocked.unshift(0);
    options = g.options ?? [];
    growthLevel = g.growthLevel ?? 1;
    growthExp = g.growthExp ?? 0;
    inventory = Array.isArray(g.inventory) ? g.inventory : [];
    itemSeq = g.itemSeq ?? (inventory.length + 1);
    ensureStarterInventory();
  } catch (e) {}
}

load();
update();
