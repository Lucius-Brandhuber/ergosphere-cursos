/* ===========================================================
   Ergosphere — lógica compartilhada de todas as páginas.
   Carregar depois de catalog.js e antes dos scripts da página.
   =========================================================== */

const SITE_ROOT = (() => {
  const s = document.currentScript;
  return s ? s.src.replace(/site\.js.*$/, "") : "./";
})();

const brl = v => "R$ " + v.toFixed(2).replace(".", ",");

/* ---------- ícones (stroke: currentColor) ---------- */
const ICONS = {
  search:   '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  cart:     '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.4 12.2a1.8 1.8 0 0 0 1.8 1.4h7.9a1.8 1.8 0 0 0 1.8-1.4L21 7H6"/>',
  book:     '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
  play:     '<path d="M7 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  folder:   '<path d="M3 6a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  clip:     '<path d="M21 12.2l-8.4 8.4a5.3 5.3 0 0 1-7.5-7.5l9.2-9.2a3.5 3.5 0 0 1 5 5l-8.8 8.8a1.8 1.8 0 0 1-2.5-2.5l8-8"/>',
  crown:    '<path d="M4 16.5L5.2 7.8l4.6 3.9L12 5.5l2.2 6.2 4.6-3.9L20 16.5z"/><path d="M5.5 19.5h13"/>',
  bulb:     '<path d="M9.3 18h5.4M10.3 21h3.4"/><path d="M12 3a6 6 0 0 1 3.7 10.7c-.7.6-1.2 1.4-1.2 2.3H9.5c0-.9-.5-1.7-1.2-2.3A6 6 0 0 1 12 3z"/>',
  doc:      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  sliders:  '<path d="M5 21v-6M5 11V3M12 21v-9M12 8V3M19 21v-4M19 13V3"/><path d="M2.5 15h5M9.5 8h5M16.5 17h5"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.8 2.8 0 0 1 5.5.7c0 1.8-2.7 2.2-2.7 3.7"/><path d="M12 17.2v.1"/>',
  grad:     '<path d="M12 4L2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/>',
  zap:      '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  shield:   '<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"/>',
  lock:     '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  chart:    '<path d="M3 21h18"/><path d="M5.5 16.5l4.5-5.5 3.5 3.5 5.5-7"/>',
  grid:     '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  heart:    '<path d="M12 20.5S4 15.4 4 9.9A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 8 2.6c0 5.5-8 10.6-8 10.6z"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4.5 20h15"/>',
  refresh:  '<path d="M20 8A8.2 8.2 0 0 0 5.7 6.3L4 8M4 3v5h5"/><path d="M4 16a8.2 8.2 0 0 0 14.3 1.7L20 16m0 5v-5h-5"/>',
  support:  '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.8"/><rect x="17" y="13" width="4" height="6" rx="1.8"/>',
  trend:    '<path d="M4 17l6-6 3.5 3.5L20 8"/><path d="M14.5 8H20v5.5"/>',
  star:     '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.7l5.9-.8z"/>',
  menu:     '<path d="M4 7h16M4 12h16M4 17h16"/>',
};

function applyIcons(root) {
  (root || document).querySelectorAll("[data-ic]").forEach(el => {
    const paths = ICONS[el.dataset.ic];
    if (paths) el.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  });
}

/* ---------- FAQ compartilhado ---------- */
function renderFaq(faqs, el) {
  el.innerHTML = faqs.map((f, i) => `
    <div class="faq" data-f="${i}">
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
        <span class="n">${String(i + 1).padStart(2, "0")}</span>
        <span class="t">${f.q}</span>
        <span class="c">⌄</span>
      </div>
      <div class="faq-a"><div><div class="pad">${f.a}</div></div></div>
    </div>
  `).join("");
  el.querySelectorAll(".faq").forEach(faq => {
    const q = faq.querySelector(".faq-q");
    pressable(q, () => {
      const open = faq.classList.toggle("open");
      q.setAttribute("aria-expanded", open);
    });
  });
}

/* ---------- clique + teclado (Enter/Espaço) ---------- */
function pressable(el, fn) {
  el.addEventListener("click", fn);
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(e); }
  });
}

/* ---------- entrada com stagger ----------
   Sem IntersectionObserver: o observer pode nunca entregar notificações
   (aba em segundo plano, motores travados) e o conteúdo sumiria. Aqui a
   checagem é por scroll + getBoundingClientRect, com a primeira passada
   síncrona. O stagger é feito em JS, não com animation-delay. */
