var config=require('../../configs');

exports.handleTrainStatusRequest=function(intent, session, response) {
    // Get a random space fact from the space facts list
    var API_KEYS=config.getAPIKeys();
    var keyIndex = Math.floor(Math.random() * API_KEYS.length);
    var apiKey = API_KEYS[keyIndex];

    // Create speech output
    var speechOutput = "Here's your train details fact: " + "put details here with API Key "+apiKey;

    response.tellWithCard(speechOutput, "Raily- Indian Railways", speechOutput);
};

