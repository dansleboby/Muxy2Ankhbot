var WebSocket = require('ws');
var tmi = require("tmi.js");
var config = require("./config.js");

console.log(config);
//Helper for logging
function addlog() {
	var date = new Date();
	var n = date.toDateString();
	var time = date.toLocaleTimeString();

	console.log("[" + n + ' ' + time + "] ", arguments);
}


//Init connexion to Twitch Chat
var client = new tmi.client({
    identity: {
        username: config.botname,
        password: config.oauth
    },
    channels: [config.channel]
});

//Connect to twitch chat
client.connect().then(function(data) {
   addlog(data);
   
   //Ping to test if all good!
   client.ping().then(function(data) {
	   addlog(data);
	   //client.say(config.channel, config.initStr);
	}).catch(function(err) {
		addlog(err);
	});
}).catch(function(err) {
    addlog(err);
});


addlog("Establishing connection to websocket server of muxys...");

//Function to connect to muxy WS
function connect() {
	var ws = new WebSocket(config.url);
	
	ws.on('message', function(message) {
		message = JSON.parse(message);
		addlog('Received: ' , message.type);
		if(message.type == 'donate') {
			client.say(config.channel, config.addPointsCmd.replace('USERNAME', message.viewer.name).replace('AMOUNT', message.extra.amount*config.multiplicator));
		}
	});

	ws.on('close', function(code) {
		addlog('Disconnected: ' + code);
		setTimeout(function() {
			  connect();
		}, 1000);
	});

	ws.on('error', function(error) {
		addlog('Error: ' + error.code);
		ws.close();
	});
}

connect();




