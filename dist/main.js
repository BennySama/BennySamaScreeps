/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: P:\Screeps\src\main.js **********/
__modules[0] = function(module, exports) {
let creepLogic = __require(1,0);
let roomLogic = __require(2,0);
let prototypes = __require(3,0);

module.exports.loop = function () {
  /*  if(Game.cpu.bucket >= 9999) {
        console.log("Generating Pixel...")
        Game.cpu.generatePixel();
    }
*/
    var remoteharvesters = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "remoteharvester"
    );
    var adjacent_rooms = Object.values(Game.map.describeExits(Game.spawns.Spawn1.room.name));
    console.log(adjacent_rooms);
  Game.myRooms = _.filter(
    Game.rooms,
    (r) => r.controller && r.controller.level > 0 && r.controller.my
  );
  _.forEach(Game.myRooms, (r) => roomLogic.spawning(r));
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    let role = creep.memory.role;
    if (creepLogic[role]) {
      creepLogic[role].run(creep);
    }
  }
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  console.log(Game.cpu.getUsed());
};

return module.exports;
}
/********** End of module 0: P:\Screeps\src\main.js **********/
/********** Start module 1: P:\Screeps\src\creeps\index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
  harvester: __require(4,1),
  hauler: __require(5,1),
  transferer: __require(6,1),
  upgrader: __require(7,1),
  builder: __require(8,1),
  repairer: __require(9,1),
  remoteharvester: __require(10,1),
  
};

module.exports = creepLogic;

return module.exports;
}
/********** End of module 1: P:\Screeps\src\creeps\index.js **********/
/********** Start module 2: P:\Screeps\src\room\index.js **********/
__modules[2] = function(module, exports) {
let roomLogic = {
    spawning:     __require(11,2),
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 2: P:\Screeps\src\room\index.js **********/
/********** Start module 3: P:\Screeps\src\prototypes\index.js **********/
__modules[3] = function(module, exports) {
let files = {
    creep: __require(12,3)
}
return module.exports;
}
/********** End of module 3: P:\Screeps\src\prototypes\index.js **********/
/********** Start module 4: P:\Screeps\src\creeps\harvester.js **********/
__modules[4] = function(module, exports) {
var harvester = {
  /** @param {Creep} creep **/
  calc: __require(13,4),
  run: function (creep) {
    if (creep.memory.deliver && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.deliver = false;
    }
    if (!creep.memory.deliver && creep.store.getFreeCapacity() == 0) {
      creep.memory.deliver = true;
    }
    if (!creep.memory.deliver) {
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      var targets_important = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              /*structure.structureType == STRUCTURE_CONTAINER ||*/
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      var targets_secondary = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_CONTAINER||structure.structureType == STRUCTURE_STORAGE) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets_important.length > 0) {
        if (
          creep.transfer(targets_important[0], RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(targets_important[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else if (targets_secondary.length > 0) {
        if (
          creep.transfer(targets_secondary[0], RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(targets_secondary[0], {
            visualizePathStyle: { stroke: "#00ffff" },
          });
        }
      } else if (creep.store.getFreeCapacity() != 0) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      } else {
        creep.moveTo(Game.flags.Flag2);
      }
    }
  },
  spawn: function (room) {
    
    var harvesters = _.filter(
      Game.creeps,
      (creep) =>
        creep.memory.role == "harvester" && creep.room.name == room.name
    );

    if (harvesters.length < 4) {
      return true;
    }
  },
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Harvester" + Game.time;
    let memory = { role: "harvester" };

    return { name, body, memory };
  },
};

module.exports = harvester;

return module.exports;
}
/********** End of module 4: P:\Screeps\src\creeps\harvester.js **********/
/********** Start module 5: P:\Screeps\src\creeps\hauler.js **********/
__modules[5] = function(module, exports) {
var hauler = {
  /** @param {Creep} creep **/
  calc: __require(13,5),
  run: function (creep) {
    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    }
    else if (creep.memory.working == false && creep.carry.energy > 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
        var targets_important = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return (
                (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  /*structure.structureType == STRUCTURE_CONTAINER ||*/
                  structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
              );
            },
          });
          var targets_important2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
              return (
                (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  /*structure.structureType == STRUCTURE_CONTAINER ||*/
                  structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
              );
            },
          });

          if (targets_important.length > 0) {
            if (
              creep.transfer(targets_important2, RESOURCE_ENERGY) ==
              ERR_NOT_IN_RANGE
            ) {
              creep.moveTo(targets_important2, {
                visualizePathStyle: { stroke: "#ffffff" },
              });
            }
          } 
          else 
          {
              
          }

    } else {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (s) =>
              (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0,
          });
          if (
            creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
          ) {
            creep.moveTo(containers[0], {
              visualizePathStyle: { stroke: "#ff0000" },
            });
          }      
    }
  },
  spawn: function (room) {
    var haulers = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "hauler"
    );
    var containers = room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0,
    });
    if (haulers.length < 1 && containers.length > 0) {
      return true;
    }
  },
  spawnData: function (room) {
    let body = this.calc.calchauler(room.energyCapacityAvailable);
    let name = "Hauler" + Game.time;
    let memory = {
      role: "hauler",
      working: false,
    };

    return { name, body, memory };
  },
};

