const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('#signal-canvas');
const ctx = canvas.getContext('2d');
let width, height, pointer = { x: -999, y: -999 }, start = performance.now();

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  width = canvas.clientWidth; height = canvas.clientHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function curveY(x) {
  const t = x / width * 8 + .12;
  const ns = .48 - .21 * ((1 - Math.exp(-t / 1.7)) / (t / 1.7)) + .25 * (((1 - Math.exp(-t / 1.7)) / (t / 1.7)) - Math.exp(-t / 1.7));
  return height * (.76 - ns * .72);
}
function draw(time) {
  ctx.clearRect(0, 0, width, height);
  const settle = reduced ? 1 : Math.min(1, (time - start) / 2200);
  const disturbance = Math.max(0, 1 - Math.hypot(pointer.x - width / 2, pointer.y - height / 2) / width) * .8;
  ctx.lineWidth = 2; ctx.strokeStyle = '#a8e063'; ctx.beginPath();
  for (let x = 0; x <= width; x += 5) {
    const y = curveY(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  const count = width < 600 ? 55 : 110;
  for (let i = 0; i < count; i++) {
    const x = (i * 83.17) % width;
    const deterministic = Math.sin(i * 42.13) * height * .26;
    const hover = Math.max(0, 1 - Math.abs(pointer.x - x) / 300);
    const noise = deterministic * (1 - settle) + Math.sin(i * 7.1 + time / 550) * 30 * hover * disturbance;
    const y = curveY(x) + noise;
    ctx.beginPath(); ctx.arc(x, y, i % 7 === 0 ? 2.4 : 1.4, 0, Math.PI * 2);
    ctx.fillStyle = i % 5 === 0 ? '#d88a5b99' : '#f2ebdd66'; ctx.fill();
  }
  if (!reduced) requestAnimationFrame(draw);
}
addEventListener('resize', resize);
addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });
resize(); requestAnimationFrame(draw);

const fit = document.querySelector('#fit-value');
if (!reduced) {
  const fitStart = performance.now();
  function updateFit(now) {
    const p = Math.min(1, (now - fitStart) / 2000);
    fit.textContent = (0.312 + p * .672).toFixed(3);
    if (p < 1) requestAnimationFrame(updateFit);
  }
  requestAnimationFrame(updateFit);
}

const chart = document.querySelector('#ns-chart');
const line = chart.querySelector('.line'), area = chart.querySelector('.area'), points = chart.querySelector('.points'), grid = chart.querySelector('.chart-grid');
for (let x = 60; x <= 660; x += 120) grid.insertAdjacentHTML('beforeend', `<line x1="${x}" y1="25" x2="${x}" y2="340"/>`);
for (let y = 40; y <= 340; y += 75) grid.insertAdjacentHTML('beforeend', `<line x1="40" y1="${y}" x2="680" y2="${y}"/>`);
const inputs = ['level','slope','curve'].map(id => document.querySelector(`#${id}`));
function ns(t, b0, b1, b2) { const tau=3.2, a=(1-Math.exp(-t/tau))/(t/tau); return b0+b1*a+b2*(a-Math.exp(-t/tau)); }
function renderChart() {
  const [b0,b1,b2] = inputs.map(i => +i.value); let d='', vals=[];
  for(let i=0;i<=60;i++){const t=.25+i*.5,yieldV=ns(t,b0,b1,b2),x=45+i*10.4,y=330-(yieldV-1)*45;vals.push([x,y,yieldV]);d+=`${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)} `}
  line.setAttribute('d',d); area.setAttribute('d',`${d} L669,340 L45,340 Z`);
  points.innerHTML=[0,10,20,40,59].map(i=>`<circle cx="${vals[i][0]}" cy="${vals[i][1]}" r="5"/>`).join('');
  document.querySelector('#ten-year').textContent=ns(10,b0,b1,b2).toFixed(2);
  document.querySelector('#level-out').textContent=b0.toFixed(1)+'%'; document.querySelector('#slope-out').textContent=(b1<0?'−':'')+Math.abs(b1).toFixed(1); document.querySelector('#curve-out').textContent=(b2<0?'−':'')+Math.abs(b2).toFixed(1);
}
inputs.forEach(i=>i.addEventListener('input',renderChart)); renderChart();

const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelector('#year').textContent=new Date().getFullYear();
