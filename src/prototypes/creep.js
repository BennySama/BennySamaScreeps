Creep.prototype.sayHello = function sayHello() {
  this.say("Hello", true);
};

Creep.prototype.bodyConstruct = function bodyConstruct()
{
    this.return [WORK, CARRY, MOVE];
}