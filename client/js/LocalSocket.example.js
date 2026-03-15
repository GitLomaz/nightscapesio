// Example usage of LocalSocket / SocketAdapter for singleplayer mode

// EXAMPLE 1: Using LocalSocket directly
// =====================================

// Create a socket server (handles multiple sockets if needed)
const socketServer = new LocalSocketServer();

// Create a socket connection
const socket = socketServer.createSocket({
  id: 'player1',
  token: 'local_token',
  guest: false
});

// Listen for events (just like socket.io)
socket.on('playerPositions', function(data) {
  console.log('Received player positions:', data);
});

socket.on('enemyPositions', function(data) {
  console.log('Received enemy positions:', data);
});

// Emit events (triggers handlers immediately but async)
socket.emit('playerPositions', [{ x: 10, y: 20, name: 'Player1' }]);

// Server-side connection handling (if needed)
socketServer.on('connection', function(socket) {
  console.log('New socket connected:', socket.id);
  
  socket.on('disconnect', function() {
    console.log('Socket disconnected:', socket.id);
  });
});


// EXAMPLE 2: Using SocketAdapter (Recommended)
// =============================================

// For singleplayer (local mode)
const adapter = new SocketAdapter({
  mode: 'local',
  id: 'player1',
  token: 'local_token',
  guest: false
});

// For multiplayer (when you want to switch back)
// const adapter = new SocketAdapter({
//   mode: 'multiplayer',
//   url: 'http://localhost:8080',
//   id: 'player1',
//   token: 'real_token'
// });

// Use the same API regardless of mode
adapter.on('playerPositions', function(data) {
  console.log('Player positions:', data);
});

adapter.emit('loaded', {});

// Check mode
if (adapter.isLocal()) {
  console.log('Running in singleplayer mode');
  
  // Access the server directly (only in local mode)
  const server = adapter.getServer();
  
  // You can manually trigger server events
  server.on('connection', function(socket) {
    console.log('Player connected');
  });
}


// EXAMPLE 3: Replacing existing socket.io code
// =============================================

// OLD CODE (multiplayer):
// const socket = io('http://localhost:8080', {
//   query: { id: playerId, token: playerToken }
// });

// NEW CODE (singleplayer):
const socketAdapter = new SocketAdapter({
  mode: 'local',
  id: playerId,
  token: 'local_token'
});
const socket = socketAdapter.getSocket();

// Everything else works the same!
socket.on('connect', function() {
  console.log('Connected!');
});

socket.emit('login', { username: 'Player' });


// EXAMPLE 4: Game-specific integration
// =====================================

// Initialize the socket adapter
window.gameSocket = new SocketAdapter({
  mode: 'local', // Change to 'multiplayer' when ready
  id: 'singleplayer',
  guest: false
});

// Get the socket instance
const gameSocket = window.gameSocket.getSocket();

// Set up game event handlers
gameSocket.on('playerPositions', function(players) {
  // Update player sprites
  updatePlayerSprites(players);
});

gameSocket.on('enemyPositions', function(enemies) {
  // Update enemy sprites
  updateEnemySprites(enemies);
});

gameSocket.on('chatMessage', function(msg) {
  // Display chat message
  displayChatMessage(msg);
});

// Emit game events
gameSocket.emit('pushLocation', { x: 10, y: 20 });
gameSocket.emit('useSkill', { id: 1 });

// In local mode, you can simulate server responses
if (window.gameSocket.isLocal()) {
  // Simulate server sending data
  setTimeout(() => {
    gameSocket.emit('playerPositions', [{
      x: 10,
      y: 20,
      name: 'You',
      health: 100
    }]);
  }, 100);
}
