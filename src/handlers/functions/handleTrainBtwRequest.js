'use strict';

var config=require('../../configs');
var station=require('../../stations');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainBtwRequest=function(intent, session, response) {
	var dateForJson;
	var stationOne, stationTwo;
	var today;
	stationOne=intent.slots.StationOne.value;
	stationTwo=intent.slots.StationTwo.value;

	if(intent.slots.dat.value !== undefined )
	{
		dateForJson=intent.slots.dat.value;
	}
	else
	{
		var d = new Date();
                var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
                today = new Date(utc + (3600000*5.5));
                console.log(today);
       		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		if(dd<10) {
			dd='0'+dd;
		}

		if(mm<10) {
			mm='0'+mm;
		}

		today =dd+'-'+mm;
		dateForJson=today;
	}

	var stationOneCode=station.getStationCode(stationOne);
	var stationTwoCode=station.getStationCode(stationTwo);
console.log(dateForJson);

	if(stationOneCode!=-1 && stationTwoCode!=-1)
	{
		railways.getJsonTrainBtw(stationOneCode, stationTwoCode, dateForJson, function (events){
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
		response.ask('Stations not suported or Incorrect station name');
	}


};



