'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainStatusRequest=function(intent, session, response, type) {
    // Get a random space fact from the space facts list
    //intent.slots.Train.value;
    // type= "number" / "name"
    var date_ = new Date().getDate();
    switch(date_)
     {
      case 1:date_='01';
             break;
      case 2:date_='02';
             break;
      case 3:date_='03';
             break;
      case 4:date_='04';
             break;
      case 5:date_='05';
             break;
      case 6:date_='06';
             break;
      case 7:date_='07';
             break;
      case 8:date_='08';
             break;
      case 9:date_='09';
             break;

     }
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
    var trainNumber;
  
    if(type=="number")
    {    
    	trainNumber=intent.slots.TrainNumber.value;
	}
	else
	{
		trainNumber="12469";
	}

	railways.getJsonLiveStatus(trainNumber,result, function (events){
	// Create speech output
    var speechOutput =  events; 
    //"The correct train name recieved: " + intent.slots.Train.value;
        if(speechOutput['status']==null){
             railways.getJsonLiveStatus(trainNumber,result, function (events){
                	// Create speech output
                      var speechOutput =  events; 
                  //"The correct train name recieved: " + intent.slots.Train.value;
                  if(speechOutput['heading']!=null)	
	         	{
	   		response.tellWithCard(speechOutput['speech'], speechOutput['heading'] , speechOutput['status']);
                	}
          	else
    	          {
    	           response.tell(speechOutput['speech']);
                  	}
        	});
    

            }
    else  if(speechOutput['heading']!=null)	
	   	{
	   		response.tellWithCard(speechOutput['speech'], speechOutput['heading'] , speechOutput['status']);
    	}
    	else
    	{
    		response.tell(speechOutput['speech']);
    	}
	});
    

};


exports.nameToId=function  (name)
{
var temp=JSON.stringify(trains);
var index= temp.indexOf(name);
var index2=temp.indexOf(":",index+1);
var id=temp.substring(index2+2,index2+7);
console.log(id);
return id;
}



