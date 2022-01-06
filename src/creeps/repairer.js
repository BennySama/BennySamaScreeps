var roleRepairer = {
  /** @param {Creep} creep **/
  calc: require("./bodypart"),
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
  // returns an object with the data to spawn a new creep
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Repairer" + Game.time;
    let memory = { role: "repairer", repairing: false };

    return { name, body, memory };
  },
};
module.exports = roleRepairer;
