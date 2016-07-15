'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handlePNRStatusRequest=function(intent, session, response) {
    //intent.slots.Train.value;

    railways.getJsonPNRstatus(intent.slots.pnrNumber.value, function (events){

    	// Create speech output
	    var speechOutput =  events; 
	    //"The correct train name recieved: " + intent.slots.Train.value;
	    if (speechOutput['status']==null)
               {
                  railways.getJsonPNRstatus(intent.slots.pnrNumber.value, function (events){

                  // Create speech output
                  var speechOutput =  events;
                  speechOutput['speech']=speechOutput['speech'];
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
         else if(speechOutput['heading']!=null)
                {
                        response.tellWithCard(speechOutput['speech'], speechOutput['heading'] , speechOutput['status']);
                }
                else
                {
                    response.tell(speechOutput['speech']);
                }
    });
 

};



