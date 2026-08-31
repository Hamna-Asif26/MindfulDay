/**
 * MindfulDay – Activity Tracker Dashboard
 * Statistics, history, filters, and Chart.js visualization
 */

const Tracker = {
  chart: null,
  currentFilter: 'all',

  init() {
    this.renderDashboard();
    this.setupFilters();
    this.setupClearHistory();
    this.initChart();
  },

  /**
   * Calculate dashboard statistics from localStorage
   */
  getStats() {
    const activities = MindfulDay.getActivities();

    const totalCompleted = activities.length;
    const totalMinutes = activities.reduce((sum, a) => sum + (a.duration || 0), 0);

    // Favorite activity (most frequent)
    const frequency = {};
    activities.forEach(a => {
      frequency[a.name] = (frequency[a.name] || 0) + 1;
    });
    const favorite = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];

    // Current streak (consecutive days with at least one activity)
    const streak = this.calculateStreak(activities);

    return {
      totalCompleted,
      totalMinutes,
      favoriteActivity: favorite ? favorite[0] : '—',
      currentStreak: streak
    };
  },

  /**
   * Calculate consecutive day streak
   */
  calculateStreak(activities) {
    if (activities.length === 0) return 0;

    const uniqueDays = [...new Set(
      activities.map(a => new Date(a.date).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a));

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Streak must include today or yesterday
    if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diff = (prev - curr) / 86400000;
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  /**
   * Get minutes per day for the current week
   */
  getWeeklyData() {
    const activities = MindfulDay.getActivities();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const minutes = [0, 0, 0, 0, 0, 0, 0];

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    activities.forEach(a => {
      const date = new Date(a.date);
      if (date >= startOfWeek) {
        const dayIndex = date.getDay();
        minutes[dayIndex] += a.duration || 0;
      }
    });

    return { labels: days, data: minutes };
  },

  /**
   * Render dashboard summary and history
   */
  renderDashboard() {
    const stats = this.getStats();
    const activities = MindfulDay.getActivities();

    document.getElementById('stat-completed').textContent = stats.totalCompleted;
    document.getElementById('stat-minutes').textContent = stats.totalMinutes;
    document.getElementById('stat-favorite').textContent = stats.favoriteActivity;
    document.getElementById('stat-streak').textContent = stats.currentStreak;

    const emptyState = document.getElementById('history-empty');
    if (emptyState) {
      emptyState.classList.toggle('hidden', activities.length > 0);
    }

    this.renderHistory();
  },

  /**
   * Render activity history table/list
   */
  renderHistory() {
    let activities = MindfulDay.getActivities();

    if (this.currentFilter !== 'all') {
      activities = activities.filter(
        a => a.category.toLowerCase() === this.currentFilter.toLowerCase()
      );
    }

    const tableBody = document.getElementById('history-table-body');
    const cardsContainer = document.getElementById('history-cards');
    const emptyState = document.getElementById('history-empty');

    if (activities.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (cardsContainer) cardsContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    if (tableBody) {
      tableBody.innerHTML = activities.map(a => `
        <tr>
          <td>${a.name}</td>
          <td>${a.category}</td>
          <td>${MindfulDay.formatDate(a.date)}</td>
          <td>${MindfulDay.formatDuration(a.duration)}</td>
          <td><span class="status-badge">${a.status}</span></td>
        </tr>
      `).join('');
    }

    if (cardsContainer) {
      cardsContainer.innerHTML = activities.map(a => `
        <div class="history-card-item">
          <div class="history-card-item__title">${a.name}</div>
          <div class="history-card-item__meta">
            <span>${a.category}</span>
            <span>·</span>
            <span>${MindfulDay.formatDate(a.date)}</span>
            <span>·</span>
            <span>${MindfulDay.formatDuration(a.duration)}</span>
            <span>·</span>
            <span class="status-badge">${a.status}</span>
          </div>
        </div>
      `).join('');
    }
  },

  /**
   * Setup history filter buttons
   */
  setupFilters() {
    document.querySelectorAll('.history-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.history-filter-btn').forEach(b =>
          b.classList.remove('active')
        );
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderHistory();
      });
    });
  },

  /**
   * Setup clear history with confirmation
   */
  setupClearHistory() {
    const clearBtn = document.getElementById('clear-history');
    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
      const confirmed = confirm(
        'Are you sure you want to clear all activity history? This cannot be undone.'
      );
      if (confirmed) {
        MindfulDay.clearActivities();
        this.renderDashboard();
        this.updateChart();
        MindfulDay.showToast('Activity history cleared.', 'info');
      }
    });
  },

  /**
   * Initialize Chart.js bar chart
   */
  initChart() {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const weeklyData = this.getWeeklyData();

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: weeklyData.labels,
        datasets: [{
          label: 'Minutes',
          data: weeklyData.data,
          backgroundColor: 'rgba(139, 168, 136, 0.6)',
          borderColor: 'rgba(61, 90, 71, 0.8)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#3D5A47',
            titleFont: { family: 'DM Sans' },
            bodyFont: { family: 'DM Sans' },
            callbacks: {
              label: (ctx) => `${ctx.raw} min`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              font: { family: 'DM Sans', size: 12 },
              color: '#9CA3AF'
            },
            grid: { color: '#F0F0F0' }
          },
          x: {
            ticks: {
              font: { family: 'DM Sans', size: 12 },
              color: '#9CA3AF'
            },
            grid: { display: false }
          }
        }
      }
    });
  },

  /**
   * Update chart with latest data
   */
  updateChart() {
    if (!this.chart) return;
    const weeklyData = this.getWeeklyData();
    this.chart.data.datasets[0].data = weeklyData.data;
    this.chart.update();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stat-completed')) {
    Tracker.init();
  }
});
