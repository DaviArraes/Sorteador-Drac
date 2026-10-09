const TOTAL = 700;
// Ordem fixa dos primeiros sorteios (número -> nome). Depois deles, o sorteio segue aleatório.
const FIXOS = [
  {n:684, nome:"Josimar Ferreira Carvalho"},
  {n:326, nome:"Adson Castro Arraes"}
];
let drawn = [], busy = false;
const $ = id => document.getElementById(id);
const grid = $("grid");
for(let i=1;i<=TOTAL;i++){const s=document.createElement("span");s.id="n"+i;s.textContent=i;grid.appendChild(s);}

function pick(){
  const idx = drawn.length;
  if(idx < FIXOS.length) return FIXOS[idx];
  const left=[];
  for(let i=1;i<=TOTAL;i++) if(!drawn.some(d=>d.n===i)) left.push(i);
  if(!left.length) return null;
  const n = left[Math.floor(Math.random()*left.length)];
  return {n, nome:"Participante nº "+n};
}
function render(){
  const h=$("hist");
  h.innerHTML = drawn.length ? "" : '<li class="empty">Nenhum número sorteado ainda.</li>';
  drawn.forEach((d,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<span>${i+1}º · ${d.nome}</span><b>${d.n}</b>`;
    h.appendChild(li);
  });
  document.querySelectorAll(".grid .d").forEach(e=>e.classList.remove("d"));
  drawn.forEach(d=>$("n"+d.n).classList.add("d"));
}
function sortear(){
  if(busy) return;
  const r = pick();
  if(!r){ $("name").textContent="Todos os números já foram sorteados."; return; }
  busy=true; $("go").disabled=true;
  const st=$("stage"); st.classList.remove("won"); st.classList.add("spin");
  $("name").textContent="Sorteando...";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let t=0; const total = reduce?1:34;
  (function tick(){
    t++;
    if(t<total){
      $("num").textContent = 1+Math.floor(Math.random()*TOTAL);
      setTimeout(tick, 50 + t*t*0.12);
    } else {
      $("num").textContent = r.n;
      $("name").textContent = r.nome;
      st.classList.remove("spin"); st.classList.add("won");
      drawn.push(r); render();
      busy=false; $("go").disabled=false;
    }
  })();
}
$("go").onclick=sortear;
$("reset").onclick=()=>{ if(busy) return; drawn=[]; $("num").textContent="?"; $("name").textContent="Pronto para o primeiro sorteio"; $("stage").classList.remove("won"); render(); };
