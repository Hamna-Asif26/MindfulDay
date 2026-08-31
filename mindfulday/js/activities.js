/**
 * MindfulDay – Activities Page
 * Activity library, modal timer, breathing guide, localStorage logging
 */

const Activities = {
  activities: [
    {
      id: 'one-minute-breathing',
      title: 'One-Minute Breathing',
      description: 'A quick breathing exercise to centre yourself. Follow the visual guide as you breathe in, hold, and breathe out.',
      duration: 1,
      category: 'Breathing',
      icon: 'wind',
      hasBreathingGuide: true,
      instructions: 'Find a comfortable position. Follow the breathing circle — breathe in as it expands, hold when prompted, and breathe out as it contracts. Continue for one minute.'
    },
    {
      id: 'mindful-pause',
      title: 'Five-Minute Mindful Pause',
      description: 'Step away from distractions and take a gentle pause. Notice your surroundings and let your mind settle.',
      duration: 5,
      category: 'Relaxation',
      icon: 'pause-circle',
      instructions: 'Sit comfortably and close your eyes if you wish. Notice your breath without changing it. When thoughts arise, gently return your attention to breathing. Continue for five minutes.'
    },
    {
      id: 'five-senses',
      title: 'Five-Senses Grounding',
      description: 'Use your five senses to anchor yourself in the present moment. A simple grounding technique for everyday use.',
      duration: 4,
      category: 'Grounding',
      icon: 'hand',
      instructions: 'Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. Take your time with each sense.'
    },
    {
      id: 'focus-reset',
      title: 'Focus Reset',
      description: 'A brief exercise to clear mental clutter and return your attention to what matters most.',
      duration: 2,
      category: 'Focus',
      icon: 'target',
      instructions: 'Write down or mentally note three things on your mind. Acknowledge each one, then set them aside. Choose one task to focus on for the next period. Breathe deeply three times.'
    },
    {
      id: 'mindful-observation',
      title: 'Mindful Observation',
      description: 'Choose an object near you and observe it with full attention — colour, shape, texture, and details.',
      duration: 3,
      category: 'Focus',
      icon: 'eye',
      instructions: 'Pick any object within reach. Study it as if seeing it for the first time. Notice colours, shapes, textures, and shadows. If your mind wanders, gently return to observing.'
    },
    {
      id: 'body-awareness',
      title: 'Body Awareness Pause',
      description: 'Scan your body from head to toe, noticing areas of tension and gently releasing them.',
      duration: 5,
      category: 'Relaxation',
      icon: 'heart',
      instructions: 'Starting at the top of your head, slowly move your attention down through your body. Notice each area without judgement. If you find tension, breathe into that area and let it soften.'
    },
    {
      id: 'gratitude-reflection',
      title: 'Gratitude Reflection',
      description: 'Take a moment to reflect on three things you appreciate today, big or small.',
      duration: 3,
      category: 'Reflection',
      icon: 'sun',
      instructions: 'Think of three things you are grateful for today. They can be simple — a warm drink, a kind word, or a moment of quiet. Hold each one in your mind for a few breaths.'
    },
    {
      id: 'digital-detox',
      title: 'Digital Detox Moment',
      description: 'Put your devices aside and enjoy a few minutes of screen-free calm.',
      duration: 5,
      category: 'Reflection',
      icon: 'smartphone-off',
      instructions: 'Place your phone face-down or in another room. Sit quietly or take a short walk. Notice how it feels to be without screens. Use this time to breathe, stretch, or simply be present.'
    },
    {
      id: 'box-breathing',
      title: 'Box Breathing',
      description: 'A structured four-count breathing pattern used to promote calm and steady focus.',
      duration: 3,
      category: 'Breathing',
      icon: 'square',
      hasBreathingGuide: true,
      instructions: 'Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Repeat this box pattern. Follow the visual guide to keep rhythm.'
    },
    {
      id: 'mindful-walk',
      title: 'Mindful Walking',
      description: 'Take a short walk paying attention to each step, the movement of your body, and your surroundings.',
      duration: 5,
      category: 'Grounding',
      icon: 'footprints',
      instructions: 'Walk at a natural pace. Feel each foot lift, move, and connect with the ground. Notice the rhythm of your steps. If indoors, walk slowly back and forth in a quiet space.'
    }
  ],

  currentActivity: null,
  timerInterval: null,
  timerRemaining: 0,
  timerTotal: 0,
  isPaused: false,
  breathingInterval: null,
  breathingPhase: 'prepare',

  init() {
    this.renderActivities();
    this.setupFilters();
    this.setupModal();
    this.handleUrlParams();
  },

  /**
   * Handle URL parameters for direct activity links
   */
  handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const activityId = params.get('activity');
    const filter = params.get('filter');

    if (filter) {
      this.setFilter(filter);
    }

    if (activityId) {
      const activity = this.activities.find(a => a.id === activityId);
      if (activity) {
        setTimeout(() => this.openActivity(activity), 300);
      }
    }
  },

  /**
   * Render activity cards
   */
  renderActivities(filter = 'all') {
    const grid = document.getElementById('activities-grid');
    if (!grid) return;

    const filtered = filter === 'all'
      ? this.activities
      : this.activities.filter(a => a.category.toLowerCase() === filter.toLowerCase());

    grid.innerHTML = filtered.map(activity => `
      <article class="activity-card fade-in" data-category="${activity.category.toLowerCase()}">
        <div class="activity-card__header">
          <div class="activity-card__icon">
            <i data-lucide="${activity.icon}" aria-hidden="true"></i>
          </div>
          <span class="activity-card__category">${activity.category}</span>
        </div>
        <h3 class="activity-card__title">${activity.title}</h3>
        <p class="activity-card__desc">${activity.description}</p>
        <div class="activity-card__meta">
          <i data-lucide="clock" aria-hidden="true" style="width:14px;height:14px"></i>
          <span>${MindfulDay.formatDuration(activity.duration)}</span>
        </div>
        <div class="activity-card__footer">
          <button class="btn btn--primary btn--sm" data-start-activity="${activity.id}">
            Start Activity
          </button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-start-activity]').forEach(btn => {
      btn.addEventListener('click', () => {
        const activity = this.activities.find(a => a.id === btn.dataset.startActivity);
        if (activity) this.openActivity(activity);
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    MindfulDay.initFadeInAnimations();
  },

  /**
   * Setup category filter buttons
   */
  setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });
  },

  setFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.renderActivities(filter);
  },

  /**
   * Setup modal close handlers
   */
  setupModal() {
    const overlay = document.getElementById('activity-modal');
    if (!overlay) return;

    overlay.querySelector('.modal__close').addEventListener('click', () => this.closeModal());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        this.closeModal();
      }
    });
  },

  /**
   * Open activity modal
   */
  openActivity(activity) {
    this.currentActivity = activity;
    this.resetTimer();

    const overlay = document.getElementById('activity-modal');
    const title = overlay.querySelector('.modal__title');
    const category = overlay.querySelector('.modal__category');
    const instructions = overlay.querySelector('.modal__instructions');
    const timerSection = overlay.querySelector('.timer-section');
    const breathingSection = overlay.querySelector('.breathing-section');
    const completionSection = overlay.querySelector('.completion-section');

    title.textContent = activity.title;
    category.textContent = `${activity.category} · ${MindfulDay.formatDuration(activity.duration)}`;
    instructions.textContent = activity.instructions;

    timerSection.classList.remove('hidden');
    breathingSection.classList.toggle('hidden', !activity.hasBreathingGuide);
    completionSection.classList.add('hidden');

    this.timerTotal = activity.duration * 60;
    this.timerRemaining = this.timerTotal;
    this.updateTimerDisplay();

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  closeModal() {
    this.stopTimer();
    this.stopBreathingGuide();
    const overlay = document.getElementById('activity-modal');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    this.currentActivity = null;
  },

  /**
   * Timer controls
   */
  startTimer() {
    if (this.isPaused) {
      this.isPaused = false;
    } else if (this.timerInterval) {
      return;
    }

    const startBtn = document.getElementById('timer-start');
    if (startBtn) startBtn.disabled = true;

    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timerRemaining--;
      this.updateTimerDisplay();

      if (this.timerRemaining <= 0) {
        this.completeActivity();
      }
    }, 1000);

    if (this.currentActivity?.hasBreathingGuide) {
      this.startBreathingGuide();
    }
  },

  pauseTimer() {
    this.isPaused = !this.isPaused;
    const pauseBtn = document.getElementById('timer-pause');
    if (pauseBtn) {
      pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
  },

  resetTimer() {
    this.stopTimer();
    this.stopBreathingGuide();
    if (this.currentActivity) {
      this.timerTotal = this.currentActivity.duration * 60;
      this.timerRemaining = this.timerTotal;
    }
    this.updateTimerDisplay();

    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.textContent = 'Pause';
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isPaused = false;
  },

  updateTimerDisplay() {
    const timeEl = document.getElementById('timer-time');
    const progressEl = document.getElementById('timer-progress-bar');

    const minutes = Math.floor(this.timerRemaining / 60);
    const seconds = this.timerRemaining % 60;
    if (timeEl) {
      timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    if (progressEl && this.timerTotal > 0) {
      const progress = ((this.timerTotal - this.timerRemaining) / this.timerTotal) * 100;
      progressEl.style.width = `${progress}%`;
    }
  },

  /**
   * Breathing guide animation
   */
  startBreathingGuide() {
    const circle = document.getElementById('breathing-circle');
    const phaseEl = document.getElementById('breathing-phase');
    const instructionEl = document.getElementById('breathing-instruction');

    const phases = [
      { name: 'prepare', label: 'Prepare', instruction: 'Get comfortable and ready', duration: 3000, class: 'prepare' },
      { name: 'inhale', label: 'Breathing In', instruction: 'Breathe in slowly through your nose', duration: 4000, class: 'inhale' },
      { name: 'hold', label: 'Hold', instruction: 'Hold gently, don\'t strain', duration: 2000, class: 'hold' },
      { name: 'exhale', label: 'Breathing Out', instruction: 'Breathe out slowly through your mouth', duration: 4000, class: 'exhale' }
    ];

    let phaseIndex = 0;

    const runPhase = () => {
      if (!this.timerInterval) return;

      const phase = phases[phaseIndex];
      this.breathingPhase = phase.name;

      if (circle) {
        circle.className = `breathing-circle ${phase.class}`;
      }
      if (phaseEl) phaseEl.textContent = phase.label;
      if (instructionEl) instructionEl.textContent = phase.instruction;

      phaseIndex = (phaseIndex + 1) % phases.length;
    };

    runPhase();
    this.breathingInterval = setInterval(runPhase, 4000);
  },

  stopBreathingGuide() {
    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
      this.breathingInterval = null;
    }
    const circle = document.getElementById('breathing-circle');
    if (circle) circle.className = 'breathing-circle prepare';
  },

  /**
   * Activity completion
   */
  completeActivity() {
    this.stopTimer();
    this.stopBreathingGuide();

    const timerSection = document.querySelector('.timer-section');
    const completionSection = document.querySelector('.completion-section');

    if (timerSection) timerSection.classList.add('hidden');
    if (completionSection) completionSection.classList.remove('hidden');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Save completed activity to log
   */
  async saveToLog() {
    if (!this.currentActivity) return;

    const entry = MindfulDay.saveActivity({
      name: this.currentActivity.title,
      category: this.currentActivity.category,
      duration: this.currentActivity.duration
    });

    // Attempt webhook integration
    if (typeof Integrations !== 'undefined') {
      const result = await Integrations.sendActivityToWebhook({
        name: entry.name,
        category: entry.category,
        duration: entry.duration,
        date: entry.date
      });

      if (result.success) {
        MindfulDay.showToast('Activity saved and synced!', 'success');
      } else {
        MindfulDay.showToast('Activity saved locally.', 'success');
      }
    } else {
      MindfulDay.showToast('Activity saved to your log!', 'success');
    }

    setTimeout(() => this.closeModal(), 1200);
  }
};

// Bind timer button events after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('activities-grid')) {
    Activities.init();

    document.getElementById('timer-start')?.addEventListener('click', () => Activities.startTimer());
    document.getElementById('timer-pause')?.addEventListener('click', () => Activities.pauseTimer());
    document.getElementById('timer-reset')?.addEventListener('click', () => Activities.resetTimer());
    document.getElementById('save-to-log')?.addEventListener('click', () => Activities.saveToLog());
  }
});
