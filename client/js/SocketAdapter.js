// SocketAdapter - Unified interface for both socket.io and LocalSocket
// Allows easy switching between multiplayer and singleplayer modes

class SocketAdapter {
  constructor(config = {}) {
    this.mode = config.mode || 'local'; // 'local' or 'multiplayer'
    this.socket = null;
    this.server = null;
    console.log('[SocketAdapter] Initializing with config:', config);
    console.log('[SocketAdapter] Mode:', this.mode);
    
    if (this.mode === 'local') {
      this.initializeLocal(config);
    } else {
      this.initializeMultiplayer(config);
    }
  }

  initializeLocal(config) {
    console.log('[SocketAdapter] Starting local initialization...');
    
    // Use existing global io server or create new one
    if (typeof window !== 'undefined' && window.io && window.io instanceof LocalSocketServer) {
      console.log('[SocketAdapter] Using existing global io server');
      this.server = window.io;
    } else {
      console.log('[SocketAdapter] Creating new LocalSocketServer');
      this.server = new LocalSocketServer();
      // Expose globally so main.js can use it
      if (typeof window !== 'undefined') {
        window.io = this.server;
        // Also set in global scope if io variable exists
        if (typeof io !== 'undefined') {
          io = this.server;
        }
        console.log('[SocketAdapter] Exposed server as window.io and global io');
      }
    }
    
    // Create the main player socket
    const socketQuery = {
      id: config.id || 'singleplayer',
      token: config.token || 'local_token',
      localhost: true,
      guest: config.guest || false,
      type: 'game'
    };
    console.log('[SocketAdapter] Creating socket with query:', socketQuery);
    this.socket = this.server.createSocket(socketQuery);
    
    console.log('[SocketAdapter] ✅ Local mode initialized');
    console.log('[SocketAdapter] Socket ID:', this.socket.id);
    console.log('[SocketAdapter] Server available:', !!this.server);
    console.log('[SocketAdapter] Server has connection listeners:', this.server.listeners['connection']?.length || 0);
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
    console.log(`[SocketAdapter] Registering listener for '${eventName}'`);
    return this.socket.on(eventName, callback);
  }

  emit(eventName, data) {
    const dataPreview = data !== undefined ? (typeof data === 'object' ? JSON.stringify(data).substring(0, 50) : data) : 'no data';
    console.log(`[SocketAdapter] Emitting '${eventName}' - ${dataPreview}`);
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
