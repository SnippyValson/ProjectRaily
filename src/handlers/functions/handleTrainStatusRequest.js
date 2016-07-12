'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainStatusRequest=function(intent, session, response) {
    // Get a random space fact from the space facts list
    var speechOutput="<p>"+intent.slots.Train.value+" Status</p> ";
    
    railways.getJsonLiveStatus('12163','20160712', function (events){
    	// Create speech output
	    speechOutput = speechOutput+ events; 
	    //"The correct train name recieved: " + intent.slots.Train.value;
	    	
	   	 response.tellWithCard(speechOutput, "Raily- Indian Railways" , speechOutput);
    });
    

};

