'use strict';

var config=require('../../configs');
var stationHere=require('../../stations');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainArrivalsRequest=function(intent, session, response) {
	//intent.slots.Train.value;

	var station=intent.slots.Station.value;
	var durationHours=intent.slots.duration.value;

	var stationCode=stationHere.getStationCode(station);

	if(stationCode!=-1)
	{

		railways.getJsonTrainArrivals(stationCode,durationHours, function (events){
			// Create speech output
			var speechOutput =  events;

			if(speechOutput['heading']!=null)
			{
				response.tellWithCardSSML(speechOutput['speech'], speechOutput['heading'] , speechOutput['status']);
			}
			else
			{
				response.ask(speechOutput['speech']);
			}
		});
	}
	else
	{
		response.ask('Station not suported or Incorrect station name');
	}


};



