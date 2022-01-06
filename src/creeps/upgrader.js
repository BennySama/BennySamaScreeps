var roleUpgrader = {
  /** @param {Creep} creep **/
  /** @param {Creep} creep **/
  calc: require("./bodypart"),
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
  // checks if the room needs to spawn a creep
  spawn: function (room) {
    var upgraders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "upgrader" && creep.room.name == room.name
    );

    if (upgraders.length < 2) {
      return true;
    }
  },
  // returns an object with the data to spawn a new creep
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Upgrader" + Game.time;
    let memory = { role: "upgrader", upgrading: false };

    return { name, body, memory };
  },
};

module.exports = roleUpgrader;
