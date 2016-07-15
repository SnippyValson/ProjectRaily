'use strict';
var config = require('../../configs');

var http = require('http');


/**
 *The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */


var apiKey=config.getAPIKey();
var i=0,j=0;
/**
 * This function will return the train status as a string.
 * Sample output : Train departed from KARUKKUTTY(KUC) and late by 24 minutes.
 */
exports.getJsonLiveStatus= function (train_no,doj,eventCallback){

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
            var status=stringResult.position;
            if(stringResult.response_code!='200')
                    status="There was an error processing your request.";
            var result={speech:status,status:stringResult.position,heading:'Train Number: '+train_no};
            eventCallback(result);

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        status= "Sorry, we could not process your request.";
        
        var result={speech:status,status:status,heading:null};
        eventCallback(result);
    });
   return status;
}



/**
 * This function will return the stations in a route as a string.
 * Sample output : KANYAKUMARI,Source,14:10,1,  NAGARCOIL JN,14:30,14:35,1,  KULITTHURAI,15:14,15:15,1,  TRIVANDRUM CNTL,15:55,16:00,1,  KOLLAM JN,17:00,17:05,1,  KAYANKULAM,17:34,17:36,1 (Station     **name,Arriavl time,Departure time,Day of arrival.) 
 */
exports.getJsonTrainRoute=function (train_no,eventCallback){

    var url =config.getBaseUrl()+'route/train/'+train_no+'/apikey/'+ apiKey+'/';
       var station_string="";
    var state = "";
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            var station_names=[];
            var station_arrival=[];
            var station_dep=[];
            var day=[];
            for (i=0; i<stringResult.route.length; i++){
                station_names[i]=stringResult.route[i].fullname;
                station_arrival[i]=stringResult.route[i].scharr;
                station_dep[i]=stringResult.route[i].schdep;
                day[i]=stringResult.route[i].day;
                }
             var m=0;
             var update=Math.ceil(((stringResult.route.length-2)/5));
             var source_=station_names[0];
             var dest_=station_names[i-1];

             station_string=station_string+"The train starts from "+source_+" at "+station_dep[0]+" and arrives  "+dest_+" at "+station_arrival[i-1]+" on day "+day[i-1]+" passing through ";
            for (j=0; j<i-1; j=j+update){
               m=j+1;
              if((j+update)<(i-1))
                 station_string=station_string+station_names[j]+",";
                else
                 station_string=station_string+" and "+station_names[j]+".";
               }
               if(stringResult.response_code!='200')
                    station_string="There was an error processing your request.";
            var result={speech:station_string,status:station_string,heading:"Route of Train Number: "+train_no};
            eventCallback(result);
              
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        status= "Sorry, we could not process your request.";
        var result={speech:status,status:status,heading:null};
        eventCallback(result);
    });
}

/**
 * This function will return the seat availability as string.
 * Sample output : AVAILABLE 11  
 
*/
exports.getJsonSeatAvailability = function (train_no, source, dest, date, _class, quota,eventCallback){
    var url =config.getBaseUrl() +'/check_seat/train/'+train_no+'/source/'+ source +'/dest/'+dest+'/date/'+ date+'/class/'+_class+'/quota/'+quota+'/apikey/'+ apiKey+'/';
    var status = ""; 
      http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            var index3=0;
            var index4=0;
            var status=stringResult.availability[0].status;
            if(status.indexOf('AVAILABLE')>-1)
            {
                var index_=status.indexOf('AVAILABLE');
                var available=status.substring(index_+10);
            }
            status=available+" seats are available.";
            if(status.charAt(0)=='G'&&status.charAt(1)=='N'&&status.charAt(2)=='W')
               {
                 index3=status.indexOf("/WL");
                 index4=status.indexOf("\n",index3);
                 var waiting=status.substring(index3+3,index3+8);
                 var status=waiting+" seats are in waiting list."; 
                }
                if(stringResult.response_code!='200')
                    status="There was an error processing your request.";
             var result={speech:status,status:status,heading:"Seat availability of Train: "+train_no};
             eventCallback(result);       
        });
    }).on('error', function (e) {
             var result={speech:"Sorry, we could not process your request.",status:"Sorry, we could not process your request.",heading:null};
             eventCallback(result);
    });
}



