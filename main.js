/* ---------- THEME INIT (Run immediately to prevent flash) ---------- */
const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
  document.documentElement.setAttribute('data-theme', 'light');
} else {
  document.documentElement.setAttribute('data-theme', 'dark');
}

/* ============================================
   CinePulse — Main JavaScript (2026)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initPageTransitions();

  fetchAllMovies();
});

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinks = document.querySelector('.navbar__links');
  const overlay = document.querySelector('.mobile-overlay');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      overlay.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ---------- THEME TOGGLE ---------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;
  
  const icon = toggleBtn.querySelector('.theme-toggle__icon');
  
  // Set initial icon based on what was applied at the top
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (icon) icon.textContent = isLight ? '☀️' : '🌙';
  
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (icon) {
      icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
    }
  });
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- BACK TO TOP ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- PAGE TRANSITIONS ---------- */
function initPageTransitions() {
  const transition = document.querySelector('.page-transition');
  if (!transition) return;

  // Fade out on load
  setTimeout(() => {
    transition.classList.remove('active');
  }, 100);

  // Fade in on navigate (Event Delegation)
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (href && /\.html(\?|$)/.test(href) && !href.startsWith('#') && !href.startsWith('http')) {
      e.preventDefault();
      
      // Save booking data to localStorage as fallback for servers that drop query params
      if (href.includes('book.html?')) {
        const queryString = href.split('?')[1];
        if (queryString) {
          const searchParams = new URLSearchParams(queryString);
          if (searchParams.has('type')) localStorage.setItem('bookingType', searchParams.get('type'));
          if (searchParams.has('name')) localStorage.setItem('bookingName', searchParams.get('name'));
          if (searchParams.has('genre')) localStorage.setItem('bookingGenre', searchParams.get('genre'));
          if (searchParams.has('lang')) localStorage.setItem('bookingLang', searchParams.get('lang'));
          if (searchParams.has('image')) localStorage.setItem('bookingImage', searchParams.get('image'));
        }
      }

      transition.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  });
}

/* ---------- TOAST NOTIFICATIONS ---------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: '🎬'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


/* ---------- HERO CAROUSEL ---------- */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  if (!slides.length) return;

  let current = 0;
  let interval;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = index;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoPlay() {
    interval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      goToSlide(i);
      startAutoPlay();
    });
  });

  startAutoPlay();
}

/* ---------- TMDB API FETCH ---------- */
async function fetchAndRenderMovies(url, gridId, limit = 6) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const movies = data.results.slice(0, limit);
    grid.innerHTML = '';

    const getGenreName = (ids) => {
      if (!ids || ids.length === 0) return 'Movie';
      const map = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western' };
      return map[ids[0]] || 'Movie';
    };

    const getLanguage = (lang) => {
      const map = { 'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil', 'ml': 'Malayalam', 'kn': 'Kannada', 'ja': 'Japanese', 'ko': 'Korean', 'fr': 'French', 'es': 'Spanish' };
      return map[lang] || lang.toUpperCase();
    };

    movies.forEach(movie => {
      const title = movie.title || movie.original_title;
      const genre = getGenreName(movie.genre_ids);
      const lang = getLanguage(movie.original_language);
      const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg';
      
      const bookUrl = `book.html?type=movie&name=${encodeURIComponent(title)}&genre=${encodeURIComponent(genre)}&lang=${encodeURIComponent(lang)}&image=${encodeURIComponent(imageUrl)}`;
      
      const cardHTML = `
        <a href="${bookUrl}" class="card">
          <div class="card__image-wrapper">
            <img src="${imageUrl}" alt="${title}" loading="lazy">
            <div class="card__overlay">
              <span class="card__overlay-btn">Book Tickets →</span>
            </div>
          </div>
          <div class="card__info">
            <h3 class="card__title">${title}</h3>
            <p class="card__meta">${genre} • ${lang}</p>
          </div>
        </a>
      `;
      grid.insertAdjacentHTML('beforeend', cardHTML);
    });

  } catch (error) {
    console.error(`Failed to fetch TMDB movies for ${gridId}:`, error);
    grid.innerHTML = '<p style="color:var(--text-muted); grid-column:1/-1; text-align:center;">Failed to load movies.</p>';
  }
}

function fetchAllMovies() {
  const apiKey = 'e60f7e5cf6e1b03d0796d59b1286bcb3';
  
  // Home page Trending
  if (document.getElementById('trendingMoviesGrid')) {
    fetchAndRenderMovies(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`, 'trendingMoviesGrid', 10);
  }
  
  // Movies page sections
  if (document.getElementById('upcomingMoviesGrid')) {
    fetchAndRenderMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`, 'upcomingMoviesGrid', 10);
  }
  
  if (document.getElementById('hindiMoviesGrid')) {
    fetchAndRenderMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=hi&sort_by=popularity.desc`, 'hindiMoviesGrid', 10);
  }
  
  if (document.getElementById('englishMoviesGrid')) {
    fetchAndRenderMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=en&sort_by=popularity.desc`, 'englishMoviesGrid', 10);
  }
}

