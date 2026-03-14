// IMPORTED RESOURCES
require('dotenv').config();
const _ = require("lodash");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const hash = require("object-hash");
const Maps = require("./classes/Maps.js");
const Player = require("./classes/Player.js");

const SpawnPoint = require("./classes/SpawnPoint.js");
const Portal = require("./classes/Portal.js");
const Receptacle = require("./classes/Receptacle.js");
const NPC = require("./classes/NPC.js");
const CollectableSpawner = require("./classes/CollectableSpawner.js");
let portals = [];
let receptacles = [];
let NPCs = [];
let collectableSpawners = [];
let spawnPoints = [];

let killServer = false;

_.each(Maps, function (map) {
  console.log("===== LOADING:" + map.map.toUpperCase() + " =====");
  try {
    mapPortals = require("../client/data/maps/" + map.map + "/portals.js");
    portals = portals.concat(mapPortals);
    console.log(mapPortals.length + " Portals Loaded!");
  } catch (error) {}
  try {
    mapReceptacles = require("../client/data/maps/" +
      map.map +
      "/receptacles.js");
    receptacles = receptacles.concat(mapReceptacles);
    console.log(mapReceptacles.length + " Receptacles Loaded!");
  } catch (error) {}
  try {
    mapNPCs = require("../client/data/maps/" + map.map + "/npcs.js");
    NPCs = NPCs.concat(mapNPCs);
    console.log(mapNPCs.length + " NPCs Loaded!");
  } catch (error) {}
  try {
    mapCollectableSpawners = require("../client/data/maps/" +
      map.map +
      "/collectableSpawners.js");
    collectableSpawners = collectableSpawners.concat(mapCollectableSpawners);
    console.log(
      mapCollectableSpawners.length + " Collectable Spawners Loaded!"
    );
  } catch (error) {}
  try {
    mapSpawnPoints = require("../client/data/maps/" +
      map.map +
      "/spawnPoints.js");
    spawnPoints = spawnPoints.concat(mapSpawnPoints);
    console.log(mapSpawnPoints.length + " Enemy Spawners Loaded!");
  } catch (error) {}
});

const Location = require("./classes/Location.js");
const Library = require("./classes/util/Library.js");
const Error = require("./classes/util/Error.js");
const Sql = require("./classes/util/Sql.js");
const mysql = require("mysql");

const { PerformanceObserver, performance } = require("perf_hooks");
const { throttle } = require("lodash");

