'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainBtwRequest=function(intent, session, response) {
    var dateForJson;
    var stationOne, stationTwo;
    stationOne=intent.slots.StationOne.value;
    stationTwo=intent.slots.StationTwo.value;

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
    

    
	railways.getJsonTrainBtw(stationOne, stationTwo, dateForJson, function (events){
	// Create speech output
    var speechOutput =  events; 
    speechOutput['speech']=""+speechOutput['speech'];
    
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



