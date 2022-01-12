var transferer = {
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
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // the second argument for findClosestByPath is an object which takes
        // a property called filter which can be a function
        // we use the arrow operator to define it
        filter: (s) =>
          s.structureType == STRUCTURE_STORAGE &&
          s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });

      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is not in range
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
  // checks if the room needs to spawn a creep
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
  // returns an object with the data to spawn a new creep
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
