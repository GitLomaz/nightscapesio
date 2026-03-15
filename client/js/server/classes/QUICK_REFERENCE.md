# 🚀 Quick Reference - LocalStorage Character System

## Imports

```javascript
const LocalStorageDB = require('./LocalStorageDB.js');
const CharacterManager = require('./CharacterManager.js');
const Sql = require('./Sql.js');
```

---

## CharacterManager API

### Character Management

```javascript
const manager = new CharacterManager();

// Create character
manager.createCharacter({ name: 'Hero', class: 'Warrior' })

// Get character by ID
manager.getCharacter(1)

// Get character by name
manager.getCharacterByName('Hero')

// Get all characters
manager.getAllCharacters()

// Update character
manager.updateCharacter(1, { level: 5, gold: 1000 })

// Delete character (and all data)
manager.deleteCharacter(1)

// Check name availability
manager.isNameAvailable('Hero')
```

### Equipment & Items

```javascript
// Add equipment
manager.addEquipment(characterId, equipmentObject)

// Add/update item
manager.addItem(characterId, itemId, quantity)

// Update kills
manager.updateKills(characterId, enemyId, count)
```

### Quests & Skills

```javascript
// Update quest
manager.updateQuest(characterId, questId, {
  status: 1,
  step: 2,
  progress: {},
  completed: 0
})

// Update skill
manager.updateSkill(characterId, skillId, level)
```

### Backup & Restore

```javascript
// Export character
const data = manager.exportCharacter(1)
const json = JSON.stringify(data)

// Import character
manager.importCharacter(JSON.parse(json))
```

---

## LocalStorageDB API

### Direct Database Access

```javascript
const db = new LocalStorageDB();

// SELECT
db.select('character', { id: 1 })
db.select('character_item', { character_id: 1 })

// INSERT
db.insert('character', characterData)

// UPDATE
db.update('character', { gold: 500 }, { id: 1 })

// DELETE
db.delete('character_item', { character_id: 1, item_id: 101 })

// UPSERT
db.upsert('character_skill', {
  character_id: 1,
  skill_id: 5,
  level: 10
})
```

### SQL Queries

```javascript
// Execute SQL-like queries
db.query("SELECT * FROM character WHERE id = '1'", (err, result) => {
  console.log(result);
})

db.query("UPDATE character SET level = '5' WHERE id = '1'")

db.query("INSERT INTO character_item (character_id, item_id, quantity) VALUES ('1', '101', '5')")
```

### Database Utilities

```javascript
// Export all data
const backup = db.exportData()

// Import all data
db.importData(backup)

// Clear database
db.clearAll()

// Get table
const characters = db.getTable('character')

// Save table
db.saveTable('character', charactersArray)
```

---

## Sql Helper API

### Query Builder

```javascript
// SELECT
Sql.select('character', { id: 1 })
// "SELECT * FROM `character` WHERE `id` = '1'"

// INSERT
Sql.insert('character', { name: 'Hero', class: 'Warrior' })
// "INSERT INTO `character` (`name`,`class`) VALUES ('Hero','Warrior')"

// UPDATE
Sql.update('character', { gold: 1000 }, { id: 1 })
// "UPDATE `character` SET `gold` = '1000' WHERE `id` = '1'"

// UPSERT
Sql.upsert('character_item', { character_id: 1, item_id: 101, quantity: 5 })
// "INSERT INTO ... ON DUPLICATE KEY UPDATE ..."

// DELETE
Sql.delete('character_item', { character_id: 1, item_id: 101 })
// "DELETE FROM `character_item` WHERE ..."
```

---

## Character Data Structure

```javascript
{
  id: 1,                    // Auto-increment
  name: 'Hero',
  class: 'Knight',
  map: 'ArchitonOutpost',
  x: 41,
  y: 69,
  
  // Stats
  strength: 10,
  vitality: 8,
  intelligence: 5,
  agility: 7,
  dexterity: 6,
  skillPoints: 0,
  points: 0,
  
  // Progress
  health: 150000,
  mana: 100000,
  exp: 1500,
  level: 5,
  gold: 500,
  
  // Serialized JSON
  combatItems: '{"s0":null,"s1":null,"s2":null,"s3":null}',
  combatSkills: '{"s0":null,"s1":null,"s2":null,"s3":null}',
  statusEffects: '[]',
  
  // Timestamps
  created_at: '2026-03-14T...',
  updated_at: '2026-03-14T...'
}
```

