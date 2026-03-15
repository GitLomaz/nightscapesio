# ✅ Template Character (ID -1) Added

## What Changed

The LocalStorageDB now automatically creates a **template character** with ID **-1** when the database is initialized. This matches the MySQL database structure.

---

## Template Character Details

```javascript
{
  id: -1,
  name: 'Template',
  class: 'Squire',
  map: 'ArchitonOutpost',
  x: 41,
  y: 69,
  strength: 1,
  vitality: 1,
  intelligence: 1,
  agility: 1,
  dexterity: 1,
  skillPoints: 0,
  points: 0,
  health: 101,
  mana: 20,
  exp: 0,
  level: 1,
  gold: 0,
  combatItems: '{"s0":17,"s1":4,"s2":5,"s3":null}',
  combatSkills: '{"s0":null,"s1":null,"s2":null,"s3":null}',
  statusEffects: '[]'
}
```

---

## Purpose

- **System Use**: The template character is reserved for internal game mechanics
- **Always Present**: Created automatically on database initialization
- **Not for Players**: Excluded from normal character listings
- **ID -1**: Special negative ID indicates system/template status

---

## Implementation

### LocalStorageDB.js
- Added `ensureTemplateCharacter()` method
- Called during `init()` to create template if it doesn't exist
- Only creates once, never duplicates

### browser-helpers.js
- Updated `initCharacterSystem()` to filter out template character
- Updated `listCharacters()` to show template separately
- Player characters: `chars.filter(c => c.id != -1)`

---

## Testing

Open browser console and verify:

```javascript
// List all characters (template shown separately)
CharacterSystemHelpers.list()

// View template character directly
const manager = new CharacterManager();
const template = manager.getCharacter(-1);
console.log(template);

// Verify it exists
const db = new LocalStorageDB();
const chars = db.select('character', { id: -1 });
console.log('Template exists:', chars.length > 0);
```

---

## Notes

- Template character uses different combat item setup: `s0:17, s1:4, s2:5`
- Lower health/mana than default players (101 health, 20 mana)
- Class is "Squire" instead of typical player classes
- Character is created automatically on first page load
- Persists across sessions like all localStorage data

---

**Template character is now part of the system!** ✅
