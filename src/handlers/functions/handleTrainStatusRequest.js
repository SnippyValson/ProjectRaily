'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainStatusRequest=function(intent, session, response) {
    // Get a random space fact from the space facts list
    var speechOutput="<p>"+intent.slots.Train.value+" Status</p> ";
    var date_ = new Date().getDate();
    var month_ = new Date().getMonth(); 
    month_= month_+1;
    switch(month_)
     {
      case 1:month_='01';
             break;
      case 2:month_='02';
             break;
      case 3:month_='03';
             break;
      case 4:month_='04';
             break;
      case 5:month_='05';
             break;
      case 6:month_='06';
             break;
      case 7:month_='07';
             break;
      case 8:month_='08';
             break;
      case 9:month_='09';
             break;

     }
    var year_ = new Date().getFullYear();
    var result = "";
    result= result + year_+month_+date_;
  
    railways.getJsonLiveStatus('12163',result, function (events){
    	// Create speech output
	    speechOutput = speechOutput+ events; 
	    //"The correct train name recieved: " + intent.slots.Train.value;
	    	
	   	 response.tellWithCard(speechOutput, "Raily- Indian Railways" , speechOutput);
    });
    

};

