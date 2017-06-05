var alexa = require('alexa-app');
var http = require('http');
var requests = require('request-promise');

const JARVIS_STG = "";
const headers =  { 'X-Test-Api-Key': ''};
var user_id = 'test_rb_alexa_0';

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app kohls
var app = new alexa.app('kohls');

// Launch kohls
app.launch(function(request, response) {
  console.log("Launching: " + request);
  response.say("Hi! I'm the Kohl's Info Messenger, but my friends call me Kim. I can help you find stores, deals, and track orders. If you have a kohls.com account, sign in to see what's in your Wallet. Don't feel like signing in, or don't have an account? No worries, I can still help. So, what can I do for you?");
});

// Product Search Intent
app.intent("ProductSearchIntent", function(request, response) {
	var request_body = {
           message: request.slot('item'),
           user: user_id
    }
    var request_obj  = { method: 'POST', json: true, headers: headers,
                             body: request_body, uri: JARVIS_STG};

    return requests(request_obj).then(function (rc) {
	    console.log(JSON.stringify(rc));
	    var speak_str = "";

	    //Loop through the replies
	    for(i = 0; i < rc.replies.length; i++) {
	    	//Check for display text
	    	if (rc.replies[i].text) {
	    		speak_str += rc.replies[i].text + " ";
	    	}
	    	//Check for cards
	    	if (rc.replies[i].attachment && rc.replies[i].attachment.payload.elements &&
	    		rc.replies[i].attachment.payload.elements[0].title && rc.replies[i].attachment.payload.elements[0].subtitle) {
	    		speak_str += rc.replies[i].attachment.payload.elements[0].title + " ";
	    		speak_str += rc.replies[i].attachment.payload.elements[0].subtitle + " ";
	    	}
	    	if (rc.replies[i].attachment && rc.replies[i].attachment.payload.text){	    		
				speak_str += rc.replies[i].attachment.payload.text + " ";	
	    	}
	    }
	    response.say(speak_str);
	    return response.send();
    });
});

module.exports = app;
