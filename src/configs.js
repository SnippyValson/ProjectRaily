
'use strict';

//var APP_ID = 'amzn1.echo-sdk-ams.app.32454c52-92db-4707-82b5-8239b8ac38ca'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";


var BASE_URL="http://api.railwayapi.com/";
var trains=[
	{
	"name":"SOLAPUR MIRAJ SPECIAL",
	"id":"1413",
	"from":"SOLAPUR",
	"to":"MIRAJ"},
	{
	"name":"LUCKNOW RAJADHANI EXPRESS",
	"id":"12429",
	"from":"LUCKNOW",
	"to":"NEW DELHI"},
	{
	"name":"CHENNAI EXPRESS",
	"id":"12163",
	"from":"DADAR",
	"to":"CHENNAI"}

];
/**
 * Array containing API keys
 */
var API_KEYS = [
    "puzgi7810",
    "xtjxm1892",
    "adieg3070",
    "bkjjv3426",
    "euhuq6862",
    "mdtzh6188",
    "rmirh2881",
    "didgb6618"
    
    ];

    //exhausted today "bfzhr4575","bkxel1825"

exports.getBaseUrl=function(){
	return BASE_URL;
};
exports.getAPIKey=function(){
    var keyIndex = Math.floor(Math.random() * API_KEYS.length);
    var apiKey = API_KEYS[keyIndex];
	return apiKey;
};
exports.getTrains=function(){
	return trains;
};
exports.getAPPID=function(){
	return APP_ID;
};
