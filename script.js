const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const currentYear = document.getElementById("currentYear");
const footerToggle = document.getElementById("footerToggle");
const footerCities = document.getElementById("footerCities");

const heroPuffs = document.getElementById("heroPuffs");
const heroFlavor = document.getElementById("heroFlavor");
const heroLabel = document.getElementById("heroLabel");
const heroCount = document.getElementById("heroCount");
const heroTrack = document.getElementById("heroTrack");
const sliderDots = document.getElementById("sliderDots");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const bannerTrack = document.getElementById("bannerTrack");
const bannerViewport = document.querySelector(".banner-slider__viewport");
const bannerDots = document.getElementById("bannerDots");
const bannerPrev = document.getElementById("bannerPrev");
const bannerNext = document.getElementById("bannerNext");
const testimonialsTrack = document.getElementById("testimonialsTrack");
const testimonialsDots = document.getElementById("testimonialsDots");
const testimonialsPrev = document.getElementById("testimonialsPrev");
const testimonialsNext = document.getElementById("testimonialsNext");

const heroSlides = getHeroSlides();

let currentSlide = 0;
let currentBanner = 0;
let currentTestimonial = 0;

function getBannerSlides() {
  return bannerTrack ? Array.from(bannerTrack.children) : [];
}

function getTestimonialCards() {
  return testimonialsTrack ? Array.from(testimonialsTrack.children) : [];
}

function markEmptyImages() {
  document.querySelectorAll(".image-placeholder").forEach((wrapper) => {
    const image = wrapper.querySelector("img");
    if (!image) return;

    const placeholderLabel = image.dataset.placeholder || "Substitui esta imagem";
    wrapper.dataset.label = !image.getAttribute("src") ? placeholderLabel : "";
    wrapper.classList.toggle("is-empty", !image.getAttribute("src"));
  });
}

function extractPuffs(text) {
  const match = text.match(/(\d+\s*K)/i);
  return match ? match[1].replace(/\s+/g, "").toUpperCase() : "0%";
}

function extractFlavor(text) {
  const parts = text
    .replace(/\.[^.]+$/, "")
    .split("/")
    .pop()
    .split("-")
    .filter(Boolean);

  const portugalIndex = parts.findIndex((part) => part.toLowerCase() === "portugal");
  const tragadasIndex = parts.findIndex((part) => part.toLowerCase().includes("tragadas"));
  const nicotineIndex = parts.findIndex((part) => part.toLowerCase().includes("nicotina"));
  const endIndex = nicotineIndex > -1 ? nicotineIndex : tragadasIndex > -1 ? tragadasIndex : parts.length;
  const startIndex = portugalIndex > -1 ? portugalIndex + 1 : 0;
  const flavorParts = parts.slice(startIndex, endIndex).filter((part) => !/^\d+$/.test(part) && !/^\d+k$/i.test(part));

  if (!flavorParts.length) {
    return "Sabor em destaque";
  }

  return flavorParts.join(" ");
}

function getHeroSlides() {
  if (!heroTrack) return [];

  return Array.from(heroTrack.querySelectorAll(".hero-slide img")).map((image, index) => {
    const src = image.getAttribute("src") || "";
    const alt = image.getAttribute("alt") || "";
    const flavor = image.dataset.flavor || extractFlavor(src) || alt || `Produto ${index + 1}`;
    const puffs = image.dataset.puffs || extractPuffs(src) || extractPuffs(alt);
    const label = image.dataset.label || "Sem nicotina";

    return {
      image: src,
      puffs,
      flavor,
      label
    };
  });
}

function renderDots() {
  if (!sliderDots) return;

  sliderDots.innerHTML = "";
  heroSlides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = index === currentSlide ? "is-active" : "";
    dot.setAttribute("aria-label", `Ir para o produto ${index + 1}`);
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateHeroSlide();
    });
    sliderDots.appendChild(dot);
  });
}

