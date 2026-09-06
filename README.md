# MindfulDay – AI-Powered Mindfulness & Wellbeing Companion

A modern, responsive web platform designed to help users practice simple mindfulness and wellbeing activities in everyday life. Built as an Artificial Intelligence & Automation final project.

> **Disclaimer:** MindfulDay provides general mindfulness and wellbeing information and is **not** a medical or diagnostic service.

---

## Problem Statement

People often want to take a mindful break but don't know which activity to choose or where to begin. Without guidance, these moments of potential calm are easily skipped.

## Solution

MindfulDay provides a centralized platform combining:

- A curated library of mindfulness activities with interactive timers
- An AI chatbot (MindfulBot) powered by Botpress
- Activity tracking and analytics dashboard
- External service integrations via Make.com/n8n automation
- A resource library with video and audio content

---

## Features

- **5 responsive pages** – Home, Activities, Tracker, Resources, About/Contact
- **10 mindfulness activities** across 5 categories (Breathing, Focus, Grounding, Relaxation, Reflection)
- **Interactive timer** with start, pause, reset, and progress indicator
- **Visual breathing guide** for breathing exercises
- **Activity tracker dashboard** with localStorage persistence
- **Chart.js weekly progress chart** driven by real activity data
- **Mindful Tip of the Day** (rotates daily via JavaScript)
- **Weather-based suggestions** (optional OpenWeatherMap integration)
- **Floating MindfulBot chatbot button** with Botpress integration placeholder
- **Make.com/n8n webhook** support for activity logging and contact forms
- **Spotify & YouTube embeds** for media resources
- **Telegram, Notion/Trello** integration architecture prepared
- **Fully responsive** with mobile navigation menu
- **Accessible** – semantic HTML, ARIA labels, keyboard navigation, focus states

---

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (variables, flexbox, grid) |
| Scripting | Vanilla JavaScript (ES6+) |
| Icons | Lucide Icons (CDN) |
| Fonts | DM Sans (Google Fonts) |
| Charts | Chart.js (CDN) |
| AI Chatbot | Botpress (integration ready) |
| Automation | Make.com / n8n webhooks |

---

## Folder Structure

```
mindfulday/
├── index.html              # Home page
├── activities.html         # Mindfulness activity library
├── tracker.html            # Activity tracker dashboard
├── resources.html          # Resource library
├── about.html              # About & contact
├── css/
│   ├── style.css           # Core styles & design system
│   └── responsive.css      # Responsive breakpoints
├── js/
│   ├── main.js             # Shared utilities, navigation, tips
│   ├── activities.js       # Activity library, timer, breathing guide
│   ├── tracker.js          # Dashboard, stats, Chart.js
│   ├── chatbot.js          # Botpress integration placeholder
│   └── integrations.js     # External service integrations
├── assets/
│   ├── images/             # Image assets
│   └── icons/              # Icon assets
└── README.md
```

---

## How to Run Locally

1. **Clone or download** this repository
2. **Open the project folder** in Visual Studio Code
3. **Launch a local server** (recommended – avoids CORS issues with some features):

   **Option A – VS Code Live Server extension:**
   - Install the "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

   **Option B – Python:**
   ```bash
   cd mindfulday
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

   **Option C – Node.js:**
   ```bash
   npx serve mindfulday
   ```

4. The website works fully **without any API keys** – all core features use localStorage.

---

## GitHub Pages Deployment

1. Push the `mindfulday` folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to your branch and `/mindfulday` folder (or root if repo contains only the project)
4. Your site will be live at `https://yourusername.github.io/repo-name/`

---

## Integration Setup

### 1. Botpress Chatbot

**File:** `js/chatbot.js`

