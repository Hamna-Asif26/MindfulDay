/**
 * MindfulDay – Chatbot Integration (Botpress)
 * =============================================
 * This file manages the MindfulBot floating button and
 * Botpress Webchat integration.
 */

const MindfulBot = {
  isInitialized: false,
  widgetObserver: null,
  fullscreenControl: null,

  /**
   * Initialize chatbot components
   */
  init() {
    this.setupFabButton();
    this.setupNavTriggers();
    this.initBotpress();
  },

  /**
   * Setup floating action button
   */
  setupFabButton() {
    const fab = document.getElementById('chatbot-fab');
    if (!fab) return;

    fab.addEventListener('click', () => this.openChat());
  },

  /**
   * Setup "Ask MindfulBot" triggers in navigation and CTAs
   */
  setupNavTriggers() {
    document.querySelectorAll('[data-open-chatbot]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openChat();
      });
    });
  },

  /**
   * Open the chatbot widget
   */
  openChat(attempt = 0) {
    const widget = document.querySelector('.bpChatContainer');
    if (window.botpress && window.botpress.open && widget) {
      window.botpress.open();
      window.setTimeout(() => this.enhanceWidget(), 100);
      return;
    }

    if (attempt < 20) {
      window.setTimeout(() => this.openChat(attempt + 1), 250);
    }
  },

  /**
   * Confirm that the Botpress embed has loaded without opening it.
   */
  initBotpress() {
    if (!document.getElementById('botpress-launcher-override')) {
      const style = document.createElement('style');
      style.id = 'botpress-launcher-override';
      style.textContent = `
        .bpChatContainer .bpFabContainer,
        #fab-root .bpFabContainer {
          display: block !important;
          transform: scale(0.68) !important;
          transform-origin: bottom right !important;
          z-index: 1 !important;
        }
        body.mindfulbot-open .bpChatContainer .bpFabContainer,
        body.mindfulbot-open #fab-root .bpFabContainer {
          display: none !important;
        }
        .bpChatContainer #fab-root {
          pointer-events: none !important;
          transform: scale(0.68) !important;
          transform-origin: bottom right !important;
          z-index: 1 !important;
        }
        body.mindfulbot-open .bpChatContainer #fab-root {
          pointer-events: auto !important;
          transform: none !important;
          z-index: 4000 !important;
        }
        .bpChatContainer,
        #webchat-root,
        .bpChatContainer #fab-root {
          --mindfulbot-green: var(--color-forest, #3D5A47);
          --mindfulbot-green-dark: var(--color-forest-dark, #2F4638);
          --mindfulbot-sage: var(--color-sage, #8BA888);
          --bpPrimary-50: #E8EFE6;
          --bpPrimary-100: #D6E3D3;
          --bpPrimary-200: #B8CEB5;
          --bpPrimary-300: #9FBC9B;
          --bpPrimary-400: #8BA888;
          --bpPrimary-500: #6F916D;
          --bpPrimary-600: #3D5A47;
          --bpPrimary-700: #2F4638;
          --bpPrimary-800: #263A2E;
          --bpPrimary-900: #1E2D24;
          --header-bg: #3D5A47;
          --header-bg-hover: #2F4638;
          --header-hover-dark: #263A2E;
          --header-title: #FFFFFF;
          --header-description: #E8EFE6;
          --header-description-icon: #E8EFE6;
          --header-description-link: #FFFFFF;
          --header-avatar-bg: #8BA888;
          --header-avatar-text: #2F4638;
        }
        .mindfulbot-fullscreen-control {
          position: fixed !important;
          top: 9px !important;
          right: 80px !important;
          z-index: 2147483647 !important;
          width: 34px !important;
          height: 34px !important;
          border: 0 !important;
          border-radius: 8px !important;
          background: #3D5A47 !important;
          color: #fff !important;
          cursor: pointer !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: none !important;
        }
        .mindfulbot-fullscreen-control:hover { background: #2F4638 !important; }
        @media (min-width: 768px) {
          .mindfulbot-fullscreen-control {
            top: max(25px, calc(100vh - 795px)) !important;
            right: 104px !important;
          }
        }
        .bpChatContainer button[aria-label="Send Message Button"],
        .bpChatContainer button[aria-label="Voice Input Button"],
        .bpChatContainer button[aria-label="Expand Header Button"] {
          background-color: var(--mindfulbot-green) !important;
          color: #fff !important;
        }
        .bpChatContainer .mindfulbot-fullscreen-toggle {
          background-color: var(--mindfulbot-green) !important;
          border: 0 !important;
          color: #fff !important;
          cursor: pointer !important;
          font: inherit !important;
          padding: 0.35rem 0.6rem !important;
        }
        .bpChatContainer button[aria-label="Send Message Button"]:hover,
        .bpChatContainer button[aria-label="Voice Input Button"]:hover,
        .bpChatContainer button[aria-label="Expand Header Button"]:hover {
          background-color: var(--mindfulbot-green-dark) !important;
        }
        .mindfulbot-fullscreen .bpChatContainer,
        .mindfulbot-fullscreen #webchat-root {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: none !important;
          max-height: none !important;
          z-index: 4000 !important;
        }
        .mindfulbot-fullscreen .bpChatContainer #fab-root {
          position: fixed !important;
          inset: 0 !important;
          z-index: 4000 !important;
          background: #FFFFFF !important;
        }
        .mindfulbot-fullscreen #chatbot-fab { display: none !important; }
        body.mindfulbot-fullscreen { overflow: hidden !important; }
        .mindfulbot-fullscreen .mindfulbot-fullscreen-toggle::before { content: 'Exit fullscreen'; }
        .mindfulbot-fullscreen .mindfulbot-fullscreen-toggle { font-size: 0 !important; }
        .mindfulbot-fullscreen .mindfulbot-fullscreen-toggle::before { font-size: 0.75rem; }
      `;
      document.head.appendChild(style);
    }

    this.observeWidget();
    this.setupBotpressEvents();
    this.applyTheme();
    this.isInitialized = true;
    if (!window.botpress) {
      console.warn('[MindfulBot] Botpress Webchat is still loading.');
    }
  },

  setupBotpressEvents() {
    if (!window.botpress || !window.botpress.on || this.eventsReady) return;

    this.eventsReady = true;
    window.botpress.on('webchat:opened', () => this.showFullscreenControl());
    window.botpress.on('webchat:closed', () => this.hideFullscreenControl());
  },

  applyTheme() {
    const root = document.querySelector('.bpChatContainer #fab-root');
    if (!root) return;

    const colors = {
      '--bpPrimary-50': '#E8EFE6',
      '--bpPrimary-100': '#D6E3D3',
      '--bpPrimary-200': '#B8CEB5',
      '--bpPrimary-300': '#9FBC9B',
      '--bpPrimary-400': '#8BA888',
      '--bpPrimary-500': '#6F916D',
      '--bpPrimary-600': '#3D5A47',
      '--bpPrimary-700': '#2F4638',
      '--bpPrimary-800': '#263A2E',
      '--bpPrimary-900': '#1E2D24',
      '--header-bg': '#3D5A47',
      '--header-bg-hover': '#2F4638',
      '--header-hover-dark': '#263A2E',
      '--header-title': '#FFFFFF',
      '--header-description': '#E8EFE6',
      '--header-description-icon': '#E8EFE6',
      '--header-description-link': '#FFFFFF',
      '--header-avatar-bg': '#8BA888',
      '--header-avatar-text': '#2F4638'
    };
    Object.entries(colors).forEach(([name, value]) => root.style.setProperty(name, value));
  },

  showFullscreenControl() {
    this.applyTheme();
    document.body.classList.add('mindfulbot-open');
    if (this.fullscreenControl) return;

    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'mindfulbot-fullscreen-control';
    control.innerHTML = '<i data-lucide="maximize-2" aria-hidden="true"></i>';
    control.setAttribute('aria-label', 'Open MindfulBot fullscreen');
    control.title = 'Open fullscreen';
    control.addEventListener('click', () => {
      const fullscreen = document.body.classList.toggle('mindfulbot-fullscreen');
      control.innerHTML = fullscreen
        ? '<i data-lucide="minimize-2" aria-hidden="true"></i>'
        : '<i data-lucide="maximize-2" aria-hidden="true"></i>';
      control.setAttribute('aria-label', fullscreen ? 'Exit MindfulBot fullscreen' : 'Open MindfulBot fullscreen');
      control.title = fullscreen ? 'Exit fullscreen' : 'Open fullscreen';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    document.body.appendChild(control);
    this.fullscreenControl = control;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  hideFullscreenControl() {
    document.body.classList.remove('mindfulbot-fullscreen');
    document.body.classList.remove('mindfulbot-open');
    if (this.fullscreenControl) this.fullscreenControl.remove();
    this.fullscreenControl = null;
  },

  observeWidget() {
    if (this.widgetObserver) return;

    this.widgetObserver = new MutationObserver(() => this.enhanceWidget());
    this.widgetObserver.observe(document.body, { childList: true, subtree: true });
    this.enhanceWidget();
  },

  enhanceWidget() {
    this.applyTheme();
    const launcher = document.querySelector('.bpChatContainer .bpFabContainer');
    if (launcher) launcher.style.display = document.body.classList.contains('mindfulbot-open') ? 'none' : 'block';

    const closeButton = document.querySelector('.bpChatContainer button[aria-label="Close Chatbot Button"]');
    if (!closeButton) return;

    closeButton.onclick = () => {
      if (window.botpress && window.botpress.close) window.botpress.close();
      document.body.classList.remove('mindfulbot-fullscreen');
    };

    if (this.fullscreenControl && !this.fullscreenControl.isConnected) this.fullscreenControl = null;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MindfulBot;
}
