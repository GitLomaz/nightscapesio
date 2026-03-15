/**
 * Initialize LocalStorage Character System
 * 
 * This script demonstrates how to set up the localStorage character system
 * and create a default character for testing/demo purposes.
 */

// Check if we're in browser or Node.js
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  console.log('🎮 Initializing Nightscapes LocalStorage Character System...');
}

/**
 * Initialize the database and create a default character
 */
function initializeCharacterSystem() {
  // Load dependencies
  let CharacterManager;
  
  if (isBrowser) {
    CharacterManager = window.CharacterManager;
  } else {
    CharacterManager = require('./classes/CharacterManager.js');
  }
  
  const manager = new CharacterManager();
  
  // Check if any characters exist
  const existingChars = manager.getAllCharacters();
  
  if (existingChars.length === 0) {
    console.log('📝 No characters found. Creating default character...');
    
    // Create a default character with the MySQL schema defaults
    const defaultCharacter = manager.createCharacter({
      name: 'Hero',
      class: 'Knight',
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
      health: 100000,
      mana: 100000,
      exp: 0,
      level: 1,
      gold: 0
    });
    
    console.log('✅ Default character created:', defaultCharacter);
    return defaultCharacter;
  } else {
    console.log(`✅ Found ${existingChars.length} existing character(s)`);
    return existingChars[0]; // Return first character
  }
}

/**
 * Create a character with custom stats
 */
function createCustomCharacter(options = {}) {
  let CharacterManager;
  
  if (isBrowser) {
    CharacterManager = window.CharacterManager;
  } else {
    CharacterManager = require('./classes/CharacterManager.js');
  }
  
  const manager = new CharacterManager();
  
  // Check if name is available
  if (options.name && !manager.isNameAvailable(options.name)) {
    console.error(`❌ Character name "${options.name}" is already taken!`);
    return null;
  }
  
  // Create character
  const character = manager.createCharacter(options);
  console.log('✅ Character created:', character.name, '(ID:', character.id + ')');
  
  return character;
}

/**
 * Load a character by ID
 */
function loadCharacter(characterId) {
  let CharacterManager;
  
  if (isBrowser) {
    CharacterManager = window.CharacterManager;
  } else {
    CharacterManager = require('./classes/CharacterManager.js');
  }
  
  const manager = new CharacterManager();
  const character = manager.getCharacter(characterId);
  
  if (character) {
    console.log('✅ Character loaded:', character);
  } else {
    console.error(`❌ Character with ID ${characterId} not found!`);
  }
  
  return character;
}

/**
 * List all characters
 */
function listAllCharacters() {
  let CharacterManager;
  
  if (isBrowser) {
    CharacterManager = window.CharacterManager;
  } else {
    CharacterManager = require('./classes/CharacterManager.js');
  }
  
  const manager = new CharacterManager();
  const characters = manager.getAllCharacters();
  
  console.log(`\n📋 Characters (${characters.length}):\n`);
  
  if (characters.length === 0) {
    console.log('  No characters found.');
  } else {
    characters.forEach(char => {
      console.log(`  [${char.id}] ${char.name} - ${char.class} (Level ${char.level})`);
      console.log(`      Location: ${char.map} (${char.x}, ${char.y})`);
      console.log(`      Stats: STR:${char.strength} VIT:${char.vitality} INT:${char.intelligence} AGI:${char.agility} DEX:${char.dexterity}`);
      console.log(`      Gold: ${char.gold} | XP: ${char.exp}\n`);
    });
  }
  
  return characters;
}

/**
 * Example: Create starter characters for different classes
 */
function createStarterCharacters() {
  const classes = [
    { name: 'Warrior', class: 'Warrior', strength: 5, vitality: 5, intelligence: 1, agility: 2, dexterity: 2 },
    { name: 'Mage', class: 'Mage', strength: 1, vitality: 2, intelligence: 5, agility: 2, dexterity: 2 },
    { name: 'Ranger', class: 'Ranger', strength: 2, vitality: 2, intelligence: 2, agility: 5, dexterity: 5 },
    { name: 'Knight', class: 'Knight', strength: 3, vitality: 5, intelligence: 1, agility: 2, dexterity: 3 }
  ];
  
  console.log('🎮 Creating starter characters for each class...\n');
  
  const created = [];
  classes.forEach(charData => {
    const char = createCustomCharacter(charData);
    if (char) {
      created.push(char);
    }
  });
  
  return created;
}

/**
 * Reset the entire database (CAUTION!)
 */
function resetDatabase() {
  if (!isBrowser || confirm('⚠️ This will delete ALL character data! Are you sure?')) {
    let LocalStorageDB;
    
    if (isBrowser) {
      LocalStorageDB = window.LocalStorageDB;
    } else {
      LocalStorageDB = require('./classes/LocalStorageDB.js');
    }
    
    const db = new LocalStorageDB();
    db.clearAll();
    console.log('✅ Database reset complete!');
  }
}

// Export functions for use in other scripts
if (isBrowser) {
  window.CharacterSystemInit = {
    initialize: initializeCharacterSystem,
    createCharacter: createCustomCharacter,
    loadCharacter: loadCharacter,
    listAll: listAllCharacters,
    createStarters: createStarterCharacters,
    reset: resetDatabase
  };
  
  // Auto-initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('🚀 LocalStorage Character System Ready!');
      console.log('💡 Use CharacterSystemInit.* functions to manage characters');
      console.log('   - CharacterSystemInit.initialize()');
      console.log('   - CharacterSystemInit.createCharacter({ name: "Hero" })');
      console.log('   - CharacterSystemInit.listAll()');
    });
  } else {
    console.log('🚀 LocalStorage Character System Ready!');
  }
} else {
  // Node.js exports
  module.exports = {
    initialize: initializeCharacterSystem,
    createCharacter: createCustomCharacter,
    loadCharacter: loadCharacter,
    listAll: listAllCharacters,
    createStarters: createStarterCharacters,
    reset: resetDatabase
  };
}

// Example usage (uncomment to auto-run):
// initializeCharacterSystem();
// listAllCharacters();
