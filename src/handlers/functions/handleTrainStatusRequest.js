'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handleTrainStatusRequest=function(intent, session, response, type) {
    // Get a random space fact from the space facts list
    //intent.slots.Train.value;
    // type= "number" / "name"
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var toda = new Date(utc + (3600000*5.5));//coverting to IST
    var date_ = toda.getDate();
    var month_ = toda.getMonth();
    month_= month_+1;
    if(date_<10)
        {  
         	date_='0'+date_;
	}

    if(month_<10) 
        {
	       month_='0'+month_;
        }
   
    var year_ = toda.getFullYear();
    var result = "";
    result= result + year_+month_+date_;
    var trainNumber;

    if(type=="number")
    {
        trainNumber=intent.slots.TrainNumber.value;
    }
    else
    {
        trainNumber= config.getTrainID(intent.slots.Train.value);
    }

    railways.getJsonLiveStatus(trainNumber,result, function (events){
        // Create speech output
        var speechOutput =  events;
        //"The correct train name recieved: " + intent.slots.Train.value;
        if(speechOutput['status']==null){
            railways.getJsonLiveStatus(trainNumber,result, function (events){
                // Create speech output
                var speechOutput =  events;
                if(speechOutput['heading']!=null)
                {
                    response.tellWithCardSSMLImageCard('<speak>'+speechOutput['speech']+'</speak>', speechOutput['heading'] , speechOutput['status']);
                }
                else
                {
                    response.askSSML('<speak>'+speechOutput['speech']+'</speak>');
                }
            });


        }
        else  if(speechOutput['heading']!=null)
        {
            response.tellWithCardSSMLImageCard('<speak>'+speechOutput['speech']+'</speak>', speechOutput['heading'] , speechOutput['status']);
        }
        else
        {
            response.askSSML('<speak>'+speechOutput['speech']+'</speak>');
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



