/* ============================================
   SCUDERIA OVERDRIVE — SCRIPT.JS
   ============================================ */

"use strict";

/* ============================================
   LOADER
   ============================================ */
(function initLoader() {
  const loader     = document.getElementById("loader");
  const loaderFill = document.getElementById("loaderFill");
  const loaderText = document.getElementById("loaderText");

  const steps = [
    { pct: 20,  text: "CARREGANDO RECURSOS..." },
    { pct: 45,  text: "INICIALIZANDO MOTOR..." },
    { pct: 70,  text: "PREPARANDO OS BOXES..." },
    { pct: 90,  text: "SCUDERIA PRONTA..." },
    { pct: 100, text: "VELOCIDADE MÁXIMA!" },
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(interval);
      setTimeout(() => loader.classList.add("hidden"), 400);
      return;
    }
    loaderFill.style.width = steps[i].pct + "%";
    loaderText.textContent  = steps[i].text;
    i++;
  }, 350);
})();

/* ============================================
   CURSOR CUSTOMIZADO
   ============================================ */
(function initCursor() {
  const cursor      = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursorTrail");

  if (!cursor || !cursorTrail) return;

  let trailX = 0, trailY = 0;
  let mouseX = 0, mouseY = 0;
  let raf;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top  = trailY + "px";
    raf = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Efeito hover em elementos clicáveis
  const hoverEls = document.querySelectorAll(
    "a, button, .piloto-card, .funcao-card, input, select, textarea, .nav-hamburger"
  );

  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
})();

/* ============================================
   NAVEGAÇÃO — SCROLL + MOBILE MENU
   ============================================ */
(function initNav() {
  const nav       = document.getElementById("nav");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Scroll — adiciona classe scrolled
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Fechar ao clicar fora
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
})();

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
(function initReveal() {
  const elements = document.querySelectorAll(
    ".piloto-card, .funcao-card, .carro-item, .stat-item, " +
    ".parceiro-card, .value-item, .sobre-text, .sobre-values, " +
    ".banco-text, .banco-card, .ingresso-intro"
  );

  elements.forEach((el, i) => {
    el.classList.add("reveal");
    const delay = (i % 4) * 0.1;
    el.style.transitionDelay = delay + "s";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ============================================
   CONTADORES DE ESTATÍSTICAS
   ============================================ */
(function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-target]");

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ============================================
   FORMULÁRIO DE INGRESSO
   ============================================ */
(function initForm() {
  const form    = document.getElementById("ingressoForm");
  const success = document.getElementById("formSuccess");

  if (!form) return;

  // ⬇️ COLE AQUI A URL DO SEU WEBHOOK DO DISCORD
  const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1490762391363911912/kuQaF9PRAnnxDnCuS4kiPL-BlCzz9n8-rKJ4vBOFzuprwqDkJcb5CePEzlRVUlG274qQ";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    btn.textContent = "ENVIANDO...";
    btn.disabled = true;

    // Coleta os dados do formulário
    const nome        = document.getElementById("nome").value;
    const discord     = document.getElementById("discord").value;
    const funcao      = document.getElementById("funcao").value;
    const experiencia = document.getElementById("experiencia").value;
    const motivacao   = document.getElementById("motivacao").value;

    // Monta a mensagem no formato embed do Discord
    const payload = {
      username: "Scuderia Overdrive",
      avatar_url: "https://i.imgur.com/AfFp7pu.png", // opcional: troque pelo logo da equipe
      embeds: [
        {
          title: "🏎️ Nova Candidatura Recebida!",
          color: 0xFFFFFF, // branco
          fields: [
            {
              name: "👤 Nome / Nick no RP",
              value: nome || "—",
              inline: true,
            },
            {
              name: "💬 Discord",
              value: discord || "—",
              inline: true,
            },
            {
              name: "🔧 Função de Interesse",
              value: funcao || "—",
              inline: false,
            },
            {
              name: "📋 Experiência",
              value: experiencia || "—",
              inline: false,
            },
            {
              name: "💡 Motivação",
              value: motivacao || "—",
              inline: false,
            },
          ],
          footer: {
            text: "Scuderia Overdrive · Primeira Equipe de F1 do FiveM",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Sucesso
        form.style.display = "none";
        success.classList.add("visible");
        success.style.display = "block";
      } else {
        throw new Error("Erro ao enviar");
      }
    } catch (err) {
      btn.textContent = "ERRO — TENTE NOVAMENTE";
      btn.disabled = false;
      console.error("Erro no webhook:", err);
    }
  });
})();

/* ============================================
   SMOOTH SCROLL — LINKS INTERNOS
   ============================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById("nav").offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

/* ============================================
   EFEITO PARALLAX SUAVE NO HERO
   ============================================ */
(function initParallax() {
  const heroGrid = document.querySelector(".hero-grid");
  const heroNumber = document.querySelector(".hero-number");

  if (!heroGrid) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const rate = scrollY * 0.3;
    if (heroGrid) heroGrid.style.transform =
      `perspective(600px) rotateX(20deg) translateY(calc(${rate}px))`;
    if (heroNumber) heroNumber.style.transform = `translateY(${scrollY * 0.2}px)`;
  }, { passive: true });
})();

/* ============================================
   EFEITO HOVER NOS CARDS DE PILOTO
   ============================================ */
(function initPilotoHover() {
  const cards = document.querySelectorAll(".piloto-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y     = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ============================================
   EFEITO HOVER NOS CARDS DO BANCO
   ============================================ */
(function initBancoCard() {
  const card = document.querySelector(".banco-card");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
    const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
    const inner = card.querySelector(".banco-card-inner");
    if (inner) inner.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    const inner = card.querySelector(".banco-card-inner");
    if (inner) inner.style.transform = "";
  });
})();

/* ============================================
   HIGHLIGHT ACTIVE NAV LINK NO SCROLL
   ============================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollY = window.scrollY + 120;

    sections.forEach((sec) => {
      if (scrollY >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
})();
