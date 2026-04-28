let money = 0;
let level = 0;
let clickIncome = 100;
let autoIncome = 0;
let enhanceCost = 1000;
let autoCost = 2000;
let successCount = 0;
let bonusReady = true;

const moneyText = document.getElementById("money");
const levelText = document.getElementById("level");
const clickIncomeText = document.getElementById("clickIncome");
const autoIncomeText = document.getElementById("autoIncome");
const successRateText = document.getElementById("successRate");
const enhanceCostText = document.getElementById("enhanceCost");
const autoCostText = document.getElementById("autoCost");
const message = document.getElementById("message");
const character = document.getElementById("character");
const rankName = document.getElementById("rankName");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const bonusText = document.getElementById("bonusText");

const workBtn = document.getElementById("workBtn");
const enhanceBtn = document.getElementById("enhanceBtn");
const autoBtn = document.getElementById("autoBtn");
const resetBtn = document.getElementById("resetBtn");
const bonusBtn = document.getElementById("bonusBtn");

loadGame();
updateScreen();

workBtn.addEventListener("click", function () {
  money += clickIncome;
  animateCharacter("workMotion");
  message.innerText = "업무 완료! " + clickIncome.toLocaleString() + "원을 벌었습니다.";
  updateScreen();
  saveGame();
});

enhanceBtn.addEventListener("click", function () {
  if (money < enhanceCost) {
    message.innerText = "강화 비용이 부족합니다.";
    return;
  }

  money -= enhanceCost;

  const rate = getSuccessRate();
  const random = Math.random() * 100;

  if (random <= rate) {
    level += 1;
    successCount += 1;
    clickIncome += 120 + (level * 30);
    autoIncome += 25 + (level * 5);
    enhanceCost = Math.floor(enhanceCost * 1.48);

    animateCharacter("success");
    message.innerText = "🎉 강화 성공! 직급이 상승했습니다.";
  } else {
    enhanceCost = Math.floor(enhanceCost * 1.18);

    animateCharacter("fail");
    message.innerText = "💥 강화 실패... 비용이 사라졌습니다.";
  }

  updateScreen();
  saveGame();
});

autoBtn.addEventListener("click", function () {
  if (money >= autoCost) {
    money -= autoCost;
    autoIncome += 80 + (level * 10);
    autoCost = Math.floor(autoCost * 1.6);

    message.innerText = "🤖 자동 수익 시스템이 강화되었습니다.";
    animateCharacter("success");
    updateScreen();
    saveGame();
  } else {
    message.innerText = "자동 수익 구매 비용이 부족합니다.";
  }
});

bonusBtn.addEventListener("click", function () {
  if (!bonusReady) {
    message.innerText = "보너스는 잠시 후 다시 받을 수 있습니다.";
    return;
  }

  const bonus = 1000 + (level * 500) + (autoIncome * 5);
  money += bonus;
  bonusReady = false;
  bonusText.innerText = "대기중";

  message.innerText = "🎁 보너스 " + bonus.toLocaleString() + "원을 받았습니다!";
  animateCharacter("success");
  updateScreen();
  saveGame();

  setTimeout(function () {
    bonusReady = true;
    bonusText.innerText = "받기";
    saveGame();
  }, 30000);
});

resetBtn.addEventListener("click", function () {
  const ok = confirm("정말 처음부터 다시 시작할까요?");
  if (!ok) return;

  money = 0;
  level = 0;
  clickIncome = 100;
  autoIncome = 0;
  enhanceCost = 1000;
  autoCost = 2000;
  successCount = 0;
  bonusReady = true;

  saveGame();
  updateScreen();
  message.innerText = "게임이 초기화되었습니다.";
});

setInterval(function () {
  if (autoIncome > 0) {
    money += autoIncome;
    updateScreen();
    saveGame();
  }
}, 1000);

function getSuccessRate() {
  return Math.max(15, 90 - (level * 5));
}

function getRank() {
  if (level >= 20) return { name: "대표이사", icon: "👑" };
  if (level >= 15) return { name: "임원", icon: "🧙‍♂️" };
  if (level >= 10) return { name: "팀장", icon: "🕴️" };
  if (level >= 5) return { name: "대리", icon: "👨‍💻" };
  if (level >= 1) return { name: "주임", icon: "🧑‍💻" };
  return { name: "신입사원", icon: "🧑‍💼" };
}

function animateCharacter(type) {
  character.classList.remove("success", "fail", "workMotion");
  void character.offsetWidth;
  character.classList.add(type);
}

function updateScreen() {
  const rank = getRank();

  character.innerText = rank.icon;
  rankName.innerText = rank.name;

  moneyText.innerText = money.toLocaleString() + "원";
  levelText.innerText = level;
  clickIncomeText.innerText = clickIncome.toLocaleString();
  autoIncomeText.innerText = autoIncome.toLocaleString();
  successRateText.innerText = getSuccessRate();
  enhanceCostText.innerText = enhanceCost.toLocaleString();
  autoCostText.innerText = autoCost.toLocaleString();

  const target = 5;
  const progress = successCount % target;
  progressText.innerText = progress + " / " + target;
  progressBar.style.width = ((progress / target) * 100) + "%";

  if (progress === 0 && successCount > 0) {
    progressBar.style.width = "100%";
  }
}

function saveGame() {
  const gameData = {
    money,
    level,
    clickIncome,
    autoIncome,
    enhanceCost,
    autoCost,
    successCount,
    bonusReady
  };

  localStorage.setItem("officeRealIdleGame", JSON.stringify(gameData));
}

function loadGame() {
  const savedData = localStorage.getItem("officeRealIdleGame");

  if (savedData) {
    const gameData = JSON.parse(savedData);

    money = gameData.money ?? 0;
    level = gameData.level ?? 0;
    clickIncome = gameData.clickIncome ?? 100;
    autoIncome = gameData.autoIncome ?? 0;
    enhanceCost = gameData.enhanceCost ?? 1000;
    autoCost = gameData.autoCost ?? 2000;
    successCount = gameData.successCount ?? 0;
    bonusReady = gameData.bonusReady ?? true;
  }
}
