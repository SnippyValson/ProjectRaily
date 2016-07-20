/**
 Copyright 2014-2015 Qburst or its affiliates. All Rights Reserved.

 Licensed under the MIT (the "License"). You may not use this file except in compliance with the License.

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
/**
 * The AlexaSkill prototype and helper functions
 */
'use strict';

var Raily = require('./Raily');
var config = require('./configs');

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Raily skill.
    //console.log("Yo "+config.getAPIKey());
    var raily = new Raily();
    raily.execute(event, context);
};

