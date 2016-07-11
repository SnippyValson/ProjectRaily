/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var BASE_URL="http://api.railwayapi.com/";
var trains={
	[
	"name":"SOLAPUR MIRAJ SPECIAL",
	"id":"1413",
	"from":"SOLAPUR",
	"to":"MIRAJ"],
	[
	"name":"MIRAJ SOLAPUR SPECIAL",
	"id":"1414",
	"from":"MIRAJ",
	"to":"SOLAPUR"]
};
/**
 * Array containing API keys
 */
var API_KEYS = [
    "bfzhr4575",
    "puzgi7810",
    "xtjxm1892",
    "adieg3070",
    "bkxel1825",
    "bkjjv3426",
    "euhuq6862",
    "mdtzh6188"
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

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

Raily.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Raily onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Raily.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Raily onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Raily.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Raily onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Raily.prototype.intentHandlers = {
    "GetTrainDetailsIntent": function (intent, session, response) {
        handleNewTrainRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Indian Railways tell me the details of a train, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewTrainRequest(response) {
    // Get a random space fact from the space facts list
    var keyIndex = Math.floor(Math.random() * API_KEYS.length);
    var apiKey = API_KEYS[keyIndex];

    // Create speech output
    var speechOutput = "Here's your train details fact: " + "put details here";

    response.tellWithCard(speechOutput, "Raily- Indian Railways", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var raily = new Raily();
    Raily.execute(event, context);
};
