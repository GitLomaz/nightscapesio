// LocalSocket - A local replacement for socket.io for single-player mode
// Provides the same API as socket.io but works entirely in-memory

class LocalSocket {
  constructor(id) {
    this.id = id || this.generateId();
    this.connected = true;
    this.listeners = {};
    this.handshake = {
      query: {},
    };
  }

  generateId() {
    return 'local_' + Math.random().toString(36).substr(2, 9);
  }

  // Listen for events (client-side)
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  // Remove event listener
  off(eventName, callback) {
    if (!this.listeners[eventName]) return;
    
    if (callback) {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    } else {
      delete this.listeners[eventName];
    }
  }

  // Emit event (triggers local handlers immediately)
  emit(eventName, data) {
    // Use setTimeout to make it async like real socket.io
    setTimeout(() => {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in ${eventName} handler:`, error);
          }
        });
      }
    }, 0);
  }

  // Disconnect
  disconnect() {
    this.connected = false;
    this.emit('disconnect');
  }

  // Connect
  connect(query = {}) {
    this.connected = true;
    this.handshake.query = query;
    this.emit('connect');
  }
}

// LocalSocketServer - Manages multiple sockets for testing
class LocalSocketServer {
  constructor() {
    this.sockets = {};
    this.listeners = {};
  }

  // Create a new socket connection
  createSocket(query = {}) {
    const socket = new LocalSocket();
    socket.handshake.query = query;
    this.sockets[socket.id] = socket;
    
    // Trigger connection event
    setTimeout(() => {
      if (this.listeners['connection']) {
        this.listeners['connection'].forEach(callback => {
          callback(socket);
        });
      }
    }, 0);
    
    return socket;
  }

  // Server-side event listener (for connection events, etc.)
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  // Emit to all connected sockets
  emit(eventName, data) {
    Object.values(this.sockets).forEach(socket => {
      socket.emit(eventName, data);
    });
  }

  // Get socket by id
  getSocket(id) {
    return this.sockets[id];
  }

  // Remove socket
  removeSocket(id) {
    delete this.sockets[id];
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.LocalSocket = LocalSocket;
  window.LocalSocketServer = LocalSocketServer;
}
