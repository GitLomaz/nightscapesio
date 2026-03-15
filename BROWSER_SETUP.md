# Browser LocalStorage Setup - Nightscapes

## ✅ Installation Complete!

The localStorage system has been integrated into `singleplayer.html`. No `require()` statements needed - everything loads via `<script>` tags!

---

## 📁 Files Added to singleplayer.html

The following scripts are now loaded in order:

```html
<!-- Data files (must load first) -->
<script src="./data/animals.js"></script>
<script src="./data/levels.js"></script>
<script src="./data/quests.js"></script>

<!-- Server classes -->
<script src="./js/server/classes/skill.js"></script>
<script src="./js/server/classes/kill.js"></script>

<!-- LocalStorage Database System (replaces MySQL) -->
<script src="./js/server/classes/LocalStorageDB.js"></script>
<script src="./js/server/classes/Sql.js"></script>
<script src="./js/server/classes/CharacterManager.js"></script>
<script src="./js/server/classes/browser-helpers.js"></script>
<script src="./js/server/classes/player.js"></script>
```

---

## 🎮 How It Works

### All globals are available in browser:

```javascript
// These are now available globally (no require needed):
LocalStorageDB    // Database engine
Sql               // Query builder
CharacterManager  // High-level character API
CharacterSystemHelpers  // Convenience functions
```

### The Player class automatically uses localStorage:

```javascript
// player.js now uses:
const conn = new LocalStorageDB();  // Instead of MySQL

// Everything else works exactly the same!
```

---

## 🚀 Quick Start

### 1. Open singleplayer.html in browser

### 2. Open browser console (F12)

### 3. Use the helper functions:

```javascript
// List all characters
CharacterSystemHelpers.list()

// Create a new character
CharacterSystemHelpers.create('Warrior1', 'Warrior')

// Give gold
CharacterSystemHelpers.giveGold(1, 5000)

// Level up
CharacterSystemHelpers.levelUp(1)

// View raw localStorage
CharacterSystemHelpers.viewStorage()

// Reset everything (CAUTION!)
CharacterSystemHelpers.reset()
```

---

## 💻 Direct API Usage

### Using CharacterManager:

```javascript
// Create manager instance
const manager = new CharacterManager();

// Create character
const hero = manager.createCharacter({
  name: 'MyHero',
  class: 'Mage',
  intelligence: 10
});

// Get character
const char = manager.getCharacter(1);

// Update character
manager.updateCharacter(1, { gold: 1000, level: 5 });

// Add item
manager.addItem(1, 101, 5);  // charId, itemId, quantity

// Update quest
manager.updateQuest(1, 5, {
  status: 1,
  step: 2,
  completed: 0
});

// Delete character
manager.deleteCharacter(1);
```

### Using LocalStorageDB:

```javascript
// Create database instance
const db = new LocalStorageDB();

// SQL-like queries
db.query("SELECT * FROM character WHERE id = '1'", (err, result) => {
  console.log(result);
});

// Direct operations
const chars = db.select('character', { level: 1 });
db.update('character', { gold: 500 }, { id: 1 });
db.upsert('character_item', {
  character_id: 1,
  item_id: 101,
  quantity: 10
});
```

---

## 🎯 Common Tasks

### Create a character on first play:

```javascript
const manager = new CharacterManager();
const chars = manager.getAllCharacters();

if (chars.length === 0) {
  // First time - create default character
  const hero = manager.createCharacter({
    name: 'Hero',
    class: 'Knight'
  });
  console.log('Created character:', hero.id);
}
```

### Load character into Player class:

```javascript
// The Player class works exactly as before
const player = new Player(1, 'token', false, false);
player.createOrLoadPlayer();

// Data automatically saves via player.save()
```

### Backup/restore data:

```javascript
const manager = new CharacterManager();

// Backup
const backup = manager.exportCharacter(1);
const json = JSON.stringify(backup);
localStorage.setItem('backup_slot_1', json);

// Restore
const saved = localStorage.getItem('backup_slot_1');
manager.importCharacter(JSON.parse(saved));
```

---

## 🔍 Debugging

### View all data:

```javascript
// See what's in localStorage
Object.keys(localStorage)
  .filter(k => k.startsWith('nightscape_'))
  .forEach(k => console.log(k, JSON.parse(localStorage.getItem(k))));
```

### Check character data:

```javascript
const manager = new CharacterManager();

// View character details
const char = manager.getCharacter(1);
console.log(char);

// View all character data (items, quests, etc)
const fullData = manager.exportCharacter(1);
console.log(fullData);
```

### Clear all data:

```javascript
const db = new LocalStorageDB();
db.clearAll();
console.log('Database cleared!');
```

---

## 📊 Database Tables

All data is stored in localStorage with prefix `nightscape_`:

- `nightscape_character` - Character stats and info
- `nightscape_character_equipment` - Equipment items
- `nightscape_character_item` - Inventory items
- `nightscape_character_kills` - Enemy kill counts
- `nightscape_character_quest` - Quest progress
- `nightscape_character_skill` - Skill levels
- `nightscape_character_id_counter` - Auto-increment counter

---

## ⚙️ Configuration

### No configuration needed!

The system automatically:
- Initializes tables on first load
- Creates auto-increment IDs
- Handles JSON serialization
- Maintains data persistence

---

## 🎨 Example: Character Selection Screen

```javascript
function showCharacterSelect() {
  const manager = new CharacterManager();
  const chars = manager.getAllCharacters();
  
  if (chars.length === 0) {
    // No characters - show creation screen
    showCharacterCreation();
  } else {
    // Show character list
    chars.forEach(char => {
      console.log(`[${char.id}] ${char.name} - Level ${char.level} ${char.class}`);
    });
    
    // Load selected character
    const selectedId = 1; // from user selection
    const player = new Player(selectedId, 'token', false, false);
    player.createOrLoadPlayer();
  }
}

function showCharacterCreation() {
  const manager = new CharacterManager();
  
  // Get name and class from UI
  const name = 'NewHero';
  const charClass = 'Warrior';
  
  if (manager.isNameAvailable(name)) {
    const char = manager.createCharacter({
      name: name,
      class: charClass
    });
    
    // Load the new character
    const player = new Player(char.id, 'token', false, false);
    player.createOrLoadPlayer();
  } else {
    alert('Name already taken!');
  }
}
```

---

## 🚨 Important Notes

### Browser Storage Limits:
- Most browsers: ~5-10MB localStorage limit
- Should handle 100+ characters with full data
- Export important saves as backup

### Data Persistence:
- Data persists across page refreshes
- Data is browser-specific (not synced)
- Clearing browser data deletes saves
- Use export/import for backups

### Security:
- Data stored in plain text
- Accessible via browser console
- No encryption (single-player mode)
- Perfect for offline/local play

---

## ✨ That's it!

Open `singleplayer.html` and start playing! Your character data is automatically saved to localStorage. No MySQL server needed! 🎮

### Quick Test:

1. Open singleplayer.html
2. Press F12 for console
3. Type: `CharacterSystemHelpers.list()`
4. Create a character: `CharacterSystemHelpers.create('Hero', 'Knight')`
5. Check it worked: `CharacterSystemHelpers.list()`

Done! 🎉
