const CONFIG = {
professionalName: 'Dra. Thabata Yanne',
profession: 'Cirurgiã-Dentista',
city: 'Imperatriz – MA',
featuredSpecialty: 'Facetas em resina',
fullAddress: 'Rua Sousa Lima, 113 — Centro, Imperatriz – MA, Brasil',
instagramHandle: '@_drathabatayanne_',
instagramProfileUrl: 'https://www.instagram.com/_drathabatayanne_/',
instagramDirectUrl: 'https://ig.me/m/_drathabatayanne_',
mapsQueryUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Sousa+Lima+113+Centro+Imperatriz+MA',
whatsappNumber: '5599984758667',
phoneDisplay: '(99) 98475-8667',
croNumber: '',      // PREENCHER quando confirmado (ex.: '12345')
hoursText: '',      // PREENCHER quando confirmado (ex.: 'Seg a Sex, 8h às 18h')
cnpj: '',           // PREENCHER se aplicável
emailAddress: '',   // PREENCHER se aplicável
enableResultsLoupe: true
};
window.dataLayer = window.dataLayer || [];
function trackConversion(eventName, eventParams = {}) {
window.dataLayer.push({ event: eventName, ...eventParams });
if (typeof gtag === 'function') gtag('event', eventName, eventParams);
if (typeof fbq === 'function') fbq('trackCustom', eventName, eventParams);
}
function safeStorageGet(type, key) {
try {
const store = type === 'session' ? window.sessionStorage : window.localStorage;
return store ? store.getItem(key) : null;
} catch (e) { return null; }
}
function safeStorageSet(type, key, val) {
try {
const store = type === 'session' ? window.sessionStorage : window.localStorage;
if (store) store.setItem(key, val);
} catch (e) {}
}
function triggerHaptic() {
try {
if (navigator.vibrate) navigator.vibrate(8);
} catch (e) {}
}
function buildBookingUrl(customMessage) {
const cleanWa = (CONFIG.whatsappNumber || '').replace(/\D/g, '');
const defaultMsg = customMessage || 'Olá, Dra. Thabata! Vim pelo site e gostaria de agendar uma consulta.';
if (cleanWa.length >= 10) {
return `https://wa.me/${cleanWa}?text=${encodeURIComponent(defaultMsg)}`;
}
return CONFIG.instagramDirectUrl;
}
function initLandingPage() {
if (window.__tyInitDone) return;
window.__tyInitDone = true;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isMobileOrCoarse = window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches;
const isLowEndDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
(navigator.deviceMemory && navigator.deviceMemory <= 4);
if (isLowEndDevice) {
document.documentElement.classList.add('is-low-end');
}
const urlParams = new URLSearchParams(window.location.search);
const heroSection = document.getElementById('inicio');
Object.keys(CONFIG).forEach(key => {
document.querySelectorAll(`[data-config="${key}"]`).forEach(el => {
if (CONFIG[key]) el.textContent = CONFIG[key];
});
});
['hoursText', 'phoneDisplay', 'emailAddress', 'cnpj'].forEach(field => {
const val = String(CONFIG[field] || '').trim();
document.querySelectorAll(`[data-optional-field="${field}"]`).forEach(box => {
box.hidden = !val;
});
});
const footerIdLine = document.getElementById('footer-identity-line');
const croClean = (CONFIG.croNumber || '').trim();
if (footerIdLine) {
footerIdLine.textContent = croClean
? `Dra. Thabata Yanne · Cirurgiã-Dentista · CRO-MA ${croClean}`
: `Dra. Thabata Yanne · Cirurgiã-Dentista`;
}
const devWarning = document.getElementById('dev-cro-warning');
if (!croClean && urlParams.get('dev') === '1' && devWarning) {
devWarning.classList.add('is-visible');
}
const schemaScript = document.getElementById('schema-dentist');
if (schemaScript) {
try {
const schemaData = JSON.parse(schemaScript.textContent);
if (CONFIG.phoneDisplay) schemaData.telephone = '+55-99-98475-8667';
if (CONFIG.emailAddress) schemaData.email = CONFIG.emailAddress;
schemaScript.textContent = JSON.stringify(schemaData, null, 2);
} catch (e) {}
}
const hasWa = (CONFIG.whatsappNumber || '').replace(/\D/g, '').length >= 10;
document.querySelectorAll('[data-wa-link]').forEach(link => {
const customText = link.getAttribute('data-wa-text') || '';
link.setAttribute('href', buildBookingUrl(customText));
link.setAttribute('target', '_blank');
link.setAttribute('rel', 'noopener noreferrer');
link.addEventListener('click', () => {
triggerHaptic();
trackConversion(hasWa ? 'whatsapp_click' : 'instagram_direct_click', {
location: link.id || 'cta_button'
});
});
});
const preloader = document.getElementById('preloader');
const siteHeader = document.getElementById('site-header');
let introFinished = false;
function finishHeroIntroImmediately() {
if (introFinished) return;
introFinished = true;
if (preloader) preloader.classList.add('is-hidden');
if (heroSection) {
heroSection.classList.remove('intro-active');
heroSection.classList.add('hero-intro-done');
}
if (siteHeader) {
siteHeader.classList.remove('intro-pending');
}
}
const seenPreloader = safeStorageGet('session', 'ty_preloader_seen');
if (prefersReducedMotion) {
finishHeroIntroImmediately();
} else {
const preloaderDelay = seenPreloader ? 40 : 460;
safeStorageSet('session', 'ty_preloader_seen', '1');
setTimeout(() => {
if (preloader) preloader.classList.add('is-hidden');
requestAnimationFrame(() => {
if (heroSection) heroSection.classList.remove('intro-active');
});
}, preloaderDelay);
setTimeout(() => {
if (siteHeader) siteHeader.classList.remove('intro-pending');
}, preloaderDelay + 800);
setTimeout(() => {
finishHeroIntroImmediately();
}, preloaderDelay + 900);
['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(evt => {
window.addEventListener(evt, finishHeroIntroImmediately, { once: true, passive: true });
});
}
const animPauseObs = new IntersectionObserver(entries => {
entries.forEach(entry => {
entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
});
}, { rootMargin: '80px 0px' });
['inicio', 'atuacao', 'sobre', 'agendar'].forEach(id => {
const el = document.getElementById(id);
if (el) animPauseObs.observe(el);
});
const shaderCanvas = document.getElementById('hero-shader-canvas');
let shaderState = {
gl: null,
prog: null,
uRes: null,
uTime: null,
uMouse: null,
inView: true,
contextLost: false,
startTime: performance.now(),
lastDraw: 0
};
function setupWebGLContext() {
if (!shaderCanvas || prefersReducedMotion || isLowEndDevice || isMobileOrCoarse) return;
const gl = shaderCanvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
if (!gl) return;
const isMob = window.innerWidth < 768;
const octaves = isMob ? 3 : 4;
const vsSource = `attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;
const fsSource = `
precision mediump float;
#define OCT ${octaves}
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_c1, u_c2, u_c3, u_gold;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
vec2 i = floor(p), f = fract(p);
f = f * f * (3.0 - 2.0 * f);
return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
float v = 0.0, a = 0.5;
for (int i = 0; i < OCT; i++){
v += a * noise(p);
p *= 2.02;
a *= 0.5;
}
return v;
}
void main(){
vec2 uv = gl_FragCoord.xy / u_res;
vec2 p = (uv - 0.5) * vec2(u_res.x / max(u_res.y, 1.0), 1.0);
float t = u_time * 0.035;
vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.2));
float n = fbm(p * 1.2 + 1.6 * q + u_mouse * 0.15);
vec3 col = mix(u_c1, u_c2, smoothstep(0.15, 0.75, n));
col = mix(col, u_c3, smoothstep(0.55, 1.0, n) * 0.65);
float beam = smoothstep(0.0, 0.6, 1.0 - abs(p.x * 0.6 + p.y * 0.35 - 0.1 + (q.x - 0.5) * 0.25) * 2.2);
col += u_gold * beam * 0.09;
col *= 1.0 - dot(uv - 0.5, uv - 0.5) * 0.88;
gl_FragColor = vec4(col, 1.0);
}
`;
function compileShader(type, src) {
const s = gl.createShader(type);
gl.shaderSource(s, src);
gl.compileShader(s);
if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
gl.deleteShader(s);
return null;
}
return s;
}
const vs = compileShader(gl.VERTEX_SHADER, vsSource);
const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
if (!vs || !fs) return;
const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
gl.useProgram(prog);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
const aPos = gl.getAttribLocation(prog, 'a_pos');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
gl.uniform3f(gl.getUniformLocation(prog, 'u_c1'), 0.118, 0.071, 0.094);
gl.uniform3f(gl.getUniformLocation(prog, 'u_c2'), 0.227, 0.102, 0.169);
gl.uniform3f(gl.getUniformLocation(prog, 'u_c3'), 0.357, 0.153, 0.259);
gl.uniform3f(gl.getUniformLocation(prog, 'u_gold'), 0.843, 0.714, 0.486);
shaderState.gl = gl;
shaderState.prog = prog;
shaderState.uRes = gl.getUniformLocation(prog, 'u_res');
shaderState.uTime = gl.getUniformLocation(prog, 'u_time');
shaderState.uMouse = gl.getUniformLocation(prog, 'u_mouse');
shaderState.contextLost = false;
resizeShaderCanvas();
gl.uniform1f(shaderState.uTime, 0);
gl.uniform2f(shaderState.uMouse, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, 6);
shaderCanvas.classList.add('is-ready');
}
function resizeShaderCanvas() {
if (!shaderState.gl || shaderState.contextLost || !shaderCanvas) return;
const maxDpr = window.innerWidth < 768 ? 0.75 : 1.25;
const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
const w = Math.max(1, Math.floor(shaderCanvas.clientWidth * dpr));
const h = Math.max(1, Math.floor(shaderCanvas.clientHeight * dpr));
if (shaderCanvas.width !== w || shaderCanvas.height !== h) {
shaderCanvas.width = w;
shaderCanvas.height = h;
shaderState.gl.viewport(0, 0, w, h);
shaderState.gl.uniform2f(shaderState.uRes, w, h);
}
}
if (shaderCanvas && !prefersReducedMotion && !isLowEndDevice && !isMobileOrCoarse) {
setupWebGLContext();
window.addEventListener('resize', resizeShaderCanvas, { passive: true });
shaderCanvas.addEventListener('webglcontextlost', e => {
e.preventDefault();
shaderState.contextLost = true;
});
shaderCanvas.addEventListener('webglcontextrestored', () => {
setupWebGLContext();
});
if (heroSection) {
const heroObs = new IntersectionObserver(entries => {
shaderState.inView = entries[0].isIntersecting;
if (shaderState.inView) requestTick();
}, { threshold: 0.01 });
heroObs.observe(heroSection);
}
}
const partCanvas = document.getElementById('consulta-particles');
const consultaSection = document.getElementById('consulta');
let particles = [];
let consultaInView = false;
if (partCanvas && consultaSection && isFinePointer && !prefersReducedMotion && !isLowEndDevice) {
const pCtx = partCanvas.getContext('2d');
function resizeParticles() {
partCanvas.width = consultaSection.clientWidth;
partCanvas.height = consultaSection.clientHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles, { passive: true });
for (let i = 0; i < 24; i++) {
particles.push({
x: Math.random() * partCanvas.width,
y: Math.random() * partCanvas.height,
r: 0.8 + Math.random() * 1.5,
vx: (Math.random() - 0.5) * 0.16,
vy: -0.10 - Math.random() * 0.20,
alpha: 0.15 + Math.random() * 0.40
});
}
const partObs = new IntersectionObserver(entries => {
consultaInView = entries[0].isIntersecting;
if (consultaInView) requestTick();
}, { threshold: 0.05 });
partObs.observe(consultaSection);
partCanvas._ctx = pCtx;
}
const customCursor = document.getElementById('custom-cursor');
const customCursorLabel = document.getElementById('custom-cursor-label');
const heroLayerBg = document.getElementById('hero-layer-bg');
const heroLayerWord = document.getElementById('hero-layer-word');
const heroLayerSubj = document.getElementById('hero-layer-subject');
const heroLayerGlow = document.getElementById('hero-layer-glow');
let mouseState = {
targetX: window.innerWidth * 0.5,
targetY: window.innerHeight * 0.5,
curX: window.innerWidth * 0.5,
curY: window.innerHeight * 0.5,
normX: 0,
normY: 0,
lerpNormX: 0,
lerpNormY: 0,
hasMoved: false
};
let rafRunning = false;
function requestTick() {
if (!rafRunning && !prefersReducedMotion && !document.hidden) {
rafRunning = true;
requestAnimationFrame(masterTick);
}
}
if (isFinePointer && !prefersReducedMotion) {
window.addEventListener('mousemove', e => {
if (!mouseState.hasMoved) {
mouseState.hasMoved = true;
mouseState.curX = e.clientX;
mouseState.curY = e.clientY;
if (customCursor) customCursor.classList.add('is-moved');
}
mouseState.targetX = e.clientX;
mouseState.targetY = e.clientY;
mouseState.normX = (e.clientX / window.innerWidth - 0.5) * 2;
mouseState.normY = (e.clientY / window.innerHeight - 0.5) * 2;
requestTick();
}, { passive: true });
document.querySelectorAll('a, button, .triage-chip, .faq-trigger').forEach(el => {
el.addEventListener('mouseenter', () => customCursor && customCursor.classList.add('is-button'));
el.addEventListener('mouseleave', () => customCursor && customCursor.classList.remove('is-button'));
});
document.querySelectorAll('input:not([type="range"]), select, textarea').forEach(el => {
el.addEventListener('mouseenter', () => customCursor && customCursor.classList.add('is-input'));
el.addEventListener('mouseleave', () => customCursor && customCursor.classList.remove('is-input'));
});
document.querySelectorAll('[data-cursor-mode]').forEach(el => {
el.addEventListener('mouseenter', () => {
if (!customCursor || !customCursorLabel) return;
customCursorLabel.textContent = el.getAttribute('data-cursor-mode');
customCursor.classList.add('is-mode');
});
el.addEventListener('mouseleave', () => {
if (!customCursor) return;
customCursor.classList.remove('is-mode');
});
});
}
document.querySelectorAll('.btn-b1, .btn-b2').forEach(btn => {
btn.addEventListener('pointerenter', e => {
const rect = btn.getBoundingClientRect();
btn.style.setProperty('--px', `${(e.clientX - rect.left).toFixed(1)}px`);
btn.style.setProperty('--py', `${(e.clientY - rect.top).toFixed(1)}px`);
});
btn.addEventListener('pointermove', e => {
const rect = btn.getBoundingClientRect();
btn.style.setProperty('--px', `${(e.clientX - rect.left).toFixed(1)}px`);
btn.style.setProperty('--py', `${(e.clientY - rect.top).toFixed(1)}px`);
if (isFinePointer && !prefersReducedMotion && btn.classList.contains('magnetic-btn')) {
const dx = ((e.clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.5)) * 5.0;
const dy = ((e.clientY - (rect.top + rect.height * 0.5)) / (rect.height * 0.5)) * 5.0;
btn.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
}
});
btn.addEventListener('pointerleave', () => {
btn.style.transform = '';
});
btn.addEventListener('pointerdown', e => {
if (isFinePointer || prefersReducedMotion) return;
triggerHaptic();
const rect = btn.getBoundingClientRect();
const ripple = document.createElement('span');
ripple.className = 'touch-ripple';
const size = Math.max(rect.width, rect.height);
ripple.style.width = ripple.style.height = `${size}px`;
ripple.style.left = `${e.clientX - rect.left - size * 0.5}px`;
ripple.style.top = `${e.clientY - rect.top - size * 0.5}px`;
btn.appendChild(ripple);
setTimeout(() => ripple.remove(), 520);
});
});
if (isFinePointer) {
document.querySelectorAll('.spotlight-surface').forEach(card => {
card.addEventListener('pointermove', e => {
const rect = card.getBoundingClientRect();
card.style.setProperty('--spot-x', `${(e.clientX - rect.left).toFixed(1)}px`);
card.style.setProperty('--spot-y', `${(e.clientY - rect.top).toFixed(1)}px`);
}, { passive: true });
});
}
function masterTick(now) {
if (document.hidden || prefersReducedMotion) {
rafRunning = false;
return;
}
const dxCursor = mouseState.targetX - mouseState.curX;
const dyCursor = mouseState.targetY - mouseState.curY;
const dxNorm = mouseState.normX - mouseState.lerpNormX;
const dyNorm = mouseState.normY - mouseState.lerpNormY;
const pointerMoving = Math.abs(dxCursor) > 0.05 || Math.abs(dyCursor) > 0.05 || Math.abs(dxNorm) > 0.002 || Math.abs(dyNorm) > 0.002;
if (pointerMoving) {
mouseState.lerpNormX += dxNorm * 0.08;
mouseState.lerpNormY += dyNorm * 0.08;
mouseState.curX += dxCursor * 0.20;
mouseState.curY += dyCursor * 0.20;
if (isFinePointer && customCursor && mouseState.hasMoved) {
customCursor.style.transform = `translate3d(${mouseState.curX.toFixed(1)}px, ${mouseState.curY.toFixed(1)}px, 0)`;
}
if (isFinePointer && shaderState.inView) {
const nx = -mouseState.lerpNormX;
const ny = -mouseState.lerpNormY;
if (heroLayerBg) heroLayerBg.style.transform = `translate3d(${(nx * 4).toFixed(2)}px, ${(ny * 4).toFixed(2)}px, 0)`;
if (heroLayerWord) heroLayerWord.style.transform = `translate3d(${(nx * 10).toFixed(2)}px, calc(-50% + ${(ny * 10).toFixed(2)}px), 0)`;
if (heroLayerSubj) heroLayerSubj.style.transform = `translate3d(${(nx * 16).toFixed(2)}px, ${(ny * 12).toFixed(2)}px, 0)`;
if (heroLayerGlow) heroLayerGlow.style.transform = `translate3d(${(nx * 22).toFixed(2)}px, ${(ny * 22).toFixed(2)}px, 0)`;
}
}
const needShader = Boolean(shaderState.gl && shaderState.inView && !shaderState.contextLost);
if (needShader && (now - shaderState.lastDraw >= 33)) {
shaderState.lastDraw = now;
const gl = shaderState.gl;
const elapsed = (now - shaderState.startTime) * 0.001;
gl.uniform1f(shaderState.uTime, elapsed);
gl.uniform2f(shaderState.uMouse, mouseState.lerpNormX, -mouseState.lerpNormY);
gl.drawArrays(gl.TRIANGLES, 0, 6);
}
const needParticles = Boolean(consultaInView && partCanvas && partCanvas._ctx);
if (needParticles) {
const ctx = partCanvas._ctx;
const w = partCanvas.width, h = partCanvas.height;
ctx.clearRect(0, 0, w, h);
particles.forEach(p => {
p.x += p.vx;
p.y += p.vy;
if (p.y < -10) p.y = h + 10;
if (p.x < -10) p.x = w + 10;
if (p.x > w + 10) p.x = -10;
ctx.beginPath();
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
ctx.fillStyle = `rgba(215, 182, 124, ${p.alpha})`;
ctx.fill();
});
}
if (pointerMoving || needShader || needParticles) {
requestAnimationFrame(masterTick);
} else {
rafRunning = false;
}
}
document.addEventListener('visibilitychange', () => {
if (!document.hidden) requestTick();
});
requestTick();
const revealObs = new IntersectionObserver((entries, obs) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('is-revealed');
obs.unobserve(entry.target);
}
});
}, { threshold: 0.12 });
document.querySelectorAll('.section-block, .site-footer').forEach(sec => revealObs.observe(sec));
const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
const atmoObs = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (!entry.isIntersecting) return;
const sec = entry.target;
const bg = sec.getAttribute('data-atmo-bg');
const txt = sec.getAttribute('data-atmo-text');
if (bg) document.documentElement.style.setProperty('--atmo-bg', bg);
if (txt) document.documentElement.style.setProperty('--atmo-text', txt);
const id = sec.getAttribute('id');
if (id) {
navLinks.forEach(l => {
l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`);
});
}
});
}, { rootMargin: '-38% 0px -48% 0px' });
document.querySelectorAll('section[id]').forEach(sec => atmoObs.observe(sec));
const baSliderA = document.getElementById('ba-slider-a');
const baRangeA = document.getElementById('ba-range-a');
function updateSliderA(val) {
if (!baSliderA || !baRangeA) return;
baRangeA.value = val;
baSliderA.style.setProperty('--ba-pos', `${val}%`);
}
if (baRangeA && baSliderA) {
baRangeA.addEventListener('input', e => updateSliderA(e.target.value));
if (!prefersReducedMotion) {
const demoObs = new IntersectionObserver((entries, obs) => {
if (!entries[0].isIntersecting) return;
obs.unobserve(baSliderA);
let touched = false;
const stopDemo = () => { touched = true; };
baSliderA.addEventListener('pointerdown', stopDemo, { once: true });
baRangeA.addEventListener('keydown', stopDemo, { once: true });
setTimeout(() => { if (!touched) updateSliderA(34); }, 320);
setTimeout(() => { if (!touched) updateSliderA(66); }, 780);
setTimeout(() => { if (!touched) updateSliderA(50); }, 1240);
}, { threshold: 0.55 });
demoObs.observe(baSliderA);
}
}
const procData = [
{
badge: 'Especialidade de destaque',
title: 'Facetas em resina composta',
desc: 'Indicadas após avaliação criteriosa da estrutura dental e da gengiva, as facetas em resina corrigem assimetrias, diastemas e alterações de cor ou forma preservando a naturalidade do sorriso.',
cta: 'Agendar avaliação de facetas',
triage: 'Facetas em resina',
waText: 'Olá, Dra. Thabata! Gostaria de saber mais sobre as facetas em resina e agendar uma avaliação.'
},
{
badge: 'Saúde e Prevenção',
title: 'Procedimentos odontológicos em geral',
desc: 'Consultas preventivas, profilaxia cuidadosa (limpeza), restaurações estéticas e acompanhamento periódico para manter dentes e gengivas saudáveis em todas as fases da vida.',
cta: 'Agendar avaliação geral',
triage: 'Avaliação geral',
waText: 'Olá, Dra. Thabata! Vim pelo site e gostaria de agendar uma avaliação odontológica geral.'
},
{
badge: 'Cuidado Cirúrgico',
title: 'Cirurgia oral menor',
desc: 'Planejamento seguro para extrações dentárias (como dentes sisos com indicação clínica) e pequenos procedimentos cirúrgicos ambulatoriais, com orientação pré e pós-operatória detalhada.',
cta: 'Avaliar cirurgia oral menor',
triage: 'Cirurgia oral menor',
waText: 'Olá, Dra. Thabata! Gostaria de agendar uma avaliação para cirurgia oral menor.'
},
{
badge: 'Aperfeiçoamento em Endodontia',
title: 'Tratamento de canal',
desc: 'Desinfecção e obturação cuidadosa dos canais radiculares para eliminar focos de infecção ou dor aguda e preservar o dente natural na arcada.',
cta: 'Avaliar tratamento de canal',
triage: 'Tratamento de canal',
waText: 'Olá, Dra. Thabata! Gostaria de agendar uma avaliação para tratamento de canal (endodontia).'
}
];
const procItems = document.querySelectorAll('.proc-item');
const procDots = document.querySelectorAll('.proc-dot-btn');
const procList = document.getElementById('proc-list');
const procPanelContent = document.getElementById('proc-panel-content');
const procBadge = document.getElementById('proc-panel-badge');
const procTitle = document.getElementById('proc-panel-title');
const procDesc = document.getElementById('proc-panel-desc');
const procCta = document.getElementById('proc-panel-cta');
const procCtaText = document.getElementById('proc-panel-cta-text');
const procCtaCopy = document.getElementById('proc-panel-cta-copy');
let currentProcIdx = 0;
function setActiveProcedure(idx) {
if (idx === currentProcIdx || !procData[idx]) return;
currentProcIdx = idx;
procItems.forEach((btn, i) => {
const active = i === idx;
btn.classList.toggle('is-active', active);
btn.setAttribute('aria-selected', active ? 'true' : 'false');
});
procDots.forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
if (procPanelContent) {
procPanelContent.classList.add('is-switching');
setTimeout(() => {
const d = procData[idx];
if (procBadge) procBadge.textContent = d.badge;
if (procTitle) procTitle.textContent = d.title;
if (procDesc) procDesc.textContent = d.desc;
if (procCta) {
procCta.setAttribute('data-select-triage', d.triage);
procCta.setAttribute('href', buildBookingUrl(d.waText));
}
if (procCtaText) procCtaText.textContent = d.cta;
if (procCtaCopy) procCtaCopy.textContent = d.cta;
procPanelContent.classList.remove('is-switching');
}, 180);
}
}
procItems.forEach((btn, idx) => {
btn.addEventListener('click', () => {
triggerHaptic();
setActiveProcedure(idx);
});
btn.addEventListener('mouseenter', () => {
if (window.innerWidth >= 1024) setActiveProcedure(idx);
});
});
if (procList) {
procList.addEventListener('scroll', () => {
if (window.innerWidth >= 1024) return;
const itemW = procItems[0] ? procItems[0].offsetWidth + 16 : 300;
const idx = Math.min(procItems.length - 1, Math.max(0, Math.round(procList.scrollLeft / itemW)));
setActiveProcedure(idx);
}, { passive: true });
}
const readingProgressBar = document.getElementById('reading-progress-bar');
const mobileAppBar = document.getElementById('mobile-app-bar');
const backToTopBtn = document.getElementById('back-to-top-btn');
const backToTopCircle = document.getElementById('back-to-top-circle');
const consultaTimeline = document.getElementById('consulta-timeline');
const consultaArcPath = document.getElementById('consulta-arc-path');
const consultaArcTip = document.getElementById('consulta-arc-tip');
const consultaMoments = document.querySelectorAll('.consulta-moment');
const cookieBar = document.getElementById('cookie-bar');
const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
const agendarSec = document.getElementById('agendar');
let formInView = false;
let cookiesAccepted = Boolean(safeStorageGet('local', 'ty_lgpd_cookies_ok'));
let cachedMetrics = {
winH: window.innerHeight,
docH: Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
consultaTop: 0,
consultaH: 400,
arcTotalLen: 1040
};
function updateCachedMetrics() {
const sy = window.scrollY;
cachedMetrics.winH = window.innerHeight;
cachedMetrics.docH = Math.max(1, document.documentElement.scrollHeight - cachedMetrics.winH);
if (consultaTimeline) {
const r = consultaTimeline.getBoundingClientRect();
cachedMetrics.consultaTop = r.top + sy;
cachedMetrics.consultaH = Math.max(r.height, 260);
}
if (consultaArcPath && consultaArcPath.getTotalLength) {
try { cachedMetrics.arcTotalLen = consultaArcPath.getTotalLength(); } catch (e) {}
}
}
updateCachedMetrics();
window.addEventListener('resize', updateCachedMetrics, { passive: true });
if (typeof ResizeObserver === 'function') {
const ro = new ResizeObserver(() => updateCachedMetrics());
ro.observe(document.body);
}
let lastScrollY = window.scrollY;
let scrollTicking = false;
function onScrollFrame() {
scrollTicking = false;
const y = window.scrollY;
const winH = cachedMetrics.winH;
const progress = Math.min(1, Math.max(0, y / cachedMetrics.docH));
if (readingProgressBar) readingProgressBar.style.width = `${(progress * 100).toFixed(1)}%`;
if (backToTopCircle) backToTopCircle.style.strokeDashoffset = (1 - progress).toFixed(3);
if (backToTopBtn) backToTopBtn.classList.toggle('is-visible', y > winH * 0.65);
const dy = y - lastScrollY;
if (siteHeader) {
siteHeader.classList.toggle('is-scrolled', y > 24);
if (y > 140 && dy > 6) {
siteHeader.classList.add('is-hidden-scroll');
} else if (dy < -6 || y <= 80) {
siteHeader.classList.remove('is-hidden-scroll');
}
}
const showCookieNow = !cookiesAccepted && y > 320 && !formInView;
if (cookieBar) cookieBar.classList.toggle('is-visible', showCookieNow);
if (mobileAppBar) {
if (formInView || showCookieNow || (y > 180 && dy > 8)) {
mobileAppBar.classList.add('is-hidden-scroll');
} else if (dy < -8 || y <= 100) {
mobileAppBar.classList.remove('is-hidden-scroll');
}
}
lastScrollY = y;
if (consultaTimeline) {
const relTop = cachedMetrics.consultaTop - y;
if (relTop < winH * 0.85 && relTop + cachedMetrics.consultaH > 0) {
const r = Math.min(1, Math.max(0.08, (winH * 0.72 - relTop) / cachedMetrics.consultaH));
if (consultaArcPath) {
consultaArcPath.style.strokeDashoffset = (1 - r).toFixed(3);
}
if (consultaArcTip && consultaArcPath && consultaArcPath.getPointAtLength) {
try {
const pt = consultaArcPath.getPointAtLength(cachedMetrics.arcTotalLen * r);
consultaArcTip.setAttribute('cx', pt.x.toFixed(1));
consultaArcTip.setAttribute('cy', pt.y.toFixed(1));
} catch (e) {}
}
const litCount = Math.max(1, Math.ceil(r * 4));
consultaMoments.forEach((m, idx) => {
m.classList.toggle('is-lit', idx < litCount);
});
}
}
}
window.addEventListener('scroll', () => {
if (!scrollTicking) {
scrollTicking = true;
requestAnimationFrame(onScrollFrame);
}
}, { passive: true });
onScrollFrame();
if (agendarSec) {
const formObs = new IntersectionObserver(entries => {
formInView = entries[0].isIntersecting;
onScrollFrame();
}, { threshold: 0.15 });
formObs.observe(agendarSec);
}
if (acceptCookiesBtn) {
acceptCookiesBtn.addEventListener('click', () => {
cookiesAccepted = true;
safeStorageSet('local', 'ty_lgpd_cookies_ok', '1');
if (cookieBar) cookieBar.classList.remove('is-visible');
if (mobileAppBar && !formInView) mobileAppBar.classList.remove('is-hidden-scroll');
});
}
if (backToTopBtn) {
backToTopBtn.addEventListener('click', () => {
triggerHaptic();
window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});
}
document.querySelectorAll('.faq-trigger').forEach(btn => {
btn.addEventListener('click', () => {
triggerHaptic();
const item = btn.closest('.faq-item');
if (!item) return;
const willOpen = !item.classList.contains('is-open');
item.classList.toggle('is-open', willOpen);
btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
});
});
const triageCopyMap = {
'Facetas em resina': 'Na avaliação para <strong>facetas em resina</strong>, analisamos a harmonia do seu sorriso, o formato dos dentes e a saúde da gengiva para planejar um resultado natural e sob medida.',
'Cirurgia oral menor': 'Para <strong>cirurgia oral menor</strong> (como remoção planejada de sisos), avaliamos exames de imagem e explicamos todos os cuidados pré e pós-operatórios com calma.',
'Tratamento de canal': 'No <strong>tratamento de canal (endodontia)</strong>, o foco é aliviar o desconforto, desinfectar o canal com precisão e preservar o seu dente natural.',
'Avaliação geral': 'Na <strong>avaliação odontológica geral</strong>, realizamos check-up preventivo, profilaxia (limpeza) e diagnóstico completo da saúde bucal.',
'Ainda não sei': 'Sem problema! Na <strong>primeira conversa</strong>, você conta o que está sentindo ou o que gostaria de melhorar, e a Dra. Thabata explica as opções indicadas para você.'
};
const triageChips = document.querySelectorAll('.triage-chip');
const triageGuidanceBox = document.getElementById('triage-guidance-box');
const treatmentSelect = document.getElementById('p-treatment');
function selectTriageTopic(topic) {
triageChips.forEach(chip => {
const match = chip.getAttribute('data-triage') === topic;
chip.setAttribute('aria-pressed', match ? 'true' : 'false');
});
if (triageGuidanceBox && triageCopyMap[topic]) {
triageGuidanceBox.innerHTML = triageCopyMap[topic];
}
if (treatmentSelect) {
Array.from(treatmentSelect.options).forEach(opt => {
if (opt.value === topic) treatmentSelect.value = topic;
});
}
}
triageChips.forEach(chip => {
chip.addEventListener('click', () => {
triggerHaptic();
selectTriageTopic(chip.getAttribute('data-triage'));
});
});
if (treatmentSelect) {
treatmentSelect.addEventListener('change', e => selectTriageTopic(e.target.value));
}
document.querySelectorAll('[data-select-triage]').forEach(link => {
link.addEventListener('click', () => {
const topic = link.getAttribute('data-select-triage');
if (topic) selectTriageTopic(topic);
});
});
const nameInput = document.getElementById('p-name');
const phoneInput = document.getElementById('p-phone');
const nameWrap = document.getElementById('field-wrap-name');
const phoneWrap = document.getElementById('field-wrap-phone');
const formErrorLive = document.getElementById('form-error-live');
if (nameInput && nameWrap) {
nameInput.addEventListener('input', () => {
nameWrap.classList.toggle('is-valid', nameInput.value.trim().length >= 2);
if (formErrorLive) formErrorLive.textContent = '';
});
}
if (phoneInput && phoneWrap) {
phoneInput.addEventListener('input', e => {
let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
if (digits.length > 6) {
e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
} else if (digits.length > 2) {
e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
} else if (digits.length > 0) {
e.target.value = `(${digits}`;
}
phoneWrap.classList.toggle('is-valid', digits.length >= 10);
if (formErrorLive) formErrorLive.textContent = '';
});
}
const mainContent = document.getElementById('conteudo-principal');
const openSheetBtn = document.getElementById('open-sheet-btn');
const sheetBackdrop = document.getElementById('sheet-backdrop');
const bottomSheet = document.getElementById('mobile-bottom-sheet');
const sheetDragHandle = document.getElementById('sheet-drag-handle');
const privacyModal = document.getElementById('privacidade');
const tyModal = document.getElementById('thankyou-modal');
const tyModalActionLink = document.getElementById('ty-modal-action-link');
const openPrivacyLink = document.getElementById('open-privacy-link');
const footerPrivacyBtn = document.getElementById('footer-privacy-btn');
const closePrivacyBtn = document.getElementById('close-privacy-modal-btn');
const closeTyBtn = document.getElementById('close-ty-modal-btn');
let activeDialogEl = null;
let lastFocusedTrigger = null;
function toggleBackgroundInert(isInert) {
[siteHeader, mainContent].forEach(el => {
if (!el) return;
if (isInert) {
el.setAttribute('inert', '');
el.setAttribute('aria-hidden', 'true');
} else {
el.removeAttribute('inert');
el.removeAttribute('aria-hidden');
}
});
}
function openAccessibleOverlay(overlayEl, triggerEl) {
if (!overlayEl) return;
lastFocusedTrigger = triggerEl || document.activeElement;
activeDialogEl = overlayEl;
overlayEl.classList.add('is-open');
overlayEl.setAttribute('aria-hidden', 'false');
toggleBackgroundInert(true);
document.body.style.overflow = 'hidden';
const focusables = overlayEl.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
if (focusables.length > 0) {
setTimeout(() => focusables[0].focus(), 40);
}
}
function closeAccessibleOverlay(overlayEl) {
if (!overlayEl) return;
overlayEl.classList.remove('is-open');
overlayEl.setAttribute('aria-hidden', 'true');
if (overlayEl === bottomSheet && sheetBackdrop) {
sheetBackdrop.classList.remove('is-open');
if (openSheetBtn) openSheetBtn.setAttribute('aria-expanded', 'false');
}
toggleBackgroundInert(false);
document.body.style.overflow = '';
activeDialogEl = null;
if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
lastFocusedTrigger.focus();
}
}
window.addEventListener('keydown', e => {
if (!activeDialogEl) return;
if (e.key === 'Escape') {
e.preventDefault();
closeAccessibleOverlay(activeDialogEl);
return;
}
if (e.key === 'Tab') {
const focusables = Array.from(activeDialogEl.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
if (focusables.length === 0) return;
const first = focusables[0];
const last = focusables[focusables.length - 1];
if (e.shiftKey && document.activeElement === first) {
e.preventDefault();
last.focus();
} else if (!e.shiftKey && document.activeElement === last) {
e.preventDefault();
first.focus();
}
}
});
if (openSheetBtn && bottomSheet && sheetBackdrop) {
openSheetBtn.addEventListener('click', () => {
triggerHaptic();
sheetBackdrop.classList.add('is-open');
openSheetBtn.setAttribute('aria-expanded', 'true');
openAccessibleOverlay(bottomSheet, openSheetBtn);
});
sheetBackdrop.addEventListener('click', () => closeAccessibleOverlay(bottomSheet));
document.querySelectorAll('.sheet-link').forEach(link => {
link.addEventListener('click', () => closeAccessibleOverlay(bottomSheet));
});
}
if (sheetDragHandle && bottomSheet) {
let startY = 0, currentDeltaY = 0, dragging = false;
sheetDragHandle.addEventListener('pointerdown', e => {
dragging = true;
startY = e.clientY;
currentDeltaY = 0;
bottomSheet.style.transition = 'none';
sheetDragHandle.setPointerCapture(e.pointerId);
});
sheetDragHandle.addEventListener('pointermove', e => {
if (!dragging) return;
currentDeltaY = Math.max(0, e.clientY - startY);
bottomSheet.style.transform = `translateY(${currentDeltaY}px)`;
});
sheetDragHandle.addEventListener('pointerup', () => {
if (!dragging) return;
dragging = false;
bottomSheet.style.transition = '';
bottomSheet.style.transform = '';
if (currentDeltaY > 75) closeAccessibleOverlay(bottomSheet);
});
}
if (openPrivacyLink && privacyModal) {
openPrivacyLink.addEventListener('click', e => {
e.preventDefault();
openAccessibleOverlay(privacyModal, openPrivacyLink);
});
}
if (footerPrivacyBtn && privacyModal) {
footerPrivacyBtn.addEventListener('click', () => openAccessibleOverlay(privacyModal, footerPrivacyBtn));
}
if (closePrivacyBtn && privacyModal) {
closePrivacyBtn.addEventListener('click', () => closeAccessibleOverlay(privacyModal));
}
if (closeTyBtn && tyModal) {
closeTyBtn.addEventListener('click', () => closeAccessibleOverlay(tyModal));
}
const scheduleForm = document.getElementById('schedule-form');
const lgpdCheckbox = document.getElementById('p-lgpd');
const formSubmitBtn = document.getElementById('form-submit-btn');
if (scheduleForm) {
scheduleForm.addEventListener('submit', e => {
e.preventDefault();
const nameVal = nameInput ? nameInput.value.trim() : '';
const phoneVal = phoneInput ? phoneInput.value.trim() : '';
const treatmentVal = treatmentSelect ? treatmentSelect.value : 'Facetas em resina';
const periodEl = document.querySelector('input[name="period"]:checked');
const periodVal = periodEl ? periodEl.value : 'Manhã';
if (nameVal.length < 2) {
if (formErrorLive) formErrorLive.textContent = 'Por favor, informe seu nome para continuarmos.';
if (nameInput) nameInput.focus();
return;
}
if (phoneVal.replace(/\D/g, '').length < 10) {
if (formErrorLive) formErrorLive.textContent = 'Por favor, informe um número de WhatsApp ou telefone válido com DDD.';
if (phoneInput) phoneInput.focus();
return;
}
if (lgpdCheckbox && !lgpdCheckbox.checked) {
if (formErrorLive) formErrorLive.textContent = 'Para prosseguir, marque a caixa concordando com a Política de Privacidade (LGPD).';
lgpdCheckbox.focus();
return;
}
const composedMessage =
`Olá, Dra. Thabata! Vim pelo site e gostaria de agendar uma consulta.\n\n` +
`• Nome: ${nameVal}\n` +
`• Contato: ${phoneVal}\n` +
`• Interesse: ${treatmentVal}\n` +
`• Turno de preferência: ${periodVal}`;
try {
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(composedMessage).catch(() => {});
}
} catch (err) {}
const targetUrl = buildBookingUrl(composedMessage);
if (tyModalActionLink) {
tyModalActionLink.setAttribute('href', targetUrl);
tyModalActionLink.addEventListener('click', () => {
closeAccessibleOverlay(tyModal);
}, { once: true });
}
triggerHaptic();
trackConversion('lead_form_submit', {
treatment: treatmentVal,
period: periodVal,
channel: 'whatsapp'
});
openAccessibleOverlay(tyModal, formSubmitBtn);
});
}
const mapIframe = document.querySelector('iframe[data-map-src]');
if (mapIframe && navigator.onLine !== false && window.location.protocol !== 'file:') {
let mapLoaded = false;
const loadMapNow = () => {
if (mapLoaded) return;
mapLoaded = true;
mapIframe.src = mapIframe.getAttribute('data-map-src');
};
if ('IntersectionObserver' in window) {
const mapObs = new IntersectionObserver((entries, obs) => {
if (entries[0].isIntersecting) {
loadMapNow();
obs.disconnect();
}
}, { rootMargin: '300px 0px' });
mapObs.observe(mapIframe);
} else {
loadMapNow();
}
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initLandingPage);
} else {
initLandingPage();
}