module.exports = {
  insert: function (table, obj) {
    let cols = "";
    let vals = "";
    for (const prop in obj) {
      cols += "`" + prop + "`,";
      vals += "'" + obj[prop] + "',";
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
      w += "`" + prop + "` = '" + where[prop] + "' AND ";
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
      vals += "'" + obj[prop] + "',";
      update += "`" + prop + "` = '" + obj[prop] + "',";
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
      u += "`" + prop + "` = '" + update[prop] + "',";
    }
    let w = " WHERE ";
    for (const prop in where) {
      w += "`" + prop + "` = '" + where[prop] + "' AND ";
    }
    qb = "UPDATE  `" + table + "` SET  " + u.slice(0, -1) + w.slice(0, -4);
    return qb;
  },
};
