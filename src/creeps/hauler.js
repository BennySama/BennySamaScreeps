var hauler = {
  /** @param {Creep} creep **/
  calc: require("./bodypart"),
  run: function (creep) {
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy > 0) {
      // switch state
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
  // checks if the room needs to spawn a creep
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
  // returns an object with the data to spawn a new creep
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
