let money=0,level=0,click=100,auto=0;

const $=id=>document.getElementById(id);

function update(){
$("money").innerText=money.toLocaleString()+"원";
$("level").innerText=level;
$("click").innerText=click;
$("auto").innerText=auto;
}

$("work").onclick=()=>{money+=click;update();}
$("enhance").onclick=()=>{
if(money<1000)return;
money-=1000;
if(Math.random()<0.7){level++;click+=100;}
update();
}
$("autoBtn").onclick=()=>{
if(money<2000)return;
money-=2000;
auto+=50;
update();
}

setInterval(()=>{money+=auto;update();},1000);

update();
