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

const wands = [
  { level: 0, grade: "E", name: "견습의 나무 지팡이", stars: 1 },
  { level: 3, grade: "D", name: "푸른 수정 지팡이", stars: 2 },
  { level: 6, grade: "C", name: "달빛 마법봉", stars: 3 },
  { level: 9, grade: "B", name: "비전의 지팡이", stars: 4 },
  { level: 12, grade: "A", name: "고대의 번개 지팡이", stars: 5 },
  { level: 15, grade: "S", name: "별빛 대마법봉", stars: 5 },
  { level: 20, grade: "SS", name: "차원의 왕홀", stars: 5 },
  { level: 25, grade: "SSS", name: "창조자의 마법봉", stars: 5 },
  { level: 30, grade: "SSS", name: "영원의 마도 지팡이", stars: 5 }
];

const optionTypes = [
  { key: "click", name: "클릭 수익 증가", min: 3, max: 15 },
  { key: "auto", name: "자동 수익 증가", min: 2, max: 12 },
  { key: "rate", name: "강화 성공률 보너스", min: 1, max: 6 },
  { key: "gold", name: "골드 획득량 증가", min: 4, max: 18 }
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
  return options
    .filter(o => o.key === key)
    .reduce((sum, o) => sum + o.value, 0);
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
  const clickBonus = 1 + getOptionBonus("click") / 100;
  const autoBonus = 1 + getOptionBonus("auto") / 100;
  clickIncome = Math.floor((10 + level * 12) * clickBonus);
  autoIncome = Math.floor((level * 4 + stone * 2) * autoBonus);
}

function checkCollection() {
  wands.forEach((w, i) => {
    if (level >= w.level && !unlocked.includes(i)) {
      unlocked.push(i);
      showMessage("📖 도감 등록! " + w.name + " 해금!");
    }
  });
}

function renderStars(count) {
  return "★".repeat(count) + "☆".repeat(Math.max(0, 5 - count));
}

function renderCollection() {
  const wrap = $("collection");
  wrap.innerHTML = "";

  const list = wands
    .map((w, i) => ({ ...w, index: i }))
    .filter(w => currentFilter === "ALL" || w.grade === currentFilter);

  list.forEach(w => {
    const isOpen = unlocked.includes(w.index);
    const card = document.createElement("div");
    card.className = "card " + (isOpen ? "unlocked" : "locked");
    card.innerHTML = `
      <div class="card-grade">${w.grade}</div>
      <div class="mini-wand"></div>
      <strong>${isOpen ? w.name : "미등록"}</strong>
      <span>${isOpen ? renderStars(w.stars) + "<br>Lv." + w.level : "+" + w.level + " 달성 시 해금"}</span>
    `;
    wrap.appendChild(card);
  });

  $("bookCount").innerText = unlocked.length + " / " + wands.length;
}

function renderOptions() {
  const list = $("optionList");
  list.innerHTML = "";

  if (options.length === 0) {
    list.innerHTML = `<div class="option-item"><span>보유 옵션 없음</span><b>강화 성공 시 획득 가능</b></div>`;
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

  // 강화 성공 시 35% 확률로 옵션 획득
  if (Math.random() > 0.35) return;

  const type = optionTypes[Math.floor(Math.random() * optionTypes.length)];
  const value = Math.floor(type.min + Math.random() * (type.max - type.min + 1));

  options.push({
    key: type.key,
    name: type.name,
    value
  });

  showMessage("🎲 랜덤 옵션 획득! " + type.name + " +" + value + "%");
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
  badge.className = "grade-badge grade-" + wand.grade.toLowerCase();
  badge.innerText = wand.grade;

  renderCollection();
  renderOptions();
  save();
}

function showMessage(text) {
  $("message").innerText = text;
}

function addParticles(success) {
  const layer = $("effectLayer");

  const text = document.createElement("div");
  text.className = "effect-text " + (success ? "success-effect" : "fail-effect");
  text.innerText = success ? "강화 성공!" : "강화 실패";
  layer.appendChild(text);

  const count = success ? 34 : 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = "50%";
    p.style.top = "50%";
    p.style.background = success ? "#facc15" : "#fb7185";
    p.style.boxShadow = success ? "0 0 18px #facc15" : "0 0 18px #fb7185";
    const angle = Math.random() * Math.PI * 2;
    const dist = success ? 100 + Math.random() * 240 : 60 + Math.random() * 160;
    p.style.setProperty("--x", Math.cos(angle) * dist + "px");
    p.style.setProperty("--y", Math.sin(angle) * dist + "px");
    layer.appendChild(p);
  }

  setTimeout(() => {
    text.remove();
    layer.querySelectorAll(".particle").forEach(el => el.remove());
  }, 900);
}

