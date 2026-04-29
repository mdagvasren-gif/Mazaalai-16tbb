const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const hero = document.querySelector(".hero");
const form = document.querySelector(".join-form");
const formNote = document.querySelector(".form-note");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const membersMarquee = document.querySelector(".members-marquee");
const routeCards = document.querySelectorAll(".route-card");
const routeModal = document.querySelector("#route-modal");
const routeModalTitle = document.querySelector("#route-modal-title");
const routeModalSummary = document.querySelector("#route-modal-summary");
const routeModalMeta = document.querySelector("#route-modal-meta");
const routeModalPrep = document.querySelector("#route-modal-prep");
const finePointer = window.matchMedia("(pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const darkToneSections = document.querySelectorAll(
  ".mission-section, .routes-section, .team-section, .members-section, .site-footer",
);

const isPointOverDark = (x, y) =>
  [...darkToneSections].some((section) => {
    const rect = section.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });

const updateHeader = () => {
  if (!header) return;
  header.dataset.scrolled = window.scrollY > 16 ? "true" : "false";
  const probeY = Math.min(window.innerHeight - 1, header.offsetHeight + 12);
  header.dataset.tone = isPointOverDark(window.innerWidth / 2, probeY) ? "dark" : "light";
};

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const smooth = (value) => value * value * (3 - 2 * value);

const updateHeroScroll = () => {
  if (!hero || reducedMotion.matches) return;
  const rect = hero.getBoundingClientRect();
  const distance = Math.max(360, window.innerHeight * 0.62);
  const progress = smooth(clamp(-rect.top / distance));
  const isMobile = window.innerWidth <= 620;
  const copyLift = isMobile ? 78 : 245;
  const logoLift = isMobile ? 42 : 96;

  hero.style.setProperty("--hero-logo-opacity", String(1 - progress));
  hero.style.setProperty("--hero-logo-scale", String(1 - progress * 0.66));
  hero.style.setProperty("--hero-logo-y", `${-progress * logoLift}px`);
  hero.style.setProperty("--hero-copy-y", `${-progress * copyLift}px`);
  hero.style.setProperty("--hero-copy-scale", String(1 + progress * 0.025));
  hero.style.setProperty("--hero-cue-opacity", String(Math.max(0, 1 - progress * 1.45)));
  hero.style.setProperty("--hero-cue-y", `${-progress * 28}px`);
};

let scrollFrame = 0;
const requestScrollUpdate = () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    updateHeader();
    updateHeroScroll();
    scrollFrame = 0;
  });
};

const closeNav = () => {
  if (!nav || !header || !navToggle) return;
  nav.classList.remove("is-open");
  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
updateHeader();
updateHeroScroll();

if (finePointer.matches) {
  const cursor = document.createElement("span");
  cursor.className = "paw-cursor";
  cursor.setAttribute("aria-hidden", "true");
  const cursorImage = document.createElement("img");
  cursorImage.src = "./assets/mazaalai-paw-cursor.png";
  cursorImage.alt = "";
  cursor.appendChild(cursorImage);
  document.body.appendChild(cursor);
  document.body.classList.add("has-custom-cursor");

  const moveCursor = (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add("is-visible");
    cursor.classList.toggle("is-dark", isPointOverDark(event.clientX, event.clientY));
    cursor.classList.toggle(
      "is-pointer",
      Boolean(event.target.closest("a, button, input, select, textarea, label")),
    );
  };

  window.addEventListener("pointermove", moveCursor, { passive: true });
  window.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
  window.addEventListener("pointerdown", () => cursor.classList.add("is-pointer"));
  window.addEventListener("pointerup", () => cursor.classList.remove("is-pointer"));
}

const routeDetails = [
  ["8 км", "Хялбар", "Хавар", "3 цаг"],
  ["14 км", "Дунд", "Зун", "5 цаг"],
  ["11 км", "Хялбар", "Намар", "4 цаг"],
  ["28 км", "Дунд", "Зун", "2 өдөр"],
  ["32 км", "Хүнд", "Зун", "3 өдөр"],
  ["24 км", "Хүнд", "Намар", "2 өдөр"],
  ["18 км", "Дунд", "Зун", "7 цаг"],
];

routeCards.forEach((card, index) => {
  if (card.querySelector(".route-details")) return;
  const details = document.createElement("div");
  details.className = "route-details";
  routeDetails[index % routeDetails.length].forEach((item) => {
    const chip = document.createElement("span");
    chip.textContent = item;
    details.appendChild(chip);
  });
  card.appendChild(details);
});

if (finePointer.matches && routeCards.length) {
  routeCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.classList.add("is-active");
      card.style.setProperty("--route-tilt-x", `${x * 10}deg`);
      card.style.setProperty("--route-tilt-y", `${y * -8}deg`);
      card.style.setProperty("--route-bg-x", `${50 + x * 8}%`);
      card.style.setProperty("--route-bg-y", `${50 + y * 8}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-active");
      card.style.removeProperty("--route-tilt-x");
      card.style.removeProperty("--route-tilt-y");
      card.style.removeProperty("--route-bg-x");
      card.style.removeProperty("--route-bg-y");
    });
  });
}

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeNav();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

if (navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.toggleAttribute("aria-current", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: "-42% 0px -52%",
      threshold: 0,
    },
  );

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) navObserver.observe(section);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px",
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

if (membersMarquee) {
  const membersTrack = membersMarquee.querySelector(".members-track");
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  if (membersTrack && !membersTrack.dataset.cloned) {
    [...membersTrack.children].forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      membersTrack.appendChild(clone);
    });
    membersTrack.dataset.cloned = "true";
  }

  membersMarquee.addEventListener("pointerdown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartScroll = membersMarquee.scrollLeft;
    membersMarquee.classList.add("is-dragging");
    membersMarquee.setPointerCapture(event.pointerId);
  });

  membersMarquee.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    membersMarquee.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });

  const stopMemberDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    membersMarquee.classList.remove("is-dragging");
    if (membersMarquee.hasPointerCapture(event.pointerId)) {
      membersMarquee.releasePointerCapture(event.pointerId);
    }
  };

  membersMarquee.addEventListener("pointerup", stopMemberDrag);
  membersMarquee.addEventListener("pointercancel", stopMemberDrag);
  membersMarquee.addEventListener("dragstart", (event) => event.preventDefault());
}

if (form && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "Танд").trim();
    formNote.textContent = `${name || "Танд"}, баярлалаа. Мазаалай 16 клуб удахгүй танд мэдээлэл илгээнэ.`;
    form.reset();
  });
}
