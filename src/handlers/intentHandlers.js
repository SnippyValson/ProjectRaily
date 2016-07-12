
var handle1=require('./functions/handleTrainStatusRequest');


var registerIntentHandlers = function (intentHandlers, skillContext) {
  
intentHandlers.handleTrainStatusIntent = function (intent, session, response) {
        handle1.handleTrainStatusRequest(intent, session, response);
    };

    intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {
        response.ask("You can ask Indian Railways tell me the details of a train, or, you can say exit... What can I help you with?", "What can I help you with?");
    };

    intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    };
    intentHandlers['AMAZON.CancelIntent'] = function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    };

};

exports.register = registerIntentHandlers;