---

## Common Patterns

### Create New Character

```javascript
const manager = new CharacterManager();

if (manager.isNameAvailable('NewHero')) {
  const char = manager.createCharacter({
    name: 'NewHero',
    class: 'Mage',
    intelligence: 10,
    vitality: 5
  });
  console.log('Created:', char.id);
}
```

### Load and Update

```javascript
const manager = new CharacterManager();
const char = manager.getCharacter(1);

if (char) {
  manager.updateCharacter(char.id, {
    level: char.level + 1,
    exp: 0,
    skillPoints: char.skillPoints + 1
  });
}
```

### Add Loot

```javascript
const manager = new CharacterManager();

// Add gold
const char = manager.getCharacter(1);
manager.updateCharacter(1, { gold: char.gold + 100 });

// Add item
manager.addItem(1, 101, 1); // potionId: 101, quantity: 1
```

### Save Game State

```javascript
const manager = new CharacterManager();

// Export all data
const saveData = {
  version: '1.0',
  timestamp: Date.now(),
  characters: manager.getAllCharacters(),
  database: manager.db.exportData()
};

// Save to file
const json = JSON.stringify(saveData);
localStorage.setItem('save_slot_1', json);
```

### Load Game State

```javascript
const json = localStorage.getItem('save_slot_1');
if (json) {
  const saveData = JSON.parse(json);
  
  const manager = new CharacterManager();
  manager.db.importData(saveData.database);
  
  console.log('Game loaded!');
}
```

---

## Browser Console Commands

```javascript
// Quick access in browser
const mgr = new CharacterManager();

// List all
mgr.getAllCharacters()

// Create test
mgr.createCharacter({ name: 'Test' })

// Update
mgr.updateCharacter(1, { gold: 9999 })

// View raw storage
Object.keys(localStorage)
  .filter(k => k.startsWith('nightscape_'))
  .forEach(k => console.log(k, localStorage.getItem(k)))

// Clear all
mgr.db.clearAll()
```

---

## Initialization Script

```javascript
// Include at game startup
const init = require('./init.js');

// Initialize system and create default character if needed
const character = init.initialize();

// Or create custom character
init.createCharacter({ name: 'Player1', class: 'Warrior' });

// List all characters
init.listAll();
```

---

## Player Class Integration

```javascript
// The Player class automatically uses LocalStorageDB now
const Player = require('./classes/player.js');

// Create player instance
const player = new Player(characterId, token, false, false);

// Load character data (from localStorage)
player.createOrLoadPlayer();

// Character data is auto-saved via player.save()
// No changes needed to existing game code!
```

---

## Debugging

```javascript
// Check if data exists
const db = new LocalStorageDB();
console.log('Characters:', db.getTable('character').length);
console.log('Items:', db.getTable('character_item').length);

// View specific character's data
const mgr = new CharacterManager();
console.log(mgr.exportCharacter(1));

// Check localStorage usage
let total = 0;
for (let key in localStorage) {
  if (key.startsWith('nightscape_')) {
    total += localStorage[key].length;
  }
}
console.log('Storage used:', (total / 1024).toFixed(2), 'KB');
```

---

## Tips

- Character IDs auto-increment starting from 1
- All JSON fields must be strings in the database
- Use `manager.updateCharacter()` for atomic updates
- Export data regularly for backups
- LocalStorage limit is ~5-10MB per domain
- Data persists across page refreshes
- Each browser has separate storage

---

## Files Location

```
client/
  ├── localStorage-test.html          # Test UI
  └── js/server/classes/
      ├── LocalStorageDB.js           # Core DB
      ├── CharacterManager.js         # High-level API
      ├── Sql.js                      # Query builder
      ├── init.js                     # Initialization
      ├── player.js                   # Updated Player class
      ├── LOCALSTORAGE_README.md      # Full docs
      └── QUICK_REFERENCE.md          # This file
```

---

**Ready to use!** 🎮
