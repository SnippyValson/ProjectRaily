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
		response.askSSML('<speak><audio src="https://s3.ap-south-1.amazonaws.com/railysamples/output2.mp3"/> Raily Here!</speak>');
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
