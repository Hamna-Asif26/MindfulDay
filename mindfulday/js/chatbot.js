/**
 * MindfulDay – Chatbot Integration (Botpress)
 * =============================================
 * This file manages the MindfulBot floating button and
 * Botpress Webchat integration placeholder.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a bot in Botpress (botpress.com)
 * 2. Configure your Knowledge Base with mindfulness content
 * 3. Copy your Webchat embed script from Botpress dashboard
 * 4. Paste it inside the marked section below
 * 5. Uncomment initBotpress() in the init() function
 */

const MindfulBot = {
  isInitialized: false,

  /**
   * Initialize chatbot components
   */
  init() {
    this.setupFabButton();
    this.setupNavTriggers();

    // Uncomment the line below once Botpress is configured:
    // this.initBotpress();
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
  openChat() {
    // If Botpress is initialized, open its widget
    if (window.botpress && window.botpress.open) {
      window.botpress.open();
      return;
    }

    // Show placeholder message when Botpress is not configured
    this.showPlaceholder();
  },

  /**
   * Show placeholder UI when Botpress is not yet connected
   */
  showPlaceholder() {
    let placeholder = document.getElementById('chatbot-placeholder');

    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.id = 'chatbot-placeholder';
      placeholder.className = 'chatbot-placeholder-modal';
      placeholder.innerHTML = `
        <div class="chatbot-placeholder-content">
          <button class="chatbot-placeholder-close" aria-label="Close">&times;</button>
          <div class="chatbot-placeholder-icon">
            <i data-lucide="message-circle" aria-hidden="true"></i>
          </div>
          <h3>MindfulBot</h3>
          <p>Your AI mindfulness companion is being connected. Once Botpress is configured, MindfulBot will help you:</p>
          <ul>
            <li>Discover suitable mindfulness activities</li>
            <li>Answer questions about mindfulness basics</li>
            <li>Recommend breathing and grounding exercises</li>
            <li>Guide you to resources and the activity tracker</li>
          </ul>
          <p class="chatbot-placeholder-note">Integration placeholder — add your Botpress Webchat script in <code>js/chatbot.js</code></p>
          <a href="activities.html" class="btn btn--primary">Browse Activities Instead</a>
        </div>
      `;

      // Inject placeholder styles
      if (!document.getElementById('chatbot-placeholder-styles')) {
        const style = document.createElement('style');
        style.id = 'chatbot-placeholder-styles';
        style.textContent = `
          .chatbot-placeholder-modal {
            position: fixed;
            inset: 0;
            background: rgba(45, 52, 54, 0.4);
            backdrop-filter: blur(4px);
            z-index: 2500;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            animation: fadeIn 0.25s ease;
          }
          .chatbot-placeholder-content {
            background: #fff;
            border-radius: 16px;
            padding: 2rem;
            max-width: 420px;
            width: 100%;
            position: relative;
            box-shadow: 0 8px 24px rgba(45, 52, 54, 0.12);
          }
          .chatbot-placeholder-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #F5F3EE;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.25rem;
            color: #6B7280;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .chatbot-placeholder-icon {
            width: 56px;
            height: 56px;
            background: #E8EFE6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3D5A47;
            margin-bottom: 1rem;
          }
          .chatbot-placeholder-content h3 {
            margin-bottom: 0.75rem;
            color: #3D5A47;
          }
          .chatbot-placeholder-content p {
            font-size: 0.9375rem;
            margin-bottom: 0.75rem;
          }
          .chatbot-placeholder-content ul {
            list-style: disc;
            padding-left: 1.25rem;
            margin-bottom: 1rem;
          }
          .chatbot-placeholder-content li {
            font-size: 0.875rem;
            color: #6B7280;
            margin-bottom: 0.25rem;
          }
          .chatbot-placeholder-note {
            font-size: 0.8125rem !important;
            color: #9CA3AF !important;
            background: #FAF9F6;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem !important;
          }
          .chatbot-placeholder-note code {
            font-size: 0.75rem;
            background: #EDE8DF;
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(placeholder);

      placeholder.querySelector('.chatbot-placeholder-close').addEventListener('click', () => {
        placeholder.remove();
      });

      placeholder.addEventListener('click', (e) => {
        if (e.target === placeholder) placeholder.remove();
      });

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  },

  /**
   * Initialize Botpress Webchat
   * Paste your Botpress embed code inside this function
   */
  initBotpress() {
    /* ============================================
       BOTPRESS INTEGRATION GOES HERE
       ============================================

       Example Botpress Webchat embed:

       <script src="https://cdn.botpress.cloud/webchat/v2/inject.js"></script>
       <script>
         window.botpress.init({
           botId: "YOUR_BOT_ID_HERE",
           clientId: "YOUR_CLIENT_ID_HERE",
           hostUrl: "https://cdn.botpress.cloud/webchat/v2",
           messagingUrl: "https://messaging.botpress.cloud",
           botName: "MindfulBot",
           botDescription: "Your mindfulness companion",
           botAvatarUrl: "assets/icons/mindfulbot-avatar.png",
           theme: {
             primaryColor: "#3D5A47",
             secondaryColor: "#8BA888",
             backgroundColor: "#FAF9F6",
             fontFamily: "DM Sans, sans-serif"
           }
         });
       </script>

       Knowledge Base topics to configure in Botpress:
       - Mindfulness basics
       - Activity descriptions (all 10 activities)
       - Breathing exercises
       - Grounding exercises
       - Focus exercises
       - Relaxation activities
       - Website FAQs
       - Resource information
       - Activity tracker usage
       - Contact/help information

       ============================================ */

    this.isInitialized = true;
    console.info('[MindfulBot] Botpress integration ready. Add your embed code above.');
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MindfulBot;
}
