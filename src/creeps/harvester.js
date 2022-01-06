var harvester = {
  /** @param {Creep} creep **/
  calc: require("./bodypart"),
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
  // checks if the room needs to spawn a creep
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
  // returns an object with the data to spawn a new creep
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Harvester" + Game.time;
    let memory = { role: "harvester" };

    return { name, body, memory };
  },
};

module.exports = harvester;
