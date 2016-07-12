'use strict';

var http = require('http');


/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */

var config = require('../../configs');
var apiKey=config.getAPIKey();

/**
exports.getJsonLiveStatus= function (train_no,doj){
  //the function content here  
};
 * This function will return the train status as a string.
 * Sample output : Train departed from KARUKKUTTY(KUC) and late by 24 minutes.
 */
exports.getJsonLiveStatus= function (train_no,doj){
    var url =config.getBaseUrl()+"live/train/"+train_no+"/doj/"+doj+"/apikey/"+apiKey+"/";
    var state="";
    var status= "";
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.stringify(body);
            var train_name=numberToName(train_no);
            var index=0;
            var index2=0
            var train_numbers=[];
            var train_string="";
            var index=stringResult.indexOf("position")
            var index1=stringResult.indexOf(".",index)
            status = "The status of "+train_name+"is"+stringResult.substring(index+14,index1+1);
            if(stringResult.indexOf("error") > -1) {
                 state = "error";
                }
            else
                 state = "success";

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        status= "Sorry, we could not process your request.";
    });
  /* return {
           0:state,
           1:status
         };*/
   return status;
}



/**
 * This function will return the stations in a route as a string.
 * Sample output : KANYAKUMARI,Source,14:10,1,  NAGARCOIL JN,14:30,14:35,1,  KULITTHURAI,15:14,15:15,1,  TRIVANDRUM CNTL,15:55,16:00,1,  KOLLAM JN,17:00,17:05,1,  KAYANKULAM,17:34,17:36,1 (Station     **name,Arriavl time,Departure time,Day of arrival.) 
 
function getJsonTrainRoute(train_no){

    var url =baseUrl +'/route/train/'+train_no+'/apikey/'+ apikey+'/';
       var station_string="";
    var state = "";
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.stringify(body);
            //console.log(stringResult);
            var index=0;
            var index2=0
            var station_names=[];
            var station_arrival=[];
            var station_dep=[];
            var day=[];
           
            while(index!=-1)
          {
             var index1=stringResult.indexOf("fullname",index+1);
             index=index1;
             var index3=stringResult.indexOf("\,",index+1);
             if(index!=-1)
             station_names[index2++]=stringResult.substring(index+14,index3-2);
              
          } 
           index=0;
           index2=0;
           while(index!=-1)
          {
             var index1=stringResult.indexOf("schdep",index+1);
             index=index1;
             var index3=stringResult.indexOf("\,",index+1);
             if(index!=-1)
             station_dep[index2++]=stringResult.substring(index+12,index3-2);
              
          }
           index=0;
           index2=0;
           while(index!=-1)
          {
             var index1=stringResult.indexOf("scharr",index+1);
             index=index1;
             var index3=stringResult.indexOf("\,",index+1);
             if(index!=-1)
             station_arrival[index2++]=stringResult.substring(index+12,index3-2);
              
          } 

            var index4=stringResult.indexOf("route");
           
            index=0;
            index2=0;
           while(index!=-1)
          {
             var index1=stringResult.indexOf("day",index4+1);
             index4=index1;
             index=index1;
             var index3=stringResult.indexOf("\,",index+1);
             if(index!=-1)
             day[index2++]=stringResult.substring(index+8,index3-1);
              
          } 
         for(i=0;i<index2;i++)
            station_string=station_string+station_names[i]+","+station_arrival[i]+","+station_dep[i]+","+day[i] +",  ";
           if(stringResult.indexOf("error") > -1) {
                 state = "error";
                }
            else
                 state = "success";

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        state = "error";
    });
   return {
           0:state,
           1:station_string
         };
}

/**
 * This function will return the seat availability as string.
 * Sample output : AVAILABLE 11  
 

function getJsonSeatAvailability(train_no, source, dest, date, _class, quota){
    var url =baseUrl +'/check_seat/train/'+train_no+'/source/'+ source +'/dest/'+dest+'/date/'+ date+'/class/'+_class+'/quota/'+quota+'/apikey/'+ apikey+'/';
    var state = "";
    var status = ""; 
      http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.stringify(body);
           
            var index=0;
            var index2=0
            var train_numbers=[];
            var train_string="";
            var index=stringResult.indexOf("status");
            var index1=stringResult.indexOf("\\",index+12);
            var status =stringResult.substring(index+12,index1);
            if(status.charAt(0)=='G'&&status.charAt(1)=='N'&&status.charAt(2)=='W')
               {
                 index3=status.indexOf("/WL");
                 index4=status.indexOf("\n",index3);
                 var waiting=status.substring(index3+3,index3+8);
                 var status=waiting+" seats are in waiting list."; 
                }
            if(stringResult.indexOf("error") > -1) {
                 state = "error";
                }
            else
                 state = "success";

            

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        state = "error";
    });
  return {
           0:state,
           1:status
         };
}



/**
 * This function will return the train numbers of trains between stations as a string.
 * Sample output : 12617  16382  16346  19577  16334  
 

function getJsonTrainBtw(source, dest, date){
         var url=baseUrl+"/between/source/"+source+"/dest/"+dest+"/date/"+date+"/apikey/"+apiKey+"/";
         var state ="";
         var train_string="";

        http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.stringify(body);
            var index=0;
            var index2=0
            var train_numbers=[];
       
            while(index!=-1)
          {
             var index1=stringResult.indexOf("number",index+1);
             index=index1;
             if(index!=-1)
             
             train_numbers[index2++]=stringResult.substring(index+12,index+17);
          } 
         for(i=0;i<index2;i++)
           {
               train_string=train_string+train_numbers[i]+"  ";
            }
         if(stringResult.indexOf("error") > -1) {
                 state = "error";
                }
            else
                 state = "success";


        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        state ="error";
    });
    return {
           0:state,
           1:train_string
         };
}

function getJsonPNRstatus(pnr_no){
    var state="";
    var result="";
    var url =baseUrl +'/pnr_status/pnr/'+pnr_no+'/apikey/'+ apikey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var train_no;
            var doj="";
            var Class="";
            var chart_prepared="";
            var total_passengers;
            var booking_status=[];
            var current_status=[];
            var coach_position =[];
            var stringResult = JSON.stringify(body);
            var index=0;
            var index1=0;
            var index2=0;
            var index3=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("train_num",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\,",index+1);
                 if(index!=-1)
                 train_no=stringResult.substring(index+15,index3-2);
                }
               index=0;
              index2=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("doj",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\,",index+1);
                 if(index!=-1)
                 doj=stringResult.substring(index+9,index3-2);
                }
             index=0;
              index2=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("total_passengers",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\,",index+1);
                 if(index!=-1)
                 total_passengers=stringResult.substring(index+22,index3-2);
                }
             index=0;
              index2=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("class",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\,",index+1);
                 if(index!=-1)
                 Class=stringResult.substring(index+11,index3-2);
                }
               index=0;
              index2=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("chart_prepared",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\,",index+1);
                 if(index!=-1)
                 chart_prepared=stringResult.substring(index+20,index3-2);
                }

              index=0;
              index2=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("booking_status",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\",\\",index+1);
                 if(index!=-1)
                 booking_status[index2++]=stringResult.substring(index+20,index3-1);
                }
              index=0;
              index2=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("current_status",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\,",index+1);
                 if(index!=-1)
                 current_status[index2++]=stringResult.substring(index+20,index3-2);
                }
              index=0;
              index2=0;
             while(index!=-1)
                {
                 var index1=stringResult.indexOf("coach_position",index+1);
                 index=index1;
                 var index3=stringResult.indexOf("\,",index+1);
                 if(index!=-1)
                 coach_position[index2++]=stringResult.substring(index+20,index3-2);
                }

             result= result+ train_no+", Starting date is "+doj+", Class is "+Class+", Chart prepared "+chart_prepared+", "
             result= result+"Total number of passengers "+total_passengers+", \nDetails of each passengers\n";              
             for(i=0;i<index2;i++)
                  result=result+" Booking status "+booking_status[i]+", Current status "+current_status[i]+", "
                  result = result +"Coach position "+coach_position[i]+",  ";
            control.log(result);
             
           if(stringResult.indexOf("error") > -1) {
                 state = "error";
                }
            else
                state = "success";
         
            
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
          state ="error";
    });
  return {
           0:state,
           1:result
         };
}

exports.getJsonTrainName = function (train_no){
    var state="";
    var result="";
    var url =baseUrl +'/name_number/train/'+train_no+'/apikey/'+ apikey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.stringify(body);
            //console.log(stringResult);
            var index=0;
            var index2=0
            var train_numbers=[];
            var train_string="";
            var index=stringResult.indexOf("name")
            var index1=stringResult.indexOf("}",index)
            var name =stringResult.substring(index+10,index1-8);
            result=name;
            if(stringResult.indexOf("error") > -1) {
                 state = "error";
                }
            else
                 state = "success";

        });
    }).on('error', function (e) {
        state = "error";
    });
  return {
           0:state,
           1:result
         };
}  







*/

function numberToName(train_no){
    var state="";
    var result="";
    var url =baseUrl +'/name_number/train/'+train_no+'/apikey/'+ apikey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.stringify(body);
            //console.log(stringResult);
            var index=0;
            var index2=0
            var train_numbers=[];
            var train_string="";
            var index=stringResult.indexOf("name")
            var index1=stringResult.indexOf("}",index)
            var name =stringResult.substring(index+10,index1-8);
            result=name;
            if(stringResult.indexOf("error") > -1) {
                 state = "error";
                }
            else
                 state = "success";

        });
    }).on('error', function (e) {
        state = "error";
    });
  return result;
}


