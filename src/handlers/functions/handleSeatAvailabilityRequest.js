'use strict';

var config=require('../../configs');
var station=require('../../stations');
var railways=require('../../services/railwayapi/apiParser');

exports.handleSeatAvailabilityRequest=function(intent, session, response) {
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
	var interTextRepromt;
	sessionAttributes.requestType="handleSeatAvailabilityRequest";



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
		var trainTemp= config.getCorrectedTrainNo(trainNumber);
		if(trainTemp==-1)
			response.tell('Invalid train number');
		interText="<speak>On what date?</speak>";
		interTextRepromt="On what date?";
		response.askSSML(interText,interTextRepromt,sessionAttributes);
	}
	else if (stationOne==undefined)
	{
		if(stationTwo==undefined)
		{
			interText='<speak>From where? And to  where?</speak>';
			interTextRepromt='From where? And to  where?';
			response.askSSML(interText,interTextRepromt,sessionAttributes);
		}
		else
		{
			interText='<speak>From where are you boarding?</speak>';
			interTextRepromt='From where are you boarding?';
			response.askSSML(interText,interTextRepromt,sessionAttributes);
		}

	}
	else if (stationTwo==undefined)
	{
		interText='<speak>Where is your journey to?</speak>';
		interTextRepromt='Where is your journey to?';
		response.askSSML(interText,interTextRepromt,sessionAttributes);
	}
	else if (classTrain==undefined)
	{
		stationOneCode=station.getStationCode(stationOne);
		stationTwoCode=station.getStationCode(stationTwo);
		if(stationOneCode==-1 || stationTwoCode==-1)
		{
			interText='<speak>Sorry! The station names are invalid, please repeat your starting and ending point.</speak>';
			interTextRepromt='Sorry! The station names are invalid, please repeat your starting and ending point.';
			response.askSSML(interText,interTextRepromt,sessionAttributes);
		}
		else
		{
			//Get classes available
			interText='<speak>Which class do you want? <p>Sleeper class,AC first class,AC Two tier,AC three tier, Seater class or, AC chair car </p></speak>';
			interTextRepromt='Which class do you want?';
			response.askSSML(interText,interTextRepromt,sessionAttributes);
		}
	}
	else if (quota==undefined)
	{
		railways.getJsonClass(session.attributes.TrainNumber,convertClassCode(classTrain), function (events){
				// Create speech output
				var speechOutput =  events;

				if(speechOutput=="no")
				{
					var inte="Sorry! the "+classTrain+" class is not available. Please tell another class.";
					response.askSSML('<speak>'+inte+'</speak>', inte , sessionAttributes);
				}
				else
				{
					//Get quotas available
					interText='<speak><p>Normally people choose General Quota</p>Which Quota do you want?</speak>';
					interTextRepromt='Which Quota do you want?';
					response.askSSML(interText,interTextRepromt,sessionAttributes);
				}
			});
		
	}
	else
	{
		stationOneCode=station.getStationCode(stationOne);
		stationTwoCode=station.getStationCode(stationTwo);
		trainNumber=session.attributes.TrainNumber;

		classTrainCode=convertClassCode(classTrain);
		quotaCode=convertQuota(quota);
		if(classTrainCode==-1)
		{
			interText='<speak>Please tell again the class you need.</speak>';
			interTextRepromt='Please tell again the class you need.';
			response.askSSML(interText,interTextRepromt,sessionAttributes);
		}
		if(quotaCode==-1)
		{
			interText='<speak>Please tell again the quota you need.</speak>';
			interTextRepromt='Please tell again the quota you need.';
			response.askSSML(interText,interTextRepromt,sessionAttributes);
		}

		if(stationOneCode!=-1 && stationTwoCode!=-1)
		{
			railways.getJsonSeatAvailability(trainNumber, stationOneCode, stationTwoCode, dateForJson, classTrainCode, quotaCode, function (events){
				// Create speech output
				var speechOutput =  events;

				if(speechOutput['heading']!=null)
				{
					response.tellWithCardSSML('<speak>'+speechOutput['speech']+'</speak>', speechOutput['heading'] , speechOutput['status']);
				}
				else
				{
					response.askSSML('<speak>'+speechOutput['speech']+'</speak>');
				}
			});
		}
		else
		{
			response.askSSML('Stations not suported or Incorrect station name');
		}
	}


	
};

function convertClassCode(classTrain)
{
	switch(classTrain.toUpperCase())
	{
		case "SLEEPER": return "SL";
		case "AC FIRST": return "1A";
		case "AC TWO TIER": return "2A";
		case "AC 2 TIER": return "2A";
		case "AC2 TIER": return "2A";
		case "AC THREE TIER": return "3A";
		case "AC 3 TIER": return "3A";
		case "AC3 TIER": return "3A";
		case "SEATER": return "2S";
		case "AC CHAIR CAR": return "CC";
		default: return -1;
	}
}

function convertQuota(quota)
{
	switch(quota.toUpperCase())
	{
		case "GENERAL": return "GN";
		case "LADIES": return "LD";
		default: return -1;
	}
}


