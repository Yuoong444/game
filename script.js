let money=0;
let level=0;
let clickIncome=100;
let autoIncome=0;
let cost=1000;
let autoCost=2000;
let unlocked=[0];

const ranks=[
  {level:0,name:"신입사원",icon:"🧑‍💼",desc:"처음 입사한 병아리"},
  {level:1,name:"주임",icon:"🧑‍💻",desc:"업무에 적응하기 시작"},
  {level:5,name:"대리",icon:"👨‍💻",desc:"혼자 일처리 가능"},
  {level:10,name:"과장",icon:"🕴️",desc:"프로젝트 책임자"},
  {level:15,name:"부장",icon:"🧑‍🏫",desc:"조직을 관리하는 단계"},
  {level:20,name:"대표이사",icon:"👑",desc:"회사의 최종 보스"}
];

const $=id=>document.getElementById(id);

function currentRank(){
  let rank=ranks[0];
  for(const r of ranks){
    if(level>=r.level) rank=r;
  }
  return rank;
}

function checkCollection(){
  ranks.forEach((r,i)=>{
    if(level>=r.level && !unlocked.includes(i)){
      unlocked.push(i);
      $("msg").innerText="도감 등록! " + r.name + " 획득!";
    }
  });
}

function renderCollection(){
  const wrap=$("collection");
  wrap.innerHTML="";

  ranks.forEach((r,i)=>{
    const isOpen=unlocked.includes(i);
    const card=document.createElement("div");
    card.className="card " + (isOpen ? "unlocked" : "locked");
    card.innerHTML=`
      <div class="icon">${isOpen ? r.icon : "❓"}</div>
      <strong>${isOpen ? r.name : "미등록"}</strong>
      <span>${isOpen ? r.desc : "+"+r.level+" 달성 시 해금"}</span>
    `;
    wrap.appendChild(card);
  });

  $("bookCount").innerText=unlocked.length + "/" + ranks.length;
}

function update(){
  checkCollection();

  const rank=currentRank();

  $("money").innerText=money.toLocaleString()+"원";
  $("level").innerText=level;
  $("clickIncome").innerText=clickIncome.toLocaleString();
  $("autoIncome").innerText=autoIncome.toLocaleString();
  $("cost").innerText=cost.toLocaleString();
  $("autoCost").innerText=autoCost.toLocaleString();
  $("rate").innerText=Math.max(20,90-level*5);

  $("character").innerText=rank.icon;
  $("rankName").innerText=rank.name;

  renderCollection();
  save();
}

function animate(type){
  $("character").classList.remove("success","fail");
  void $("character").offsetWidth;
  $("character").classList.add(type);
}

$("workBtn").onclick=()=>{
  money+=clickIncome;
  $("msg").innerText=clickIncome.toLocaleString()+"원을 벌었습니다.";
  animate("success");
  update();
};

$("enhanceBtn").onclick=()=>{
  if(money<cost){
    $("msg").innerText="강화 비용이 부족합니다.";
    return;
  }

  money-=cost;
  const rate=Math.max(20,90-level*5);

  if(Math.random()*100<rate){
    level++;
    clickIncome+=100+(level*20);
    autoIncome+=20;
    $("msg").innerText="강화 성공!";
    animate("success");
  }else{
    $("msg").innerText="강화 실패...";
    animate("fail");
  }

  cost=Math.floor(cost*1.4);
  update();
};

$("autoBtn").onclick=()=>{
  if(money<autoCost){
    $("msg").innerText="자동수익 구매 비용이 부족합니다.";
    return;
  }

  money-=autoCost;
  autoIncome+=50;
  autoCost=Math.floor(autoCost*1.5);
  $("msg").innerText="자동 수익이 증가했습니다.";
  update();
};

$("gameTab").onclick=()=>{
  $("gamePanel").classList.remove("hidden");
  $("bookPanel").classList.add("hidden");
  $("gameTab").classList.add("active");
  $("bookTab").classList.remove("active");
};

$("bookTab").onclick=()=>{
  $("bookPanel").classList.remove("hidden");
  $("gamePanel").classList.add("hidden");
  $("bookTab").classList.add("active");
  $("gameTab").classList.remove("active");
};

$("resetBtn").onclick=()=>{
  if(!confirm("처음부터 다시 시작할까요?")) return;
  money=0;
  level=0;
  clickIncome=100;
  autoIncome=0;
  cost=1000;
  autoCost=2000;
  unlocked=[0];
  $("msg").innerText="초기화되었습니다.";
  update();
};

setInterval(()=>{
  if(autoIncome>0){
    money+=autoIncome;
    update();
  }
},1000);

function save(){
  localStorage.setItem("officeCollectionGame",JSON.stringify({
    money,level,clickIncome,autoIncome,cost,autoCost,unlocked
  }));
}

function load(){
  const data=localStorage.getItem("officeCollectionGame");
  if(!data) return;
  const g=JSON.parse(data);
  money=g.money??0;
  level=g.level??0;
  clickIncome=g.clickIncome??100;
  autoIncome=g.autoIncome??0;
  cost=g.cost??1000;
  autoCost=g.autoCost??2000;
  unlocked=g.unlocked??[0];
}

load();
update();
