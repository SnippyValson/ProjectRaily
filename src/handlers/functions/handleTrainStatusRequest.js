'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainStatusRequest=function(intent, session, response) {
    // Get a random space fact from the space facts list
    
    var resultString=railways.getJsonLiveStatus('12046','20160712', function (events){
	    // Create speech output
	    var speechOutput = events; 
	    //"The correct train name recieved: " + intent.slots.Train.value;
	    	
	   	 response.tellWithCard(speechOutput, "Raily- Indian Railways" , speechOutput);
    });
    

};

