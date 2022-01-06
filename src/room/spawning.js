let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
  var hostiles = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS, {filter: { owner: { username: 'Invader' } }
});
  if(hostiles.length > 0) {
      var username = hostiles[0].owner.username;
      //Game.notify(`User ${username} spotted in room ${roomName}`);
      var towers = Game.spawns.Spawn1.room.find(
          FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
      towers.forEach(tower => tower.attack(hostiles[0]));
  }
  // lists all the creep types to console
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

  // find a creep type that returns true for the .spawn() function
  let creepTypeNeeded = _.find(creepTypes, function (type) {
    return creepLogic[type].spawn(room);
  });

  // get the data for spawning a new creep of
  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester" && creep.room.name == room.name
  );
    var creepSpawnData =
      creepLogic[creepTypeNeeded] &&
      creepLogic[creepTypeNeeded].spawnData(room);
  console.log(room, JSON.stringify(creepSpawnData));

  if (creepSpawnData) {
    // find the first or 0th spawn in the room
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {
      memory: creepSpawnData.memory,
    });
  }
}

module.exports = spawnCreeps;
