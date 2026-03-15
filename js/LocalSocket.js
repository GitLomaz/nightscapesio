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
    console.log('[LocalSocket] Created socket:', this.id);
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
    console.log(`[LocalSocket] ${this.id} registered listener for '${eventName}'`);
  }

  // Remove event listener
  off(eventName, callback) {
    if (!this.listeners[eventName]) return;
    
    if (callback) {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    } else {
      delete this.listeners[eventName];
    }
    console.log(`[LocalSocket] ${this.id} removed listener for '${eventName}'`);
  }

  // Emit event (triggers local handlers immediately)
  emit(eventName, data) {
    const hasData = data !== undefined;
    const dataPreview = hasData ? (typeof data === 'object' ? JSON.stringify(data).substring(0, 100) : data) : 'no data';
    // console.log(`[LocalSocket] ${this.id} emitting '${eventName}' (${this.listeners[eventName]?.length || 0} listeners) - ${dataPreview}`);
    
    // Use setTimeout to make it async like real socket.io
    setTimeout(() => {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(`[LocalSocket] Error in ${eventName} handler:`, error);
          }
        });
      } else {
        console.warn(`[LocalSocket] ${this.id} emitted '${eventName}' but no listeners registered`);
      }
    }, 0);
  }

  // Disconnect
  disconnect() {
    console.log(`[LocalSocket] ${this.id} disconnecting...`);
    this.connected = false;
    this.emit('disconnect');
  }

  // Connect
  connect(query = {}) {
    console.log(`[LocalSocket] ${this.id} connecting with query:`, query);
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
    console.log('[LocalSocketServer] Server created');
  }

  // Create a new socket connection
  createSocket(query = {}) {
    const socket = new LocalSocket();
    socket.handshake.query = query;
    this.sockets[socket.id] = socket;
    console.log('[LocalSocketServer] Created socket with query:', query);
    console.log('[LocalSocketServer] Total sockets:', Object.keys(this.sockets).length);
    
    // Trigger connection event
    setTimeout(() => {
      if (this.listeners['connection']) {
        console.log(`[LocalSocketServer] Triggering connection event (${this.listeners['connection'].length} listeners)`);
        this.listeners['connection'].forEach(callback => {
          callback(socket);
        });
      } else {
        console.warn('[LocalSocketServer] Socket created but no connection listeners registered!');
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
    console.log(`[LocalSocketServer] Registered server listener for '${eventName}'`);
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
    console.log(`[LocalSocketServer] Removing socket: ${id}`);
    delete this.sockets[id];
    console.log('[LocalSocketServer] Total sockets:', Object.keys(this.sockets).length);
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.LocalSocket = LocalSocket;
  window.LocalSocketServer = LocalSocketServer;
}