function initReveal() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pendentes = [...document.querySelectorAll(
    ".hero > *, .grid .card, .plan, .incl-card, .panel, .tabs, .buy, .closing"
  )].filter(el => !el.closest(".tabpane")); // aba inativa é display:none: nunca
                                            // entraria na tela e ficaria oculta
                                            // para sempre (a aba já tem fadeUp)
  pendentes.forEach(el => el.classList.add("oculto"));

  const checar = () => {
    const naTela = pendentes.filter(el => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight - 40 && r.bottom > 0;
    });
    naTela.forEach((el, i) => {
      pendentes.splice(pendentes.indexOf(el), 1);
      setTimeout(() => {
        el.classList.remove("oculto");  // volta ao opacity padrão (1)
        el.classList.add("revelar");    // a animação faz o fade + slide
      }, i * 70);
    });
    if (!pendentes.length) {
      removeEventListener("scroll", agendar);
      removeEventListener("resize", agendar);
    }
  };

  // throttle por tempo com trailing edge, chamando checar() direto — sem
  // requestAnimationFrame, que pode não rodar e deixaria tudo abaixo da
  // dobra invisível. O trailing garante a checagem após o último scroll.
  let ultimo = 0, timer = null;
  const agendar = () => {
    const resta = 80 - (Date.now() - ultimo);
    if (resta <= 0) {
      ultimo = Date.now();
      checar();
    } else if (!timer) {
      timer = setTimeout(() => {
        timer = null; ultimo = Date.now(); checar();
      }, resta);
    }
  };

  addEventListener("scroll", agendar, { passive: true });
  addEventListener("resize", agendar);
  checar();
}

/* ---------- nav: link ativo, scrolled, hamburger, ⌘K ---------- */
function initNav() {
  const rootPath = new URL(SITE_ROOT, location.href).pathname;
  const secao = location.pathname.includes("/assinar") ? "assinar" : "cursos";

  const marcar = a => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const p = new URL(href, location.href).pathname.replace(/index\.html$/, "");
    const on = (secao === "assinar" && p.includes("/assinar")) ||
               (secao === "cursos" && p === rootPath);
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page");
  };

  document.querySelectorAll(".nav-links a").forEach(marcar);

  const wrap = document.querySelector(".nav-wrap");
  if (wrap) {
    const onScroll = () => wrap.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // hamburger + menu mobile (injetados para manter fonte única)
  const nav = document.querySelector(".nav");
  if (nav && wrap) {
    const burger = document.createElement("button");
    burger.className = "nav-burger";
    burger.setAttribute("aria-label", "Abrir menu");
    burger.setAttribute("aria-expanded", "false");
    burger.innerHTML = '<span class="ic" data-ic="menu"></span>';
    nav.querySelector(".nav-right").prepend(burger);

    const menu = document.createElement("div");
    menu.className = "nav-menu";
    menu.innerHTML = `<div>
      <a href="${SITE_ROOT}index.html"><span class="ic" data-ic="book"></span> Cursos</a>
      <a href="#"><span class="ic" data-ic="question"></span> Pedir Curso</a>
      <a href="${SITE_ROOT}assinar/"><span class="ic" data-ic="crown"></span> Assinar</a>
    </div>`;
    wrap.appendChild(menu);
    menu.querySelectorAll("a").forEach(marcar);

    burger.addEventListener("click", e => {
      e.stopPropagation();
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    document.addEventListener("click", e => {
      if (!menu.contains(e.target)) {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // busca: ⌘K / Ctrl+K e clique na busca da nav
  const focarBusca = () => {
    const inp = document.getElementById("busca");
    if (inp) { inp.focus(); inp.scrollIntoView({ block: "center" }); }
    else location.href = SITE_ROOT + "index.html#buscar";
  };
  addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); focarBusca();
    }
  });
  const mini = document.querySelector(".search-mini");
  if (mini) { mini.setAttribute("tabindex", "0"); pressable(mini, focarBusca); }
}

/* ---------- footer ---------- */
function initFooter() {
  const R = SITE_ROOT;
  const cursos = (window.CATALOGO_ORDEM || [])
    .map(s => `<a href="${R}curso/${s}/">${CATALOGO[s].t}</a>`).join("");
  const el = document.createElement("footer");
  el.className = "footer";
  el.innerHTML = `
    <div class="footer-in">
      <div>
        <a href="${R}index.html" class="brand">
          <span class="ring"></span>
          <span class="wordmark">Ergo<b>sphere</b></span>
        </a>
        <p class="tagline">Cursos de marketing digital com acesso vitalício, atualizações constantes e aprovação imediata via PIX.</p>
      </div>
      <div class="f-col">
        <div class="f-title">Navegação</div>
        <a href="${R}index.html">Cursos</a>
        <a href="${R}assinar/">Assinar</a>
        <a href="#">Pedir Curso</a>
      </div>
      <div class="f-col">
        <div class="f-title">Cursos</div>
        ${cursos}
      </div>
    </div>
    <div class="footer-base">
      <div class="footer-base-in">
        <span>© 2026 Ergosphere. Todos os direitos reservados.</span>
        <span class="safe"><span class="ic" data-ic="lock"></span> Compra 100% segura · <span class="ic" data-ic="zap"></span> Acesso imediato</span>
      </div>
    </div>`;
  document.body.appendChild(el);
}

/* ---------- links ainda sem destino ---------- */
function initDeadLinks() {
  document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener("click", e => e.preventDefault());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFooter();
  initDeadLinks();
  applyIcons();
  initReveal();
});
