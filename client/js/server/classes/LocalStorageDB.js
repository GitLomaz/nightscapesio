// LocalStorageDB - A localStorage wrapper that mimics MySQL database operations
// Handles character data storage for single-player mode

class LocalStorageDB {
  constructor() {
    this.prefix = 'nightscape_';
    this.init();
  }

  // Initialize default tables if they don't exist
  init() {
    const tables = [
      'character',
      'character_equipment',
      'character_item',
      'character_kills',
      'character_quest',
      'character_skill'
    ];
    
    tables.forEach(table => {
      if (!localStorage.getItem(this.prefix + table)) {
        localStorage.setItem(this.prefix + table, JSON.stringify([]));
      }
    });

    // Initialize auto-increment counter
    if (!localStorage.getItem(this.prefix + 'character_id_counter')) {
      localStorage.setItem(this.prefix + 'character_id_counter', '1');
    }
    
    // Ensure template character (ID -1) exists
    this.ensureTemplateCharacter();
  }
  
  // Create template character with ID -1 if it doesn't exist
  ensureTemplateCharacter() {
    const characters = this.getTable('character');
    const templateExists = characters.some(char => char.id == -1);
    
    if (!templateExists) {
      const now = new Date().toISOString();
      const templateCharacter = {
        id: -1,
        name: 'Template',
        map: 'ArchitonOutpost',
        class: 'Squire',
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
        token: null,
        combatItems: '{"s0":17,"s1":4,"s2":5,"s3":null}',
        combatSkills: '{"s0":null,"s1":null,"s2":null,"s3":null}',
        statusEffects: '[]',
        created_at: now,
        updated_at: now
      };
      
      characters.push(templateCharacter);
      this.saveTable('character', characters);
      console.log('✅ Template character (ID -1) created');
    }
  }

  // Get next auto-increment ID for character
  getNextCharacterId() {
    let counter = parseInt(localStorage.getItem(this.prefix + 'character_id_counter') || '1');
    localStorage.setItem(this.prefix + 'character_id_counter', (counter + 1).toString());
    return counter;
  }

  // Get table data
  getTable(tableName) {
    const data = localStorage.getItem(this.prefix + tableName);
    return data ? JSON.parse(data) : [];
  }

  // Save table data
  saveTable(tableName, data) {
    localStorage.setItem(this.prefix + tableName, JSON.stringify(data));
  }

  // SELECT query
  select(tableName, where = {}) {
    const table = this.getTable(tableName);
    
    if (Object.keys(where).length === 0) {
      return table;
    }
    
    return table.filter(row => {
      return Object.keys(where).every(key => {
        return row[key] == where[key]; // Use == for type coercion
      });
    });
  }

  // INSERT query
  insert(tableName, data) {
    const table = this.getTable(tableName);
    
    // Auto-increment ID for character table
    if (tableName === 'character' && !data.id) {
      data.id = this.getNextCharacterId();
    }
    
    table.push(data);
    this.saveTable(tableName, table);
    return data;
  }

  // UPDATE query
  update(tableName, updateData, where = {}) {
    const table = this.getTable(tableName);
    let updated = false;
    
    const newTable = table.map(row => {
      const matches = Object.keys(where).every(key => row[key] == where[key]);
      if (matches) {
        updated = true;
        return { ...row, ...updateData };
      }
      return row;
    });
    
    if (updated) {
      this.saveTable(tableName, newTable);
    }
    
    return updated;
  }

  // DELETE query
  delete(tableName, where = {}) {
    const table = this.getTable(tableName);
    const newTable = table.filter(row => {
      return !Object.keys(where).every(key => row[key] == where[key]);
    });
    
    this.saveTable(tableName, newTable);
    return table.length - newTable.length; // Return number of deleted rows
  }

  // UPSERT (INSERT ... ON DUPLICATE KEY UPDATE)
  upsert(tableName, data, primaryKeys = []) {
    const table = this.getTable(tableName);
    
    // Determine primary keys based on table
    if (primaryKeys.length === 0) {
      if (tableName === 'character') {
        primaryKeys = ['id'];
      } else if (tableName === 'character_equipment') {
        primaryKeys = ['character_id', 'item_id'];
      } else if (tableName === 'character_item') {
        primaryKeys = ['character_id', 'item_id'];
      } else if (tableName === 'character_kills') {
        primaryKeys = ['character_id', 'enemy_id'];
      } else if (tableName === 'character_quest') {
        primaryKeys = ['character_id', 'quest_id'];
      } else if (tableName === 'character_skill') {
        primaryKeys = ['character_id', 'skill_id'];
      }
    }
    
    let found = false;
    const newTable = table.map(row => {
      const matches = primaryKeys.every(key => row[key] == data[key]);
      if (matches) {
        found = true;
        return { ...row, ...data };
      }
      return row;
    });
    
    if (!found) {
      newTable.push(data);
    }
    
    this.saveTable(tableName, newTable);
    return data;
  }

