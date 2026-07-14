/* ===========================================================
   Ergosphere — lógica compartilhada das páginas de curso.
   Cada página define antes: PRECO_CURSO, modulos, bumps, faqs.
   =========================================================== */

const brl = v => "R$ " + v.toFixed(2).replace(".", ",");

/* ---------- módulos ---------- */
document.getElementById('mods').innerHTML = modulos.map((m, i) => `
  <div class="mod" data-i="${i}">
    <div class="num">${String(i + 1).padStart(2, '0')}</div>
    <div>
      <div class="name">${i + 1}.${m.n}</div>
      <div class="meta">
        <span>▶ ${m.aulas}</span> <span>•</span> <span>🕐 ${m.dur}</span>
        ${m.arq ? `<span>•</span> <span>📎 ${m.arq}</span>` : ``}
      </div>
    </div>
    <div class="chev">⌄</div>
  </div>
  <div class="mod-body" data-b="${i}">
    Conteúdo do módulo disponível após a compra.
  </div>
`).join('');

document.querySelectorAll('.mod').forEach(el => {
  el.addEventListener('click', () => {
    const body = document.querySelector(`.mod-body[data-b="${el.dataset.i}"]`);
    el.classList.toggle('open');
    body.classList.toggle('open');
  });
});

/* ---------- abas ---------- */
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tabpane').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById(t.dataset.tab).classList.add('active');
  });
});

/* ---------- Compre Junto ---------- */
document.getElementById('bumps').innerHTML = bumps.map((b, i) => `
  <div class="bump" data-i="${i}">
    <div class="box"></div>
    <div class="mini">
      <img src="../${b.slug}/capa.png" alt="${b.n}">
      <span class="ph"></span>
    </div>
    <div class="info">
      <div class="n">${b.n}</div>
      <div class="d">${b.d}</div>
    </div>
    <div class="pr">
      <div class="v">${brl(b.preco)}</div>
      <div class="l">à vista</div>
    </div>
  </div>
`).join('');

// capa ausente → mostra o placeholder do disco de acreção
document.querySelectorAll('.bump .mini img').forEach(img => {
  const marcar = () => img.parentNode.classList.add('noimg');
  img.addEventListener('error', marcar);
  if (img.complete && img.naturalWidth === 0) marcar();
});

const totalEl = document.getElementById('total');
function recalc() {
  let t = PRECO_CURSO;
  document.querySelectorAll('.bump.on').forEach(el => { t += bumps[el.dataset.i].preco; });
  totalEl.textContent = brl(t);
}
document.querySelectorAll('.bump').forEach(el => {
  el.addEventListener('click', () => { el.classList.toggle('on'); recalc(); });
});

/* ---------- FAQ ---------- */
document.getElementById('faqs').innerHTML = faqs.map((f, i) => `
  <div class="faq" data-f="${i}">
    <div class="faq-q">
      <span class="n">${String(i + 1).padStart(2, '0')}</span>
      <span class="t">${f.q}</span>
      <span class="c">⌄</span>
    </div>
    <div class="faq-a">${f.a}</div>
  </div>
`).join('');

document.querySelectorAll('.faq').forEach(el => {
  el.querySelector('.faq-q').addEventListener('click', () => el.classList.toggle('open'));
});
