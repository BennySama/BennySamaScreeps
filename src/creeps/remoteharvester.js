var remoteharvester = {
  spawn_amount: 3,
  calc: require("./bodypart"),
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
