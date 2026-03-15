# LocalStorage Character System

This system replaces MySQL with browser localStorage for single-player character management.

## Overview

The localStorage system maintains the same structure as the original MySQL database schema:

### Tables

1. **character** - Main character data (stats, position, level, etc.)
2. **character_equipment** - Equipment items owned by character
3. **character_item** - Inventory items with quantities
4. **character_kills** - Enemy kill counts
5. **character_quest** - Quest progress and status
6. **character_skill** - Skill levels

## Files

- **LocalStorageDB.js** - Core database wrapper that mimics MySQL operations
- **Sql.js** - SQL query builder (generates SQL-like strings)
- **CharacterManager.js** - High-level character management utilities
- **player.js** - Updated to use LocalStorageDB instead of MySQL

## Usage Examples

### 1. Create a New Character

```javascript
// Include the CharacterManager
const CharacterManager = require('./classes/CharacterManager.js');
const manager = new CharacterManager();

// Create a new character
const character = manager.createCharacter({
  name: 'MyHero',
  class: 'Warrior',
  map: 'ArchitonOutpost',
  x: 41,
  y: 69
});

console.log('Character created with ID:', character.id);
```

### 2. Load an Existing Character

```javascript
const manager = new CharacterManager();

// Get character by ID
const character = manager.getCharacter(1);

// Get character by name
const character = manager.getCharacterByName('MyHero');

console.log(character);
```

### 3. Update Character Stats

```javascript
const manager = new CharacterManager();

// Update character
manager.updateCharacter(1, {
  level: 5,
  exp: 1000,
  health: 150000,
  strength: 10,
  vitality: 8
});
```

### 4. Add Items and Equipment

```javascript
const manager = new CharacterManager();

// Add an item to inventory
manager.addItem(1, 101, 5); // characterId, itemId, quantity

// Add equipment
manager.addEquipment(1, {
  id: 201,
  name: 'Iron Sword',
  stats: { damageMin: 10, damageMax: 15 },
  equipped: true,
  slot: 'weapon'
});
```

### 5. Update Quests and Skills

```javascript
const manager = new CharacterManager();

// Update quest progress
manager.updateQuest(1, 1, {
  status: 1,
  step: 2,
  progress: { objectives: [1, 0, 0] },
  completed: 0
});

// Update skill level
manager.updateSkill(1, 5, 10); // characterId, skillId, level
```

### 6. Working with Player Class

```javascript
// The Player class now automatically uses LocalStorageDB
const Player = require('./classes/player.js');

// Create a player instance (will load from localStorage)
const player = new Player(1, 'token123', false, false);

// The player will automatically load data from localStorage
player.createOrLoadPlayer();

// Data is automatically saved periodically via the save() method
```

### 7. Direct Database Operations

```javascript
const LocalStorageDB = require('./classes/LocalStorageDB.js');
const db = new LocalStorageDB();

// SELECT
const characters = db.select('character', { level: 5 });

// INSERT
db.insert('character_item', {
  character_id: 1,
  item_id: 101,
  quantity: 10
});

// UPDATE
db.update('character', { gold: 1000 }, { id: 1 });

// UPSERT (insert or update)
db.upsert('character_skill', {
  character_id: 1,
  skill_id: 5,
  level: 10
});

// Using SQL-like queries
db.query("SELECT * FROM character WHERE id = '1'", (error, result) => {
  console.log(result);
});
```

### 8. Export and Import Characters

```javascript
const manager = new CharacterManager();

// Export character data (for backup)
const characterData = manager.exportCharacter(1);
const jsonBackup = JSON.stringify(characterData);
// Save to file or send to server

// Import character data (for restore)
const importedData = JSON.parse(jsonBackup);
manager.importCharacter(importedData);
```

### 9. Character Management

```javascript
const manager = new CharacterManager();

// Check if name is available
if (manager.isNameAvailable('NewHero')) {
  const char = manager.createCharacter({ name: 'NewHero' });
}

// Get all characters
const allCharacters = manager.getAllCharacters();
console.log('Total characters:', allCharacters.length);

// Delete a character and all associated data
manager.deleteCharacter(1);
```

### 10. Database Maintenance

```javascript
const LocalStorageDB = require('./classes/LocalStorageDB.js');
const db = new LocalStorageDB();

// Export all database data
const backup = db.exportData();
console.log('Backup created');

// Import database data
db.importData(backup);

// Clear all data (CAUTION!)
db.clearAll();
```

## Migration from MySQL

The system is designed to be a drop-in replacement for MySQL:

1. **No code changes needed** - The Player class and existing code continue to work
2. **Same API** - The `conn.query()` method signature is maintained
3. **SQL compatibility** - Basic SQL queries are parsed and executed
4. **Auto-increment** - Character IDs are auto-incremented just like MySQL

## Data Structure

### Character Object
```javascript
{
  id: 1,                    // Auto-incremented
  name: 'MyHero',
  map: 'ArchitonOutpost',
  class: 'Knight',
  x: 41,
  y: 69,
  strength: 10,
  vitality: 8,
  intelligence: 5,
  agility: 7,
  dexterity: 6,
  skillPoints: 0,
  points: 0,
  health: 150000,
  mana: 100000,
  exp: 1500,
  level: 5,
  gold: 500,
  token: null,
  combatItems: '{"s0":null,"s1":null,"s2":null,"s3":null}',
  combatSkills: '{"s0":null,"s1":null,"s2":null,"s3":null}',
  statusEffects: '[]',
  created_at: '2026-03-14T...',
  updated_at: '2026-03-14T...'
}
```

## Browser Console Testing

You can test the system directly in the browser console:

```javascript
// Create a test character
const manager = new CharacterManager();
const char = manager.createCharacter({
  name: 'TestHero',
  class: 'Mage',
  intelligence: 15
});

// Check localStorage
console.log(localStorage.getItem('nightscape_character'));

// Update and verify
manager.updateCharacter(char.id, { level: 10 });
console.log(manager.getCharacter(char.id));
```

## Notes

- All data is stored in browser localStorage with the prefix `nightscape_`
- Data persists across page refreshes but not across different browsers
- No server required - fully client-side
- Character IDs auto-increment starting from 1
- Perfect for single-player/offline mode

## Limitations

- Storage limit: ~5-10MB depending on browser
- No server-side validation
- No multi-device sync (unless you implement export/import)
- No account system (single-player only)

## Troubleshooting

### Clear all data
```javascript
const db = new LocalStorageDB();
db.clearAll();
```

### View raw data
```javascript
// In browser console
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('nightscape_')) {
    console.log(key, localStorage.getItem(key));
  }
});
```

### Check character count
```javascript
const manager = new CharacterManager();
console.log('Characters:', manager.getAllCharacters().length);
```
