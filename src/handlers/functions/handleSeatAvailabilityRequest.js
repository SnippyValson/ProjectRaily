'use strict';

var config=require('../../configs');
var station=require('../../stations');
var railways=require('../../services/railwayapi/apiParser');

exports.handleSeatAvailabilityRequest=function(intent, session, response,type) {
	var dateForJson;
	var trainNumber;
	var stationOne;
	var stationTwo;
	var classTrain;
	var quota;
	var stationOneCode;
	var stationTwoCode;
	var classTrainCode;
	var quotaCode;
	var sessionAttributes={};
	var interText;

	if(intent.slots.TrainNumber.value != undefined )
	{
		trainNumber=intent.slots.TrainNumber.value;
		sessionAttributes.TrainNumber=trainNumber;
	}
	if(intent.slots.Dat.value != undefined )
	{
		dateForJson=intent.slots.dat.value;
		sessionAttributes.Dat=dateForJson;
	}
	if(intent.slots.StationOne.value != undefined )
	{
		stationOne=intent.slots.StationOne.value;
		sessionAttributes.StationOne=stationOne;
	}
	if(intent.slots.StationTwo.value != undefined )
	{
		stationTwo=intent.slots.StationTwo.value;
		sessionAttributes.StationTwo=stationTwo;
	}
	if(intent.slots.ClassTrain.value != undefined )
	{
		classTrain=intent.slots.ClassTrain.value;
		sessionAttributes.ClassTrain=classTrain;
	}
	if(intent.slots.Quota.value != undefined )
	{
		quota=intent.slots.Quota.value;
		sessionAttributes.Quota=quota;
	}

	if(dateForJson==undefined && session.attributes.Dat!=undefined )
	{
		dateForJson=session.attributes.Dat.value;
		sessionAttributes.Dat=dateForJson;
	}
	if(stationOne==undefined && session.attributes.StationOne!=undefined )
	{
		stationOne=session.attributes.StationOne.value;
		sessionAttributes.StationOne=stationOne;
	}
	if(stationTwo==undefined && session.attributes.StationTwo!=undefined )
	{
		stationTwo=session.attributes.StationTwo.value;
		sessionAttributes.StationTwo=stationTwo;
	}
	if(classTrain==undefined && session.attributes.ClassTrain!=undefined )
	{
		classTrain=session.attributes.ClassTrain.value;
		sessionAttributes.ClassTrain=classTrain;
	}
	if(quota==undefined && session.attributes.Quota!=undefined )
	{
		quota=session.attributes.Quota.value;
		sessionAttributes.Quota=quota;
	}

	if(dateForJson==undefined)
	{
		interText="<speak>On what date?</speak>";
		response.askSSML(interText,interText,sessionAttributes);
	}
	else if (dateForJson==undefined)
	{

	}
	else if (stationOne==undefined)
	{

	}
	else if (stationTwo==undefined)
	{

	}
	else if (classTrain==undefined)
	{
		stationOneCode=station.getStationCode(stationOne);
		stationTwoCode=station.getStationCode(stationTwo);
		if(stationOneCode==-1 || stationTwoCode==-1)
		{
			response.ask('Stations not suported or Incorrect station name');
		}
		else
		{

		}
	}
	else if (quota==undefined)
	{

	}
	else
	{
		stationOneCode=station.getStationCode(stationOne);
		stationTwoCode=station.getStationCode(stationTwo);

		if(stationOneCode!=-1 && stationTwoCode!=-1)
		{
			railways.getJsonSeatAvailability(trainNumber, stationOneCode, stationTwoCode, dateForJson, 'CC', 'GN', function (events){
				// Create speech output
				var speechOutput =  events;

				if(speechOutput['heading']!=null)
				{
					response.tellWithCard(speechOutput['speech'], speechOutput['heading'] , speechOutput['status']);
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
	}


	
};



