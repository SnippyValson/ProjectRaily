'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainRouteRequest=function(intent, session, response) {
    // Get a random space fact from the space facts list
    //intent.slots.Train.value;

/* CODE TO BE EDITED
  
    railways.getJsonLiveStatus('12429',result, function (events){

    	// Create speech output
	    var speechOutput =  events; 
	    speechOutput['speech']='<p>'+intent.slots.Train.value+'</p> '+speechOutput['speech'];
	    //"The correct train name recieved: " + intent.slots.Train.value;
	    	
	   	 response.tellWithCard(speechOutput['speech'], "Raily- Indian Railways" , speechOutput['status']);
    });
    
CODE TO BE EDITED*/

};



