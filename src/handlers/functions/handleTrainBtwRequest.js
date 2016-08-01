'use strict';

var config=require('../../configs');
var station=require('../../stations');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainBtwRequest=function(intent, session, response) {
	var dateForJson;
	var stationOne, stationTwo;
	var today;
	var takenToday=0;
	var errorText;
	var sessionAttributes=session.attributes;

	sessionAttributes.requestType="handleTrainBtwRequest";

	if(intent.slots.StationOne.value==undefined && intent.slots.StationTwo.value==undefined && session.attributes.StationOne==undefined && session.attributes.StationTwo==undefined )
	{
		errorText='Please tell the destination and source!';
		response.askSSML(errorText,errorText,sessionAttributes);
	}
	else if(intent.slots.StationOne.value==undefined && session.attributes.StationOne==undefined )
	{

		errorText='Where do you start your journey from?';
		response.askSSML(errorText,errorText,sessionAttributes);
	}
	else if(intent.slots.StationTwo.value==undefined && session.attributes.StationTwo==undefined )
	{
		sessionAttributes.StationOne=intent.slots.StationOne.value;
		errorText="Where is your journey to?";
		response.askSSML(errorText,errorText,sessionAttributes);
	}
	if(intent.slots.StationOne.value!=undefined)
		stationOne=intent.slots.StationOne.value;
	else if (session.attributes.StationOne!=undefined)
		stationOne=session.attributes.StationOne;

	if(intent.slots.StationTwo.value!=undefined)
		stationTwo=intent.slots.StationTwo.value;
	else if (session.attributes.StationTwo!=undefined)
		stationTwo=session.attributes.StationTwo;

	sessionAttributes.StationOne=stationOne;
	sessionAttributes.StationTwo=stationTwo;
	

	if(intent.slots.Dat.value != undefined )
	{
		dateForJson=intent.slots.Dat.value;
	}
	else
	{
		takenToday=1;
		var d = new Date();
                var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
                var toda = new Date(utc + (3600000*5.5));//coverting to IST
       		var dd = toda.getDate();
		var mm = toda.getMonth()+1; //January is 0!
                if(dd<10) {
			dd='0'+dd;
		}

		if(mm<10) {
			mm='0'+mm;
		}
                var yyyy= toda.getFullYear();
		today =yyyy+'-'+mm+'-'+dd;
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
		errorText='Stations not suported or Incorrect station name';
		response.askSSML(errorText,errorText,sessionAttributes);
	}


};



