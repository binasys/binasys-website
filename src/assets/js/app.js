(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const running = new Set();
  const settlers = new Set();
  const ease = "cubic-bezier(.22,1,.36,1)";
  const page = document.body.dataset.page || "home";
  // Keep earlier draft bookmarks useful after splitting the homepage.
  function redirectLegacyHomeHash() {
    if (page !== "home") return false;
    const legacy = {
      "#work": "/services#work",
      "#help": "/services",
      "#industries": "/industries",
      "#about": "/about#about",
      "#approach": "/about#approach",
      "#service-sales": "/services#service-sales",
      "#service-work": "/services#service-work",
      "#service-clarity": "/services#service-clarity",
    }[location.hash];
    if (legacy) {
      location.replace(new URL(legacy, location.href));
      return true;
    }
    return false;
  }
  if (redirectLegacyHomeHash()) return;
  addEventListener("hashchange", redirectLegacyHomeHash);
  const currentURL = new URL(location.href);
  const isPlainClick = (event) =>
    event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  const isSameDocument = (link) => {
    const url = new URL(link.href, location.href);
    return (
      url.origin === currentURL.origin &&
      url.pathname === currentURL.pathname &&
      url.search === currentURL.search
    );
  };
  const pageForURL = (url) => {
    const file = url.pathname.split("/").pop();
    return {
      services: "services",
      "services.html": "services",
      industries: "industries",
      "industries.html": "industries",
      about: "about",
      "about.html": "about",
      "index.html": "home",
      "preview.html": "home",
      "": "home",
    }[file];
  };
  // Cross-document transitions are initialized before paint by navigation.js.
  const canAnimate = () =>
    !motionPreference.matches && typeof Element.prototype.animate === "function";
  function animate(element, frames, options = {}) {
    if (!element || !canAnimate()) return null;
    const animation = element.animate(frames, { duration: 600, easing: ease, ...options });
    running.add(animation);
    const forget = () => running.delete(animation);
    animation.addEventListener("finish", forget, { once: true });
    animation.addEventListener("cancel", forget, { once: true });
    return animation;
  }
  const cancel = (animations) => animations.forEach((animation) => animation?.cancel());
  motionPreference.addEventListener("change", () => {
    if (!motionPreference.matches) return;
    settlers.forEach((settle) => settle());
    running.forEach((animation) => animation.cancel());
    running.clear();
  });

  // Text is always present in the document; no loader or reveal-only content.
  const headline = [...document.querySelectorAll(".hero-line > span")];
  headline.forEach((line, i) =>
    animate(
      line,
      [
        { opacity: 0, transform: "translateY(45%)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 850, delay: 40 + i * 85, fill: "backwards" },
    ),
  );
  [$(".hero > .eyebrow"), $(".hero-intro"), $(".hero-actions")].forEach((element, i) =>
    animate(
      element,
      [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 650, delay: i === 0 ? 0 : 100 + i * 60, fill: "backwards" },
    ),
  );
  const heroParts = [
    [".paper-back .paper-inner", 100, "translateY(32px) rotate(-5deg) scale(.97)"],
    [".paper-middle .paper-inner", 180, "translateY(35px) rotate(-3deg) scale(.98)"],
    [".paper-front .paper-inner", 260, "translateY(38px) rotate(2deg) scale(.98)"],
    [".question-one .tag-inner", 420, "translate(-20px,9px)"],
    [".question-two .tag-inner", 490, "translate(20px,9px)"],
    [".answer-tag .tag-inner", 570, "translate(10px,16px)"],
  ];
  heroParts.forEach(([selector, delay, transform]) =>
    animate(
      $(selector),
      [
        { opacity: 0, transform },
        { opacity: 1, transform: "none" },
      ],
      { duration: 800, delay: delay * 0.65, fill: "backwards" },
    ),
  );

  // One observer, with short sibling staggers rather than overlapping parent reveals.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const groupOrder = new Map();
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          if (entry.target.contains(document.activeElement)) return;
          const parent = entry.target.parentElement;
          const order = groupOrder.get(parent) || 0;
          groupOrder.set(parent, order + 1);
          animate(
            entry.target,
            [
              { opacity: 0, transform: "translateY(20px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 700, delay: Math.min(order, 2) * 70, fill: "backwards" },
          );
        });
      },
      { threshold: 0, rootMargin: "0px 0px 16px 0px" },
    );
    document
      .querySelectorAll(
        ".brands-section,.section-top,.summary-card,.home-work,.home-about,.help-card,.work-card,.founder-card,.steps li,.contact-section > *",
      )
      .forEach((el) => observer.observe(el));
  }

  // Decorative depth only: pointer events schedule one frame, with no idle loop.
  const art = $(".hero-art");
  const scene = $(".hero-scene");
  // Browser-managed drift: no frame loop, and no work when the graphic is hidden.
  const motionToggle = $(".hero-motion-toggle");
  let driftPaused = false;
  let heroInView = !("IntersectionObserver" in window);
  function syncDrift() {
    const enabled = canAnimate();
    if (!art) return;
    art.classList.toggle("is-drifting", enabled && heroInView && !document.hidden && !driftPaused);
    if (!motionToggle) return;
    motionToggle.hidden = !enabled;
    motionToggle.dataset.paused = String(driftPaused);
    const label = driftPaused ? "Play animation" : "Pause animation";
    motionToggle.setAttribute("aria-label", label);
    motionToggle.title = label;
  }
  motionToggle?.addEventListener("click", () => {
    driftPaused = !driftPaused;
    syncDrift();
  });
  motionPreference.addEventListener("change", syncDrift);
  document.addEventListener("visibilitychange", syncDrift);
  if (art && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      heroInView = entry.isIntersecting && entry.intersectionRatio > 0;
      syncDrift();
    }).observe(art);
  }
  syncDrift();
  let pointerFrame = 0;
  let artBounds;
  let pointerX = 0;
  let pointerY = 0;
  function resetDepth() {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    artBounds = null;
    scene?.style.removeProperty("--yaw");
    scene?.style.removeProperty("--pitch");
  }
  settlers.add(resetDepth);
  art?.addEventListener("pointerenter", () => {
    artBounds = art.getBoundingClientRect();
  });
  art?.addEventListener("pointermove", (event) => {
    if (!scene || !finePointer.matches || !canAnimate() || event.pointerType === "touch") return;
    artBounds ||= art.getBoundingClientRect();
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!artBounds || !canAnimate()) return;
      const x = Math.max(
        -1,
        Math.min(1, ((pointerX - artBounds.left) / artBounds.width - 0.5) * 2),
      );
      const y = Math.max(
        -1,
        Math.min(1, ((pointerY - artBounds.top) / artBounds.height - 0.5) * 2),
      );
      scene.style.setProperty("--yaw", `${x * 3.2}deg`);
      scene.style.setProperty("--pitch", `${-y * 2.2}deg`);
    });
  });
  art?.addEventListener("pointerleave", resetDepth);
  finePointer.addEventListener("change", resetDepth);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetDepth();
  });
  const header = $(".site-header");
  let scrollFrame = 0;
  const sectionLinks = [...document.querySelectorAll(".header-inner nav a,#mobile-menu a")];
  const navSections = [...document.querySelectorAll("main > section")].filter((section) =>
    sectionLinks.some((link) => isSameDocument(link) && link.hash === `#${section.id}`),
  );
  function markCurrentNavigation(activeSection) {
    sectionLinks.forEach((link) => {
      const url = new URL(link.href, location.href);
      const route = pageForURL(url);
      const current =
        !url.hash && route === page
          ? "page"
          : route === page && url.hash && url.hash === `#${activeSection}`
            ? "location"
            : null;
      if (current) link.setAttribute("aria-current", current);
      else link.removeAttribute("aria-current");
    });
    const homeLink = $(".site-header .wordmark");
    if (homeLink) {
      if (page === "home") homeLink.setAttribute("aria-current", "page");
      else homeLink.removeAttribute("aria-current");
    }
  }
  const steps = [...document.querySelectorAll(".steps li")];
  function updateHeader() {
    const sectionPositions = navSections.map((section) => section.getBoundingClientRect().top);
    const stepPositions = steps.map((step) => step.getBoundingClientRect().top);
    let active = -1;
    sectionPositions.forEach((top, i) => {
      if (top < innerHeight * 0.4) active = i;
    });
    let activeStep = 0;
    stepPositions.forEach((top, i) => {
      if (top < innerHeight * 0.58) activeStep = i;
    });
    header?.classList.toggle("scrolled", scrollY > 16);
    markCurrentNavigation(navSections[active]?.id);
    steps.forEach((step, i) => step.classList.toggle("is-current", i === activeStep));
    artBounds = null;
    scrollFrame = 0;
  }
  addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );
  updateHeader();

  const tabs = [...document.querySelectorAll("[data-industry]")];
  const panels = [...document.querySelectorAll(".industry-panel")];
  const viewport = $(".industry-panels");
  const indicator = $(".tab-indicator");
  let activeIndustry = "manufacturing";
  let panelToken = 0;
  let panelAnimations = [];
  function placeIndicator() {
    const tab = tabs.find((item) => item.dataset.industry === activeIndustry);
    if (!tab || !indicator) return;
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.height = `${tab.offsetHeight}px`;
    indicator.style.transform = `translate(${tab.offsetLeft}px,${tab.offsetTop}px)`;
  }
  function settlePanels() {
    panelToken++;
    cancel(panelAnimations);
    panelAnimations = [];
    panels.forEach((panel) => {
      const selected = panel.id === `panel-${activeIndustry}`;
      panel.hidden = !selected;
      panel.inert = !selected;
      panel.classList.remove("is-outgoing");
      if (selected) panel.removeAttribute("aria-hidden");
      else panel.setAttribute("aria-hidden", "true");
    });
    viewport?.style.removeProperty("height");
    viewport?.classList.remove("is-changing");
  }
  settlers.add(settlePanels);
  function selectIndustry(id, { motion = true } = {}) {
    if (!viewport || !tabs.some((tab) => tab.dataset.industry === id)) return;
    const old = $(`#panel-${activeIndustry}`);
    const oldHeight = viewport.getBoundingClientRect().height;
    const oldOpacity = parseFloat(getComputedStyle(old).opacity);
    settlePanels();
    activeIndustry = id;
    const token = ++panelToken;
    const next = $(`#panel-${id}`);
    tabs.forEach((tab) => {
      const selected = tab.dataset.industry === id;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      const selected = panel === next;
      panel.hidden = !selected;
      panel.inert = !selected;
      if (selected) panel.removeAttribute("aria-hidden");
      else panel.setAttribute("aria-hidden", "true");
    });
    placeIndicator();
    if (!motion || !canAnimate() || old === next) return;
    const nextHeight = next.getBoundingClientRect().height;
    viewport.style.height = `${oldHeight}px`;
    viewport.classList.add("is-changing");
    old.hidden = false;
    old.inert = true;
    old.setAttribute("aria-hidden", "true");
    old.classList.add("is-outgoing");
    panelAnimations.push(
      animate(
        old,
        [
          { opacity: oldOpacity, transform: "none" },
          { opacity: 0, transform: "translateX(-6px)" },
        ],
        { duration: 180, fill: "forwards" },
      ),
    );
    panelAnimations.push(
      animate(
        next,
        [
          { opacity: 0, transform: "translateX(8px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 450, delay: 35, fill: "backwards" },
      ),
    );
    const heightAnimation = animate(
      viewport,
      [{ height: `${oldHeight}px` }, { height: `${nextHeight}px` }],
      { duration: 450, fill: "forwards" },
    );
    panelAnimations.push(heightAnimation);
    next.querySelectorAll(".industry-icon path").forEach((path, i) => {
      const length = path.getTotalLength();
      panelAnimations.push(
        animate(
          path,
          [
            { strokeDasharray: `${length}`, strokeDashoffset: length },
            { strokeDasharray: `${length}`, strokeDashoffset: 0 },
          ],
          { duration: 330, delay: 60 + i * 40 },
        ),
      );
    });
    // All final state is set synchronously; completions only clean visual overlays.
    const incoming = panelAnimations[1];
    incoming?.addEventListener(
      "finish",
      () => {
        if (token === panelToken) settlePanels();
      },
      { once: true },
    );
  }
  // Deep links: industries.html#retail (or #panel-retail) opens that tab.
  const industryFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1)).replace(/^panel-/, "");
    return tabs.some((tab) => tab.dataset.industry === id) ? id : null;
  };
  const rememberIndustry = (id) => history.replaceState(null, "", `#${id}`);
  const showIndustryFromHash = ({ motion = true } = {}) => {
    const id = industryFromHash();
    if (!id) return;
    selectIndustry(id, { motion });
    $(".industry-tabs")?.scrollIntoView({
      block: "center",
      behavior: canAnimate() ? "smooth" : "auto",
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.industry !== activeIndustry) selectIndustry(tab.dataset.industry);
      rememberIndustry(tab.dataset.industry);
    });
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].focus();
        selectIndustry(tabs[next].dataset.industry);
        rememberIndustry(tabs[next].dataset.industry);
      }
    });
  });
  if (tabs.length && viewport) {
    activeIndustry =
      industryFromHash() ||
      tabs.find((tab) => tab.getAttribute("aria-selected") === "true")?.dataset.industry ||
      tabs[0].dataset.industry;
    document.body.classList.add("enhanced");
    selectIndustry(activeIndustry, { motion: false });
    if (industryFromHash()) requestAnimationFrame(() => showIndustryFromHash({ motion: false }));
    addEventListener("hashchange", () => showIndustryFromHash());
    if ("ResizeObserver" in window && $(".industry-tabs"))
      new ResizeObserver(placeIndicator).observe($(".industry-tabs"));
  }

  const disclosures = new Map();
  function settleDisclosure(details) {
    const state = disclosures.get(details);
    if (!state) return;
    cancel(state.animations);
    details.open = state.target;
    details.style.removeProperty("height");
    details.style.removeProperty("overflow");
    details.removeAttribute("data-expanded");
    disclosures.delete(details);
  }
  function toggleDisclosure(details) {
    if (viewport?.classList.contains("is-changing")) settlePanels();
    const oldState = disclosures.get(details);
    const target = !(oldState ? oldState.target : details.open);
    const start = details.getBoundingClientRect().height;
    const content = details.querySelector(".example-content");
    const opacity = details.open ? parseFloat(getComputedStyle(content).opacity) : 0;
    if (oldState) {
      cancel(oldState.animations);
      disclosures.delete(details);
    }
    details.style.removeProperty("height");
    details.style.removeProperty("overflow");
    if (!canAnimate()) {
      details.open = target;
      details.removeAttribute("data-expanded");
      return;
    }
    details.open = true;
    details.dataset.expanded = String(target);
    const end = target ? details.offsetHeight : details.querySelector("summary").offsetHeight;
    const state = { target, animations: [] };
    disclosures.set(details, state);
    details.style.height = `${start}px`;
    details.style.overflow = "clip";
    const resize = animate(details, [{ height: `${start}px` }, { height: `${end}px` }], {
      duration: 480,
      fill: "forwards",
    });
    state.animations.push(
      resize,
      animate(
        content,
        [
          { opacity, transform: target ? "translateY(-5px)" : "none" },
          { opacity: target ? 1 : 0, transform: target ? "none" : "translateY(-4px)" },
        ],
        { duration: target ? 430 : 220, fill: "forwards" },
      ),
    );
    resize?.addEventListener(
      "finish",
      () => {
        if (disclosures.get(details) === state) settleDisclosure(details);
      },
      { once: true },
    );
  }
  document.querySelectorAll(".example").forEach((details) =>
    details.querySelector("summary").addEventListener("click", (event) => {
      event.preventDefault();
      toggleDisclosure(details);
    }),
  );
  const settleDisclosures = () => [...disclosures.keys()].forEach(settleDisclosure);
  settlers.add(settleDisclosures);
  addEventListener("resize", () => {
    resetDepth();
    settleDisclosures();
    settlePanels();
    placeIndicator();
  });

  const menuToggle = $(".menu-toggle");
  const menu = $("#mobile-menu");
  let menuOpen = false;
  let menuAnimation;
  let menuToken = 0;
  function setMenu(open, { immediate = false, restoreFocus = false } = {}) {
    if (!menu || !menuToggle) return;
    menuOpen = open;
    const token = ++menuToken;
    menuAnimation?.cancel();
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.inert = !open;
    if (restoreFocus) menuToggle.focus();
    if (immediate || !canAnimate()) {
      menu.hidden = !open;
      return;
    }
    menu.hidden = false;
    menuAnimation = animate(
      menu,
      open
        ? [
            { opacity: 0, transform: "translateY(-10px)" },
            { opacity: 1, transform: "none" },
          ]
        : [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: "translateY(-7px)" },
          ],
      { duration: open ? 370 : 230 },
    );
    menuAnimation?.addEventListener(
      "finish",
      () => {
        if (token === menuToken) menu.hidden = !menuOpen;
      },
      { once: true },
    );
  }
  settlers.add(() => setMenu(menuOpen, { immediate: true }));
  menuToggle?.addEventListener("click", () => setMenu(!menuOpen));
  menu?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (isPlainClick(event) && !link.target && !link.hasAttribute("download"))
        setMenu(false, { immediate: true });
    }),
  );
  document.addEventListener("pointerdown", (event) => {
    if (menuOpen && !menu.contains(event.target) && !menuToggle.contains(event.target))
      setMenu(false, { immediate: true });
  });
  document.addEventListener("focusin", (event) => {
    if (menuOpen && !menu.contains(event.target) && !menuToggle.contains(event.target))
      setMenu(false, { immediate: true });
  });
  addEventListener("pagehide", () => {
    setMenu(false, { immediate: true });
    resetDepth();
  });
  matchMedia("(min-width:921px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false, { immediate: true });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) setMenu(false, { restoreFocus: true });
  });

  // Optional service details on the services page; regular page links remain native.
  // Service details come from src/_data/services.yaml via the #service-data block.
  let services = {};
  try {
    services = JSON.parse($("#service-data")?.textContent || "{}");
  } catch {
    services = {};
  }
  const serviceDialog = $("#service-dialog");
  if (serviceDialog) {
    let serviceOpener = null,
      serviceId = null,
      serviceAnimation = null,
      serviceContentAnimation = null,
      serviceClosing = false,
      serviceCloseRequested = false;
    let afterServiceClose = null;
    const serviceFromURL = () =>
      location.hash.startsWith("#service-") ? location.hash.slice(9) : null;
    function fillService(id) {
      const data = services[id];
      if (!data) return;
      serviceId = id;
      $("#service-category").textContent = data.category;
      $("#service-title").textContent = data.title;
      $("#service-intro").textContent = data.intro;
      $("#service-offers").replaceChildren(
        ...data.offers.map((text) => {
          const li = document.createElement("li");
          li.textContent = text;
          return li;
        }),
      );
      const art = $(`.help-card[data-kind="${id}"] .service-art`);
      $("#service-art-slot").replaceChildren(...(art ? [art.cloneNode(true)] : []));
      serviceDialog
        .querySelectorAll("[data-service]")
        .forEach((button) =>
          button.setAttribute("aria-current", String(button.dataset.service === id)),
        );
      serviceDialog.scrollTop = 0;
    }
    function finishServiceClose() {
      serviceAnimation?.cancel();
      serviceContentAnimation?.cancel();
      serviceClosing = false;
      serviceCloseRequested = false;
      serviceDialog.classList.remove("is-closing");
      serviceDialog.inert = false;
      if (serviceDialog.open) serviceDialog.close();
      serviceOpener?.focus({ preventScroll: true });
      const done = afterServiceClose;
      afterServiceClose = null;
      done?.();
    }
    function hideService() {
      if (!serviceDialog.open) {
        const done = afterServiceClose;
        afterServiceClose = null;
        done?.();
        return;
      }
      serviceAnimation?.cancel();
      serviceContentAnimation?.cancel();
      serviceClosing = true;
      serviceDialog.inert = true;
      if (!canAnimate()) {
        finishServiceClose();
        return;
      }
      serviceDialog.classList.add("is-closing");
      serviceAnimation = animate(
        serviceDialog,
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "translateY(14px) scale(.985)" },
        ],
        { duration: 220 },
      );
      serviceAnimation?.addEventListener("finish", finishServiceClose, { once: true });
    }
    function showService(id) {
      if (!services[id]) return;
      const wasClosing = serviceClosing;
      afterServiceClose = null;
      serviceCloseRequested = false;
      serviceAnimation?.cancel();
      serviceContentAnimation?.cancel();
      serviceClosing = false;
      serviceDialog.inert = false;
      serviceDialog.classList.remove("is-closing");
      const wasOpen = serviceDialog.open;
      fillService(id);
      serviceOpener ||= $(`.service-trigger[data-service="${id}"]`);
      if (!wasOpen) {
        serviceDialog.showModal();
        $("#service-close").focus({ preventScroll: true });
        serviceAnimation = animate(
          serviceDialog,
          [
            { opacity: 0, transform: "translateY(28px) scale(.965)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 560 },
        );
      } else {
        serviceContentAnimation = animate(
          $(".service-detail-layout"),
          [
            { opacity: 0, transform: "translateX(12px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 430 },
        );
        if (wasClosing) $("#service-close").focus({ preventScroll: true });
      }
    }
    function syncServiceRoute() {
      const id = serviceFromURL();
      if (services[id]) showService(id);
      else hideService();
    }
    function requestServiceClose() {
      if (serviceClosing || serviceCloseRequested) return;
      serviceCloseRequested = true;
      if (history.state?.fcServiceEntry) history.back();
      else {
        history.replaceState(null, "", `#${serviceId || "help"}`);
        hideService();
      }
    }
    document.querySelectorAll(".service-trigger").forEach((link) =>
      link.addEventListener("click", (event) => {
        if (!isPlainClick(event) || link.target || link.hasAttribute("download")) return;
        event.preventDefault();
        serviceOpener = link;
        history.pushState({ fcServiceEntry: true }, "", `#service-${link.dataset.service}`);
        showService(link.dataset.service);
      }),
    );
    serviceDialog.querySelectorAll("[data-service]").forEach((button) =>
      button.addEventListener("click", () => {
        if (serviceId === button.dataset.service) return;
        history.replaceState(history.state, "", `#service-${button.dataset.service}`);
        showService(button.dataset.service);
      }),
    );
    $("#service-close").addEventListener("click", requestServiceClose);
    serviceDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      requestServiceClose();
    });
    settlers.add(() => {
      if (serviceClosing) finishServiceClose();
    });
    addEventListener("popstate", syncServiceRoute);
    if (services[serviceFromURL()]) showService(serviceFromURL());
  }

  // Only same-document anchors receive scroll/focus polish; page changes stay native.
  document.querySelectorAll("a[href]:not(.service-trigger)").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (
        !isPlainClick(event) ||
        link.target ||
        link.hasAttribute("download") ||
        !link.hash ||
        !isSameDocument(link)
      )
        return;
      let id;
      try {
        id = decodeURIComponent(link.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      setMenu(false, { immediate: true });
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: canAnimate() ? "smooth" : "instant", block: "start" });
    }),
  );

  // Contact page: submit the enquiry to Formspree without leaving the page.
  // Without JS the form still posts normally and Formspree shows its own confirmation page.
  const enquiryForm = $("#enquiry-form");
  if (enquiryForm) {
    const status = $("#enquiry-status");
    const submit = enquiryForm.querySelector('button[type="submit"]');
    const setStatus = (message, state) => {
      status.textContent = message;
      status.classList.toggle("is-error", state === "error");
      status.classList.toggle("is-success", state === "success");
    };
    enquiryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      submit.disabled = true;
      setStatus("Sending…");
      try {
        const response = await fetch(enquiryForm.action, {
          method: "POST",
          body: new FormData(enquiryForm),
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
        enquiryForm.reset();
        setStatus("Thank you. Your enquiry has been sent and we’ll be in touch soon.", "success");
      } catch {
        setStatus("Sorry, your enquiry could not be sent. Please try again in a moment.", "error");
      } finally {
        submit.disabled = false;
      }
    });
  }

  // Bilingual legal pages (privacy notice): EN | BM switch.
  // The initial language (hash, then saved choice, then EN) is set by an inline script in <head>.
  const langButtons = document.querySelectorAll("[data-set-lang]");
  if (langButtons.length) {
    const root = document.documentElement;
    const titles = {
      en: document.body.dataset.titleEn || document.title,
      ms: document.body.dataset.titleMs || document.title,
    };
    const setLang = (lang, save) => {
      root.lang = lang;
      root.setAttribute("data-legal-lang", lang);
      langButtons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.setLang === lang)),
      );
      if (titles[lang]) document.title = titles[lang];
      if (save) {
        try {
          localStorage.setItem("bns-lang", lang);
        } catch {
          // Storage blocked: the switch still works for this visit.
        }
        history.replaceState(null, "", `#${lang}`);
      }
    };
    const current = root.getAttribute("data-legal-lang") === "ms" ? "ms" : "en";
    setLang(current, false);
    langButtons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.setLang, true)));
    window.addEventListener("hashchange", () => {
      const h = location.hash.slice(1);
      if (h === "en" || h === "ms") setLang(h, true);
    });
  }
})();