function updateHeroSlide() {
  currentSlide = ((currentSlide % heroSlides.length) + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[currentSlide];

  if (heroPuffs) {
    heroPuffs.textContent = slide.puffs;
  }

  if (heroFlavor) {
    heroFlavor.textContent = slide.flavor;
  }

  if (heroLabel) {
    heroLabel.textContent = slide.label;
  }

  if (heroCount) {
    heroCount.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(heroSlides.length).padStart(2, "0")}`;
  }

  if (heroTrack) {
    heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  renderDots();
}

function renderBannerDots(total) {
  bannerDots.innerHTML = "";
  for (let index = 0; index < total; index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = index === currentBanner ? "is-active" : "";
    dot.setAttribute("aria-label", `Ir para o banner ${index + 1}`);
    dot.addEventListener("click", () => {
      currentBanner = index;
      updateBannerSlider();
    });
    bannerDots.appendChild(dot);
  }
}

function updateBannerSlider() {
  if (!bannerTrack) return;

  const slides = getBannerSlides();
  const total = slides.length;
  if (!total) return;

  currentBanner = ((currentBanner % total) + total) % total;
  bannerTrack.style.width = `${total * 100}%`;
  slides.forEach((slide) => {
    slide.style.flex = `0 0 ${100 / total}%`;
    slide.style.minWidth = `${100 / total}%`;
  });
  bannerTrack.style.transform = `translateX(-${(currentBanner * 100) / total}%)`;

  renderBannerDots(total);
}

function getTestimonialsPerView() {
  if (window.innerWidth <= 820) return 1;
  if (window.innerWidth <= 1080) return 2;
  return 4;
}

function renderTestimonialDots(totalPages) {
  if (!testimonialsDots) return;

  testimonialsDots.innerHTML = "";
  for (let index = 0; index < totalPages; index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = index === currentTestimonial ? "is-active" : "";
    dot.setAttribute("aria-label", `Ir para o grupo de testemunhos ${index + 1}`);
    dot.addEventListener("click", () => {
      currentTestimonial = index;
      updateTestimonialsSlider();
    });
    testimonialsDots.appendChild(dot);
  }
}

function updateTestimonialsSlider() {
  if (!testimonialsTrack) return;

  const cards = getTestimonialCards();
  const total = cards.length;
  if (!total) return;

  const perView = getTestimonialsPerView();
  const totalPages = Math.max(1, Math.ceil(total / perView));
  currentTestimonial = ((currentTestimonial % totalPages) + totalPages) % totalPages;
  const mobileSingleCardWidth = window.innerWidth <= 560 ? "calc(100% - 1.3rem)" : "calc(100% - 1.7rem)";

  cards.forEach((card) => {
    card.style.flex = perView === 1
      ? `0 0 ${mobileSingleCardWidth}`
      : `0 0 calc(${100 / perView}% - ${(perView - 1) * 1}rem / ${perView})`;
  });

  const firstCard = cards[0];
  const trackGap = parseFloat(window.getComputedStyle(testimonialsTrack).gap || "0");
  const pageOffset = firstCard ? (firstCard.getBoundingClientRect().width + trackGap) * perView * currentTestimonial : 0;

  testimonialsTrack.style.transform = `translateX(-${pageOffset}px)`;
  renderTestimonialDots(totalPages);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

if (footerToggle && footerCities) {
  footerCities.style.display = "none";

  footerToggle.addEventListener("click", () => {
    const expanded = footerToggle.getAttribute("aria-expanded") === "true";
    footerToggle.setAttribute("aria-expanded", String(!expanded));
    footerCities.style.display = expanded ? "none" : "flex";
  });
}

prevSlide?.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
  updateHeroSlide();
});

nextSlide?.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % heroSlides.length;
  updateHeroSlide();
});

bannerPrev?.addEventListener("click", () => {
  const total = getBannerSlides().length;
  if (!total) return;
  currentBanner = (currentBanner - 1 + total) % total;
  updateBannerSlider();
});

bannerNext?.addEventListener("click", () => {
  const total = getBannerSlides().length;
  if (!total) return;
  currentBanner = (currentBanner + 1) % total;
  updateBannerSlider();
});

testimonialsPrev?.addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(getTestimonialCards().length / getTestimonialsPerView()));
  currentTestimonial = (currentTestimonial - 1 + totalPages) % totalPages;
  updateTestimonialsSlider();
});

testimonialsNext?.addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(getTestimonialCards().length / getTestimonialsPerView()));
  currentTestimonial = (currentTestimonial + 1) % totalPages;
  updateTestimonialsSlider();
});

window.addEventListener("resize", () => {
  updateBannerSlider();
  updateTestimonialsSlider();
});


if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
markEmptyImages();
updateHeroSlide();

window.addEventListener("DOMContentLoaded", () => {
  updateBannerSlider();
  updateTestimonialsSlider();
});

