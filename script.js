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