module.exports = hauler;

return module.exports;
}
/********** End of module 5: P:\Screeps\src\creeps\hauler.js **********/
/********** Start module 6: P:\Screeps\src\creeps\transferer.js **********/
__modules[6] = function(module, exports) {
var transferer = {
  /** @param {Creep} creep **/
  calc: __require(13,6),
  run: function (creep) {
    
    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    }
    else if (creep.memory.working == false && creep.carry.energy > 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_STORAGE &&
          s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (structure != undefined) {
        for (const resourceType in creep.store) {

          if (creep.transfer(structure, resourceType) == OK) break
          else creep.moveTo(structure);
          }
      
      }
    } else {
      var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
      if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
  spawn: function (room) {
    var transferers = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "transferer"
    );
    var containers = room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0,
    });
    if (transferers.length < 1 && containers.length > 0) {
      return true;
    }
  },
  spawnData: function (room) {
    let body = this.calc.calchauler(room.energyCapacityAvailable);
    let name = "Transferer" + Game.time;
    let memory = {
      role: "transferer",
      working: false,
    };

    return { name, body, memory };
  },
};

module.exports = transferer;

return module.exports;
}
/********** End of module 6: P:\Screeps\src\creeps\transferer.js **********/
/********** Start module 7: P:\Screeps\src\creeps\upgrader.js **********/
__modules[7] = function(module, exports) {
var roleUpgrader = {
  /** @param {Creep} creep **/
  /** @param {Creep} creep **/
  calc: __require(13,7),
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    } else {
      var containers = creep.room.find(FIND_STRUCTURES, {
        filter: (s) =>
        (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
          s.store[RESOURCE_ENERGY] > 0,
      });
      if (containers.length > 0) {
        if (
          creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(containers[0], {
            visualizePathStyle: { stroke: "#ff0000" },
          });
        }
      } else {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  },
  spawn: function (room) {
    var upgraders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "upgrader" && creep.room.name == room.name
    );

    if (upgraders.length < 1) {
      return true;
    }
  },
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Upgrader" + Game.time;
    let memory = { role: "upgrader", upgrading: false };

    return { name, body, memory };
  },
};

module.exports = roleUpgrader;

return module.exports;
}
/********** End of module 7: P:\Screeps\src\creeps\upgrader.js **********/
/********** Start module 8: P:\Screeps\src\creeps\builder.js **********/
__modules[8] = function(module, exports) {
var roleBuilder = {
  /** @param {Creep} creep **/
  calc: __require(13,8),
  run: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0,
    });
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

    if (targets.length == 0 && creep.store[RESOURCE_ENERGY] > 0) {
      var targets_important = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)  &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets_important.length > 0) {
        if (
          creep.transfer(targets_important[0], RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(targets_important[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else if (targets.length > 0) {
      if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.building = false;
      }
      if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
        creep.memory.building = true;
      }

      if (creep.memory.building) {
        if (targets.length) {
          if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
              visualizePathStyle: { stroke: "#ffffff" },
            });
          }
        } else {
          creep.moveTo(Game.flags.Flag3);
        }
      } else {
        if (containers.length == 0) {
          var sources = creep.room.find(FIND_SOURCES);
          if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {
              visualizePathStyle: { stroke: "#ffaa00" },
            });
          }
        } else {
          if (
            creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
          ) {
            creep.moveTo(containers[0], {
              visualizePathStyle: { stroke: "#ff0000" },
            });
          }
        }
      }
    } else {
      creep.moveTo(Game.flags.Flag3);
    }
  },
  spawn: function (room) {
    var builders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "builder" && creep.room.name == room.name
    );
    if (builders.length < 4 && room.find(FIND_CONSTRUCTION_SITES).length > 0) {
      return true;
    }
  },
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Builder" + Game.time;
    let memory = { role: "builder", building: false };

    return { name, body, memory };
  },
};

module.exports = roleBuilder;

return module.exports;
}
/********** End of module 8: P:\Screeps\src\creeps\builder.js **********/
/********** Start module 9: P:\Screeps\src\creeps\repairer.js **********/
__modules[9] = function(module, exports) {
var roleRepairer = {
  /** @param {Creep} creep **/
  calc: __require(13,9),
  run: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (s) =>
        s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
    });


    if (creep.memory.reparing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (object) => object.hits < object.hitsMax / 3,
      });

      targets.sort((a, b) => a.hits - b.hits);

      

          if (targets.length == 0 && creep.store[RESOURCE_ENERGY] > 0) {
      var targets_important = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets_important.length > 0) {
        if (
          creep.transfer(targets_important[0], RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(targets_important[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else if (targets.length > 0) {
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      } else {
        creep.moveTo(Game.flags.Flag1);
      }
    } else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },
  spawn: function (room) {
    var repairers = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "repairer" && creep.room.name == room.name
    );

    if (repairers.length < 2) {
      return true;
    }
  },
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Repairer" + Game.time;
    let memory = { role: "repairer", repairing: false };

    return { name, body, memory };
  },
};
module.exports = roleRepairer;

