'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleSeatAvailabilityRequest=function(intent, session, response,type) {
	var dateForJson;
	var trainNumber;
	var stationOne=intent.slots.StationOne.value;
	var stationTwo=intent.slots.StationTwo.value;

	if(type=="number")
	{
		trainNumber=intent.slots.TrainNumber.value;
	}
	else
	{
		trainNumber="12469";
	}

	if(intent.slots.dat !== undefined && intent.slots.dat !== null)
	{
		dateForJson=intent.slots.dat.value;
	}
	else
	{
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd='0'+dd
		}

		if(mm<10) {
			mm='0'+mm
		}

		today = yyyy+'-'+mm+'-'+dd;
		dateForJson=today;
	}



	railways.getJsonSeatAvailability(trainNumber, stationOne, stationTwo, dateForJson, 'CC', 'GN', function (events){
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



