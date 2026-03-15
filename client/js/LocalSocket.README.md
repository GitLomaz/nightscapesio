# LocalSocket - Singleplayer Socket.io Replacement

A drop-in replacement for socket.io that works entirely in the browser for singleplayer mode.

## Files Created

- `LocalSocket.js` - Core local socket implementation
- `SocketAdapter.js` - Adapter that switches between multiplayer and singleplayer
- `LocalSocket.example.js` - Usage examples

## Quick Start

### 1. Include the scripts in your HTML

```html
<!-- Add these BEFORE your game scripts -->
<script type="text/javascript" src="./js/LocalSocket.js"></script>
<script type="text/javascript" src="./js/SocketAdapter.js"></script>
```

### 2. Initialize in singleplayer mode

The game automatically detects singleplayer mode when you visit:
```
singleplayer.html?singleplayer
```

Or manually initialize:

```javascript
// Create socket adapter
const socketAdapter = new SocketAdapter({
  mode: 'local',      // Use 'local' for singleplayer
  id: 'player1',
  token: 'local_token',
  guest: false
});

// Get the socket (works like socket.io)
const socket = socketAdapter.getSocket();
```

### 3. Use socket normally

```javascript
// Listen for events
socket.on('playerPositions', function(data) {
  console.log('Received:', data);
});

// Emit events
socket.emit('pushLocation', { x: 10, y: 20 });

// All socket.io methods work the same!
socket.on('connect', () => console.log('Connected!'));
socket.on('disconnect', () => console.log('Disconnected!'));
```

## How It Works

### LocalSocket Class

Mimics socket.io's client-side API:
- `on(eventName, callback)` - Listen for events
- `emit(eventName, data)` - Trigger events locally
- `off(eventName, callback)` - Remove listeners
- `disconnect()` - Disconnect socket
- `connect()` - Reconnect socket

Events are triggered asynchronously (using setTimeout) to match socket.io's behavior.

### SocketAdapter Class

Provides a unified interface:
- Set `mode: 'local'` for singleplayer
- Set `mode: 'multiplayer'` for socket.io
- Same API regardless of mode
- Easy switching between modes

### LocalSocketServer Class

For advanced use cases where you need server-side logic:
- Manages multiple sockets
- Handles connection events
- Can broadcast to all sockets

## Integration with Existing Code

Your existing socket.io code works without changes:

```javascript
// This code works in both modes!
socket.on('enemyPositions', updateEnemies);
socket.on('playerPositions', updatePlayers);
socket.emit('useSkill', { id: skillId });
```

## Switching Between Modes

### Method 1: URL Parameter (Current Implementation)
Visit `singleplayer.html?singleplayer` to activate local mode.

### Method 2: Manual Toggle
```javascript
// Change mode in SocketAdapter config
const adapter = new SocketAdapter({
  mode: 'local',  // or 'multiplayer'
  // ... other config
});
```

## Testing Singleplayer

1. Open `singleplayer.html?singleplayer`
2. Check console for: `[DEBUG] Singleplayer mode detected`
3. Socket automatically connects locally
4. All socket events work in-memory

## Simulating Server Responses

In singleplayer mode, you need to simulate server responses:

```javascript
if (socketAdapter.isLocal()) {
  // Simulate server sending data
  socket.on('pushLocation', function(data) {
    // Process the location
    console.log('Player moved to:', data);
    
    // Respond with updated positions
    socket.emit('playerPositions', [{
      x: data.x,
      y: data.y,
      name: 'Player',
      health: 100
    }]);
  });
}
```

## Benefits

✅ **No server needed** - Works entirely in browser  
✅ **Same API as socket.io** - Drop-in replacement  
✅ **Easy testing** - Test game logic without server  
✅ **Offline play** - Works without internet  
✅ **Lightweight** - No socket.io dependency needed  

## Migration Checklist

- [x] Created LocalSocket and SocketAdapter classes
- [x] Added scripts to singleplayer.html
- [x] Modified game.js to detect singleplayer mode
- [ ] Implement local game loop (tick handling)
- [ ] Simulate server responses for all events
- [ ] Update player/enemy position logic
- [ ] Handle local state management
- [ ] Test all game features offline

## Next Steps

1. **Implement local game loop** - Replace server tick with client-side loop
2. **Add state management** - Track players, enemies, etc. locally
3. **Simulate server logic** - Move server code to client for singleplayer
4. **Test thoroughly** - Ensure all features work offline

## Questions?

Check `LocalSocket.example.js` for detailed usage examples!