return module.exports;
}
/********** End of module 9: P:\Screeps\src\creeps\repairer.js **********/
/********** Start module 10: P:\Screeps\src\creeps\remoteharvester.js **********/
__modules[10] = function(module, exports) {
var remoteharvester = {
  spawn_amount: 3,
  calc: __require(13,10),
  run: function (creep) {
    if (Game.time % 2 == 0) creep.say("Beep");
    else creep.say("Boop");

    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    } else if (
      creep.memory.working == false &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.working = true;
    }
    if (creep.memory.working == true) {
      if (creep.room.name == creep.memory.home) {
        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (s) =>
            (s.structureType == STRUCTURE_STORAGE ||
              s.structureType == STRUCTURE_CONTAINER) &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        });
        if (structure != undefined) {
          if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
          }
        }
      } else {
        var exit = creep.room.findExitTo(creep.memory.home);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    } else {
      if (creep.room.name == creep.memory.target) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      } else {
        var exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    }
  },
  spawn: function (room) {
    var adjacent_rooms = Object.values(Game.map.describeExits(room.name));
    var remoteharvesters = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "remoteharvester"
    );
    if (remoteharvesters.length < this.spawn_amount * adjacent_rooms.length) {
      return true;
    }
  },
  spawnData: function (room) {
    var containers = room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0,
    });
    let body = this.calc.remotecalc(room.energyCapacityAvailable, room.controller.level);
    let name = "RemoteHarvester" + Game.time;
    var adjacent_rooms = Object.values(Game.map.describeExits(Game.spawns.Spawn1.room.name));
    var target_room = "";
    if(containers.length > 0)
    {
    for (let i = 0; i < adjacent_rooms.length; i++) {
      var remoteharvesters = _.filter(
        Game.creeps,
        (creep) => creep.memory.target == adjacent_rooms[i]
      );
      if (remoteharvesters.length < this.spawn_amount) {
        console.log(adjacent_rooms[i]);
        target_room = adjacent_rooms[i];
        break;
      }
    }
    let memory = {
      role: "remoteharvester",
      home: room.name,
      target: target_room,
      working: false,
    };

    return { name, body, memory };
  }
  },
};

module.exports = remoteharvester;

return module.exports;
}
/********** End of module 10: P:\Screeps\src\creeps\remoteharvester.js **********/
/********** Start module 11: P:\Screeps\src\room\spawning.js **********/
__modules[11] = function(module, exports) {
let creepLogic = __require(1,11);
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
  var hostiles = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS, {filter: { owner: { username: 'Invader' } }
});
  if(hostiles.length > 0) {
      var username = hostiles[0].owner.username;
      var towers = Game.spawns.Spawn1.room.find(
          FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
      towers.forEach(tower => tower.attack(hostiles[0]));
  }
  var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION },
  });
  var containers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
    filter: (s) =>
      s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
  });
  console.log(
    room.name +
      " >>> " +
      extensions.length +
      " extension/s III " +
      room.energyCapacityAvailable +
      " Capacity available III " +
      room.energyAvailable +
      " available energy III " +
      containers.length +
      " container/s with energy"
  );
  let creepTypeNeeded = _.find(creepTypes, function (type) {
    return creepLogic[type].spawn(room);
  });
  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester" && creep.room.name == room.name
  );
    var creepSpawnData =
      creepLogic[creepTypeNeeded] &&
      creepLogic[creepTypeNeeded].spawnData(room);
  console.log(room, JSON.stringify(creepSpawnData));

  if (creepSpawnData) {
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {
      memory: creepSpawnData.memory,
    });
  }
}

module.exports = spawnCreeps;

return module.exports;
}
/********** End of module 11: P:\Screeps\src\room\spawning.js **********/
/********** Start module 12: P:\Screeps\src\prototypes\creep.js **********/
__modules[12] = function(module, exports) {
Creep.prototype.sayHello = function sayHello() {
  this.say("Hello", true);
};

Creep.prototype.bodyConstruct = function bodyConstruct()
{
    this.return [WORK, CARRY, MOVE];
}
return module.exports;
}
/********** End of module 12: P:\Screeps\src\prototypes\creep.js **********/
/********** Start module 13: P:\Screeps\src\creeps\bodypart.js **********/
__modules[13] = function(module, exports) {
var calc = {
calc: function(energy)
{
        var numberOfParts = Math.floor(energy / 200);
        var numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
    return body;
},

calchauler: function(energy)
{
        var numberOfParts = Math.floor(energy / 200);
        var numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
    return body;
},

remotecalc: function(energy, workParts)
{
    var body = [];
    for (let i = 0; i < workParts; i++) {
        body.push(WORK);
        
    }
    energy -= 150 * workParts;
    var numberOfParts = Math.floor(energy / 200);
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }

    return body;

}


}
  module.exports = calc;
  
return module.exports;
}
/********** End of module 13: P:\Screeps\src\creeps\bodypart.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
