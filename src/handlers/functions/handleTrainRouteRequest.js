'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainRouteRequest=function(intent, session, response,type) {
	// Get a random space fact from the space facts list
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
			response.tellWithCard(speechOutput['speech'], speechOutput['heading'] , speechOutput['status']);
		}
		else
		{
			response.tell(speechOutput['speech']);
		}
	});



};



