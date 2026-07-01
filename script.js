/* =========================================================================
   DR LAIBA SIDDIQUE — PREMIUM BIRTHDAY WEBSITE — SCRIPT
   ✏️ To edit messages: open index.html and edit the text inside each section.
   🎨 To change colors: open style.css and edit the :root variables at the top.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================== PRELOADER ===================== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 600);
  });
  // Fallback in case 'load' fires very late
  setTimeout(() => preloader && preloader.classList.add('loaded'), 3500);

  /* ===================== SCROLL PROGRESS BAR ===================== */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ===================== REVEAL ON SCROLL ===================== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ===================== DOT NAVIGATION ACTIVE STATE ===================== */
  const sections = document.querySelectorAll('main > section[id]');
  const dots = document.querySelectorAll('.dot-nav .dot');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        dots.forEach(dot => {
          dot.classList.toggle('active', dot.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(sec => sectionObserver.observe(sec));

  /* ===================== FLOATING PARTICLES (CANVAS) ===================== */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resizeCanvas(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLE_COUNT = window.innerWidth < 700 ? 35 : 70;
  const colors = ['rgba(212,175,55,0.55)', 'rgba(183,110,121,0.45)', 'rgba(248,245,242,0.35)'];

  function createParticles(){
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++){
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        speedY: Math.random() * 0.4 + 0.08,
        speedX: (Math.random() - 0.5) * 0.25,
        drift: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }
  createParticles();
  window.addEventListener('resize', createParticles);

  function animateParticles(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.drift += 0.01;
      p.x += Math.sin(p.drift) * 0.2 + p.speedX;
      if (p.y < -10){ p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ===================== MUSIC PLAYER ===================== */
  const audio = document.getElementById('bgAudio');
  const musicPlayer = document.getElementById('musicPlayer');
  const musicToggle = document.getElementById('musicToggle');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');

  function playAudio(){
    audio.play().then(() => {
      musicPlayer.classList.add('playing');
      musicToggle.setAttribute('aria-label', 'Pause music');
    }).catch(() => { /* autoplay restrictions — ignore silently */ });
  }
  function pauseAudio(){
    audio.pause();
    musicPlayer.classList.remove('playing');
    musicToggle.setAttribute('aria-label', 'Play music');
  }

  musicToggle.addEventListener('click', () => {
    if (audio.paused) playAudio(); else pauseAudio();
  });
  playBtn.addEventListener('click', playAudio);
  pauseBtn.addEventListener('click', pauseAudio);
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔈' : '🔇';
  });

  /* ===================== LIVE COUNTDOWNS ===================== */
  function nextOccurrence(monthDay){
    // monthDay format "MM-DD"
    const [month, day] = monthDay.split('-').map(Number);
    const now = new Date();
    let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);
    if (target < now){
      target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0);
    }
    return target;
  }

  function setupCountdown(containerId){
    const el = document.getElementById(containerId);
    if (!el) return;
    const target = nextOccurrence(el.dataset.target);
    const daysEl = el.querySelector('[data-days]');
    const hoursEl = el.querySelector('[data-hours]');
    const minutesEl = el.querySelector('[data-minutes]');
    const secondsEl = el.querySelector('[data-seconds]');

    function tick(){
      const now = new Date();
      let diff = target - now;
      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }
  setupCountdown('birthdayCountdown');
  setupCountdown('mdcatCountdown');

  /* ===================== CONFETTI ===================== */
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cctx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeConfettiCanvas(){
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);

  const confettiColors = ['#d4af37', '#b76e79', '#f8f5f2', '#6a4ab0', '#f0d98c'];

  function launchConfetti(){
    confettiPieces = [];
    const count = window.innerWidth < 700 ? 80 : 150;
    for (let i = 0; i < count; i++){
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.5,
        size: Math.random() * 7 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }
    if (!confettiRunning){
      confettiRunning = true;
      animateConfetti();
    }
    setTimeout(() => { confettiPieces = []; }, 5200);
  }

  function animateConfetti(){
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate((p.rotation * Math.PI) / 180);
      cctx.fillStyle = p.color;
      if (p.shape === 'circle'){
        cctx.beginPath();
        cctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        cctx.fill();
      } else {
        cctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      cctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 30);

    if (confettiPieces.length > 0){
      requestAnimationFrame(animateConfetti);
    } else {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiRunning = false;
    }
  }

  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn) confettiBtn.addEventListener('click', launchConfetti);

  // Subtle auto-confetti burst once when the final section first comes into view
  const finalSection = document.getElementById('final');
  if (finalSection){
    const finalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          launchConfetti();
          finalObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    finalObserver.observe(finalSection);
  }

});
    
