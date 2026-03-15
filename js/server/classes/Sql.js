// Sql.js - SQL query builder utility for localStorage
// Generates SQL-like strings that LocalStorageDB can parse

const Sql = {
  // Helper to escape single quotes in values
  escape: function(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/'/g, "''");
  },
  
  insert: function (table, obj) {
    let cols = "";
    let vals = "";
    for (const prop in obj) {
      cols += "`" + prop + "`,";
      vals += "'" + this.escape(obj[prop]) + "',";
    }
    qb =
      "INSERT INTO `" +
      table +
      "` (" +
      cols.slice(0, -1) +
      ") VALUES (" +
      vals.slice(0, -1) +
      ")";
    return qb;
  },
  select: function (table, where) {
    let w = " WHERE ";
    for (const prop in where) {
      w += "`" + prop + "` = '" + this.escape(where[prop]) + "' AND ";
    }
    qb = "SELECT * FROM  `" + table + "` " + w.slice(0, -4);
    return qb;
  },
  upsert: function (table, obj) {
    let cols = "";
    let vals = "";
    let update = "";
    for (const prop in obj) {
      cols += "`" + prop + "`,";
      vals += "'" + this.escape(obj[prop]) + "',";
      update += "`" + prop + "` = '" + this.escape(obj[prop]) + "',";
    }
    qb =
      "INSERT INTO `" +
      table +
      "` (" +
      cols.slice(0, -1) +
      ") VALUES (" +
      vals.slice(0, -1) +
      ") ON DUPLICATE KEY UPDATE " +
      update.slice(0, -1);
    return qb;
  },
  update: function (table, update, where) {
    let u = "";
    for (const prop in update) {
      u += "`" + prop + "` = '" + this.escape(update[prop]) + "',";
    }
    let w = "";
    for (const prop in where) {
      w += "`" + prop + "` = '" + this.escape(where[prop]) + "' AND ";
    }
    qb =
      "UPDATE `" +
      table +
      "` SET " +
      u.slice(0, -1) +
      " WHERE " +
      w.slice(0, -4);
    return qb;
  },
  delete: function (table, where) {
    let w = "";
    for (const prop in where) {
      w += "`" + prop + "` = '" + where[prop] + "' AND ";
    }
    qb = "DELETE FROM `" + table + "` WHERE " + w.slice(0, -4);
    return qb;
  },
};

// Expose as global for browser
if (typeof window !== 'undefined') {
  window.Sql = Sql;
}
