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
	var sessionAttributes=session.attributes;
	var interText;

	// if(session.attributes.TrainNumber!=undefined)
	// 	sessionAttributes.TrainNumber=session.attributes.TrainNumber;
	// if(session.attributes.Dat!=undefined)
	// 	sessionAttributes.Dat=session.attributes.Dat;
	// if(session.attributes.StationOne!=undefined)
	// 	sessionAttributes.StationOne=session.attributes.StationOne;
	// if(session.attributes.StationTwo!=undefined)
	// 	sessionAttributes.StationTwo=session.attributes.StationTwo;
	// if(session.attributes.StationTwo!=undefined)
	// 	sessionAttributes.ClassTrain=session.attributes.StationTwo;
	// if(session.attributes.StationTwo!=undefined)
	// 	sessionAttributes.Quota=session.attributes.StationTwo;

	if(intent.slots.TrainNumber.value != undefined )
	{
		trainNumber=intent.slots.TrainNumber.value;
		sessionAttributes.TrainNumber=trainNumber;
	}
	if(intent.slots.Dat.value != undefined )
	{
		dateForJson=intent.slots.Dat.value;
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
		dateForJson=session.attributes.Dat;
		sessionAttributes.Dat=dateForJson;
	}
	if(stationOne==undefined && session.attributes.StationOne!=undefined )
	{
		stationOne=session.attributes.StationOne;
		sessionAttributes.StationOne=stationOne;
	}
	if(stationTwo==undefined && session.attributes.StationTwo!=undefined )
	{
		stationTwo=session.attributes.StationTwo;
		sessionAttributes.StationTwo=stationTwo;
	}
	if(classTrain==undefined && session.attributes.ClassTrain!=undefined )
	{
		classTrain=session.attributes.ClassTrain;
		sessionAttributes.ClassTrain=classTrain;
	}
	if(quota==undefined && session.attributes.Quota!=undefined )
	{
		quota=session.attributes.Quota;
		sessionAttributes.Quota=quota;
	}

	if(dateForJson==undefined)
	{
		interText="<speak>On what date?</speak>";
		response.askSSML(interText,interText,sessionAttributes);
	}
	else if (stationOne==undefined)
	{
		if(stationTwo==undefined)
		{
			interText='<speak>From where? And to  where?</speak>';
			response.askSSML(interText,interText,sessionAttributes);
		}
		else
		{
			interText='<speak>From where are you boarding?</speak>';
			response.askSSML(interText,interText,sessionAttributes);
		}

	}
	else if (stationTwo==undefined)
	{
		interText='<speak>Where is your journey to?</speak>';
		response.askSSML(interText,interText,sessionAttributes);
	}
	else if (classTrain==undefined)
	{
		stationOneCode=station.getStationCode(stationOne);
		stationTwoCode=station.getStationCode(stationTwo);
		if(stationOneCode==-1 || stationTwoCode==-1)
		{
			interText='<speak>Sorry! The station names are invalid, please repeat your starting and ending point.</speak>';
			response.askSSML(interText,interText,sessionAttributes);
		}
		else
		{
			//Get classes available
			interText='<speak>Which class do you want? <p>Sleeper class,First class AC,AC Two tier,AC three tier, Seater class or, AC chair car </p></speak>';
			response.askSSML(interText,interText,sessionAttributes);
		}
	}
	else if (quota==undefined)
	{
		//Get quotas available
		interText='<speak><p>Normally people choose General Quota</p>Which Quota do you want?</speak>';
		response.askSSML(interText,interText,sessionAttributes);
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



