'use strict';

var handle1=require('./functions/handleTrainStatusRequest');
var handle2=require('./functions/handleTrainRouteRequest');
var handle3=require('./functions/handleSeatAvailabilityRequest');
var handle4=require('./functions/handleTrainArrivalsRequest');
var handle5=require('./functions/handleTrainBtwRequest');
var handle6=require('./functions/handlePNRStatusRequest');

var registerIntentHandlers = function (intentHandlers, skillContext) {

    intentHandlers.handleTrainNumberStatusIntent = function (intent, session, response) {
        handle1.handleTrainStatusRequest(intent, session, response,"number");
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
    intentHandlers.handleMultipleCasesIntent = function (intent, session, response) {

        if(session.attributes.requestType==undefined)
            response.ask('For help with with Raily, say help');
        else
        {
            switch(session.attributes.requestType)
            {
                case "handleSeatAvailabilityRequest":
                    handle3.handleSeatAvailabilityRequest(intent, session, response);
                    break;
                case "handleTrainBtwRequest":
                    handle4.handleTrainBtwRequest(intent, session, response);
                    break;
            }
        }
        
    };

    intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {
        var speechOutput = "<speak>You can ask raily to get the details of a train, like,<p>live status of the train using the train number,</p> seat availability of the train between two stations on a date for a particular class and quota,<p> or about route of the train using the train number.</p> You can even ask about the details of the trains arriving at a station in the next two or four hours,<p> trains between two stations for a particular date,</p> or, can get the status of your PNR number. For example,<p> you can ask,</p> train number<say-as interpret-as='digits'>16346</say-as> status,<p> what's the route of the train number <say-as interpret-as='digits'>16346</say-as>,</p> seat availability of train number <say-as interpret-as='digits'>16346</say-as>,<p> trains arriving at aluva,</p> get the PNR status of <say-as interpret-as='digits'>1234567891</say-as>,<p> list of trains between Aluva and New Delhi.</p><p>What can I help you with?</p></speak>";
       
        var cardContent= "You can ask raily to get the following details:\n1) Live status of a train using the train number\nEg: Train number 16346 status\n2) Seat availability of the train between two stations on a date for a particular class and quota\nEg: seat availability of train number 16346\n3) Route of the train using the train number\nEg: What's the route of the train number 16346?\n4) Trains arriving at a station in the next two or four hours\nEg: Trains arriving at aluva\n5)Trains between two stations for a particular date\nEg: List of trains between Aluva and New Delhi\n6) Status of your PNR number\nEg: Get the PNR status of 1234567891\n";
        response.askWithCardSSMLImageCard(speechOutput,speechOutput,"Raily help",cardContent);
    };

    intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    };
    intentHandlers['AMAZON.CancelIntent'] = function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    };
    intentHandlers['AMAZON.YesIntent'] = function (intent, session, response) {
        if(session.attributes.repeat==undefined)
            response.ask('Didn\'t get why you told YES. For help with with Raily, say help');
        else
        {
            response.tellSSML("<speak><audio src='https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3' /><p>Here are the remaining train details</p> "+session.attributes.repeatText+'</speak>');
        }
    };
    intentHandlers['AMAZON.NoIntent'] = function (intent, session, response) {
        var speechOutput
        if(session.attributes.repeat==undefined)
            speechOutput = 'Didn\'t get why you told NO. For help with with Raily, say help';
        else
            speechOutput = "Okay";
        response.ask(speechOutput);
    };

};

exports.register = registerIntentHandlers;
