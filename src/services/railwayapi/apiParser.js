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
exports.getJsonLiveStatus= function (train_no,doj,eventCallback){


     var train_name="Hi";
     numberToName(train_no,function(events){ train_name=events});

    var url =config.getBaseUrl()+"live/train/"+train_no+"/doj/"+doj+"/apikey/"+apiKey+"/";
    var state="";
    var status= "";
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            var status="<p>The status of the train "+train_name+"</p> "+ stringResult.position;
            eventCallback(status);

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        status= "Sorry, we could not process your request.";
        eventCallback(status);
    });
   return status;
}



/**
 * This function will return the stations in a route as a string.
 * Sample output : KANYAKUMARI,Source,14:10,1,  NAGARCOIL JN,14:30,14:35,1,  KULITTHURAI,15:14,15:15,1,  TRIVANDRUM CNTL,15:55,16:00,1,  KOLLAM JN,17:00,17:05,1,  KAYANKULAM,17:34,17:36,1 (Station     **name,Arriavl time,Departure time,Day of arrival.) 
 
ecports.function getJsonTrainRoute(train_no,eventCallback){

    var url =config.getBaseUrl()+'route/train/'+train_no+'/apikey/'+ apikey+'/';
       var station_string="";
    var state = "";
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            //console.log(stringResult);
            
            var station_names=[];
            var station_arrival=[];
            var station_dep=[];
            var day=[];
            for (var i=0; i<stringResult["route"].length; i++){
                station_names[i]=stringResult["route"][i].fullname;
                station_arrival[i]=stringResult["route"][i].scharr;
                station_dep[i]=stringResult["route"][i].schdep;
                day[i]=stringResult["route"][i].day;
                }
             var m=0;
            for (var j=0; j<i; j++){
               m=j+1;
               station_string = station_string + "Route "+m+ '.';
               station_string=station_string+station_names[i]+","+station_arrival[i]+","+station_dep[i]+","+day[i] +".  ";

               }
            //console.log(station_string);
            eventCallback(station_string);
              
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        status= "Sorry, we could not process your request.";
        eventCallback(station_string);
    });
   return station_string;
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

exports.function getJsonPNRstatus(pnr_no, eventCallback){
    //var state="";
    var result="";
      var train_name="Hi";
     var url =config.getBaseUrl() +'pnr_status/pnr/'+pnr_no+'/apikey/'+ apikey+'/';
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
            var stringResult = JSON.parse(body);
           
            train_no= stringResult.train_no;
            numberToName(train_no,function(events){ train_name=events});
            doj= stringResult.doj;
            Class= stringResult.class;
            chart_prepared= stringResult.chart_prepared; 
            total_passengers= stringResult.total_passengers; 
            result= result+ train_name+", Starting date is "+doj+", Class is "+Class+", Chart prepared "+chart_prepared+", Total number of passengers "+total_passengers+". Details of each passengers.";
            for (var i=0; i<stringResult["passengers"].length; i++){
               //result = result + "passenger "+i+ '\n';
               booking_status[i]=stringResult["passengers"][i].booking_status;
               current_status[i]=stringResult["passengers"][i].current_status;
               coach_position[i]=stringResult["passengers"][i].coach_position;
                                  
              } 
             var m=0;
            for (var j=0; j<i; j++){
               m=j+1;
               result = result + "passenger "+m+ '.';
               result=result+" Booking status "+booking_status[j]+", Current status "+current_status[j]+", Coach position "+coach_position[j]+".";
               }
            //console.log(result);
            eventCallback(result);             
              
            
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
         result = "sorry, we could not process your request.";
    });
  return result;
}

exports.function getJsonTrainArrivals(station_code,hrs, eventCallback){
    //var state="";
    var result="";
     var train_name=[];
    var url =config.getBaseUrl() +'arrivals/station/'+station_code+'/hours/'+hrs+'/apikey/'+ apikey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
           var train_no=[];
            var actdep=[];
            var delaydep=[];
            var scharr=[];
            var delayarr=[];
            var schdep =[];
            var stringResult = JSON.parse(body);
             for (var i=0; i<stringResult["train"].length; i++){
                train_no[i]=stringResult["train"][i].number;
                numberToName(train_no[i],function(events){ train_name[i]=events});
                scharr[i]=stringResult["train"][i].scharr;
                delayarr[i]=stringResult["train"][i].delayarr;
                schdep[i]=stringResult["train"][i].schdep;
                actdep[i]=stringResult["train"][i].actdep;
                delaydep[i]=stringResult["train"][i].delaydep;

              }
             var m=0;
            for (var j=0; j<i; j++){
               m=j+1;
               result = result + "Train "+m+ '.';
               result=result+train_name[j]+", Scheduled arrival "+scharr[j]+", Delayed arrival "+delayarr[j]+", Scheduled departure "+schdep[j]+", actual departure "+actdep[j]+", delayed departure "+delaydep[j]+".";

               }
            //console.log(result);
            eventCallback(result);

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
         result = "sorry, we could not process your request.";
    });
  return result;
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

function numberToName(train_no,eventCallback){
    var baseURL="http://api.railwayapi.com";
    var apiKey="bkxel1825";
    var state="";
    var result="";
    var url =baseURL +'/name_number/train/'+train_no+'/apikey/'+ apiKey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            eventCallback(stringResult.train.name);

        });
    }).on('error', function (e) {
        state = "error";
    });
}



