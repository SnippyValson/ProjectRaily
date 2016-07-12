/**
 * Raily is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */

var AlexaSkill = require('./AlexaSkill');
var config = require('./configs');
var skillContext = {};
var intentHandlers = require('./handlers/intentHandlers');
var eventHandlers = require('./handlers/eventHandlers');

var Raily = function () {
    AlexaSkill.call(this, config.getAPPID());
    skillContext.needMoreHelp = true;
};
// Extend AlexaSkill
Raily.prototype = Object.create(AlexaSkill.prototype);
Raily.prototype.constructor = Raily;


eventHandlers.register(Raily.prototype.eventHandlers, skillContext);
intentHandlers.register(Raily.prototype.intentHandlers, skillContext);

module.exports = Raily;