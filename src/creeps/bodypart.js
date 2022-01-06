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
  