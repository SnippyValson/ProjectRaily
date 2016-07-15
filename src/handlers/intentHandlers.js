'use strict';

var handle1=require('./functions/handleTrainStatusRequest');
var handle2=require('./functions/handleTrainRouteRequest');
var handle3=require('./functions/handleSeatAvailabilityRequest');
var handle4=require('./functions/handleTrainArrivalsRequest');
var handle5=require('./functions/handleTrainBtwRequest');
var handle6=require('./functions/handlePNRStatusRequest');

var registerIntentHandlers = function (intentHandlers, skillContext) {
  
intentHandlers.handleTrainStatusIntent = function (intent, session, response) {
        handle1.handleTrainStatusRequest(intent, session, response,"name");
    };

intentHandlers.handleTrainNumberStatusIntent = function (intent, session, response) {
        handle1.handleTrainStatusRequest(intent, session, response,"number");
    };

intentHandlers.handleTrainRouteIntent = function (intent, session, response) {
        handle2.handleTrainRouteRequest(intent, session, response);
    };
intentHandlers.handleTrainNumberRouteIntent = function (intent, session, response) {
        handle2.handleTrainRouteRequest(intent, session, response,"number");
    };

intentHandlers.handleSeatAvailabilityIntent = function (intent, session, response) {
        handle3.handleSeatAvailabilityRequest(intent, session, response);
    };
    
intentHandlers.handleSeatAvailabilityNumberIntent = function (intent, session, response) {
        handle3.handleSeatAvailabilityRequest(intent, session, response,"number");
    };    

intentHandlers.handleTrainArrivalsIntent = function (intent, session, response) {
        handle4.handleTrainArrivalsRequest(intent, session, response);
    };

intentHandlers.handleTrainBtwIntent = function (intent, session, response) {
        handle5.handleTrainBtwRequest(intent, session, response);
    };

intentHandlers.handlePNRStatusIntent = function (intent, session, response) {
        handle6.handlePNRStatusRequest(intent, session, response);
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
