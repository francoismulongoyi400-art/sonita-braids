/* =========================================================
   Sonita Braids – site scripts (plain JavaScript)
   ---------------------------------------------------------
   EDIT HERE: business hours, prices, durations and links.
   Leave a price or duration as "" to show "Price TBA" /
   "Duration TBA". Example: "svc-box-braids": "R650"
   ========================================================= */
const CONFIG = {
  whatsappNumber: "27684947695", // WhatsApp number in international format (no + or 00)

  hours: {
    short: "Open 24 hours",
    long: "Open 24 hours (per our Google listing). Please confirm your appointment time with us."
  },

  links: {
    instagram: "https://www.instagram.com/sunita_braids/",
    tiktok: "https://www.tiktok.com/@sonitabraids",
    directions: "https://www.google.com/maps/search/?api=1&query=Sonita+Hair+Beauty+Salon+24+Plein+Street+Cape+Town",
    // Replace with the salon's direct Google "write a review" link when available
    reviews: "https://www.google.com/maps/search/?api=1&query=Sonita+Hair+Beauty+Salon+24+Plein+Street+Cape+Town"
  },

  // ---- PRICES (placeholders until the salon supplies real prices) ----
  prices: {
    // Service cards
    "svc-hair-braiding": "",
    "svc-box-braids": "",
    "svc-goddess-braids": "",
    "svc-hair-twists": "",
    "svc-hair-extensions": "",
    "svc-hair-colouring": "",
    "svc-hairstyling": "",
    "svc-hair-treatments": "",
    // Price list
    "pr-box-braids": "",
    "pr-knotless-braids": "",
    "pr-cornrows": "",
    "pr-senegalese-twists": "",
    "pr-passion-twists": "",
    "pr-soft-locs": "",
    "pr-goddess-braids": "",
    "pr-boho-knotless": "",
    "pr-hair-extensions": "",
    "pr-colour-matching": "",
    "pr-hair-treatment": "",
    "pr-wash-style": ""
  },

  // ---- ESTIMATED DURATIONS (placeholders) ----
  durations: {
    "svc-hair-braiding": "",
    "svc-box-braids": "",
    "svc-goddess-braids": "",
    "svc-hair-twists": "",
    "svc-hair-extensions": "",
    "svc-hair-colouring": "",
    "svc-hairstyling": "",
    "svc-hair-treatments": ""
  }
};

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const waLink = (text) =>
    `https://wa.me/${CONFIG.whatsappNumber}` + (text ? `?text=${encodeURIComponent(text)}` : "");

  /* ---------- Fill editable content from CONFIG ---------- */
  $$("[data-price]").forEach((el) => {
    const v = (CONFIG.prices[el.dataset.price] || "").trim();
    el.textContent = v || "Price TBA";
    el.classList.toggle("is-placeholder", !v);
  });
  $$("[data-duration]").forEach((el) => {
    const v = (CONFIG.durations[el.dataset.duration] || "").trim();
    el.textContent = v || "Duration TBA";
    el.classList.toggle("is-placeholder", !v);
  });
  $$("[data-hours-short]").forEach((el) => (el.textContent = CONFIG.hours.short));
  $$("[data-hours-long]").forEach((el) => (el.textContent = CONFIG.hours.long));
  $$("[data-link]").forEach((el) => {
    const url = CONFIG.links[el.dataset.link];
    if (url) el.href = url;
  });
  $$("[data-wa]").forEach((el) => (el.href = waLink(el.dataset.wa)));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Header: scroll state + mobile menu ---------- */
  const header = $("#siteHeader");
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => window.innerWidth > 980 && setMenu(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && nav.classList.contains("open") && setMenu(false));

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = $$("a[data-nav]");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));

    /* Reveal on scroll */
    const rev = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            rev.unobserve(en.target);
          }
        }),
      { threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => rev.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Hero video ---------- */
  const video = $("#heroVideo");
  const vToggle = $("#videoToggle");
  const setVideoIcon = (playing) => {
    vToggle.innerHTML = `<svg class="ic"><use href="#i-${playing ? "pause" : "play"}"/></svg>`;
    vToggle.setAttribute("aria-label", playing ? "Pause video" : "Play video");
  };
  if (video) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.removeAttribute("autoplay");
      video.pause();
      setVideoIcon(false);
    } else {
      const p = video.play();
      if (p && p.catch) p.catch(() => setVideoIcon(false));
    }
    vToggle.addEventListener("click", () => {
      if (video.paused) { video.play(); setVideoIcon(true); }
      else { video.pause(); setVideoIcon(false); }
    });
    // Save battery/data: pause when hero is off screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((e) => {
        if (!e[0].isIntersecting && !video.paused) video.pause();
        else if (e[0].isIntersecting && video.paused && !video.dataset.userPaused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.play().catch(() => {});
      }, { threshold: 0.1 }).observe(video);
    }
    vToggle.addEventListener("click", () => { video.dataset.userPaused = video.paused ? "1" : ""; });
  }

  /* ---------- Services -> booking / WhatsApp ---------- */
  const serviceSelect = $("#fService");
  $$(".service-card").forEach((card) => {
    const name = card.dataset.service;
    const bookBtn = $("[data-book]", card);
    const wa = $("[data-wa-service]", card);
    if (wa) wa.href = waLink(`Hello Sonita Braids, I'd like to enquire about ${name}.`);
    if (bookBtn)
      bookBtn.addEventListener("click", () => {
        serviceSelect.value = name;
        clearError("service");
        $("#booking").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => $("#fName").focus({ preventScroll: true }), 700);
      });
  });

  /* ---------- Gallery filter ---------- */
  const items = $$(".g-item");
  $$(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const f = chip.dataset.filter;
      items.forEach((it) => (it.hidden = !(f === "all" || it.dataset.cat.split(" ").includes(f))));
    })
  );

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let current = 0, visible = [], lastFocus = null;
  const showAt = (i) => {
    current = (i + visible.length) % visible.length;
    const img = $("img", visible[current]);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = $("figcaption", visible[current]).textContent;
  };
  const openLb = (item) => {
    visible = items.filter((it) => !it.hidden);
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    showAt(visible.indexOf(item));
    $("#lbClose").focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  items.forEach((it) => $(".g-btn", it).addEventListener("click", () => openLb(it)));
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => showAt(current - 1));
  $("#lbNext").addEventListener("click", () => showAt(current + 1));
  lb.addEventListener("click", (e) => (e.target === lb) && closeLb());
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showAt(current - 1);
    if (e.key === "ArrowRight") showAt(current + 1);
  });
  let tx = 0;
  lb.addEventListener("touchstart", (e) => (tx = e.changedTouches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) showAt(current + (dx < 0 ? 1 : -1));
  });

  /* ---------- Booking form ---------- */
  const form = $("#bookingForm");
  const confirmPanel = $("#confirmPanel");
  const dateInput = $("#fDate");

  const pad = (n) => String(n).padStart(2, "0");
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  dateInput.min = todayStr(); // prevents past dates in the date picker

  function setError(field, msg) {
    const el = $(`[data-err="${field}"]`);
    if (el) el.textContent = msg;
    const input = form.elements[field];
    if (input && input.closest) input.closest(".field").classList.add("invalid");
  }
  function clearError(field) {
    const el = $(`[data-err="${field}"]`);
    if (el) el.textContent = "";
    const input = form.elements[field];
    if (input && input.closest) input.closest(".field").classList.remove("invalid");
  }

  function validate() {
    const v = Object.fromEntries(new FormData(form).entries());
    Object.keys(v).forEach(clearError);
    let firstBad = null;
    const bad = (f, m) => { setError(f, m); if (!firstBad) firstBad = form.elements[f]; };

    v.name = (v.name || "").trim();
    v.phone = (v.phone || "").trim();
    v.email = (v.email || "").trim();
    v.notes = (v.notes || "").trim();
    v.ref = (v.ref || "").trim();

    if (v.name.length < 2) bad("name", "Please enter your full name.");
    const digits = v.phone.replace(/[\s\-().+]/g, "");
    if (!/^\d{9,15}$/.test(digits)) bad("phone", "Please enter a valid phone number (9–15 digits).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) bad("email", "Please enter a valid email address.");
    if (!v.service) bad("service", "Please choose a hairstyle or service.");

    if (!v.date) bad("date", "Please choose a preferred date.");
    else if (v.date < todayStr()) bad("date", "Appointment dates in the past aren't allowed.");

    if (!v.time) bad("time", "Please choose a preferred time.");
    else if (v.date === todayStr()) {
      const n = new Date();
      if (v.time <= `${pad(n.getHours())}:${pad(n.getMinutes())}`) bad("time", "Please choose a time later than now.");
    }

    if (v.ref) {
      try {
        const u = new URL(v.ref);
        if (!/^https?:$/.test(u.protocol)) throw new Error();
      } catch (e) { bad("ref", "Please enter a valid link starting with https://"); }
    }
    if (firstBad) { firstBad.focus(); return null; }
    return v;
  }

  const prettyDate = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };
  const prettyTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return `${pad(h)}:${pad(m)}`;
  };

  function buildMessage(v) {
    return [
      "Hello Sonita Braids,",
      "I'd like to request an appointment:",
      "",
      `Name: ${v.name}`,
      `Phone: ${v.phone}`,
      `Email: ${v.email}`,
      `Hairstyle/Service: ${v.service}`,
      `Preferred date: ${prettyDate(v.date)}`,
      `Preferred time: ${prettyTime(v.time)}`,
      `Additional requirements: ${v.notes || "None"}`,
      v.ref ? `Reference image: ${v.ref}` : null,
      "",
      "Please let me know if this time is available. Thank you!"
    ].filter((l) => l !== null).join("\n");
  }

  let lastRequest = null;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = validate();
    if (!v) return;
    lastRequest = buildMessage(v);

    const rows = [
      ["Name", v.name], ["Phone", v.phone], ["Email", v.email], ["Service", v.service],
      ["Date", prettyDate(v.date)], ["Time", prettyTime(v.time)],
      ["Requirements", v.notes || "None"]
    ];
    if (v.ref) rows.push(["Reference", v.ref]);
    const list = $("#confirmList");
    list.innerHTML = "";
    rows.forEach(([k, val]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = val; // textContent keeps user input safe
      list.append(dt, dd);
    });
    $("#waSend").href = waLink(lastRequest);
    form.hidden = true;
    confirmPanel.hidden = false;
    confirmPanel.focus();
    confirmPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // Validate, then open WhatsApp straight away
  $("#waDirect").addEventListener("click", () => {
    const v = validate();
    if (!v) return;
    window.open(waLink(buildMessage(v)), "_blank", "noopener");
  });

  $("#editReq").addEventListener("click", () => {
    confirmPanel.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  $("#copyReq").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(lastRequest);
      btn.textContent = "Copied ✓";
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = lastRequest; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); btn.textContent = "Copied ✓"; } catch (e2) { btn.textContent = "Copy failed"; }
      ta.remove();
    }
    setTimeout(() => (btn.textContent = "Copy Request"), 2200);
  });

  // Clear a field's error as the user fixes it
  $$("input, select, textarea", form).forEach((el) =>
    el.addEventListener("input", () => clearError(el.name))
  );
})();
