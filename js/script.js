const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const navLinks = [...document.querySelectorAll('.nav-link')];
const backTop = document.querySelector('[data-back-top]');
const parallaxImage = document.querySelector('[data-parallax]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projects = [
  {
    title: 'Akbulut Deniz Sitesi',
    category: 'Konut + Ticari',
    year: '2026',
    location: 'Büyükçekmece',
    area: '32420 m²',
    image: 'assets/ads1.png',
    description:
      'Kordonboyu Caddesi üzerinde bulunan kentsel dönüşüm projemiz, panoramik balonlarla kesintisiz deniz manzarasını kullanıcılarına sunmaktadır.',
    gallery: ['assets/ads2.png', 'assets/ads3.png', 'assets/ads5.png', 'assets/ads6.png'],
  },
  {
    title: 'Stone Apartment',
    category: 'Interior',
    year: '2025',
    location: 'İstanbul',
    area: '165 m²',
    image: 'assets/project2.jpg',
    description:
      'A calm interior proposal defined by limestone surfaces, warm joinery and carefully held daylight.',
    gallery: ['assets/project2.jpg', 'assets/project1.jpg', 'assets/project3.jpg'],
  },
  {
    title: 'Akbulut Icon',
    category: 'Kentsel Dönüşüm',
    year: '2026',
    location: 'İstanbul - Büyükçekmece',
    area: '2.500 m²',
    image: 'assets/ıcon1.png',
    description:
      'A visual study for an urban residential frame, developed to clarify mass, depth and evening atmosphere.',
    gallery: ['assets/ıcon2.png', 'assets/ıcon3.png', 'assets/ıcon4.png', 'assets/ıcon5.png', 'assets/ıcon6.png', 'assets/ıcon7.png'],
  },
];

function setHeaderState() {
  const isScrolled = window.scrollY > 40;
  header.classList.toggle('scrolled', isScrolled);
  backTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);

  if (parallaxImage && !prefersReducedMotion) {
    parallaxImage.style.transform = 'translate3d(0, ' + window.scrollY * 0.12 + 'px, 0) scale(1.04)';
  }
}

function toggleMenu(forceOpen) {
  const open = typeof forceOpen === 'boolean' ? forceOpen : !navMenu.classList.contains('is-open');
  navMenu.classList.toggle('is-open', open);
  header.classList.toggle('menu-active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  document.body.classList.toggle('nav-open', open);
}

navToggle.addEventListener('click', () => toggleMenu());
navLinks.forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((element) => {
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll('main section[id]')];
const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  },
  { threshold: 0.38 }
);

