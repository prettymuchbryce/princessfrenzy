var Keyboard = {};
Keyboard.UP = 38;
Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.DOWN = 40;
Keyboard.W = 87;
Keyboard.A = 65;
Keyboard.S = 83;
Keyboard.D = 68;
Keyboard.keysDown = [];

Keyboard.isKeyDown = function(key) {
	return Keyboard.keysDown.indexOf(key)!==-1;
}

Keyboard.onKeyDown = function(event) {
	if (event.keyCode===9) {
		if ($("#chatBox").is(":focus")) {
			$("#chatBox").blur();
			canvas.tabIndex = 1;
		} else {
			$("#chatBox").focus();
		}
		event.preventDefault();
		return;
	}
	if ($("#chatBox").is(":focus")) {
		return;
	}
	if (!connected) {
		return;
	}
	if (event.keyCode===72) {
		showHelp();
	}
	if (!Keyboard.isKeyDown(event.keyCode)) {
		Keyboard.keysDown.push(event.keyCode);
	}
		event.preventDefault();
}

Keyboard.onKeyUp = function(event) {
	if (event.keyCode===9) {
		return;
	}
	if ($("#chatBox").is(":focus")) {
		return;
	}
	if (!connected) {
		return;
	}
	for (var i = 0; i < Keyboard.keysDown.length; i++) {
		if (Keyboard.keysDown[i] === event.keyCode) {
			Keyboard.keysDown.splice(i,1);
			return;
		}
	}
}

//Event Listeners
window.addEventListener('keydown',Keyboard.onKeyDown);
window.addEventListener('keyup',Keyboard.onKeyUp);