// SocketAdapter - Unified interface for both socket.io and LocalSocket
// Allows easy switching between multiplayer and singleplayer modes

class SocketAdapter {
  constructor(config = {}) {
    this.mode = config.mode || 'local'; // 'local' or 'multiplayer'
    this.socket = null;
    this.server = null;
    
    if (this.mode === 'local') {
      this.initializeLocal(config);
    } else {
      this.initializeMultiplayer(config);
    }
  }

  initializeLocal(config) {
    // Create local socket server for singleplayer
    this.server = new LocalSocketServer();
    
    // Create the main player socket
    this.socket = this.server.createSocket({
      id: config.id || 'singleplayer',
      token: config.token || 'local_token',
      localhost: true,
      guest: config.guest || false,
      type: 'game'
    });
    
    console.log('[LocalSocket] Initialized in singleplayer mode');
  }

  initializeMultiplayer(config) {
    // Connect to real socket.io server
    if (typeof io === 'undefined') {
      console.error('socket.io library not loaded!');
      return;
    }
    
    const url = config.url || window.location.origin;
    this.socket = io(url, {
      query: {
        id: config.id,
        token: config.token,
        localhost: config.localhost || false,
        guest: config.guest || false,
        type: 'game'
      }
    });
    
    console.log('[SocketIO] Initialized in multiplayer mode');
  }

  // Proxy methods to underlying socket
  on(eventName, callback) {
    return this.socket.on(eventName, callback);
  }

  emit(eventName, data) {
    return this.socket.emit(eventName, data);
  }

  off(eventName, callback) {
    return this.socket.off(eventName, callback);
  }

  disconnect() {
    return this.socket.disconnect();
  }

  // Helper to check if we're in local mode
  isLocal() {
    return this.mode === 'local';
  }

  // Get the underlying socket
  getSocket() {
    return this.socket;
  }

  // Get the server (only available in local mode)
  getServer() {
    return this.server;
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.SocketAdapter = SocketAdapter;
}
