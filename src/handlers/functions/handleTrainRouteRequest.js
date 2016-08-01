'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainRouteRequest=function(intent, session, response,type) {
    //intent.slots.Train.value;


    var trainNumber;

   if(type=="number")
    {    
    	trainNumber=intent.slots.TrainNumber.value;
	}
	else
	{
		trainNumber="12469";
	}

	railways.getJsonTrainRoute(trainNumber, function (events){
	// Create speech output
    var speechOutput =  events; 
    
	    if(speechOutput['heading']!=null)	
	   	{
	   		response.tellWithCardSSMLImageCard('<speak>'+speechOutput['speech']+'</speak>', speechOutput['heading'] , speechOutput['status']);
    	}
    	else
    	{
    		response.askSSML(speechOutput['speech']);
    	}
	});
    


};