sections.forEach((section) => spyObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('[data-counter]').forEach((counter) => counterObserver.observe(counter));

function animateCounter(element) {
  const target = Number(element.dataset.target);
  const duration = prefersReducedMotion ? 1 : 1300;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function showProjectModal(project) {
  const modal = document.querySelector('[data-modal]');
  const mainImage = document.querySelector('[data-modal-image]');
  const category = document.querySelector('[data-modal-category]');
  const title = document.getElementById('modal-title');
  const year = document.querySelector('[data-modal-year]');
  const location = document.querySelector('[data-modal-location]');
  const area = document.querySelector('[data-modal-area]');
  const description = document.querySelector('[data-modal-description]');
  const galleryContainer = document.querySelector('[data-modal-gallery]');

  if (!modal || !mainImage) return;

  // Bilgileri dolduruyoruz
  mainImage.setAttribute('src', project.image);
  if (category) category.textContent = project.category;
  if (title) title.textContent = project.title;
  if (year) year.textContent = project.year;
  if (location) location.textContent = project.location;
  if (area) area.textContent = project.area;
  if (description) description.textContent = project.description;

  // Galeriyi temizle ve yeniden oluştur
  if (galleryContainer) {
    if (project.gallery && project.gallery.length > 0) {
      galleryContainer.innerHTML = project.gallery
        .map((src) => `<img src="${src}" alt="${project.title} detail" loading="lazy" />`)
        .join('');
        
      // Küçük resimlerin başlangıç opaklığını ayarla
      galleryContainer.querySelectorAll('img').forEach(img => img.style.opacity = '0.5');
    } else {
      galleryContainer.innerHTML = '';
    }
  }

  // Modalı göster
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

// =======================================================
// GÜVENLİ VE İZOLE GALERİ TIKLAMA KONTROLLERİ
// =======================================================

// 1. Alttaki Küçük Resimlere Tıklayınca Büyük Resmi Değiştirme
document.addEventListener('click', (event) => {
  const galleryImg = event.target.closest('[data-modal-gallery] img');
  if (!galleryImg) return; 

  event.preventDefault();
  event.stopPropagation();

  const mainImage = document.querySelector('[data-modal-image]');
  if (mainImage) {
    mainImage.setAttribute('src', galleryImg.getAttribute('src'));
    
    // Aktiflik efektini güncelle
    document.querySelectorAll('[data-modal-gallery] img').forEach(img => {
      img.style.opacity = '0.5';
      img.style.border = 'none';
    });
    galleryImg.style.opacity = '1';
    galleryImg.style.border = '2px solid #ffffff';
  }
});

// 2. Büyük Resme Tıklayınca Sıradaki Resme Geçme
document.addEventListener('click', (event) => {
  const mainImage = event.target.closest('[data-modal-image]');
  if (!mainImage) return; 

  event.preventDefault();
  event.stopPropagation();

  const currentSrc = mainImage.getAttribute('src');
  // Proje Kartlarına Tıklanınca Modalı Açan Güvenli Kod
// =======================================================
// PROJE KARTLARI VE GÜVENLİ MODAL TETİKLEYİCİSİ
// =======================================================
document.querySelectorAll('[data-project-id]').forEach((card) => {
  card.addEventListener('click', (event) => {
    // Eğer halihazırda modal zaten açıksa kart tıklamasını tamamen iptal et
    if (document.body.classList.contains('modal-open')) return;
    
    const project = projects[Number(card.dataset.projectId)];
    if (project) {
      showProjectModal(project);
    }
  });
});

// Sayfa yukarı kaydırma butonu
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Otomatik yıl güncellemesi
const yearElement = document.querySelector('[data-year]');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Sayfa yüklenme animasyon tetikleyicileri
window.addEventListener('load', () => {
  window.setTimeout(() => document.body.classList.add('loaded'), 420);
});
window.setTimeout(() => document.body.classList.add('loaded'), 1800);


// ==========================================
// MODAL GÖSTERİMİ VE DINAMIK GALERİ VERİLERİ
// ==========================================
function showProjectModal(project) {
  const modal = document.querySelector('[data-modal]');
  const mainImage = document.querySelector('[data-modal-image]');
  const category = document.querySelector('[data-modal-category]');
  const title = document.getElementById('modal-title');
  const year = document.querySelector('[data-modal-year]');
  const location = document.querySelector('[data-modal-location]');
  const area = document.querySelector('[data-modal-area]');
  const description = document.querySelector('[data-modal-description]');
  const galleryContainer = document.querySelector('[data-modal-gallery]');

  if (!modal || !mainImage) return;

  // Bilgileri dolduruyoruz
  mainImage.setAttribute('src', project.image);
  if (category) category.textContent = project.category;
  if (title) title.textContent = project.title;
  if (year) year.textContent = project.year;
  if (location) location.textContent = project.location;
  if (area) area.textContent = project.area;
  if (description) description.textContent = project.description;

  // Galeriyi oluştur
  if (galleryContainer) {
    if (project.gallery && project.gallery.length > 0) {
      galleryContainer.innerHTML = project.gallery
        .map((src) => `<img src="${src}" alt="${project.title} detail" loading="lazy" />`)
        .join('');
        
      // Küçük resimlerin başlangıç opaklığını ayarla
      galleryContainer.querySelectorAll('img').forEach(img => img.style.opacity = '0.5');
    } else {
      galleryContainer.innerHTML = '';
    }
  }

  // Modalı göster ve body'yi kilitle
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}


// =======================================================
// GÜVENLİ VE İZOLE GALERİ TIKLAMA KONTROLLERİ
// =======================================================

// 1. Alttaki Küçük Resimlere Tıklayınca Büyük Resmi Değiştirme
document.addEventListener('click', (event) => {
  const galleryImg = event.target.closest('[data-modal-gallery] img');
  if (!galleryImg) return; 

  event.preventDefault();
  event.stopPropagation(); // Tıklamanın dışarı taşmasını önler

  const mainImage = document.querySelector('[data-modal-image]');
  if (mainImage) {
    mainImage.setAttribute('src', galleryImg.getAttribute('src'));
    
    // Aktiflik efektlerini güncelle
    document.querySelectorAll('[data-modal-gallery] img').forEach(img => {
      img.style.opacity = '0.5';
      img.style.border = 'none';
    });
    galleryImg.style.opacity = '1';
    galleryImg.style.border = '2px solid #ffffff';
  }
});

// 2. Büyük Resme Tıklayınca Sıradaki Resme Geçme
document.addEventListener('click', (event) => {
  const mainImage = event.target.closest('[data-modal-image]');
  if (!mainImage) return; 

  event.preventDefault();
  event.stopPropagation(); // Döngü koruması

  const currentSrc = mainImage.getAttribute('src');
  const galleryImages = Array.from(document.querySelectorAll('[data-modal-gallery] img'));
  if (galleryImages.length === 0) return;

  let currentIndex = galleryImages.findIndex(img => img.getAttribute('src') === currentSrc);
  
  if (currentIndex === -1) {
    currentIndex = -1;
  }
  
  const nextIndex = (currentIndex + 1) % galleryImages.length;
  const nextSrc = galleryImages[nextIndex].getAttribute('src');
  
  mainImage.setAttribute('src', nextSrc);
  
  // Küçük resimleri senkronize et
  galleryImages.forEach((img, idx) => {
    if (idx === nextIndex) {
      img.style.opacity = '1';
      img.style.border = '2px solid #ffffff';
    } else {
      img.style.opacity = '0.5';
      img.style.border = 'none';
    }
  });
});

// =======================================================
// MODALIN KAPANMASINI SAĞLAYAN TAM KORUMA KODU
// =======================================================
document.querySelectorAll('[data-modal-close]').forEach((closer) => {
  closer.addEventListener('click', () => {
    const modal = document.querySelector('[data-modal]');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      // Sitenin kilitlenmesini önleyen altın vuruş burası:
      document.body.classList.remove('modal-open'); 
    }
  });
});
