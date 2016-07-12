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



function getJsonTrainRoute(train_no, eventCallback){
    var url =baseUrl +'/route/train/'+train_no+'/apikey/'+ apikey+'/';
    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.stringify(body);
            eventCallback(stringResult);
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
  

