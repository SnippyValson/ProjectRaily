'use strict';

var config=require('../../configs');
var stationHere=require('../../stations');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainArrivalsRequest=function(intent, session, response) {
	//intent.slots.Train.value;

	var station=intent.slots.Station.value;
	var durationHours;
	var sessionAttributes=session.attributes;
	if(intent.slots.duration != undefined )
	{	
		durationHours=intent.slots.duration.value;
	}
	else
	{
		durationHours=2;
	}
	var stationCode=stationHere.getStationCode(station);

	if(stationCode!=-1)
	{

		railways.getJsonTrainArrivals(stationCode,durationHours, function (events){
			// Create speech output
			var speechOutput =  events;

			if(speechOutput['heading']!=null)
			{
				if(speechOutput['remaining']=="")
					response.tellWithCardSSML('<speak>'+speechOutput['speech']+'</speak>', speechOutput['heading'] , speechOutput['status']);
				else
				{
					sessionAttributes.repeat="ON";
					sessionAttributes.repeatText=speechOutput['remaining'];
					response.askWithCardSSML('<speak>'+speechOutput['speech']+' <p> Do you want to hear about all the other trains?</p></speak>','<speak>'+speechOutput['speech']+'</speak>' , speechOutput['heading'], speechOutput['status'],sessionAttributes);
				}
			}
			else
			{
				response.askSSML(speechOutput['speech']);
			}
		});
	}
	else
	{
		response.askSSML('Station not suported or Incorrect station name');
	}


};



