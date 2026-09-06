/**
 * MindfulDay – Main JavaScript
 * Shared utilities, navigation, tips, and page initialization
 */

const MindfulDay = {
  STORAGE_KEY: 'mindfulday_activities',

  /**
   * Initialize shared functionality
   */
  init() {
    this.initNavigation();
    this.initScrollEffects();
    this.initFadeInAnimations();
    this.initTipOfTheDay();
    this.initWeatherWidget();
    this.setActiveNavLink();
  },

  /**
   * Get all stored activities from localStorage
   */
  getActivities() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Save a completed activity to localStorage
   */
  saveActivity(activity) {
    const activities = this.getActivities();
    const entry = {
      id: Date.now().toString(),
      name: activity.name,
      category: activity.category,
      duration: activity.duration,
      date: activity.date || new Date().toISOString(),
      status: 'Completed'
    };
    activities.unshift(entry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
    return entry;
  },

  /**
   * Clear all activity history
   */
  clearActivities() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  /**
   * Format date for display
   */
  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Format duration in minutes
   */
  formatDuration(minutes) {
    if (minutes < 1) return '< 1 min';
    return `${minutes} min`;
  },

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  /**
   * Navigation – mobile menu & scroll effect
   */
  initNavigation() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar__toggle');
    const mobileMenu = document.querySelector('.navbar__mobile');

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        const icon = toggle.querySelector('[data-lucide]');
        if (icon && typeof lucide !== 'undefined') {
          icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
          lucide.createIcons();
        }
      });

      mobileMenu.querySelectorAll('.navbar__mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  },

  /**
   * Set active class on current page nav link
   */
  setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },

  /**
   * Smooth scroll for anchor links
   */
  initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  /**
   * Fade-in on scroll using Intersection Observer
   */
  initFadeInAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  },

  /**
   * Mindful Tip of the Day – rotates daily
   */
  initTipOfTheDay() {
    const tipElement = document.getElementById('tip-of-the-day');
    if (!tipElement) return;

    const tips = [
      'Take three slow breaths before checking your phone in the morning.',
      'Notice five things you can see around you right now.',
      'Set a gentle reminder to pause and stretch every hour.',
      'Before your next meal, take a moment to notice its colors and aromas.',
      'When walking, feel each step connecting with the ground.',
      'Close your eyes for ten seconds and listen to the nearest sound.',
      'Write down one thing you appreciate about today.',
      'Unclench your jaw and relax your shoulders — right now.',
      'Take a mindful sip of water and notice its temperature.',
      'Before bed, recall three calm moments from your day.',
      'Place one hand on your chest and breathe slowly for five counts.',
      'Step outside for one minute and feel the air on your skin.',
      'Between tasks, pause and take one conscious breath.',
      'Smile gently — even a small smile can shift your mood.',
      'Focus on the sensation of your feet on the floor for thirty seconds.',
      'Put your phone face-down and enjoy five minutes of quiet.',
      'Name one emotion you feel without judging it.',
      'Look out a window and observe something you haven\'t noticed before.',
      'Hum a soft note and feel the vibration in your chest.',
      'End your day by setting one gentle intention for tomorrow.',
      'When stressed, press your palms together firmly for five seconds.',
      'Eat one snack slowly, noticing every texture and flavor.',
      'Draw or doodle for two minutes without any goal.',
      'Repeat silently: "I am here, in this moment."',
      'Stand up, stretch your arms overhead, and breathe deeply.',
      'Send a kind thought to someone you care about.',
      'Count backwards from ten, breathing out on each number.',
      'Notice the weight of your body in your chair.',
      'Choose one activity today and do it with full attention.',
      'Allow yourself to do nothing for just sixty seconds.',
      'Listen to a favorite song and focus only on the melody.'
    ];

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    tipElement.textContent = tips[dayOfYear % tips.length];
  },

  /**
   * Weather widget on home page
   */
  async initWeatherWidget() {
    const widget = document.getElementById('weather-widget');
    if (!widget || typeof Integrations === 'undefined') return;

    const messageEl = widget.querySelector('.weather-widget__message');
    if (!messageEl) return;

    messageEl.textContent = 'Checking weather suggestion...';

    const result = await Integrations.getWeatherSuggestion();
    messageEl.textContent = result.message;
  },

  /**
   * AI-style activity recommendation based on user need
   */
  recommendActivity(need) {
    const recommendations = {
      break: { id: 'mindful-pause', reason: 'A short pause can help you reset.' },
      focus: { id: 'focus-reset', reason: 'This quick focus exercise can help you refocus.' },
      relax: { id: 'body-awareness', reason: 'This relaxation activity can help you unwind.' },
      breathe: { id: 'one-minute-breathing', reason: 'Breathing exercises are great for calming the mind.' },
      new: { id: 'five-senses', reason: 'Try this grounding exercise — many people find it refreshing.' },
      two_minutes: { id: 'focus-reset', reason: 'This 2-minute exercise fits your schedule perfectly.' },
      five_minutes: { id: 'mindful-pause', reason: 'This 5-minute pause is ideal for a short break.' }
    };

    return recommendations[need] || recommendations.break;
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  MindfulDay.init();
  if (typeof MindfulBot !== 'undefined') MindfulBot.init();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
