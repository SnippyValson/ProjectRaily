'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainStatusRequest=function(intent, session, response) {
    // Get a random space fact from the space facts list
    
    var resultString=railways.getJsonLiveStatus('12046','20160712');
    // Create speech output
    var speechOutput = "The correct train name recieved: " + intent.slots.Train.value;

    if(resultString[0] == "success")
    {	
   	 response.tellWithCard(speechOutput, resultString[1] , speechOutput);
   	}
   	else
   	{
   		response.tellWithCard(speechOutput, "<p>Sorry</p> We could not process your request" , speechOutput);
   	}
};