const serv = require("http").Server(app);
const conn = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "nightscape",
});
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// REST endpoints
app.post("/api/register", (req, res) => {
  const regex = new RegExp("^[a-zA-Z0-9]{3,12}$");
  if (!req.body.password) {
    res.status(200).send({ success: false, error: "password is required" });
    return;
  } else if (req.body.password.length < 8) {
    res.status(200).send({
      success: false,
      error: "password must be at least 8 characters",
    });
    return;
  } else if (!regex.test(req.body.username)) {
    res.status(200).send({ success: false, error: "invalid username" });
    return;
  }
  const salt =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const username = req.body.username;
  const password = hash(Library.mergeStrings(salt, req.body.password));
  conn.query(
    Sql.insert("account", { name: username, password: password, salt: salt }),
    function (err, result) {
      if (err) {
        res.status(200).send({ success: false, error: Error.error(err, "A") });
        return;
      } else {
        const token = login(username);
        conn.query(
          Sql.insert("character", {
            name: username,
            class: "Squire",
            account_id: result.insertId,
          }),
          function (err, r) {
            if (err) {
              res
                .status(200)
                .send({ success: false, error: Error.error(err, "C") });
            } else {
              conn.query(
                Sql.select("character", { account_id: result.insertId }),
                function (err, characters) {
                  if (err) {
                    console.log(err);
                    res.status(200).send({ success: false, error: err.code });
                  } else {
                    res.status(200).send({
                      success: true,
                      login: token,
                      characters: characters,
                      dev: 0,
                    });
                    conn.query(
                      Sql.insert("logs", {
                        message: req.body.username + " Has Registered",
                      })
                    );
                    return;
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/api/login", async (req, res) => {
  // ARGON2: NEED TO REPLACE "hash" with Argon2 function
  if (!req.body.password) {
    res
      .status(200)
      .send({ success: false, error: Error.error(Error.pwRequired) });
    return;
  } else if (req.body.password.length < 8) {
    res.status(200).send({ success: false, error: { code: "shortPW" } });
    return;
  }

  conn.query(
    Sql.select("account", { name: req.body.username }),
    function (err, result) {
      if (err) {
        res.status(200).send({ success: false, error: Error.error(err) });
        return;
      }
      if (result.length !== 1) {
        res
          .status(200)
          .send({ success: false, error: "incorrect username or password" });
        return;
      }

      // ARGON2: password needs to verified with .verify function
      const password = hash(
        Library.mergeStrings(result[0].salt, req.body.password)
      );
      if (password === result[0].password) {
        const token = login(req.body.username);
        conn.query(
          Sql.select("character", { account_id: result[0].index }),
          function (err, characters) {
            if (err) {
              res.status(200).send({ success: false, error: Error.error(err) });
            } else {
              res.status(200).send({
                success: true,
                login: token,
                characters: characters,
                dev: result[0].tester,
              });
              return;
            }
          }
        );
      } else {
        res
          .status(200)
          .send({ success: false, error: "incorrect username or password" });
      }
    }
  );
});

app.post("/api/sso", (req, res) => {
  conn.query(
    Sql.select("account", { token: req.body.token }),
    function (err, result) {
      if (err) {
        console.log(err);
        if (err.code) {
          res.status(200).send({ success: false, error: err.code });
        }
        return;
      } else if (!result[0]) {
        console.log("no SSO session");
        res.status(200).send({ success: false, error: "Invalid SSO session" });
        return;
      }
      conn.query(
        Sql.select("character", { account_id: result[0].index }),
        function (err, characters) {
          if (err) {
            console.log(err);
            res.status(200).send({ success: false, error: err.code });
          } else {
            res.status(200).send({
              success: true,
              login: result[0].token,
              characters: characters,
              dev: result[0].tester,
            });
            return;
          }
        }
      );
    }
  );
});

// API routes first
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// static files
app.use(express.static(path.join(__dirname, "../client")));

// catch-all last
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = process.env.PORT || 8080;

console.log("booting app");
console.log("__dirname:", __dirname);
console.log("client path:", path.join(__dirname, "../client"));
console.log("index path:", path.join(__dirname, "../client/index.html"));

serv.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on ${PORT}`);
});

let counter = 0;
_.each(spawnPoints, function (sp) {
  if (!sp.count) {
    new SpawnPoint(sp, counter);
    counter++;
  } else {
    for (let index = 0; index < sp.count; index++) {
      new SpawnPoint(sp, counter);
      counter++;
    }
  }
});

counter = 0;
_.each(portals, function (portal) {
  new Portal(portal, counter);
  counter++;
});

counter = 0;
_.each(receptacles, function (rec) {
  new Receptacle(rec, counter);
  counter++;
});

_.each(NPCs, function (npc) {
  new NPC(npc);
});

counter = 0;
_.each(collectableSpawners, function (sp) {
  new CollectableSpawner(sp, counter);
  counter++;
});

let io = require("socket.io")(serv, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
console.log("========== Nightscape Running ==========");

io.sockets.on("connection", function (socket) {
  if (socket.handshake.query.type === "polling") {
    socket.on("pingu", function () {
      socket.emit("pongu", {
        len: Object.keys(Library.SOCKET_LIST).length || 0,
      });
    });
  } else {
    try {
      if (socket.handshake.query.guest) {
        socket.id = Library.getRandomInt(-100000, 0);
      } else {
        socket.id = socket.handshake.query.id;
      }
      Library.SOCKET_LIST[socket.id] = socket;
      socket.player = new Player(
        socket.id,
        socket.handshake.query.token,
        socket.handshake.query.localhost,
        socket.handshake.query.guest
      );
      socket.hashes = [];
      socket.player.createOrLoadPlayer();

      socket.on("loaded", function () {
        socket.hashes = [];
        emitDataToClient([
          "players",
          "enemies",
          "graphics",
          "NPCs",
          "collectables",
          "receptacles",
          "portals",
        ]);
      });

      socket.on("respawn", function () {
        socket.player.respawn();
      });

      socket.on("targetObject", function (data) {
        socket.player.targetType = data.type;
        socket.player.targetObject(
          Library.OBJECTS[data.type.toUpperCase()][data.hash]
        );
      });

      socket.on("forgetTarget", function () {
        socket.player.forgetObject();
      });

      socket.on("useItem", function (data) {
        socket.player.useItem(data.id);
      });

      socket.on("useSkill", function (data) {
        socket.player.useSkill(data.id);
      });

      socket.on("buyItem", function (data) {
        socket.player.buyItem(data.id, data.qty);
      });

      socket.on("sellItem", function (data) {
        socket.player.sellItem(data.id, data.qty);
      });

      socket.on("observeItem", function (data) {
        socket.player.observeItem(data.id);
      });

      socket.on("buyEquipment", function (data) {
        socket.player.buyEquipment(data.id);
      });

      socket.on("sellEquipment", function (data) {
        socket.player.sellEquipment(data.id);
      });

      socket.on("observeEquipment", function (data) {
        socket.player.observeEquipment(data.id);
      });

      socket.on("sellAll", function (data) {
        let money = 0;
        _.each(socket.player.equipment, function (equip) {
          if (!equip.equipped) {
            if (equip.rarity === data) {
              money = money + socket.player.sellEquipment(equip.id, true);
              equip.deleted = true;
            }
          }
        });
        Library.NOTICES.push({
          target: this.id,
          type: "itemGain",
          image: "itemGainIconGold",
          string: Library.numberWithCommas(money) + " Gold ",
        });
      });

      socket.on("equipItem", function (data) {
        socket.player.equipItem(data.id);
      });

      socket.on("unequipItem", function (data) {
        socket.player.unequipItem(data.id);
      });

      socket.on("equipConbatItem", function (data) {
        socket.player.equipCombatItem(data.id, data.slot);
      });

      socket.on("equipConbatSkill", function (data) {
        socket.player.equipCombatSkill(data.id, data.slot);
      });

      socket.on("register", function (data) {
        if (socket.player.guest) {
          const regex = new RegExp("^[a-zA-Z0-9]{3,12}$");
          if (!data.password) {
            socket.emit("registerFailure", {
              success: false,
              error: "password is required",
            });
            return;
          } else if (data.password.length < 8) {
            socket.emit("registerFailure", {
              success: false,
              error: "password must be at least 8 characters",
            });
            return;
          } else if (!regex.test(data.username)) {
            socket.emit("registerFailure", {
              success: false,
              error: "invalid username",
            });
            return;
          }
          const salt =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
          const username = data.username;
          const password = hash(Library.mergeStrings(salt, data.password));
          conn.query(
            Sql.insert("account", {
              name: username,
              password: password,
              salt: salt,
            }),
            function (err, result) {
              if (err) {
                socket.emit("registerFailure", {
                  success: false,
                  error: "Account Name Taken",
                });
                return;
              } else {
                const token = login(username);
                conn.query(
                  Sql.insert("character", {
                    name: username,
                    class: "Squire",
                    account_id: result.insertId,
                  }),
                  function (err, r) {
                    if (err) {
                      socket.emit("registerFailure", {
                        success: false,
                        error: "Account Name Taken",
                      });
                    } else {
                      conn.query(
                        Sql.select("character", {
                          account_id: result.insertId,
                        }),
                        function (err, characters) {
                          if (err) {
                            console.log(err);
                          } else {
                            socket.emit("registerSuccess", { success: true });
                            socket.player.id = characters[0].id;
                            socket.player.guest = false;
                            socket.player.name = username;
                            socket.player.save(false);
                            return;
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      });

      socket.on("pushLocation", function (data) {
        if (!socket.player.dead) {
          let loc = new Location({
            x: data.x,
            y: data.y,
            map: socket.player.location.map,
          });
          if (loc.isWalkable()) {
            path = Library.calculatePath(socket.player.location, loc);
            let pathNew = [];
            if (path.length < 45 && path.length > 0) {
              _.each(path, function (e) {
                pathNew.push({ x: e[0], y: e[1] });
              });
              pathNew.shift();
              socket.player.moves = pathNew;
            }
          }
        }
      });

      socket.on("updateQuestFromNPC", function () {
        if (socket.player.target) {
          let questId = socket.player.target.getFirstValidQuestId(
            socket.player
          );
          socket.player.quests[questId].action("talk", socket.player.target.id);
          socket.player.quests[questId].action(
            "return",
            socket.player.target.id
          );
        }
      });

      socket.on("moveToTarget", function () {
        socket.player.moveToTarget();
      });

      socket.on("useCombatItem", function (item) {
        socket.player.setQueuedAttackItem(item.id);
        socket.player.moveToTarget();
      });

      socket.on("useCombatSkill", function (skill) {
        socket.player.setQueuedAttackSkill(skill.id);
        socket.player.moveToTarget();
      });

      socket.on("allocateStat", function (stat) {
        socket.player.allocateStat(stat.id);
      });

      socket.on("allocateSkill", function (skill) {
        socket.player.allocateSkill(skill.id);
      });

      socket.on("chat", function (message) {
        let sendAll = false;
        if (message.charAt(0) === "/") {
          let msg = {
            sender: "System",
          };
          switch (message.split(" ")[0]) {
            case "/loc":
            case "/location":
              msg.message = socket.player.location.readable();
              break;
            case "/shrug":
              message = "¯\\_(ツ)_/¯";
              sendAll = true;
              break;
            case "/help":
            case "/h":
              msg.message = "Valid chat commands:<br/>";
              msg.message +=
                "/h or /help: Looks like you have figured that one out!<br/>";
              msg.message +=
                "/loc or /location: Display current player location.<br/>";
              msg.message +=
                "/where <player>: Display target player location.<br/>";
              msg.message += "/clear: Clear all recent chat messages.<br/>";
              msg.message += "/who: Display all online players.<br/>";
              break;
            case "/where":
              let found = false;
              _.each(Library.SOCKET_LIST, function (s) {
                if (s.player.name === message.split(" ")[1]) {
                  found = s.player.location.readable();
                }
              });
              if (found) {
                msg.message = found;
              } else {
                msg.message = "Player not found";
              }
              break;
            case "/who":
              msg.message = "Currently Online:<br/>";
              _.each(Library.SOCKET_LIST, function (s) {
                if (s.player.location) {
                  msg.message +=
                    s.player.name +
                    ": " +
                    s.player.location.readable() +
                    "<br/>";
                }
              });
              break;
            default:
              msg.message = "Type /h or /help for a list of commands";
              break;
          }
          if (!sendAll) {
            socket.emit("chatMessage", msg);
            return;
          }
        }
        if (socket.player.chats.length > 5) {
          let msg = {
            sender: "System",
            message: "Maybe cool it with the messages a bit? okay?",
          };
          socket.emit("chatMessage", msg);
          return;
        }
        socket.player.chats.push(socket.player.tickCount);
        // message = Filter.clean(message);
        console.log("CHAT: " + socket.player.name + ": " + message);
        conn.query(
          Sql.insert("logs", {
            message: "CHAT: " + socket.player.name + ": " + message,
          })
        );
        message = Library.encodeHTML(message);
        let tag = "";
        if (parseInt(socket.player.id) === 5) {
          tag = "adminTags";
        } else if (socket.player.tester) {
          tag = "supportTags";
        }
        msg = {
          message: message,
          sender: socket.player.name,
          tag: tag,
        };
        _.each(Library.SOCKET_LIST, function (s) {
          s.emit("chatMessage", msg);
        });
      });

      socket.on("disconnect", function () {
        if (socket.player.loaded) {
          socket.player.save(false, true);
        }
        delete Library.SOCKET_LIST[socket.id];
        if (socket.player.loaded) {
          let message = Library.encodeHTML(
            socket.player.name + " Has Disconnected."
          );
          console.log(message);
          let msg = {
            message: message,
            sender: "System",
          };
          _.each(Library.SOCKET_LIST, function (s) {
            s.emit("chatMessage", msg);
          });
          conn.query(
            Sql.insert("logs", {
              message: socket.player.name + " Has Disconnected",
            })
          );
          Library.GRAPHICS.push({
            type: "hidePlayer",
            location: socket.player.location,
            tints: [0x00454a, 0x00757d, 0x008d96],
          });
          _.each(Library.SPAWN_POINTS, function (sp) {
            if (sp.enemy && sp.enemy.target && sp.enemy.target == socket.id) {
              sp.enemy.forgetPlayer();
            }
          });
        }
      });
    } catch (error) {
      console.log("CATCHING ERROR:");
      console.log(error);
    }
  }
});

// Main server loop
setInterval(function () {
  try {
    var t0 = performance.now();
    _.each(Library.SPAWN_POINTS, function (sp) {
      sp.tick();
    });
    var t2 = performance.now();
    _.each(Library.SOCKET_LIST, function (socket) {
      socket.player.tick();
    });
    var t3 = performance.now();
    _.each(Library.COLLECTABLE_SPAWNERS, function (sp) {
      sp.tick();
    });
    var t4 = performance.now();
    emitDataToClient([
      "players",
      "enemies",
      "graphics",
      "NPCs",
      "collectables",
      "receptacles",
      "notices",
      "portals",
    ]);

    var t1 = performance.now();
    if (t1 - t0 > 200) {
      console.log(
        "Call to emit took " +
          String(t1 - t0).split(".")[0] +
          " milliseconds. " +
          Object.keys(Library.SOCKET_LIST).length
      );
      console.log("Call to SP took " + String(t2 - t0).split(".")[0] + " ms. ");
      console.log("Call to PP took " + String(t3 - t2).split(".")[0] + " ms. ");
      console.log("Call to CS took " + String(t4 - t3).split(".")[0] + " ms. ");
      console.log("Call to EM took " + String(t1 - t4).split(".")[0] + " ms. ");
    }
    killServer = false;
  } catch (error) {
    console.log("=== ERROR IN MAIN LOOP ===");
    console.log(error.message);
    console.log(error);
    if (killServer) {
      console.log("repeating error, throwing again");
      throttle(error);
    } else {
      killServer = true;
    }
  }
}, 100);

function emitDataToClient(type = []) {
  let pack = [];
  _.each(type, function (c) {
    _.each(Library.SOCKET_LIST, function (s) {
      if (s.player.loaded) {
        p = s.player;
        switch (c) {
          case "players":
            pack = [];
            _.each(Library.SOCKET_LIST, function (ss) {
              if (ss.player.loaded) {
                if (p.location.getDistance(ss.player.location) < 30) {
                  let playerObj = ss.player.exportObj(
                    s.player.id === ss.player.id
                  );
                  playerObj.id = ss.id;
                  pack.push(playerObj);
                }
              }
            });
            if (JSON.stringify(s.hashes["players"]) !== JSON.stringify(pack)) {
              s.hashes["players"] = pack;
              s.emit("playerPositions", pack);
            }
            break;
          case "enemies":
            pack = [];
            _.each(Library.OBJECTS.ENEMIES, function (e) {
              if (p.location.getDistance(e.location) < 30) {
                obj = e.exportObj();
                pack.push(obj);
              }
            });
            if (JSON.stringify(s.hashes["enemies"]) !== JSON.stringify(pack)) {
              s.hashes["enemies"] = pack;
              s.emit("enemyPositions", pack);
            }
            break;
          case "graphics":
            pack = [];
            _.each(Library.GRAPHICS, function (g) {
              if (!g.player || g.player === p.id) {
                if (g.location && p.location.getDistance(g.location) < 30) {
                  pack.push(g);
                }
              }
            });
            if (pack.length > 0) s.emit("graphics", pack);
            break;
          case "notices":
            pack = [];
            _.each(Library.NOTICES, function (g) {
              if (g.target === p.id) {
                pack.push(g);
              }
            });
            if (pack.length > 0) s.emit("notices", pack);
            break;
          case "NPCs":
            pack = [];
            _.each(Library.OBJECTS.NPCS, function (npc) {
              if (p.location.getDistance(npc.location) < 30) {
                pack.push({
                  npc: npc,
                  punctionation: npc.getQuestPunctuation(p),
                });
              }
            });
            if (JSON.stringify(s.hashes["NPCs"]) !== JSON.stringify(pack)) {
              s.hashes["NPCs"] = pack;
              s.emit("NPCs", pack);
            }
            break;
          case "collectables":
            pack = [];
            _.each(Library.OBJECTS.COLLECTABLES, function (col) {
              if (
                p.location.getDistance(col.location) < 30 &&
                (!col.collecter || col.collecter == p)
              ) {
                pack.push(col.exportObj());
              }
            });
            if (
              JSON.stringify(s.hashes["collectables"]) !== JSON.stringify(pack)
            ) {
              s.hashes["collectables"] = pack;
              s.emit("collectables", pack);
            }
            break;
          case "receptacles":
            pack = [];
            _.each(Library.OBJECTS.RECEPTACLES, function (rec) {
              if (p.location.getDistance(rec.location) < 30) {
                ret = rec.exportObj();
                if (rec.used(p)) {
                  ret.used = true;
                  ret.title = "Opened";
                }
                pack.push(ret);
              }
            });
            if (
              JSON.stringify(s.hashes["receptacles"]) !== JSON.stringify(pack)
            ) {
              s.hashes["receptacles"] = pack;
              s.emit("receptacles", pack);
            }
            break;
          case "portals":
            pack = [];
            _.each(Library.OBJECTS.PORTALS, function (portal) {
              if (p.location.getDistance(portal.location) < 30) {
                ret = portal.exportObj();
                pack.push(ret);
              }
            });
            if (JSON.stringify(s.hashes["portals"]) !== JSON.stringify(pack)) {
              s.hashes["portals"] = pack;
              s.emit("portals", pack);
            }
            break;
        }
      }
    });
  });
  Library.GRAPHICS = [];
  Library.NOTICES = [];
}

function login(account) {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  conn.query(
    "update `account` set `token` = '" +
      token +
      "' where name = '" +
      account +
      "';"
  );
  return token;
}

function findPlayer(name) {
  return "Player not found";
}
