var Connection = new WebSocket('ws://'+ENDPOINT+':8080', ['soap', 'xmpp']);
var connected = false;
var selfId;

// Handle WebSocket Events
Connection.onopen = function() {};
Connection.onclose = function() {
	showModalMessage("You've been disconnected. The server either crashed, is down, or you timed out due to inactivity. Sorry."); 
}
Connection.onerror = function(error) {
	showModalMessage("You've been disconnected. The server either crashed, is down, or you timed out due to inactivity. Sorry."); 
};

// Handle incoming packets
Connection.onmessage = function(e) {
	params = e.data.split(Messaging.DELIMITER);
	if (params[0] === Messaging.ACCEPT_LOGIN) {
		Messaging.handleAcceptLoginMessage(params[1]);
	} else if (params[0] === Messaging.MOVE) {
		Messaging.handleMoveMessage(params[1], params[2], params[3], params[4], params[5], params[6]);
	} else if (params[0] === Messaging.QUIT) {
		Messaging.handleQuitMessage(params[1]);
	} else if (params[0] === Messaging.BULLET) {
		Messaging.handleBulletMessage(params[1],params[2],params[3],params[4],params[5]);
	} else if (params[0] === Messaging.DIE) {
		Messaging.handleDieMessage(params[1]);
	} else if (params[0] === Messaging.CHAT) {
		Messaging.handleChatMessage(params[1],params[2]);
	} else if (params[0] === Messaging.BANNED) {
		Messaging.handleBannedMessage();
	} else if (params[0] === Messaging.LEVEL) {
		Messaging.handleLevelMessage(params[1]);
	} else if (params[0] === Messaging.SERVER_MESSAGE) {
		Messaging.handleServerMessageMessage(params[1]);
	} else if (params[0] === Messaging.NPC_MOVE) {
		Messaging.handleNpcMoveMessage(params[1], params[2], params[3], params[4], params[5],params[6], params[7]);
	}
};

function startGame() {
	connected = true;
}

function sendChatMessage() {
	Connection.send("C" + Messaging.DELIMITER + $("#chatBox").val());
	$("#chatBox").val("");
}

function triggerAdminMessage(text) {
	var textField = new createjs.Text(text);
	textField.textAlign = "left";
	textField.color = "#00FF00";
	textField.width = CANVAS_WIDTH
	textField.font = "bold 20px ff-meta-serif-web-pro";
	textField.x = 5;
	textField.y = CANVAS_HEIGHT-30-server_texts.length*18;
	stage.addChild(textField);
	server_texts.push(textField);

	setTimeout(function() {
		stage.removeChild(server_texts[0]);
		server_texts.splice(0,1);
		for (var i =0; i < server_texts.length; i++) {
			server_texts[i].y = CANVAS_HEIGHT-30-i*18;
		}
	}, 8000);
}

function sendMoveUpdate(direction) {
	self = getSelf();

	if (direction === DIRECTION_UP) {
		self.move(DIRECTION_UP,self.x,self.y-1);
	} else if (direction === DIRECTION_LEFT) {
		self.move(DIRECTION_LEFT,self.x-1,self.y);
	} else if (direction === DIRECTION_DOWN) {
		self.move(DIRECTION_DOWN,self.x,1+self.y);
	} else if (direction === DIRECTION_RIGHT) {
		self.move(DIRECTION_RIGHT,self.x,self.y);
	}

	Connection.send("M" + Messaging.DELIMITER + direction);
}

function sendShootArrow() {
	Connection.send("A");
}

function connect() {
	hideModal();
	$(".modalContainer").hide();
	$(".login").hide();
	login($("#username").val(),"todo");
}

function login(username,password) {
	if (username===undefined) {
		return;
	}

	if (password===undefined) {
		return;
	}

	$("#canvas").focus();

	id = username;

	Connection.send(Messaging.LOGIN + Messaging.DELIMITER + username + Messaging.DELIMITER + password);
}