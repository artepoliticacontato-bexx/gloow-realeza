const money = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const basePrice = 119.90;
const levelInputs = [document.querySelector('#level1'),document.querySelector('#level2'),document.querySelector('#level3')];
let selectedRank = 'consulesa';
const rankRules = {
  consulesa:{label:'Consulesa',rates:[.10,0,0],layers:1},
  duqueza:{label:'Duqueza',rates:[.10,.05,0],layers:2},
  embaixadora:{label:'Embaixadora',rates:[.30,.10,.05],layers:3}
};
function calculate(){
  const rule=rankRules[selectedRank];
  const layerValues=levelInputs.map((input,index)=>+input.value*basePrice*rule.rates[index]);
  levelInputs.forEach((input,index)=>{
    document.querySelector(`#level${index+1}Out`).value=input.value;
    document.querySelector(`#level${index+1}Value`).textContent=money.format(layerValues[index]);
  });
  document.querySelector('#revenue').textContent=money.format(layerValues.reduce((sum,value)=>sum+value,0));
  document.querySelector('#rankLabel').textContent=`Simulação como ${rule.label}`;
}
levelInputs.forEach(input=>input.addEventListener('input',calculate));
document.querySelectorAll('.level-pills button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelector('.level-pills .active').classList.remove('active');
  btn.classList.add('active');
  selectedRank=btn.dataset.rank;
  const layers=rankRules[selectedRank].layers;
  [2,3].forEach(layer=>{
    const available=layer<=layers;
    document.querySelector(`[data-layer="${layer}"]`).hidden=!available;
    document.querySelector(`[data-breakdown="${layer}"]`).hidden=!available;
    levelInputs[layer-1].disabled=!available;
  });
  calculate();
}));
const modal=document.querySelector('#loginModal');
document.querySelectorAll('[data-open-login]').forEach(btn=>btn.addEventListener('click',()=>modal.showModal()));
modal.querySelector('.close').addEventListener('click',()=>modal.close());
modal.querySelector('.close-link').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
document.querySelector('#loginForm').addEventListener('submit',e=>{e.preventDefault();modal.close();document.querySelector('#area-logada').scrollIntoView();});
const signupModal=document.querySelector('#signupModal');
document.querySelectorAll('[data-open-signup]').forEach(btn=>btn.addEventListener('click',()=>{signupModal.classList.remove('submitted');signupModal.querySelector('.form-status').textContent='';signupModal.showModal();}));
signupModal.querySelector('.close').addEventListener('click',()=>signupModal.close());
signupModal.addEventListener('click',e=>{if(e.target===signupModal)signupModal.close()});
const cpfInput=signupModal.querySelector('[name="cpf"]');
const whatsInput=signupModal.querySelector('[name="whatsapp"]');
cpfInput.addEventListener('input',()=>{let v=cpfInput.value.replace(/\D/g,'').slice(0,11);v=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');cpfInput.value=v;});
whatsInput.addEventListener('input',()=>{let v=whatsInput.value.replace(/\D/g,'').slice(0,11);v=v.replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d{1,4})$/,'$1-$2');whatsInput.value=v;});
document.querySelector('#signupForm').addEventListener('submit',e=>{e.preventDefault();const status=signupModal.querySelector('.form-status');status.textContent='Cadastro validado. Conecte o formulário ao sistema para salvar os dados.';});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const root=document.documentElement;
let ticking=false;
function paintScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  root.style.setProperty('--scroll',Math.max(0,Math.min(1,scrollY/max)));
  document.querySelector('.topbar').classList.toggle('scrolled',scrollY>20);
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(paintScroll);ticking=true}},{passive:true});
const aura=document.querySelector('.cursor-aura');
window.addEventListener('pointermove',e=>{aura.animate({left:e.clientX+'px',top:e.clientY+'px'},{duration:650,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'})});
document.querySelectorAll('.button,.rank-card,.calc-panel').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width;const y=(e.clientY-r.top-r.height/2)/r.height;el.style.transform=`perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg)`}));
document.querySelectorAll('.button,.rank-card,.calc-panel').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
paintScroll();
calculate();
