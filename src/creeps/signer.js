const { isUndefined } = require("lodash");

let signstring = "Newbie on the road, peaceful player";
var signer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if(!creep.room.controller.sign || creep.room.controller.sign.text !== signstring)
        {
        if(creep.room.controller) {
            if(creep.signController(creep.room.controller, signstring) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else
        {
            creep.moveTo(Game.flags.Flag2);
        }
    }
    else
    {
        creep.suicide();
    }
    },
    // checks if the room needs to spawn a creep
    spawn: function (room) {
      var signers = _.filter(
        Game.creeps,
        (creep) =>
          creep.memory.role == "signer" && creep.room.name == room.name
      );
  
      if (signers.length < 1 && (!creep.room.controller.sign || creep.room.controller.sign.text !== signstring)) {
        return true;
      }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function (room) {
      let name = "Signer" + Game.time;
      let body = [MOVE];
      let memory = { role: "signer" };
  
      return { name, body, memory };
    },
    spawnDataLv2: function (room) {
      let name = "Signer" + Game.time;
      let body = [MOVE];
      let memory = { role: "signer" };
  
      return { name, body, memory };
    },
    spawnDataLv3: function (room) {
      let name = "Signer" + Game.time;
      let body = [MOVE];
      let memory = { role: "signer" };
  
      return { name, body, memory };
    },
  };
  
  module.exports = signer;
  