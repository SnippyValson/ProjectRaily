'use strict';


var registerEventHandlers = function (eventHandlers, skillContext) {
	  
	eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
	    console.log("Raily onSessionStarted requestId: " + sessionStartedRequest.requestId
	        + ", sessionId: " + session.sessionId);
	    skillContext.needMoreHelp = false;
	    // any initialization logic goes here
	};

	eventHandlers.onLaunch = function (launchRequest, session, response) {
	    console.log("Raily onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
	   	response.ask("Hi, welcome to Raily, helping you commute in Indian Railways.");
	};

	/**
	 * Overridden to show that a subclass can override this function to teardown session state.
	 */
	eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
	    console.log("Raily onSessionEnded requestId: " + sessionEndedRequest.requestId
	        + ", sessionId: " + session.sessionId);
	    // any cleanup logic goes here
	};

};

exports.register = registerEventHandlers;
