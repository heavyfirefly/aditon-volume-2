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
    description: 'Kordonboyu Caddesi üzerinde bulunan kentsel dönüşüm projemiz, panoramik balonlarla kesintisiz deniz manzarasını kullanıcılarına sunmaktadır.',
    gallery: ['assets/ads2.png', 'assets/ads3.png', 'assets/ads5.png', 'assets/ads6.png'],
  },
  {
    title: 'Stone Apartment',
    category: 'Interior',
    year: '2025',
    location: 'İstanbul',
    area: '165 m²',
    image: 'assets/project2.jpg',
    description: 'A calm interior proposal defined by limestone surfaces, warm joinery and carefully held daylight.',
    gallery: ['assets/project2.jpg', 'assets/project1.jpg', 'assets/project3.jpg'],
  },
  {
    title: 'Akbulut Plaza',
    category: 'Commercial',
    year: '2024',
    location: 'Büyükçekmece',
    area: '12000 m²',
    image: 'assets/ads4.png',
    description: 'Modern office blocks integrated with social terraces and a double-skin facade system for climate control.',
    gallery: ['assets/ads4.png'],
  }
];

// HEADER VE NAVİGASYON
const handleScroll = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 50);
  if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 300);
};

window.addEventListener('scroll', handleScroll, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.getAttribute('aria-hidden') === 'false';
    navMenu.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    document.body.classList.toggle('nav-open', !isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu) {
      navMenu.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });
});

// PARALLAX EFEKTİ
if (parallaxImage && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const speed = 0.4;
    const rect = parallaxImage.parentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const shift = (window.innerHeight - rect.top) * speed;
      parallaxImage.style.transform = `translate3d(0, ${shift}px, 0)`;
    }
  }, { passive: true });
}

// SLIDER (TESTIMONIALS)
const slides = [...document.querySelectorAll('.testimonial')];
const sliderButtons = [...document.querySelectorAll('[data-slide]')];
let currentSlide = 0;
let sliderInterval;

const showSlide = (index) => {
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  sliderButtons.forEach((btn, i) => btn.classList.toggle('is-active', i === index));
  currentSlide = index;
};

const nextSlide = () => showSlide((currentSlide + 1) % slides.length);
const startSlider = () => { clearInterval(sliderInterval); sliderInterval = window.setInterval(nextSlide, 5000); };

sliderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showSlide(Number(button.dataset.slide));
    startSlider();
  });
});
if (slides.length) startSlider();

// FORM İŞLEMLERİ
const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    const invalidFields = fields.filter((field) => !field.checkValidity());
    fields.forEach((field) => field.closest('label').classList.toggle('invalid', !field.checkValidity()));

    if (invalidFields.length) {
      if (formStatus) formStatus.textContent = 'Please complete the required fields.';
      invalidFields[0].focus();
      return;
    }
    if (formStatus) formStatus.textContent = 'Thank you. We will contact you shortly.';
    form.reset();
  });
}

// RIPPLE EFFECT
document.querySelectorAll('.button').forEach((button) => {
  button.addEventListener('click', (event) => {
    if (event.target !== button && !event.target.classList.contains('button')) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = event.offsetX + 'px';
    ripple.style.top = event.offsetY + 'px';
    button.append(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  });
});

if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const yearElement = document.querySelector('[data-year]');
if (yearElement) yearElement.textContent = new Date().getFullYear();

window.addEventListener('load', () => window.setTimeout(() => document.body.classList.add('loaded'), 420));
window.setTimeout(() => document.body.classList.add('loaded'), 1800);


// =======================================================
// GÜVENLİ VE AYRIŞTIRILMIŞ MODAL / GALERİ SİSTEMİ
// =======================================================

// 1. Proje Kartlarına Tıklanınca Modalı Güvenli Açma
document.querySelectorAll('[data-project-id]').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (document.body.classList.contains('modal-open')) return;
    
    const project = projects[Number(card.dataset.projectId)];
    if (project) {
      showProjectModal(project);
    }
  });
});

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

  mainImage.setAttribute('src', project.image);
  if (category) category.textContent = project.category;
  if (title) title.textContent = project.title;
  if (year) year.textContent = project.year;
  if (location) location.textContent = project.location;
  if (area) area.textContent = project.area;
  if (description) description.textContent = project.description;

  if (galleryContainer) {
    if (project.gallery && project.gallery.length > 0) {
      galleryContainer.innerHTML = project.gallery
        .map((src) => `<img src="${src}" alt="${project.title} detail" loading="lazy" />`)
        .join('');
      
      // İlk resmi aktif göster, diğerlerini hafif soluk yap
      galleryContainer.querySelectorAll('img').forEach((img) => {
        img.style.opacity = img.getAttribute('src') === project.image ? '1' : '0.5';
        if (img.getAttribute('src') === project.image) img.style.border = '2px solid #ffffff';
      });
    } else {
      galleryContainer.innerHTML = '';
    }
  }

  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

// 2. Modalı Kapatma Tetikleyicileri (Çakışma Önleyicili Kesin Kapatma)
document.querySelectorAll('[data-modal-close]').forEach((closer) => {
  closer.addEventListener('click', (event) => {
    // Tıklama perdenin kendisine mi yapıldı yoksa içindeki galeriye mi? Ayrıştırıyoruz.
    if (closer.classList.contains('project-modal__backdrop') && event.target !== closer) return;

    const modal = document.querySelector('[data-modal]');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  });
});

// 3. Küçük Resimlere Tıklayınca Büyük Resmi Değiştirme
document.addEventListener('click', (event) => {
  const galleryImg = event.target.closest('[data-modal-gallery] img');
  if (!galleryImg) return;

  event.preventDefault();
  event.stopPropagation(); // Üst perdedeki kapatma tetiğine sızmayı engeller!

  const mainImage = document.querySelector('[data-modal-image]');
  if (mainImage) {
    mainImage.setAttribute('src', galleryImg.getAttribute('src'));
    
    document.querySelectorAll('[data-modal-gallery] img').forEach(img => {
      img.style.opacity = '0.5';
      img.style.border = 'none';
    });
    galleryImg.style.opacity = '1';
    galleryImg.style.border = '2px solid #ffffff';
  }
});

// 4. Büyük Resme Tıklayınca Sıradaki Resme Geçme
document.addEventListener('click', (event) => {
  const mainImage = event.target.closest('[data-modal-image]');
  if (!mainImage) return;

  event.preventDefault();
  event.stopPropagation(); // Üst perdedeki kapatma tetiğine sızmayı engeller!

  const currentSrc = mainImage.getAttribute('src');
  const galleryImages = Array.from(document.querySelectorAll('[data-modal-gallery] img'));
  if (galleryImages.length === 0) return;

  let currentIndex = galleryImages.findIndex(img => img.getAttribute('src') === currentSrc);
  if (currentIndex === -1) currentIndex = -1;

  const nextIndex = (currentIndex + 1) % galleryImages.length;
  const nextSrc = galleryImages[nextIndex].getAttribute('src');

  mainImage.setAttribute('src', nextSrc);

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
