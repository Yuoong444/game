let money = 0;
let level = 0;
let clickIncome = 100;
let autoIncome = 0;
let enhanceCost = 1000;
let autoCost = 2000;

const moneyText = document.getElementById("money");
const levelText = document.getElementById("level");
const clickIncomeText = document.getElementById("clickIncome");
const autoIncomeText = document.getElementById("autoIncome");
const successRateText = document.getElementById("successRate");
const enhanceCostText = document.getElementById("enhanceCost");
const autoCostText = document.getElementById("autoCost");
const message = document.getElementById("message");
const character = document.getElementById("character");

const workBtn = document.getElementById("workBtn");
const enhanceBtn = document.getElementById("enhanceBtn");
const autoBtn = document.getElementById("autoBtn");
const resetBtn = document.getElementById("resetBtn");

loadGame();
updateScreen();

workBtn.addEventListener("click", function () {
  money += clickIncome;
  animateCharacter("success");
  message.innerText = clickIncome.toLocaleString() + "원을 벌었습니다!";
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
    clickIncome += 100 + (level * 20);
    autoIncome += 20;
    enhanceCost = Math.floor(enhanceCost * 1.45);

    animateCharacter("success");
    message.innerText = "강화 성공! + " + level + " 달성!";
  } else {
    enhanceCost = Math.floor(enhanceCost * 1.2);

    animateCharacter("fail");
    message.innerText = "강화 실패... 비용만 사라졌습니다.";
  }

  updateScreen();
  saveGame();
});

autoBtn.addEventListener("click", function () {
  if (money >= autoCost) {
    money -= autoCost;
    autoIncome += 50;
    autoCost = Math.floor(autoCost * 1.6);

    message.innerText = "자동 수익이 증가했습니다!";
    animateCharacter("success");
    updateScreen();
    saveGame();
  } else {
    message.innerText = "자동 수익 구매 비용이 부족합니다.";
  }
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
  // 강화 레벨이 올라갈수록 성공률이 낮아집니다.
  // 최소 성공률은 20%입니다.
  return Math.max(20, 90 - (level * 5));
}

function animateCharacter(type) {
  character.classList.remove("success", "fail");
  void character.offsetWidth;
  character.classList.add(type);
}

function updateScreen() {
  moneyText.innerText = money.toLocaleString() + "원";
  levelText.innerText = level;
  clickIncomeText.innerText = clickIncome.toLocaleString();
  autoIncomeText.innerText = autoIncome.toLocaleString();
  successRateText.innerText = getSuccessRate();
  enhanceCostText.innerText = enhanceCost.toLocaleString();
  autoCostText.innerText = autoCost.toLocaleString();
}

function saveGame() {
  const gameData = {
    money,
    level,
    clickIncome,
    autoIncome,
    enhanceCost,
    autoCost
  };

  localStorage.setItem("officeEnhanceGame", JSON.stringify(gameData));
}

function loadGame() {
  const savedData = localStorage.getItem("officeEnhanceGame");

  if (savedData) {
    const gameData = JSON.parse(savedData);

    money = gameData.money ?? 0;
    level = gameData.level ?? 0;
    clickIncome = gameData.clickIncome ?? 100;
    autoIncome = gameData.autoIncome ?? 0;
    enhanceCost = gameData.enhanceCost ?? 1000;
    autoCost = gameData.autoCost ?? 2000;
  }
}
