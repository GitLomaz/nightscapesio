// Client-side configuration
// Override these values by setting window.CONFIG before loading this script
// Or modify this file directly for your deployment

window.CONFIG = window.CONFIG || {
  // Development server port (used when URL contains 'dev')
  DEV_PORT: ':2000',
  
  // Stats server URL (used for analytics)
  // Format: protocol://hostname:port/path
  STATS_URL: null, // null = uses default based on environment
  
  // Add other configuration options here as needed
};