1. Create a bot at [botpress.com](https://botpress.com)
2. Build a Knowledge Base with mindfulness content:
   - Mindfulness basics & FAQs
   - Activity descriptions (all 10 activities)
   - Breathing, grounding, focus, relaxation exercises
   - Resource information & tracker usage guide
3. Copy your Webchat embed script from the Botpress dashboard
4. Paste it inside the `initBotpress()` function (marked with `<!-- BOTPRESS INTEGRATION GOES HERE -->`)
5. Uncomment `this.initBotpress()` in the `init()` function
6. Customize theme colors to match MindfulDay palette:
   - Primary: `#3D5A47`
   - Secondary: `#8BA888`
   - Background: `#FAF9F6`

**Suggested MindfulBot conversation topics:**
- "What is mindfulness?"
- "I want to relax" / "I want to improve focus"
- "Give me a breathing activity" / "Give me a grounding activity"
- "What activity should I try?"
- "How long should I practice?"
- "Show me relaxation resources"
- "How can I use the activity tracker?"

### 2. Weather API

**File:** `js/integrations.js`

1. Register at [openweathermap.org](https://openweathermap.org/api) for a free API key
2. Replace `WEATHER_API_KEY_HERE` with your key:
   ```javascript
   weatherApiKey: 'your-api-key-here',
   ```
3. Optionally change `defaultCity` and `defaultCountry`
4. The home page weather widget will show contextual indoor/outdoor suggestions

### 3. Make.com / n8n Webhook

**File:** `js/integrations.js`

1. Create a webhook scenario in [Make.com](https://make.com) or [n8n](https://n8n.io)
2. Replace `WEBHOOK_URL_HERE` with your webhook URL:
   ```javascript
   webhookUrl: 'https://hook.make.com/your-webhook-id',
   ```
3. The webhook receives JSON payloads for:
   - **Activity completion:** `{ type, activity, category, duration, completedAt }`
   - **Contact form:** `{ type, name, email, message }`

**Example Make.com automation flow:**
```
Webhook → Router → Notion (create record) / Email (notification) / Telegram (reminder)
```

### 4. Telegram Integration

**File:** `js/integrations.js`

Telegram is configured via Make.com/n8n automation (not directly in frontend):

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
2. Set up a Make.com scenario: Webhook → Telegram (send message)
3. Replace `TELEGRAM_WEBHOOK_URL_HERE` with your automation webhook
4. Set `telegramEnabled: true`

**Use case:** Daily mindfulness reminder with a tip and activity link.

### 5. Spotify Integration

**File:** `resources.html` + `js/integrations.js`

No API key required for embed players.

1. Find Spotify playlist IDs from share URLs
2. Update `data-spotify-id` attributes on resource cards
3. Embeds use: `Integrations.getSpotifyEmbedUrl(playlistId)`

For advanced features (search, recommendations), use Spotify Web API via Make.com/n8n backend – never expose client secrets in frontend code.

### 6. YouTube Integration

**File:** `resources.html` + `js/integrations.js`

No API key required for embed players.

1. Find YouTube video IDs from video URLs
2. Update `data-video-id` attributes on resource cards
3. Embeds use: `Integrations.getYouTubeEmbedUrl(videoId)`

### 7. Notion / Trello (Optional)

Configure via Make.com/n8n automation:

```
Activity Completed (webhook) → Make.com → Notion Database / Trello Card
```

Create a database/board with fields: Activity Name, Category, Duration, Date, Status.

---

## Security Notes

- **Never commit API keys** to version control
- Use environment variables or backend proxies for sensitive credentials
- All placeholder values use obvious strings like `WEBHOOK_URL_HERE`
- The frontend gracefully handles missing integrations without errors
- Add `.env` to `.gitignore` if you create a backend wrapper later
- Contact form and activity data are sent via HTTPS webhooks only when configured

---

## Activity Tracker (localStorage)

Activities are stored in `localStorage` under the key `mindfulday_activities`.

**Data structure:**
```json
{
  "id": "1704067200000",
  "name": "One-Minute Breathing",
  "category": "Breathing",
  "duration": 1,
  "date": "2026-01-01T12:00:00.000Z",
  "status": "Completed"
}
```

The tracker dashboard dynamically calculates:
- Total activities completed
- Total minutes practiced
- Most frequent activity (favorite)
- Current day streak
- Weekly minutes chart (Chart.js)

---

## Future Improvements

- [ ] Connect Botpress with full Knowledge Base
- [ ] Backend API proxy for secure key management
- [ ] User accounts with cloud sync
- [ ] Push notification reminders (PWA)
- [ ] Personalized activity recommendations using ML
- [ ] Multi-language support
- [ ] Dark mode theme toggle
- [ ] Export activity history as CSV/PDF
- [ ] Social sharing of milestones
- [ ] Integration with Apple Health / Google Fit

---

## License

This project was created as an academic final project. Feel free to use and modify for educational purposes.

---

**Built with care for mindful moments.** 🌿
