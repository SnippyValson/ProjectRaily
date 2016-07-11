var http = require('http');


/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var config = require('../../configs');

function getJsonLiveStatus(tain_no,doj, eventCallback){
    var url =baseUrl +'/live/train/'+train_no+'/doj/'+doj+'/apikey/'+ apikey+'/';
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

function getJsonTrainRoute(train_no, eventCallback){
    var url =baseUrl +'/route/train/'+train_no+'/apikey/'+ apikey+'/';
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

function getJsonSeatAvailability(train_no, source, dest, date, class, quota, eventCallback){
    var url =baseUrl +'/check_seat/train/'+train_no+'/source/'+ source +'/dest/'+dest+'/date/'+ date+'/class/'+class+'/quota/'+quota+'/apikey/'+ apikey+'/';
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
  

