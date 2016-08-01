'use strict';

var config=require('../../configs');
var railways=require('../../services/railwayapi/apiParser');

exports.handlePNRStatusRequest=function(intent, session, response) {

    railways.getJsonPNRstatus(intent.slots.pnrNumber.value, function (events){

        var speechOutput =  events;
        /* if (speechOutput['status']==null)
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
         else*/ 
        if(speechOutput['heading']!=null)
        {
            response.tellWithCardSSML('<speak>'+speechOutput['speech']+'</speak>', speechOutput['heading'] , speechOutput['status']);
        }
        else
        {
            response.askSSML(speechOutput['speech']);
        }
    });


};



