// CharacterManager.js - Helper functions for managing characters in localStorage

class CharacterManager {
  constructor() {
    this.db = typeof LocalStorageDB !== 'undefined' ? new LocalStorageDB() : null;
  }

  /**
   * Create a new character with default values matching MySQL schema
   * @param {Object} characterData - Character creation data
   * @returns {Object} Created character
   */
  createCharacter(characterData = {}) {
    const defaults = {
      // account_id is not needed for single-player
      name: characterData.name || 'Hero',
      map: 'ArchitonOutpost',
      class: 'Knight',
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
      gold: 0,
      token: null,
      combatItems: JSON.stringify({ s0: null, s1: null, s2: null, s3: null }),
      combatSkills: JSON.stringify({ s0: null, s1: null, s2: null, s3: null }),
      statusEffects: JSON.stringify([]),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Merge with provided data
    const character = { ...defaults, ...characterData };

    // Ensure JSON fields are strings
    if (typeof character.combatItems !== 'string') {
      character.combatItems = JSON.stringify(character.combatItems);
    }
    if (typeof character.combatSkills !== 'string') {
      character.combatSkills = JSON.stringify(character.combatSkills);
    }
    if (typeof character.statusEffects !== 'string') {
      character.statusEffects = JSON.stringify(character.statusEffects);
    }

    // Insert into database
    const result = this.db.insert('character', character);
    return result;
  }

  /**
   * Get a character by ID
   * @param {number} id - Character ID
   * @returns {Object|null} Character data or null if not found
   */
  getCharacter(id) {
    const results = this.db.select('character', { id });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get a character by name
   * @param {string} name - Character name
   * @returns {Object|null} Character data or null if not found
   */
  getCharacterByName(name) {
    const results = this.db.select('character', { name });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get all characters
   * @returns {Array} Array of all characters
   */
  getAllCharacters() {
    return this.db.select('character');
  }

  /**
   * Update a character
   * @param {number} id - Character ID
   * @param {Object} updateData - Data to update
   * @returns {boolean} Success status
   */
  updateCharacter(id, updateData) {
    updateData.updated_at = new Date().toISOString();
    return this.db.update('character', updateData, { id });
  }

  /**
   * Delete a character and all associated data
   * @param {number} id - Character ID
   * @returns {boolean} Success status
   */
  deleteCharacter(id) {
    // Delete character and all related data
    this.db.delete('character', { id });
    this.db.delete('character_equipment', { character_id: id });
    this.db.delete('character_item', { character_id: id });
    this.db.delete('character_kills', { character_id: id });
    this.db.delete('character_quest', { character_id: id });
    this.db.delete('character_skill', { character_id: id });
    return true;
  }

  /**
   * Check if a character name is available
   * @param {string} name - Character name to check
   * @returns {boolean} True if name is available
   */
  isNameAvailable(name) {
    const results = this.db.select('character', { name });
    return results.length === 0;
  }

  /**
   * Add equipment to a character
   * @param {number} characterId - Character ID
   * @param {Object} equipment - Equipment item
   * @returns {Object} Created equipment entry
   */
  addEquipment(characterId, equipment) {
    const equipmentData = {
      character_id: characterId,
      item_id: equipment.id,
      itemString: typeof equipment === 'string' ? equipment : JSON.stringify(equipment),
      sold: 0
    };
    return this.db.upsert('character_equipment', equipmentData);
  }

  /**
   * Add or update an item in character's inventory
   * @param {number} characterId - Character ID
   * @param {number} itemId - Item ID
   * @param {number} quantity - Item quantity
   * @returns {Object} Created/updated item entry
   */
  addItem(characterId, itemId, quantity) {
    const itemData = {
      character_id: characterId,
      item_id: itemId,
      quantity: quantity
    };
    return this.db.upsert('character_item', itemData);
  }

  /**
   * Update character kill count
   * @param {number} characterId - Character ID
   * @param {number} enemyId - Enemy ID
   * @param {number} quantity - Kill count
   * @returns {Object} Created/updated kill entry
   */
  updateKills(characterId, enemyId, quantity) {
    const killData = {
      character_id: characterId,
      enemy_id: enemyId,
      quantity: quantity
    };
    return this.db.upsert('character_kills', killData);
  }

  /**
   * Update quest progress
   * @param {number} characterId - Character ID
   * @param {number} questId - Quest ID
   * @param {Object} questData - Quest progress data
   * @returns {Object} Created/updated quest entry
   */
  updateQuest(characterId, questId, questData) {
    const data = {
      character_id: characterId,
      quest_id: questId,
      status: questData.status || 0,
      step: questData.step || 0,
      progress: typeof questData.progress === 'string' ? questData.progress : JSON.stringify(questData.progress || {}),
      completed: questData.completed || 0
    };
    return this.db.upsert('character_quest', data);
  }

  /**
   * Update skill level
   * @param {number} characterId - Character ID
   * @param {number} skillId - Skill ID
   * @param {number} level - Skill level
   * @returns {Object} Created/updated skill entry
   */
  updateSkill(characterId, skillId, level) {
    const skillData = {
      character_id: characterId,
      skill_id: skillId,
      level: level
    };
    return this.db.upsert('character_skill', skillData);
  }

  /**
   * Export character data (for backup)
   * @param {number} id - Character ID
   * @returns {Object} All character data
   */
  exportCharacter(id) {
    return {
      character: this.db.select('character', { id }),
      equipment: this.db.select('character_equipment', { character_id: id }),
      items: this.db.select('character_item', { character_id: id }),
      kills: this.db.select('character_kills', { character_id: id }),
      quests: this.db.select('character_quest', { character_id: id }),
      skills: this.db.select('character_skill', { character_id: id })
    };
  }

  /**
   * Import character data (for restore)
   * @param {Object} data - Exported character data
   * @returns {boolean} Success status
   */
  importCharacter(data) {
    try {
      if (data.character && data.character.length > 0) {
        const char = data.character[0];
        this.db.insert('character', char);
        
        if (data.equipment) {
          data.equipment.forEach(eq => this.db.upsert('character_equipment', eq));
        }
        if (data.items) {
          data.items.forEach(item => this.db.upsert('character_item', item));
        }
        if (data.kills) {
          data.kills.forEach(kill => this.db.upsert('character_kills', kill));
        }
        if (data.quests) {
          data.quests.forEach(quest => this.db.upsert('character_quest', quest));
        }
        if (data.skills) {
          data.skills.forEach(skill => this.db.upsert('character_skill', skill));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Import character error:', error);
      return false;
    }
  }
}

// Expose as global for browser
if (typeof window !== 'undefined') {
  window.CharacterManager = CharacterManager;
}
