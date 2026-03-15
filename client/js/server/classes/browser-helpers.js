// Browser LocalStorage Character System - Quick Start Guide

/**
 * This file demonstrates how to use the LocalStorage character system in the browser.
 * All scripts are loaded via <script> tags in singleplayer.html
 */

// =============================================================================
// QUICK START - Create a Character on First Load
// =============================================================================

// Check if this is first time playing (no characters exist)
function initCharacterSystem() {
  // CharacterManager is globally available from CharacterManager.js
  const manager = new CharacterManager();
  
  const existingChars = manager.getAllCharacters().filter(c => c.id != -1); // Exclude template
  
  if (existingChars.length === 0) {
    console.log('🎮 First time playing! Creating default character...');
    console.log('ℹ️  Template character (ID -1) is reserved for system use');
    
    // Create default character with MySQL schema defaults
    const character = manager.createCharacter({
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
    
    console.log('✅ Character created with ID:', character.id);
    return character;
  } else {
    console.log('✅ Found', existingChars.length, 'existing character(s)');
    return existingChars[0]; // Return first character
  }
}

// =============================================================================
// USAGE EXAMPLES IN BROWSER CONSOLE
// =============================================================================

// Example 1: Create a new character
function createNewCharacter(name, className) {
  const manager = new CharacterManager();
  
  if (!manager.isNameAvailable(name)) {
    console.error('❌ Name already taken!');
    return null;
  }
  
  const char = manager.createCharacter({
    name: name,
    class: className || 'Warrior'
  });
  
  console.log('✅ Created:', char);
  return char;
}

// Example 2: List all characters
function listCharacters() {
  const manager = new CharacterManager();
  const chars = manager.getAllCharacters();
  const playerChars = chars.filter(c => c.id != -1); // Exclude template
  
  console.log('\n📋 Characters:', playerChars.length);
  playerChars.forEach(c => {
    console.log(`  [${c.id}] ${c.name} - Lvl ${c.level} ${c.class}`);
  });
  
  // Show template character separately
  const template = chars.find(c => c.id == -1);
  if (template) {
    console.log('\n🔧 System Characters:');
    console.log(`  [-1] ${template.name} (Template) - ${template.class}`);
  }
  
  return playerChars;
}

// Example 3: Update character stats
function giveGold(characterId, amount) {
  const manager = new CharacterManager();
  const char = manager.getCharacter(characterId);
  
  if (!char) {
    console.error('❌ Character not found!');
    return;
  }
  
  manager.updateCharacter(characterId, {
    gold: char.gold + amount
  });
  
  console.log('✅ Added', amount, 'gold. New total:', char.gold + amount);
}

// Example 4: Level up character
function levelUp(characterId) {
  const manager = new CharacterManager();
  const char = manager.getCharacter(characterId);
  
  if (!char) {
    console.error('❌ Character not found!');
    return;
  }
  
  manager.updateCharacter(characterId, {
    level: char.level + 1,
    skillPoints: char.skillPoints + 1,
    points: char.points + 5,
    exp: 0
  });
  
  console.log('✅ Level up! Now level', char.level + 1);
}

// Example 5: Reset database (CAUTION!)
function resetAllData() {
  if (confirm('⚠️ Delete ALL character data?')) {
    const db = new LocalStorageDB();
    db.clearAll();
    console.log('✅ Database reset!');
  }
}

// =============================================================================
// BROWSER CONSOLE HELPERS - Available globally
// =============================================================================

window.CharacterSystemHelpers = {
  init: initCharacterSystem,
  create: createNewCharacter,
  list: listCharacters,
  giveGold: giveGold,
  levelUp: levelUp,
  reset: resetAllData,
  
  // Quick access to manager
  getManager: () => new CharacterManager(),
  
  // Debug helpers
  viewStorage: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('nightscape_')) {
        console.log(key, localStorage.getItem(key));
      }
    });
  }
};

// =============================================================================
// AUTO-INITIALIZE ON PAGE LOAD
// =============================================================================

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 LocalStorage Character System Loaded!');
    console.log('💡 Use CharacterSystemHelpers for quick commands:');
    console.log('   CharacterSystemHelpers.list()');
    console.log('   CharacterSystemHelpers.create("MyHero", "Warrior")');
    console.log('   CharacterSystemHelpers.giveGold(1, 1000)');
    console.log('   CharacterSystemHelpers.levelUp(1)');
  });
}

// =============================================================================
// INTEGRATION WITH PLAYER CLASS
// =============================================================================

/**
 * The Player class (player.js) automatically uses LocalStorageDB now.
 * No changes needed - it works exactly like MySQL did.
 * 
 * Example:
 * const player = new Player(characterId, token, false, false);
 * player.createOrLoadPlayer(); // Loads from localStorage
 * player.save(); // Saves to localStorage
 */
