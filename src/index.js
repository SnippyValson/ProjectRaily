/**
    Copyright 2014-2015 Qburst or its affiliates. All Rights Reserved.

    Licensed under the MIT (the "License"). You may not use this file except in compliance with the License.

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/



/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var Functions = require('./functions');
var Config = require('./config');
var Intent_handlers = require('./handlers/intent_handlers');
var Event_handlers = require('./handlers/event_handlers');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Raily = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Raily.prototype = Object.create(AlexaSkill.prototype);
Raily.prototype.constructor = SpaceGeek;


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var raily = new Raily();
    Raily.execute(event, context);
};