  // Query method that mimics MySQL conn.query()
  query(sql, callback) {
    try {
      // Parse SQL-like syntax and execute appropriate operation
      const result = this.executeSql(sql);
      if (callback) {
        // Mimic MySQL callback signature: (error, result, fields)
        callback(null, result, null);
      }
      return result;
    } catch (error) {
      if (callback) {
        callback(error, null, null);
      }
      console.error('LocalStorageDB query error:', error);
      return null;
    }
  }

  // Execute SQL-like queries
  executeSql(sql) {
    // Simple SQL parser for common operations
    sql = sql.trim();
    
    // SELECT query
    if (sql.toUpperCase().startsWith('SELECT')) {
      return this.parseSelect(sql);
    }
    
    // INSERT query
    if (sql.toUpperCase().startsWith('INSERT')) {
      return this.parseInsert(sql);
    }
    
    // UPDATE query
    if (sql.toUpperCase().startsWith('UPDATE')) {
      return this.parseUpdate(sql);
    }
    
    // DELETE query
    if (sql.toUpperCase().startsWith('DELETE')) {
      return this.parseDelete(sql);
    }
    
    return [];
  }

  // Parse SELECT statement
  parseSelect(sql) {
    // Extract table name
    const fromMatch = sql.match(/FROM\s+`?(\w+)`?/i);
    if (!fromMatch) return [];
    
    const tableName = fromMatch[1];
    
    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|$)/i);
    const where = {};
    
    if (whereMatch) {
      const conditions = whereMatch[1].trim();
      // Simple WHERE parsing (handles basic conditions)
      const parts = conditions.split(/\s+AND\s+/i);
      parts.forEach(part => {
        const match = part.match(/`?(\w+)`?\s*=\s*'?([^']+)'?/);
        if (match) {
          where[match[1]] = match[2].replace(/'/g, '');
        }
      });
    }
    
    return this.select(tableName, where);
  }

  // Parse INSERT statement (including upsert)
  parseInsert(sql) {
    const tableMatch = sql.match(/INSERT INTO\s+`?(\w+)`?/i);
    if (!tableMatch) return [];
    
    const tableName = tableMatch[1];
    
    // Check if it's an UPSERT
    const isUpsert = sql.toUpperCase().includes('ON DUPLICATE KEY UPDATE');
    
    // Extract columns and values
    const colMatch = sql.match(/\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (!colMatch) return [];
    
    const columns = colMatch[1].split(',').map(c => c.trim().replace(/`/g, ''));
    const values = colMatch[2].split(',').map(v => v.trim().replace(/'/g, ''));
    
    const data = {};
    columns.forEach((col, i) => {
      data[col] = values[i];
    });
    
    if (isUpsert) {
      return [this.upsert(tableName, data)];
    } else {
      return [this.insert(tableName, data)];
    }
  }

  // Parse UPDATE statement
  parseUpdate(sql) {
    const tableMatch = sql.match(/UPDATE\s+`?(\w+)`?/i);
    if (!tableMatch) return [];
    
    const tableName = tableMatch[1];
    
    // Extract SET clause
    const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
    if (!setMatch) return [];
    
    const updateData = {};
    const setParts = setMatch[1].split(',');
    setParts.forEach(part => {
      const match = part.match(/`?(\w+)`?\s*=\s*'?([^']+)'?/);
      if (match) {
        updateData[match[1]] = match[2].replace(/'/g, '');
      }
    });
    
    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+)$/i);
    const where = {};
    
    if (whereMatch) {
      const conditions = whereMatch[1].trim();
      const parts = conditions.split(/\s+AND\s+/i);
      parts.forEach(part => {
        const match = part.match(/`?(\w+)`?\s*=\s*'?([^']+)'?/);
        if (match) {
          where[match[1]] = match[2].replace(/'/g, '');
        }
      });
    }
    
    this.update(tableName, updateData, where);
    return [];
  }

  // Parse DELETE statement
  parseDelete(sql) {
    const tableMatch = sql.match(/DELETE FROM\s+`?(\w+)`?/i);
    if (!tableMatch) return [];
    
    const tableName = tableMatch[1];
    
    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+)$/i);
    const where = {};
    
    if (whereMatch) {
      const conditions = whereMatch[1].trim();
      const parts = conditions.split(/\s+AND\s+/i);
      parts.forEach(part => {
        const match = part.match(/`?(\w+)`?\s*=\s*'?([^']+)'?/);
        if (match) {
          where[match[1]] = match[2].replace(/'/g, '');
        }
      });
    }
    
    this.delete(tableName, where);
    return [];
  }

  // Clear all data (for testing/reset)
  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    this.init();
  }

  // Export all data (for backup)
  exportData() {
    const data = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        data[key] = localStorage.getItem(key);
      }
    });
    return data;
  }

  // Import data (for restore)
  importData(data) {
    Object.keys(data).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.setItem(key, data[key]);
      }
    });
  }
}

// Expose as global for browser
if (typeof window !== 'undefined') {
  window.LocalStorageDB = LocalStorageDB;
}
