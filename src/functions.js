/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewTrainRequest(intent, session, response) {
    // Get a random space fact from the space facts list
    var keyIndex = Math.floor(Math.random() * API_KEYS.length);
    var apiKey = API_KEYS[keyIndex];

    // Create speech output
    var speechOutput = "Here's your train details fact: " + "put details here";

    response.tellWithCard(speechOutput, "Raily- Indian Railways", speechOutput);
}