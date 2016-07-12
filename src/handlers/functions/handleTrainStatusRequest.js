var config=require('../../configs');

exports.handleTrainStatusRequest=function(intent, session, response) {
    // Get a random space fact from the space facts list
    

    // Create speech output
    var speechOutput = "Here's your train details fact: " + "put details here";

    response.tellWithCard(speechOutput, "Raily- Indian Railways", speechOutput);
};