/* =========================================================
   PREMIUM PACK 1 — LUXURY CINEMATIC LOADER
   Paste at END of script.js · Runs as independent IIFE
   ========================================================= */
(function luxCinemaLoader() {
  'use strict';

  const pl = document.getElementById('preloader');
  if (!pl) return; // safety guard — will not throw if preloader is absent

  /* ---- 1. Inject all new elements into existing preloader ---- */

  // Golden outer edge ring
  const edgeRing = document.createElement('div');
  edgeRing.className = 'lux-edge-ring';
  pl.appendChild(edgeRing);

  // Ambient glow behind emblem
  const glow = document.createElement('div');
  glow.className = 'lux-emblem-glow';
  pl.appendChild(glow);

  // Golden light sweep
  const sweep = document.createElement('div');
  sweep.className = 'lux-light-sweep';
  pl.appendChild(sweep);

  // Decorative lines
  const lineL = document.createElement('div');
  lineL.className = 'lux-line-l';
  pl.appendChild(lineL);

  const lineR = document.createElement('div');
  lineR.className = 'lux-line-r';
  pl.appendChild(lineR);

  // Loading counter
  const counter = document.createElement('div');
  counter.className = 'lux-counter';
  counter.textContent = '0%';
  pl.appendChild(counter);

  // Name tagline
  const tagline = document.createElement('p');
  tagline.className = 'lux-tagline';
  tagline.textContent = 'Dr Laiba Siddique · 7 July';
  pl.appendChild(tagline);

  // Cinematic top bar (added LAST so it sits visually on top)
  const barTop = document.createElement('div');
  barTop.className = 'lux-bar-top';
  pl.appendChild(barTop);

  // Cinematic bottom bar
  const barBottom = document.createElement('div');
  barBottom.className = 'lux-bar-bottom';
  pl.appendChild(barBottom);

  /* ---- 2. Enhance existing .preloader-inner logo entry ---- */
  const inner = pl.querySelector('.preloader-inner');
  if (inner) inner.classList.add('lux-enhanced');

  /* ---- 3. Animate loading counter 0 → 100 ----
     Reaches 100 in ~2.4s average, aligned with load timing */
  let count = 0;
  const counterInterval = setInterval(function () {
    // Acceleration curve: fast start, slows near 95, jumps to 100 on load
    const step = count < 60 ? Math.floor(Math.random() * 9) + 5
               : count < 85 ? Math.floor(Math.random() * 5) + 2
               : count < 95 ? 1
               : 0; // hold at 95 until page actually loads

    count = Math.min(count + step, 95);
    counter.textContent = count + '%';

    if (count >= 95) clearInterval(counterInterval);
  }, 55);

  /* ---- 4. Watch for existing .loaded class to snap counter to 100 ----
     Uses MutationObserver — purely reactive, never interferes with existing logic */
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        if (pl.classList.contains('loaded')) {
          clearInterval(counterInterval);
          counter.textContent = '100%';
          observer.disconnect();
        }
      }
    });
  });
  observer.observe(pl, { attributes: true });

})(); // end luxCinemaLoader IIFE

/* =========================================================
   END OF PREMIUM PACK 1
   ========================================================= */