/* ==========================================================================
   Zentek — shared site script
   Injects the header and footer, handles EN/ES language switching,
   applies the CONFIG links, sends forms to Formspree and runs the mobile menu.
   ========================================================================== */

/* ============================================================
   CONFIG — edit these values once and every page updates.
   If a value is empty, the related button or link is hidden.
   ============================================================ */
const CONFIG = {
    email: "",               // e.g. "sales@zentek.com.gt"
    calendlyUrl: "",         // e.g. "https://calendly.com/zentek/30min"
    clutchUrl: "",           // your public Clutch profile
    clutchReviewUrl: "",     // the "leave a review" link Clutch gives you
    goodfirmsUrl: "",        // your public GoodFirms profile
    goodfirmsReviewUrl: "",  // the "write a review" link GoodFirms gives you
    linkedinUrl: "",         // company LinkedIn page
    ga4Id: ""                // Google Analytics 4 ID, e.g. "G-XXXXXXXXXX" (optional)
};

(function () {
    "use strict";

    const SERVICES = [
        { href: "bilingual-support.html", icon: "headphones", key: "s1.t", en: "Bilingual Technical Support", slug: "bilingual-support" },
        { href: "helpdesk.html", icon: "life-buoy", key: "s2.t", en: "IT Helpdesk / Service Desk", slug: "helpdesk" },
        { href: "infrastructure-management.html", icon: "server", key: "s3.t", en: "Infrastructure Management", slug: "infrastructure-management" },
        { href: "network-monitoring.html", icon: "activity", key: "s4.t", en: "Network Monitoring (NOC)", slug: "network-monitoring" },
        { href: "software-development.html", icon: "code-2", key: "s5.t", en: "Software Development &amp; Maintenance", slug: "software-development" }
    ];
    const COMPANY = [
        { href: "engagement-models.html", key: "nav.models", en: "Engagement models" },
        { href: "how-we-work.html", key: "nav.process", en: "How we work" },
        { href: "why-guatemala.html", key: "nav.nearshore", en: "Why Guatemala" },
        { href: "reviews.html", key: "nav.reviews", en: "Client reviews" }
    ];

    /* ------------------- Shared Spanish text ------------------- */
    const SHARED_ES = {
        "nav.home": "Inicio", "nav.services": "Servicios", "nav.company": "Empresa",
        "nav.models": "Modelos de contratación", "nav.process": "Cómo trabajamos", "nav.nearshore": "Por qué Guatemala",
        "nav.reviews": "Reseñas de clientes", "nav.contact": "Contacto", "nav.cta": "Pedir propuesta", "nav.all": "Ver todos los servicios",
        "s1.t": "Soporte Técnico Bilingüe", "s2.t": "Mesa de Ayuda (Helpdesk)", "s3.t": "Administración de Infraestructura",
        "s4.t": "Monitoreo de Redes (NOC)", "s5.t": "Desarrollo y Mantenimiento de Software",
        "pillar.bpo": "BPO · Tercerización de procesos", "pillar.ito": "ITO · Outsourcing de TI",
        "cta.more": "Ver detalles", "cta.call": "Agendar llamada de 30 min",
        "cta.band.t": "¿Listo para ver cómo sería su equipo?",
        "cta.band.d": "Cuéntenos qué necesita. Recibirá una propuesta con alcance, SLAs y precio en 48 horas.",
        "h.included": "Qué incluye", "h.options": "Opciones", "h.tools": "Herramientas con las que trabajamos",
        "h.kpis": "Qué medimos", "h.kpis.note": "Las metas se acuerdan en su SLA y se reportan cada mes.",
        "h.ideal": "Ideal para", "h.faq": "Preguntas frecuentes", "h.related": "Servicios relacionados",
        "f.name": "Nombre completo", "f.company": "Empresa", "f.email": "Correo corporativo", "f.country": "País",
        "f.services": "Servicios de interés",
        "f.size0": "Tamaño estimado del equipo", "f.size1": "1–2 personas", "f.size2": "3–5 personas",
        "f.size3": "6–15 personas", "f.size4": "Más de 15", "f.size5": "Aún no lo sé",
        "f.msg": "¿Qué le gustaría tercerizar? Volúmenes, horarios, herramientas…",
        "f.send": "Solicitar propuesta", "f.privacy": "Solo usaremos sus datos para responder a esta solicitud. Vea nuestra <a href=\"privacy.html\" class=\"underline hover:text-blue-400\">política de privacidad</a>.",
        "form.sending": "Enviando…",
        "form.ok": "¡Gracias! Recibimos su solicitud y le responderemos en un día hábil.",
        "form.err": "Algo salió mal. Intente de nuevo o escríbanos directamente por correo.",
        "ft.about": "Soporte bilingüe y outsourcing de TI desde Guatemala para empresas de EE. UU. y Latinoamérica.",
        "ft.services": "Servicios", "ft.company": "Empresa", "ft.contact": "Contacto", "ft.privacy": "Política de privacidad",
        "ft.hours": "Lun–Vie, 8:00–18:00 (hora de Guatemala)", "ft.rights": "Todos los derechos reservados.",
        "live.new": "Nuevo", "live.progress": "En curso", "live.resolved": "Resuelto",
        "live.open": "Oficina en Guatemala abierta ahora", "live.closed": "Oficina cerrada · abrimos a las 8:00 (hora de Guatemala)",
        "tz.cov": "{n} de 9 horas", "tz.gt": "Guatemala (nearshore)", "tz.mnl": "Manila (offshore)", "tz.blr": "Bangalore (offshore)",
        "tz.your": "Su jornada 8:00–17:00", "tz.axis": "Hora en {city}",
        "tz.legend.both": "Cubierta por el turno de día del equipo", "tz.legend.shift": "Turno de día del equipo fuera de su jornada"
    };
    const EXTRA_EN = {
        "form.sending": "Sending…",
        "form.ok": "Thanks! We received your request and will reply within one business day.",
        "form.err": "Something went wrong. Please try again or email us directly.",
        "live.new": "New", "live.progress": "In progress", "live.resolved": "Resolved",
        "live.open": "Guatemala office open now", "live.closed": "Office closed · opens at 8:00 Guatemala time",
        "tz.cov": "{n} of 9 hours", "tz.gt": "Guatemala (nearshore)", "tz.mnl": "Manila (offshore)", "tz.blr": "Bangalore (offshore)",
        "tz.your": "Your 8:00–17:00 workday", "tz.axis": "Time in {city}",
        "tz.legend.both": "Covered by the team's day shift", "tz.legend.shift": "Team day shift outside your workday"
    };

    const page = (location.pathname.split("/").pop() || "index.html");
    const isCurrent = (href) => href === page;

    /* ------------------- Header ------------------- */
    function headerHTML() {
        const dd = SERVICES.map(s => `
            <a href="${s.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 ${isCurrent(s.href) ? "text-blue-400" : "text-slate-200"}">
                <i data-lucide="${s.icon}" class="w-4 h-4 text-blue-400 shrink-0"></i>
                <span class="normal-case tracking-normal text-sm font-semibold" data-i18n="${s.key}">${s.en}</span>
            </a>`).join("");
        const company = COMPANY.map(c => `
            <a href="${c.href}" class="hover:text-blue-400 transition ${isCurrent(c.href) ? "text-blue-400" : ""}" data-i18n="${c.key}">${c.en}</a>`).join("");
        const mServices = SERVICES.map(s => `<a href="${s.href}" class="flex items-center gap-3 normal-case tracking-normal font-semibold"><i data-lucide="${s.icon}" class="w-4 h-4 text-blue-400"></i><span data-i18n="${s.key}">${s.en}</span></a>`).join("");
        const mCompany = COMPANY.map(c => `<a href="${c.href}" data-i18n="${c.key}">${c.en}</a>`).join("");

        return `
        <div id="scroll-progress"></div>
        <nav class="site-nav fixed top-0 w-full z-50 px-5 md:px-12 lg:px-20 py-4 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <a href="index.html" class="flex items-center gap-2.5 text-xl font-black tracking-tight text-white" aria-label="Zentek home"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="zg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#zg)"/><path d="M18 18h28L22 46h24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>ZENTEK</span></a>
            <div class="hidden xl:flex items-center space-x-8 text-xs font-bold text-slate-300 uppercase tracking-[0.16em]">
                <div class="nav-group relative">
                    <a href="index.html#services" class="flex items-center gap-1 hover:text-blue-400 transition py-2" aria-haspopup="true">
                        <span data-i18n="nav.services">Services</span><i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
                    </a>
                    <div class="nav-dropdown absolute left-0 top-full pt-3">
                        <div class="w-80 rounded-2xl p-2 bg-slate-950 border border-white/10 shadow-2xl">${dd}</div>
                    </div>
                </div>
                ${company}
            </div>
            <div class="flex items-center gap-3">
                <div class="flex rounded-full border border-white/10 overflow-hidden text-[11px] font-black" role="group" aria-label="Language">
                    <button type="button" class="lang-btn px-3 py-1.5" data-lang="en" aria-pressed="true">EN</button>
                    <button type="button" class="lang-btn px-3 py-1.5" data-lang="es" aria-pressed="false">ES</button>
                </div>
                <a href="contact.html" class="hidden sm:inline-block bg-white text-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all" data-i18n="nav.cta">Get a proposal</a>
                <button type="button" id="menu-btn" class="xl:hidden text-slate-300 p-1" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><i data-lucide="menu"></i></button>
            </div>
        </nav>
        <div id="mobile-menu" class="fixed top-[64px] inset-x-0 bottom-0 z-40 flex-col overflow-y-auto bg-slate-950/95 backdrop-blur-xl px-6 py-6 space-y-5 text-sm font-bold uppercase tracking-widest text-slate-200 xl:hidden">
            <span class="text-xs text-slate-500" data-i18n="nav.services">Services</span>
            ${mServices}
            <span class="text-xs text-slate-500 pt-3" data-i18n="nav.company">Company</span>
            ${mCompany}
            <a href="contact.html" class="text-blue-400 pt-3" data-i18n="nav.cta">Get a proposal</a>
        </div>`;
    }

    /* ------------------- Footer ------------------- */
    function footerHTML() {
        const svc = SERVICES.map(s => `<li><a href="${s.href}" class="hover:text-blue-400" data-i18n="${s.key}">${s.en}</a></li>`).join("");
        const comp = COMPANY.map(c => `<li><a href="${c.href}" class="hover:text-blue-400" data-i18n="${c.key}">${c.en}</a></li>`).join("");
        return `
        <footer class="pt-20 pb-10 px-5 md:px-12 lg:px-20 border-t border-white/5 bg-[#020617]">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
                <div class="space-y-5">
                    <div>
                        <a href="index.html" class="flex items-center gap-3 text-2xl font-black tracking-tight text-white"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="zg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#zg2)"/><path d="M18 18h28L22 46h24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>ZENTEK</span></a>
                        <p class="text-slate-400 text-xs font-bold tracking-[0.25em] uppercase mt-2">Nearshore BPO &amp; ITO</p>
                    </div>
                    <p class="text-slate-400 text-sm leading-relaxed max-w-xs" data-i18n="ft.about">Bilingual support and IT outsourcing from Guatemala for companies in the US and Latin America.</p>
                </div>
                <div>
                    <span class="block text-white font-black uppercase tracking-[0.25em] text-xs mb-5" data-i18n="ft.services">Services</span>
                    <ul class="space-y-3 text-sm text-slate-400">${svc}</ul>
                </div>
                <div>
                    <span class="block text-white font-black uppercase tracking-[0.25em] text-xs mb-5" data-i18n="ft.company">Company</span>
                    <ul class="space-y-3 text-sm text-slate-400">${comp}<li><a href="contact.html" class="hover:text-blue-400" data-i18n="nav.contact">Contact</a></li></ul>
                </div>
                <div>
                    <span class="block text-white font-black uppercase tracking-[0.25em] text-xs mb-5" data-i18n="ft.contact">Contact</span>
                    <ul class="space-y-3 text-sm text-slate-400">
                        <li class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-blue-400"></i> Guatemala City, Guatemala</li>
                        <li class="flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-blue-400"></i> <span data-i18n="ft.hours">Mon–Fri, 8:00–18:00 CST</span></li>
                        <li class="flex items-center gap-2" data-config-wrap><i data-lucide="mail" class="w-4 h-4 text-blue-400"></i> <a href="#" data-config="email" data-config-text class="hover:text-blue-400"></a></li>
                        <li class="flex items-center gap-2" data-config-wrap><svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg> <a href="#" data-config="linkedin" class="hover:text-blue-400">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <span>© <span id="year"></span> Zentek Solutions GT. <span data-i18n="ft.rights">All rights reserved.</span></span>
                <a href="privacy.html" class="hover:text-slate-300" data-i18n="ft.privacy">Privacy policy</a>
            </div>
        </footer>
        <a id="call-btn" href="#" class="hidden fixed bottom-6 right-6 z-[60] animate-call items-center bg-blue-600 hover:bg-blue-500 text-white px-5 py-4 rounded-2xl shadow-2xl transition-all duration-300 group">
            <span class="text-sm font-bold mr-3 whitespace-nowrap" data-i18n="cta.call">Book a 30-min call</span>
            <span class="bg-white/20 p-2 rounded-lg group-hover:rotate-12 transition-transform"><i data-lucide="calendar-check-2" class="w-5 h-5"></i></span>
        </a>`;
    }

    const headerSlot = document.getElementById("site-header");
    const footerSlot = document.getElementById("site-footer");
    if (headerSlot) headerSlot.outerHTML = headerHTML();
    if (footerSlot) footerSlot.outerHTML = footerHTML();

    /* ------------------- CONFIG links ------------------- */
    const LINKS = {
        email: CONFIG.email ? "mailto:" + CONFIG.email : "",
        calendly: CONFIG.calendlyUrl,
        clutch: CONFIG.clutchUrl,
        clutchReview: CONFIG.clutchReviewUrl,
        goodfirms: CONFIG.goodfirmsUrl,
        goodfirmsReview: CONFIG.goodfirmsReviewUrl,
        linkedin: CONFIG.linkedinUrl
    };
    function applyConfig() {
        document.querySelectorAll("[data-config]").forEach(el => {
            const v = LINKS[el.dataset.config];
            const wrap = el.closest("[data-config-wrap]") || el;
            if (v) {
                el.href = v;
                if (!v.startsWith("mailto:")) { el.target = "_blank"; el.rel = "noopener"; }
                if (el.hasAttribute("data-config-text")) el.textContent = CONFIG.email;
            } else if (el.dataset.configFallback) {
                el.href = el.dataset.configFallback;
            } else {
                wrap.style.display = "none";
            }
        });
        document.querySelectorAll("[data-config-empty]").forEach(el => {
            if (LINKS[el.dataset.configEmpty]) el.style.display = "none";
        });
        document.querySelectorAll("[data-config-section]").forEach(sec => {
            const keys = sec.dataset.configSection.split(",");
            if (keys.every(k => !LINKS[k.trim()])) sec.style.display = "none";
        });
    }

    /* ------------------- Language ------------------- */
    const ES = Object.assign({}, SHARED_ES, window.PAGE_ES || {});
    const EN = {};
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const k = el.dataset.i18n;
        if (!(k in EN)) EN[k] = el.innerHTML.trim();
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
        EN[el.dataset.i18nPh] = el.getAttribute("placeholder");
    });
    const TITLE = { en: document.title, es: document.body.dataset.titleEs || document.title };
    let LANG = "en";
    const langHooks = [];

    function tr(k) {
        if (LANG === "es" && ES[k] !== undefined) return ES[k];
        if (EN[k] !== undefined) return EN[k];
        return EXTRA_EN[k] !== undefined ? EXTRA_EN[k] : k;
    }

    function setLang(lang) {
        LANG = lang === "es" ? "es" : "en";
        document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = tr(el.dataset.i18n); });
        document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", tr(el.dataset.i18nPh)); });
        document.documentElement.lang = LANG;
        document.title = TITLE[LANG];
        document.querySelectorAll(".lang-btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === LANG)));
        applyConfig();
        langHooks.forEach(fn => fn(LANG));
        try { localStorage.setItem("zentek-lang", LANG); } catch (e) { /* storage unavailable */ }
    }

    function initialLang() {
        const q = new URLSearchParams(location.search).get("lang");
        if (q === "es" || q === "en") return q;
        try { const s = localStorage.getItem("zentek-lang"); if (s === "es" || s === "en") return s; } catch (e) { /* ignore */ }
        return (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";
    }

    document.querySelectorAll(".lang-btn").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
    setLang(initialLang());

    if (CONFIG.calendlyUrl) {
        const cb = document.getElementById("call-btn");
        if (cb && page !== "contact.html") {
            cb.href = CONFIG.calendlyUrl; cb.target = "_blank"; cb.rel = "noopener";
            cb.classList.remove("hidden"); cb.classList.add("flex");
        }
    }

    /* ------------------- Analytics (optional) ------------------- */
    if (CONFIG.ga4Id) {
        const s = document.createElement("script");
        s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CONFIG.ga4Id);
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", CONFIG.ga4Id);
    }

    /* ------------------- Lead forms (Formspree) ------------------- */
    const pre = new URLSearchParams(location.search).get("service");
    if (pre) document.querySelectorAll('input[data-slug="' + CSS.escape(pre) + '"]').forEach(c => { c.checked = true; });

    document.querySelectorAll("form.js-lead-form").forEach(form => {
        const status = document.createElement("p");
        status.className = "form-status text-sm text-center";
        status.setAttribute("role", "status");
        form.appendChild(status);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = form.querySelector('[type="submit"]');
            const data = new FormData(form);
            data.append("language", LANG);
            data.append("page", page);
            btn.disabled = true;
            status.className = "form-status text-sm text-center text-slate-300";
            status.textContent = tr("form.sending");
            try {
                const res = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
                if (!res.ok) throw new Error("HTTP " + res.status);
                form.reset();
                status.className = "form-status text-sm text-center text-emerald-400 font-semibold";
                status.textContent = tr("form.ok");
                if (window.gtag) window.gtag("event", "generate_lead", { page: page });
            } catch (err) {
                status.className = "form-status text-sm text-center text-rose-400 font-semibold";
                status.textContent = tr("form.err");
            } finally {
                btn.disabled = false;
            }
        });
    });

    /* ------------------- Misc ------------------- */
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            const open = mobileMenu.classList.toggle("open");
            menuBtn.setAttribute("aria-expanded", String(open));
            document.body.style.overflow = open ? "hidden" : "";
        });
        mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        }));
    }


    /* ==================================================================
       Interactivity layer
       ================================================================== */
    const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ""));

    /* ---- Header shadow + scroll progress ---- */
    const nav = document.querySelector(".site-nav");
    const bar = document.getElementById("scroll-progress");
    function onScroll() {
        const y = window.scrollY;
        if (nav) nav.classList.toggle("scrolled", y > 12);
        if (bar) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
        }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- Scroll reveal ---- */
    if (!REDUCED && "IntersectionObserver" in window) {
        const targets = document.querySelectorAll(
            "main section h1, main section h2, main section .eyebrow, main section > div > p, main .card-blur, main .card-static, main details, main .rv-item, main table"
        );
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        targets.forEach(el => {
            if (el.closest(".rv")) return;               // parent already animates
            const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
            const i = Math.max(0, sibs.indexOf(el));
            el.style.setProperty("--rv-delay", Math.min(i, 6) * 80 + "ms");
            el.classList.add("rv");
            io.observe(el);
        });
    }

    /* ---- Cursor spotlight on cards ---- */
    document.querySelectorAll(".card-blur, .card-static").forEach(card => {
        card.classList.add("spot");
        card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", (e.clientX - r.left) + "px");
            card.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
    });

    /* ---- Animated network background in hero sections ---- */
    document.querySelectorAll(".hero-gradient").forEach(hero => {
        const cv = document.createElement("canvas");
        cv.className = "hero-canvas";
        cv.setAttribute("aria-hidden", "true");
        hero.prepend(cv);
        const ctx = cv.getContext("2d");
        let W = 0, H = 0, nodes = [], running = false, raf = 0;
        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        function size() {
            W = hero.clientWidth; H = hero.clientHeight;
            cv.width = W * DPR; cv.height = H * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            const n = Math.round(Math.min(70, Math.max(24, (W * H) / 22000)));
            nodes = Array.from({ length: n }, () => ({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.8
            }));
        }
        function draw() {
            ctx.clearRect(0, 0, W, H);
            const LINK = 150;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
                    if (d < LINK) {
                        ctx.strokeStyle = "rgba(96,165,250," + (0.22 * (1 - d / LINK)).toFixed(3) + ")";
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    }
                }
            }
            nodes.forEach(p => {
                ctx.fillStyle = "rgba(147,197,253,0.7)";
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            });
        }
        function step() {
            nodes.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            });
            draw();
            if (running) raf = requestAnimationFrame(step);
        }
        function start() { if (!running && !REDUCED) { running = true; raf = requestAnimationFrame(step); } }
        function stop() { running = false; cancelAnimationFrame(raf); }

        size(); draw();
        let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { size(); draw(); }, 150); });
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(hero);
        } else start();
        document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    });

    /* ---- World clocks + office status ---- */
    function timeIn(tz, opts) {
        return new Intl.DateTimeFormat(LANG === "es" ? "es-GT" : "en-US", Object.assign({ timeZone: tz, hour: "numeric", minute: "2-digit", hourCycle: LANG === "es" ? "h23" : "h12" }, opts || {})).format(new Date());
    }
    function gtParts() {
        const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Guatemala", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
        const get = t => (p.find(x => x.type === t) || {}).value;
        return { day: get("weekday"), hour: parseInt(get("hour"), 10) % 24 };
    }
    function updateClocks() {
        document.querySelectorAll("[data-clock]").forEach(el => { el.textContent = timeIn(el.dataset.clock); });
        const { day, hour } = gtParts();
        const open = !["Sat", "Sun"].includes(day) && hour >= 8 && hour < 18;
        document.querySelectorAll("[data-office-status]").forEach(el => {
            const dot = el.querySelector(".pulse-dot"), txt = el.querySelector("[data-office-text]");
            if (dot) dot.classList.toggle("off", !open);
            if (txt) txt.textContent = tr(open ? "live.open" : "live.closed");
        });
    }
    if (document.querySelector("[data-clock], [data-office-status]")) {
        updateClocks();
        setInterval(updateClocks, 20000);
        langHooks.push(updateClocks);
    }

    /* ---- Live operations demo panel (home page) ---- */
    const panel = document.querySelector("[data-live-panel]");
    if (panel) {
        const list = panel.querySelector("[data-live-list]");
        const SAMPLES = [
            { svc: "Helpdesk", l: "EN", ic: "key-round", en: "Password reset · VPN access", es: "Reseteo de contraseña · acceso VPN" },
            { svc: "Support", l: "ES", ic: "message-circle", en: "Customer can't complete checkout", es: "Cliente no puede completar su compra" },
            { svc: "NOC", l: "EN", ic: "activity", en: "High latency on branch firewall", es: "Latencia alta en firewall de sucursal" },
            { svc: "Infra", l: "EN", ic: "user-plus", en: "New hire onboarding · M365 license", es: "Alta de colaborador · licencia M365" },
            { svc: "Dev", l: "EN", ic: "bug", en: "Fix: invoice PDF export error", es: "Corrección: error al exportar factura PDF" },
            { svc: "Support", l: "ES", ic: "phone", en: "Billing question · Mexico customer", es: "Consulta de facturación · cliente en México" },
            { svc: "NOC", l: "EN", ic: "hard-drive", en: "Nightly backup verified", es: "Respaldo nocturno verificado" },
            { svc: "Helpdesk", l: "ES", ic: "printer", en: "Printer offline · 3rd floor", es: "Impresora sin conexión · 3er piso" },
            { svc: "Support", l: "EN", ic: "mail", en: "Refund status request", es: "Consulta de estado de reembolso" },
            { svc: "Infra", l: "EN", ic: "shield-check", en: "MFA enrollment · sales team", es: "Registro de MFA · equipo de ventas" }
        ];
        const ORDER = ["new", "progress", "resolved"];
        let next = 0, ticketNo = 4817, timer = 0, visible = true;

        function paint(li) {
            const s = SAMPLES[+li.dataset.idx];
            li.querySelector("[data-t]").textContent = LANG === "es" ? s.es : s.en;
            const st = li.querySelector("[data-st]");
            st.className = "st st-" + li.dataset.st;
            st.textContent = tr("live." + li.dataset.st);
        }
        function make(idx, state) {
            const s = SAMPLES[idx];
            const li = document.createElement("li");
            li.className = "live-item flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5";
            li.dataset.idx = idx; li.dataset.st = state || "new";
            li.innerHTML =
                '<span class="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0"><i data-lucide="' + s.ic + '" class="w-4 h-4 text-blue-400"></i></span>' +
                '<span class="min-w-0 flex-1"><span class="block text-[13px] font-semibold truncate" data-t></span>' +
                '<span class="block text-[11px] text-slate-500">#' + (ticketNo++) + ' · ' + s.svc + ' · <span class="text-slate-300 font-bold">' + s.l + '</span></span></span>' +
                '<span data-st></span>';
            paint(li);
            return li;
        }
        function advance(li) {
            const i = ORDER.indexOf(li.dataset.st);
            if (i < ORDER.length - 1) { li.dataset.st = ORDER[i + 1]; paint(li); }
        }
        function push() {
            const li = make(next, "new");
            next = (next + 1) % SAMPLES.length;
            list.prepend(li);
            if (window.lucide) window.lucide.createIcons();
            setTimeout(() => advance(li), 1400);
            setTimeout(() => advance(li), 4200);
            const items = list.querySelectorAll(".live-item:not(.out)");
            if (items.length > 4) {
                const last = items[items.length - 1];
                last.classList.add("out");
                setTimeout(() => last.remove(), 400);
            }
        }
        // initial state
        [["resolved", 3], ["resolved", 2], ["progress", 1], ["new", 0]].forEach(([st, i]) => list.prepend(make(i, st)));
        next = 4;
        function loop() { clearTimeout(timer); if (visible && !document.hidden) push(); timer = setTimeout(loop, 3200); }
        if (!REDUCED) {
            timer = setTimeout(loop, 2200);
            if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(panel);
        }
        langHooks.push(() => list.querySelectorAll(".live-item").forEach(paint));
    }

    /* ---- Time-zone overlap widget ---- */
    document.querySelectorAll("[data-tz-widget]").forEach(root => {
        const CITIES = [
            { id: "ny", tz: "America/New_York", en: "New York", es: "Nueva York" },
            { id: "chi", tz: "America/Chicago", en: "Chicago", es: "Chicago" },
            { id: "den", tz: "America/Denver", en: "Denver", es: "Denver" },
            { id: "la", tz: "America/Los_Angeles", en: "Los Angeles", es: "Los Ángeles" }
        ];
        const TEAMS = [
            { key: "tz.gt", tz: "America/Guatemala", primary: true },
            { key: "tz.mnl", tz: "Asia/Manila" },
            { key: "tz.blr", tz: "Asia/Kolkata" }
        ];
        let city = CITIES[1];

        function offsetMin(tz) {
            const d = new Date();
            const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(d);
            const g = t => +p.find(x => x.type === t).value;
            const asUTC = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"));
            return Math.round((asUTC - d.getTime()) / 60000);
        }
        function render() {
            const cOff = offsetMin(city.tz);
            const btns = CITIES.map(c => '<button type="button" class="tz-city px-4 py-2 rounded-full border border-white/15 text-sm font-bold transition hover:border-blue-500" data-city="' + c.id + '" aria-pressed="' + (c.id === city.id) + '">' + (LANG === "es" ? c.es : c.en) + '</button>').join("");
            const rows = TEAMS.map(t => {
                const tOff = offsetMin(t.tz);
                let covered = 0, cells = "";
                for (let h = 0; h < 24; h++) {
                    const m = ((h * 60 + 30 - cOff + tOff) % 1440 + 1440) % 1440;   // team local minute at client hour h:30
                    const shift = m >= 480 && m < 1080;                             // team day shift 8:00–18:00
                    const work = h >= 8 && h < 17;                                    // client workday 8:00–17:00
                    if (shift && work) covered++;
                    cells += '<span class="tz-cell' + (work ? " work" : "") + (shift ? " shift" : "") + '"></span>';
                }
                return '<div class="tz-row ' + (t.primary ? "primary" : "") + ' mb-5">' +
                    '<div class="flex items-center justify-between gap-3 mb-2"><span class="text-sm font-bold ' + (t.primary ? "text-white" : "text-slate-300") + '">' + tr(t.key) + '</span>' +
                    '<span class="text-sm font-black ' + (t.primary ? "text-cyan-300" : "text-slate-400") + '">' + fmt(tr("tz.cov"), { n: covered }) + '</span></div>' +
                    '<div class="tz-grid">' + cells + '</div>' +
                    '<div class="tz-bar mt-2"><span style="width:' + Math.round(covered / 9 * 100) + '%"></span></div></div>';
            }).join("");
            const axis = '<div class="tz-grid text-[10px] text-slate-500 mb-6">' + Array.from({ length: 24 }, (_, h) => '<span class="text-center">' + (h % 6 === 0 ? h + ":00" : "") + '</span>').join("") + '</div>';
            root.innerHTML =
                '<div class="flex flex-wrap gap-2 mb-6">' + btns + '</div>' +
                '<p class="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">' + fmt(tr("tz.axis"), { city: LANG === "es" ? city.es : city.en }) + '</p>' +
                rows + axis +
                '<div class="flex flex-wrap gap-5 text-xs text-slate-400">' +
                '<span class="flex items-center gap-2"><span class="tz-cell work inline-block" style="width:20px;height:12px"></span>' + tr("tz.your") + '</span>' +
                '<span class="flex items-center gap-2"><span class="tz-cell work shift inline-block" style="width:20px;height:12px"></span>' + tr("tz.legend.both") + '</span>' +
                '<span class="flex items-center gap-2"><span class="tz-cell shift inline-block" style="width:20px;height:12px"></span>' + tr("tz.legend.shift") + '</span></div>';
            root.querySelectorAll(".tz-city").forEach(b => b.addEventListener("click", () => {
                city = CITIES.find(c => c.id === b.dataset.city); render();
            }));
        }
        render();
        langHooks.push(render);
    });

    if (window.lucide) window.lucide.createIcons();
})();
