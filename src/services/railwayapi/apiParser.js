var http = require('http');


/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var config = require('../../configs');

function getJsonTrainBtw(source, dest, date, eventCallback){
    var url =baseUrl +'/between/source/'+ source +'/dest/'+dest+'/date/'+ date+'/apikey/'+ apikey+'/';
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
  

