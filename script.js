const lines = [
    { t: '> booting nut.exe ...', d: 0 },
    { t: '> loading modules: design, code, gaming', d: 380 },
    { t: '> connecting to R.E.P.O., VALORANT, PUBG servers', d: 760 },
    { t: '> <span class="ok">all systems online</span>', d: 1140 }
  ];
  const boot = document.getElementById('bootLog');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  lines.forEach((l, i) => {
    const div = document.createElement('div');
    div.className = 'boot-line mono';
    div.innerHTML = (i === lines.length - 1) ? l.t : l.t + (i < lines.length - 1 ? '' : '');
    div.style.animationDelay = prefersReduced ? '0s' : (l.d / 1000) + 's';
    boot.appendChild(div);
  });
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  boot.appendChild(cursor);


  /* ---------- EFFECTS ---------- */
  const fine = matchMedia('(pointer: fine)').matches;
  const xh = document.getElementById('xh');
  const tg = document.getElementById('tg');
  if (!fine) document.body.classList.remove('aim');
  addEventListener('pointermove', e => { xh.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
  addEventListener('pointerdown', e => {
    if (!document.body.classList.contains('aim')) return;
    xh.classList.add('fire'); setTimeout(() => xh.classList.remove('fire'), 90);
    const hit = document.createElement('div');
    hit.className = 'hit'; hit.style.left = e.clientX + 'px'; hit.style.top = e.clientY + 'px';
    document.body.appendChild(hit); setTimeout(() => hit.remove(), 450);
  });
  tg.addEventListener('click', () => {
    const on = document.body.classList.toggle('aim');
    tg.textContent = 'crosshair: ' + (on ? 'on' : 'off');
  });

  const nm = document.getElementById('nm');
  const glitch = () => { if (prefersReduced) return; nm.classList.remove('glitch'); void nm.offsetWidth; nm.classList.add('glitch'); };
  nm.addEventListener('pointerenter', glitch);
  setInterval(glitch, 6000);

  document.querySelectorAll('.pf-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', x * 100 + '%'); card.style.setProperty('--my', y * 100 + '%');
      if (!prefersReduced) { card.style.setProperty('--ry', (x - .5) * 10 + 'deg'); card.style.setProperty('--rx', (.5 - y) * 10 + 'deg'); }
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });

  const t0 = Date.now(), up = document.getElementById('up');
  setInterval(() => {
    const s = Math.floor((Date.now() - t0) / 1000), p = n => String(n).padStart(2, '0');
    up.textContent = `uptime ${p(s / 3600 | 0)}:${p(s / 60 % 60 | 0)}:${p(s % 60)}`;
  }, 1000);

  /* aim trainer */
  const arena = document.getElementById('arena'), aMsg = document.getElementById('aMsg'), aTitle = document.getElementById('aTitle');
  const el = id => document.getElementById(id);
  const DUR = 20;
  let running = false, hits = 0, miss = 0, rts = [], left = DUR, timer = null, spawnAt = 0, best = 0;
  try { best = +localStorage.getItem('nutAimBest') || 0; } catch (e) {}
  el('aBest').textContent = best;
  function stats() {
    el('aTime').textContent = left.toFixed(1);
    el('aHits').textContent = hits;
    el('aAcc').textContent = hits + miss ? Math.round(hits / (hits + miss) * 100) + '%' : '--';
    el('aRt').textContent = rts.length ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : '--';
  }
  function spawn() {
    const old = arena.querySelector('.tgt'); if (old) old.remove();
    const t = document.createElement('button');
    t.className = 'tgt'; t.type = 'button'; t.setAttribute('aria-label', 'target');
    t.style.left = Math.random() * (arena.clientWidth - 46) + 'px';
    t.style.top = Math.random() * (arena.clientHeight - 46) + 'px';
    arena.appendChild(t); spawnAt = performance.now();
  }
  function finish() {
    running = false; clearInterval(timer);
    const old = arena.querySelector('.tgt'); if (old) old.remove();
    left = 0; stats();
    if (hits > best) { best = hits; el('aBest').textContent = best; try { localStorage.setItem('nutAimBest', best); } catch (e) {} }
    const rt = rts.length ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : 0;
    aTitle.innerHTML = 'จบรอบ! ยิงโดน <b>' + hits + '</b> เป้า' + (rt ? ' เฉลี่ย ' + rt + ' ms' : '');
    el('aStart').textContent = 'เล่นอีกครั้ง';
    aMsg.classList.remove('hide');
  }
  el('aStart').addEventListener('click', () => {
    hits = 0; miss = 0; rts = []; left = DUR; stats();
    aMsg.classList.add('hide'); running = true; spawn();
    timer = setInterval(() => { left = Math.max(0, left - 0.1); stats(); if (left <= 0) finish(); }, 100);
  });
  arena.addEventListener('pointerdown', e => {
    if (!running) return;
    if (e.target.closest('.tgt')) { hits++; rts.push(performance.now() - spawnAt); spawn(); } else { miss++; }
    stats();
  });


  /* donate */
  const tiers = document.querySelectorAll('.tier'), thanks = document.getElementById('thanks');
  tiers.forEach(t => t.addEventListener('click', () => {
    tiers.forEach(x => x.classList.remove('on')); t.classList.add('on');
    thanks.textContent = '> ขอบคุณสำหรับ ' + t.dataset.amt + ' บาท (' + t.querySelector('small').textContent + ') สแกน QR ได้เลย';
  }));
  const copyBtn = document.getElementById('copyPp');
  copyBtn.addEventListener('click', async () => {
    const txt = document.getElementById('pp').textContent.replace(/-/g, '');
    try { await navigator.clipboard.writeText(txt); copyBtn.textContent = 'คัดลอกแล้ว'; }
    catch (e) { copyBtn.textContent = 'คัดลอกไม่ได้ ลองกดค้างที่เลข'; }
    setTimeout(() => copyBtn.textContent = 'คัดลอกเลขพร้อมเพย์', 2000);
  });