/**
 * This function will return the train numbers of trains between stations as a string.
 * Sample output : 12617  16382  16346  19577  16334  
 
*/
exports.getJsonTrainBtw =function (source, dest, date, eventCallback){
         var day= date.substring(5,7);
         var mon= date.substring(8);
         date=day+"-"+mon;
         var url=config.getBaseUrl()+"between/source/"+source+"/dest/"+dest+"/date/"+date+"/apikey/"+apiKey+"/";
         var stat="";
         var train_string="";
        http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            var train_no=[];
            var src_departure_time=[];
            var dest_arrival_time=[];
            var days=[];
            var index=0;
            for(i=0; i<stringResult["train"].length; i++){
                days[i]="";
                train_no[i]=stringResult["train"][i].number;
                src_departure_time[i]=stringResult["train"][i].src_departure_time;
                dest_arrival_time[i]=stringResult["train"][i].dest_arrival_time;
                for  (j=0; j<stringResult["train"][i]["days"].length; j++){
                        if(stringResult["train"][i]["days"][j].runs==="Y")
                          { 
                            switch(j){
                               case 0: days[i]=days[i]+"monday, ";
                                       break;
                               case 1: days[i]=days[i]+"tuesday, ";
                                       break;
                               case 2: days[i]=days[i]+"wednesday, ";
                                       break;
                               case 3: days[i]=days[i]+"thursday, ";
                                       break;
                               case 4: days[i]=days[i]+"friday, ";
                                       break;
                               case 5: days[i]=days[i]+"saturday, ";
                                       break;
                               case 6: days[i]=days[i]+"sunday, ";
                                       break; 
                              }
                            }
                     }
              }
             stat= stat+ "Total "+i+" trains are between "+source+ " and "+dest+"";
             var m=0;
            for (j=0; j<i; j++){
               m=j+1;
               if(m<=3)
                 {
                  stat = stat + "Train "+m+ '.';
                   stat = stat+" Source departure time :"+src_departure_time[j]+", Destination arrival time "+dest_arrival_time[j]+", Days of run "+days[j]+".";
                   } 
               train_string = train_string + "Train "+m+ '\n';
               train_string =train_string+" Source departure time :"+src_departure_time[j]+"\n Destination arrival time "+dest_arrival_time[j]+"\n Days of run "+days[j]+"\n";

               }
                
               if(stringResult.response_code!='200'){
                    train_string="There was an error processing your request.";
                     stat=train	_string;
                   }
             stat=stat+ "For details of all other trains see the result card."
             var result={speech:stat,status:train_string,heading:"Trains running between "+source+" and "+dest};
             eventCallback(result);  
        
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        train_string = "sorry, we could not process your request.";
        var result={speech:train_string,status:train_string,heading:null};
        eventCallback(result); 
    });
}

exports.getJsonPNRstatus=function (pnr_no, eventCallback){
    var result="";
    var stat="";
      var train_name="Hi";
     var url =config.getBaseUrl() +'pnr_status/pnr/'+pnr_no+'/apikey/'+ apiKey+'/';
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
             var c="";
            train_no= stringResult.train_no;
            doj= stringResult.doj;
            Class= stringResult.class;
            chart_prepared= stringResult.chart_prepared; 
            total_passengers= stringResult.total_passengers; 
           result= result+"Starting date is "+doj+"\n Class is "+Class+"\n Chart prepared "+chart_prepared+"\n Total number of passengers "+total_passengers+"\n Details of each passengers\n";
           result= result+"Starting date is "+doj+". Class is "+Class+". Chart prepared "+chart_prepared+". Total number of passengers "+total_passengers+". Details of each passengers.";
           
            for ( i=0; i<stringResult["passengers"].length; i++){
               booking_status[i]=stringResult["passengers"][i].booking_status;
               current_status[i]=stringResult["passengers"][i].current_status;
               coach_position[i]=stringResult["passengers"][i].coach_position;
                                  
              } 
             var m=0;
            for (j=0; j<i; j++){
               m=j+1;
               result = result + "passenger "+m+ '\n';
               result=result+" Booking status "+booking_status[j]+"\n Current status "+current_status[j]+"\n Coach position "+coach_position[j]+"\n";
               if(current_status[j]==="CAN/MOD")
                  current_status[j]="cancelled or modified.";
              if(current_status[j]==="CNF/Confirmed")
                  { 
                    if(chart_prepared==="Y")
                      {
                        c=current_status[j];
                        current_status[j]= "confirmed, coach and berth position is "+ c+".";
                       }
                     else
                           current_status[j]="confirmed, Coach/Berth number will be available after chart preparation."; 
                  }
               stat=stat+" passenger "+m+", current status is "+current_status[j]+".";
               }

               stat=stat+" For further details see the result card.";
                if(stringResult.response_code=='410'){
                    result="PNR does not exist.";
                    stat=result;
                   }
            var result1={speech:stat,status:result,heading:"PNR status of: "+pnr_no};

            eventCallback(result1);          
              
            
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
         result = "sorry, we could not process your request.";
        var result1={speech:result,status:result,heading:null};
        eventCallback(result1); 
    });
}

exports.getJsonTrainArrivals=function (station_code,hrs, eventCallback){
    var result="";
    var url =config.getBaseUrl() +'arrivals/station/'+station_code+'/hours/'+hrs+'/apikey/'+ apiKey+'/';

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
             for (i=0; i<stringResult["train"].length; i++){
                train_no[i]=stringResult["train"][i].number;
                scharr[i]=stringResult["train"][i].scharr;
                delayarr[i]=stringResult["train"][i].delayarr;
                schdep[i]=stringResult["train"][i].schdep;
                actdep[i]=stringResult["train"][i].actdep;
                delaydep[i]=stringResult["train"][i].delaydep;

              }
             var m=0;
            for ( j=0; j<i; j++){
               m=j+1;
               result = result + "Train "+m+ '.';
               result=result+", Scheduled arrival "+scharr[j]+", Delayed arrival "+delayarr[j]+", Scheduled departure "+schdep[j]+", actual departure "+actdep[j]+", delayed departure "+delaydep[j]+".";

               }
               if(stringResult.response_code!='200')
                    result="There was an error processing your request.";
            var result1={speech:result,status:result,heading:"Train arrivals at station: "+station_code};
            eventCallback(result1);    

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
         result = "sorry, we could not process your request.";
         var result1={speech:result,status:result,heading:null};
         eventCallback(result1);    
    });
}


/*exports.getJsonTrainName = function (train_no){
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
}  

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
*/




