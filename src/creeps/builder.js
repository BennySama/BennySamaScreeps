var roleBuilder = {
  /** @param {Creep} creep **/
  calc: require("./bodypart"),
  run: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0,
    });
    //creep.sayHello();
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
        //console.log("ASDF " + containers.length);
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
  // checks if the room needs to spawn a creep
  spawn: function (room) {
    var builders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "builder" && creep.room.name == room.name
    );
    if (builders.length < 2 && room.find(FIND_CONSTRUCTION_SITES).length > 0) {
      return true;
    }
  },
  // returns an object with the data to spawn a new creep
  spawnData: function (room) {
    let body = this.calc.calc(room.energyCapacityAvailable);
    let name = "Builder" + Game.time;
    let memory = { role: "builder", building: false };

    return { name, body, memory };
  },
};

module.exports = roleBuilder;