function animateWand(type) {
  const wand = $("wand");
  wand.classList.remove("success", "fail");
  void wand.offsetWidth;
  wand.classList.add(type);
}

$("workBtn").onclick = () => {
  const goldBonus = 1 + getOptionBonus("gold") / 100;
  const earned = Math.floor(clickIncome * goldBonus);
  gold += earned;
  showMessage("💰 골드 +" + earned.toLocaleString());
  animateWand("success");
  update();
};

$("enhanceBtn").onclick = () => {
  if (gold < enhanceCost) {
    showMessage("강화 비용이 부족합니다.");
    return;
  }

  gold -= enhanceCost;
  const success = Math.random() * 100 < getSuccessRate();
  const skip = $("skipEffect").checked;

  if (success) {
    level += 1;
    stone += Math.floor(1 + level / 5);
    enhanceCost = Math.floor(enhanceCost * 1.28 + 60);
    tryAddRandomOption();

    showMessage("⚡ 강화 성공! +" + level + " 달성");
    animateWand("success");
  } else {
    const penalty = getFailPenalty();
    level = Math.max(0, level - penalty);
    enhanceCost = Math.floor(enhanceCost * 1.12 + 30);

    showMessage(penalty === 0 ? "💥 강화 실패... 단계는 유지됩니다." : "💥 강화 실패... 강화 단계 -" + penalty);
    animateWand("fail");
  }

  if (!skip) addParticles(success);
  update();
};

$("autoBtn").onclick = () => {
  if (gold < autoCost) {
    showMessage("자동 수익 구매 비용이 부족합니다.");
    return;
  }

  gold -= autoCost;
  stone += 3;
  autoCost = Math.floor(autoCost * 1.55);
  showMessage("🔮 마력석이 증가하여 자동 수익이 올랐습니다.");
  update();
};

$("rerollBtn").onclick = () => {
  if (gem < 30) {
    showMessage("보석이 부족합니다.");
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

  showMessage("🎲 옵션이 재설정되었습니다.");
  update();
};

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

  showMessage("게임이 초기화되었습니다.");
  update();
};

function openTab(tab) {
  ["enhance", "collection", "option"].forEach(name => {
    $(name + "Panel").classList.remove("active");
    $("tab" + name.charAt(0).toUpperCase() + name.slice(1)).classList.remove("active");
  });

  $(tab + "Panel").classList.add("active");
  $("tab" + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add("active");
}

$("tabEnhance").onclick = () => openTab("enhance");
$("tabCollection").onclick = () => openTab("collection");
$("tabOption").onclick = () => openTab("option");

document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.grade;
    renderCollection();
  };
});

setInterval(() => {
  if (autoIncome > 0) {
    gold += autoIncome;
    update();
  }
}, 1000);

function save() {
  localStorage.setItem("magicWandEnhanceGame", JSON.stringify({
    gold, gem, stone, level, enhanceCost, autoCost, unlocked, options
  }));
}

function load() {
  const data = localStorage.getItem("magicWandEnhanceGame");
  if (!data) return;

  try {
    const g = JSON.parse(data);
    gold = g.gold ?? 0;
    gem = g.gem ?? 100;
    stone = g.stone ?? 0;
    level = g.level ?? 0;
    enhanceCost = g.enhanceCost ?? 100;
    autoCost = g.autoCost ?? 500;
    unlocked = g.unlocked ?? [0];
    options = g.options ?? [];
  } catch (e) {
    console.warn("save load failed", e);
  }
}

load();
update();
