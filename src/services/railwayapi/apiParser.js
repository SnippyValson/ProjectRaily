var http = require('http');


/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var apiKey="bfzhr4575";
var AlexaSkill = require('./AlexaSkill');
var config = require('../../configs');


/**
 * This function will return the train status as a string.
 * Sample output : Train departed from KARUKKUTTY(KUC) and late by 24 minutes.
 */
function getJsonLiveStatus(train_no,doj, eventCallback){
    var url =baseUrl+"/live/train/"+train_no+"/doj/"+doj+"/apikey/"+apiKey+"/";
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
            var index=stringResult.indexOf("position")
            var index1=stringResult.indexOf(".",index)
            var status =stringResult.substring(index+14,index1+1);
            eventCallback(status);

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}


/**
 * This function will return the stations in a route as a string.
 * Sample output : KANYAKUMARI,Source,14:10,1,  NAGARCOIL JN,14:30,14:35,1,  KULITTHURAI,15:14,15:15,1,  TRIVANDRUM CNTL,15:55,16:00,1,  KOLLAM JN,17:00,17:05,1,  KAYANKULAM,17:34,17:36,1 (Station     **name,Arriavl time,Departure time,Day of arrival.) 
 */
function getJsonTrainRoute(train_no, eventCallback){
    var url =baseUrl +'/route/train/'+train_no+'/apikey/'+ apikey+'/';
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
            var station_string="";
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
            eventCallBacbk(station_string);

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });

}

/**
 * This function will return the seat availability as string.
 * Sample output : AVAILABLE 11  
 */

function getJsonSeatAvailability(train_no, source, dest, date, class, quota, eventCallback){
    var url =baseUrl +'/check_seat/train/'+train_no+'/source/'+ source +'/dest/'+dest+'/date/'+ date+'/class/'+class+'/quota/'+quota+'/apikey/'+ apikey+'/';
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
            eventCallBack(status);
            

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}


function getJsonFare(train_no, source, dest, age, quota, doj, eventCallback){
    var url =baseUrl +'/fare/train/'+train_no+'/source/'+ source +'/dest/'+dest+'/age/'+ age+'/quota/'+quota+'/doj/'+doj+'/apikey/'+ apikey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = parseJson(body);
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}


/**
 * This function will return the train numbers of trains between stations as a string.
 * Sample output : 12617  16382  16346  19577  16334  
 */

function getJsonTrainBtw(source, dest, date, eventCallback){
        var url=baseUrl+"/between/source/"+source+"/dest/"+dest+"/date/"+date+"/apikey/"+apiKey+"/";

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
            eventCallback(train_string);

        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function getJsonPNRstatus(pnr_no, eventCallback){
    var url =baseUrl +'/pnr_status/pnr/'+pnr_no+'/apikey/'+ apikey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = parseJson(body);
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}
  

