var DELIMITER = "%";
var ENDPOINT = "127.0.0.1";
var Connection = new WebSocket('ws://'+ENDPOINT+':8080', ['soap', 'xmpp']);
var playerId = "";
var connected = false;
// When the connection is open, send some data to the server
Connection.onopen = function () {
  //initConnection();
};

Connection.onclose = function() {
	showModalMessage("You've been disconnected. The server either crashed, is down, or you timed out due to inactivity. Sorry."); 
}

// Log errors
Connection.onerror = function (error) {
	showModalMessage("You've been disconnected. The server either crashed, is down, or you timed out due to inactivity. Sorry."); 
};

// Log messages from the server
Connection.onmessage = function (e) {
	if (e.data==="ok") {
		startGame();
	} else {
		params = e.data.split(DELIMITER);
		if (params[0] === "M") {
			if (!muted) {
				soundMove.play();
			}
			if (doesPlayerExist(params[1]) === false) {
				p = createPlayer(params[1],params[2],params[3],params[4]);
				if (params[5] === "true") {
					p.die();
				}
			} else {
				player = getPlayerById(params[1]);
				player.move(params[2],params[3],params[4]);
			}
		} else if (params[0] === "Q") {
			deletePlayer(params[1]);
		} else if (params[0] === "A") {
			// is this the right level for this arrow?
			if (params[5] === levelPath) {
				if (!muted) {
					soundShoot.play();
				}
				if (doesArrowExist(params[1]) === false) {
					createArrow(params[1],params[2],parseInt(params[3]),parseInt(params[4]),params[5]);
				} else {
					arrow = getArrowById(params[1]);
					arrow.move(params[2],parseInt(params[3]),parseInt(params[4]));
				}
			}
		} else if (params[0] === "D") {
			if (!muted) {
				soundDie.play();
			}
			killPlayer(params[1]);
			if (params[1] === id) {
				dead = true;
			}
		} else if (params[0] === "C") {
			player = getPlayerById(params[1]);
			if (player===null) {
				return;
			}
			player.chat(params[2]);
		} else if (params[0] === "B") {
			$(".blackout").show();
			alert("You are banned.");
		} else if (params[0] === "E") {
			loadLevel(params[1]);
		} else if (params[0] === "S") {
			triggerAdminMessage(params[1]);
		} else if (params[0] === "P") {
			if (princess == null) {
				princess = new Princess(params[1],params[2],params[3]);
			} else {
				princess.move(params[1],params[2],params[3]);
			}
		} else if (params[0] === "W") {
			if (params[1] === id) {
				//Congrats you're winning.
			}

			if (params[1]==="_null") {
				if (!muted) {
					soundRound.play();
				}
				princessName = "Princess";
			} else {
				if (!muted) {
					soundPrincess.play();
				}
				princessName = params[1] + "'s Princess";
			}

			if (princess!=null) {
				princess.setName(princessName);
			}
		} else if (params[0] === "R") {
			$(".leaderBoard").html(params[1]);
		}
	}
};
function startGame() {
	connected = true;
}
//CHAT
function sendChatMessage() {
	Connection.send("C" + DELIMITER + $("#chatBox").val());
	$("#chatBox").val("");
}

function sendChat(value) {
	Connection.send("C" + DELIMITER + value);
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

$("#chatBox").keyup(function(event){
    if(event.keyCode == 13){
        $("#chatButton").click();
    }
});

$("#username").keyup(function(event){
    if(event.keyCode == 13){
        $("#loginButton").click();
    }
});

function sendMoveUpdate(direction) {
	Connection.send("M" + DELIMITER + direction);
}

function sendShootArrow() {
	Connection.send("A");
}
function connect() {
	if ($("#username").val().length < 1) {
		alert("You gotta enter a name, bub.")
	} else if ($("#username").val().length > 24) {
		alert("Username too long. Please try again");
	} else if( /[^a-zA-Z0-9]/.test( $("#username").val() ) ) {
		alert("Only letters and numbers are allowed. Please try again");
	} else {
		hideModal();
		$(".modalContainer").hide();
		$(".login").hide();
		login($("#username").val());
	}
}
function login(username) {
	if (username===undefined) {
		return;
	}

	$("#canvas").focus();

	id = username;

	Connection.send("L" + DELIMITER + username);
}

