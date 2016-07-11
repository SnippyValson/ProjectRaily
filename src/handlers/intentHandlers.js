
module.exports = function(Raily) {
  
Raily.prototype.intentHandlers = {
    "GetTrainDetailsIntent": function (intent, session, response) {
        handleTrainStatusRequest(intent, session, response);
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

};

