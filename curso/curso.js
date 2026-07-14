/* ===========================================================
   Ergosphere — lógica compartilhada das páginas de curso.
   Cada página define antes: SLUG, modulos, bumps (slug + d), faqs.
   Preços e nomes vêm de catalog.js; helpers de site.js.
   =========================================================== */

const CURSO = CATALOGO[SLUG];
const PRECO_CURSO = CURSO.preco;

/* ---------- preço da caixa de compra (fonte: catálogo) ---------- */
(() => {
  const el = document.querySelector(".amount");
  if (!el) return;
  const [int, cents] = CURSO.preco.toFixed(2).split(".");
  el.innerHTML = `<span class="cur">R$</span><span class="int">${int}</span><span class="cents">,${cents}</span>`;
})();

/* ---------- pills de estatísticas (fonte: catálogo) ---------- */
(() => {
  const el = document.getElementById("stats");
  if (!el) return;
  const n = modulos.length;
  el.innerHTML = `
    <span class="pill"><span class="ic" data-ic="folder"></span> <b>${n}</b> módulo${n > 1 ? "s" : ""}</span>
    <span class="pill"><span class="ic" data-ic="play"></span> <b>${CURSO.aulas}</b> aulas</span>
    <span class="pill"><span class="ic" data-ic="clock"></span> <b>${CURSO.dur}</b></span>
    ${CURSO.arq ? `<span class="pill"><span class="ic" data-ic="clip"></span> <b>${CURSO.arq}</b> arquivos</span>` : ""}`;
})();

/* ---------- módulos ---------- */
document.getElementById("mods").innerHTML = modulos.map((m, i) => `
  <div class="mod" data-i="${i}" role="button" tabindex="0" aria-expanded="false">
    <div class="num">${String(i + 1).padStart(2, "0")}</div>
    <div>
      <div class="name">${i + 1}. ${m.n}</div>
      <div class="meta">
        <span><span class="ic" data-ic="play"></span> ${m.aulas}</span> <span>•</span>
        <span><span class="ic" data-ic="clock"></span> ${m.dur}</span>
        ${m.arq ? `<span>•</span> <span><span class="ic" data-ic="clip"></span> ${m.arq} arquivos</span>` : ""}
      </div>
    </div>
    <div class="chev">⌄</div>
  </div>
  <div class="mod-body" data-b="${i}">
    <div><div class="pad">Conteúdo do módulo disponível após a compra.</div></div>
  </div>
`).join("");

document.querySelectorAll(".mod").forEach(el => {
  pressable(el, () => {
    const body = document.querySelector(`.mod-body[data-b="${el.dataset.i}"]`);
    const open = el.classList.toggle("open");
    body.classList.toggle("open", open);
    el.setAttribute("aria-expanded", open);
  });
});

/* ---------- abas ---------- */
const tablist = document.querySelector(".tabs");
if (tablist) tablist.setAttribute("role", "tablist");
document.querySelectorAll(".tab").forEach(t => {
  t.setAttribute("role", "tab");
  t.setAttribute("tabindex", "0");
  t.setAttribute("aria-selected", t.classList.contains("active"));
  pressable(t, () => {
    document.querySelectorAll(".tab").forEach(x => {
      x.classList.remove("active");
      x.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".tabpane").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    t.setAttribute("aria-selected", "true");
    document.getElementById(t.dataset.tab).classList.add("active");
  });
});

/* ---------- Compre Junto ---------- */
const bumpsData = bumps.map(b => ({
  ...b,
  n: CATALOGO[b.slug].t,
  preco: CATALOGO[b.slug].preco,
}));

document.getElementById("bumps").innerHTML = bumpsData.map((b, i) => `
  <div class="bump" data-i="${i}" role="checkbox" tabindex="0" aria-checked="false"
       aria-label="Adicionar ${b.n} por ${brl(b.preco)}">
    <div class="box"></div>
    <div class="mini">
      <img src="../${b.slug}/capa.png" alt="${b.n}" loading="lazy" decoding="async">
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
`).join("");

// capa ausente → mostra o placeholder do disco de acreção
document.querySelectorAll(".bump .mini img").forEach(img => {
  const marcar = () => img.parentNode.classList.add("noimg");
  img.addEventListener("error", marcar);
  if (img.complete && img.naturalWidth === 0) marcar();
});

const totalEl = document.getElementById("total");
totalEl.textContent = brl(PRECO_CURSO);

function recalc() {
  let t = PRECO_CURSO;
  document.querySelectorAll(".bump.on").forEach(el => { t += bumpsData[el.dataset.i].preco; });
  totalEl.textContent = brl(t);
  totalEl.classList.remove("pop");
  void totalEl.offsetWidth; // reinicia a animação
  totalEl.classList.add("pop");
}
document.querySelectorAll(".bump").forEach(el => {
  pressable(el, () => {
    const on = el.classList.toggle("on");
    el.setAttribute("aria-checked", on);
    recalc();
  });
});

/* ---------- FAQ ---------- */
renderFaq(faqs, document.getElementById("faqs"));

/* ---------- barra de compra fixa (mobile) ---------- */
(() => {
  const bar = document.createElement("div");
  bar.className = "buybar";
  bar.innerHTML = `
    <div class="p"><small>${CURSO.t}</small>${brl(CURSO.preco)}</div>
    <a href="#" class="btn-gold shine-auto"><span class="ic" data-ic="cart"></span> Comprar Agora</a>`;
  document.body.appendChild(bar);
  document.body.classList.add("has-buybar");
})();
