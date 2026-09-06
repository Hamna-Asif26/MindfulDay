/**
 * MindfulDay – External Integrations
 * ===================================
 * This module handles all external service integrations.
 * Replace placeholder URLs/keys with your actual credentials.
 * NEVER commit real API keys to version control.
 */

const Integrations = {
  // ============================================
  // CONFIGURATION – Replace placeholders below
  // ============================================

  config: {
    // Make.com or n8n webhook URL for activity logging & contact form
    webhookUrl: 'WEBHOOK_URL_HERE',

    // OpenWeatherMap API (or similar) – get key at openweathermap.org
    weatherApiKey: 'WEATHER_API_KEY_HERE',
    weatherApiUrl: 'https://api.openweathermap.org/data/2.5/weather',

    // Default location if geolocation is unavailable
    defaultCity: 'London',
    defaultCountry: 'GB',

    // Telegram Bot – configured via Make.com/n8n, not directly in frontend
    telegramEnabled: false,
    telegramWebhookUrl: 'TELEGRAM_WEBHOOK_URL_HERE',

    // Spotify embed – no API key needed for embed player
    spotifyEmbedBase: 'https://open.spotify.com/embed/playlist/',

    // YouTube embed – no API key needed for embed player
    youtubeEmbedBase: 'https://www.youtube.com/embed/',

    // Notion/Trello – handled via Make.com/n8n automation
    notionEnabled: false,
    trelloEnabled: false
  },

  /**
   * Check if webhook is configured
   */
  isWebhookConfigured() {
    return this.config.webhookUrl && this.config.webhookUrl !== 'WEBHOOK_URL_HERE';
  },

  /**
   * Check if weather API is configured
   */
  isWeatherConfigured() {
    return this.config.weatherApiKey && this.config.weatherApiKey !== 'WEATHER_API_KEY_HERE';
  },

  /**
   * Send completed activity data to Make.com / n8n webhook
   * @param {Object} activityData - Activity completion data
   */
  async sendActivityToWebhook(activityData) {
    if (!this.isWebhookConfigured()) {
      console.info('[Integrations] Webhook not configured. Activity saved locally only.');
      return { success: false, reason: 'not_configured' };
    }

    try {
      const payload = {
        type: 'activity_completed',
        activity: activityData.name,
        category: activityData.category,
        duration: activityData.duration,
        completedAt: activityData.date,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
      return { success: true };
    } catch (error) {
      console.warn('[Integrations] Webhook send failed:', error.message);
      return { success: false, reason: 'request_failed' };
    }
  },

  /**
   * Send contact form data to Make.com / n8n webhook
   * @param {Object} formData - { name, email, message }
   */
  async sendContactForm(formData) {
    if (!this.isWebhookConfigured()) {
      console.info('[Integrations] Webhook not configured. Form validated locally.');
      return { success: false, reason: 'not_configured' };
    }

    try {
      const payload = {
        type: 'contact_form',
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
      return { success: true };
    } catch (error) {
      console.warn('[Integrations] Contact form webhook failed:', error.message);
      return { success: false, reason: 'request_failed' };
    }
  },

  /**
   * Get weather-based mindfulness suggestion
   * Uses OpenWeatherMap when configured, otherwise returns placeholder
   */
  async getWeatherSuggestion() {
    if (!this.isWeatherConfigured()) {
      return {
        configured: false,
        message: 'Weather integration is not configured yet.',
        suggestion: null
      };
    }

    try {
      let lat, lon;

      // Try geolocation first
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } else {
        // Fallback to default city geocoding
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${this.config.defaultCity},${this.config.defaultCountry}&limit=1&appid=${this.config.weatherApiKey}`
        );
        const geoData = await geoResponse.json();
        if (geoData.length === 0) throw new Error('City not found');
        lat = geoData[0].lat;
        lon = geoData[0].lon;
      }

      const weatherResponse = await fetch(
        `${this.config.weatherApiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.config.weatherApiKey}`
      );

      if (!weatherResponse.ok) throw new Error('Weather API request failed');

      const weather = await weatherResponse.json();
      const condition = weather.weather[0].main.toLowerCase();
      const temp = Math.round(weather.main.temp);
      const city = weather.name;

      const pleasantConditions = ['clear', 'clouds', 'mist'];
      const isPleasant = pleasantConditions.includes(condition) && temp >= 10 && temp <= 30;

      return {
        configured: true,
        city,
        temp,
        condition: weather.weather[0].description,
        message: isPleasant
          ? `Today's weather in ${city} looks pleasant (${temp}°C). Consider taking your mindfulness break outdoors.`
          : `Today in ${city} might be a good day for an indoor mindfulness activity.`,
        suggestion: isPleasant ? 'outdoor' : 'indoor'
      };
    } catch (error) {
      console.warn('[Integrations] Weather fetch failed:', error.message);
      return {
        configured: true,
        message: 'Unable to fetch weather data. Try an indoor mindfulness activity today.',
        suggestion: 'indoor',
        error: true
      };
    }
  },

  /**
   * Request daily mindfulness reminder via Telegram
   * This sends a request to your Make.com/n8n automation
   */
  async requestTelegramReminder(userData) {
    if (!this.config.telegramEnabled || this.config.telegramWebhookUrl === 'TELEGRAM_WEBHOOK_URL_HERE') {
      return { success: false, reason: 'not_configured' };
    }

    try {
      const response = await fetch(this.config.telegramWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'telegram_reminder_request',
          ...userData,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Telegram webhook failed');
      return { success: true };
    } catch (error) {
      console.warn('[Integrations] Telegram request failed:', error.message);
      return { success: false, reason: 'request_failed' };
    }
  },

  /**
   * Generate Spotify embed URL (no API key required for embeds)
   */
  getSpotifyEmbedUrl(playlistId) {
    return `${this.config.spotifyEmbedBase}${playlistId}`;
  },

  /**
   * Generate YouTube embed URL (no API key required for embeds)
   */
  getYouTubeEmbedUrl(videoId) {
    return `${this.config.youtubeEmbedBase}${videoId}`;
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Integrations;
}
