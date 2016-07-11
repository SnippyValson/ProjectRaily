
var handle1=require('./functions/handleTrainStatusRequest');

module.exports = function(Raily) {
  
Raily.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Raily onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Raily.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Raily onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handle1.handleTrainStatusRequest("GetTrainDetailsIntent",session,response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Raily.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Raily onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

};
