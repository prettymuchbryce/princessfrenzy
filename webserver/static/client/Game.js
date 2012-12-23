//Constants should always be declared at the top of a file. Not within the code.

//Game Constants
var DIRECTION_UP = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_DOWN = 2;
var DIRECTION_LEFT = 3;
var TILE_SIZE = 32;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 448;
var MAP_HEIGHT = CANVAS_HEIGHT/TILE_SIZE;
var MAP_WIDTH = CANVAS_WIDTH/TILE_SIZE;
var TILE_SHEET_WIDTH = 16;
var TILE_SHEET_HEIGHT = 16;

//HTML5, and Framework globals.
var stage;
var canvas;
var canvasBg;
var contextBg;
var tileLayer = new createjs.Container();
var objectLayer = new createjs.Container();

var muted = true;
var id;
var dead = false;
var arrows = [];
var players = [];
var explosions = [];
var server_texts = [];
var princess = null;
var requestParams = [];
var levelPath = "";

$(document).ready(function() {
	canvas = document.getElementById("canvas");
	canvasBg = document.getElementById("canvasBg");
	contextBg = canvasBg.getContext("2d");
	stage = new createjs.Stage(canvas);
	
	// To change where assets are loaded from, change ASSET_URL here
	// ASSET_URL = "http://place/";
	initAssets(ASSET_URL);
	
	stage.addChild(tileLayer);
	stage.addChild(objectLayer);

	createjs.Ticker.setFPS(60);

	setTimeout(function() {
		$(".modalContainer").css("display","block");
	},400);
});
function startRender() {
	createjs.Ticker.addListener(onTick);
}
function stopRender() {
	createjs.Ticker.removeListener(onTick);
}

function loadLevel(path) {
	// change the current level
	levelPath = path;
	stopRender();
	$.ajax({
	  url: ASSET_URL + "levels/"+path+"?r="+(new Date()).getTime(),
	  crossDomain: true,
	  dataType: 'json'
	}).done(function(payload) {
	  destroyArrows();
	  parseLayers(payload.layers);
	  startRender();
	});
}

function destroyArrows() {
	for(var i = 0; i < arrows.length; i++) {
		arrows[i].destroy();
	}
	
	arrows.length = 0;
}

function getTileById(id) {
	y = Math.floor(id/TILE_SHEET_WIDTH);
	x = id - 1 - TILE_SHEET_WIDTH*y;
	return {x: x, y: y};
}

function parseLayers(layers) {
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		if (layer.name === "collision" || layer.name === "playercollision") {
			continue;
		}
		if (layer.type !== "tilelayer") {
			continue;
		}
		var x = 0;
		var y = 0;
		for (var j = 0; j < layer.data.length; j++) {
			var point = getTileById(layer.data[j]);
			if (point.x >= 0 && point.y >= 0) {
				contextBg.drawImage(ASSET_TILES,point.x*TILE_SIZE, point.y*TILE_SIZE,TILE_SIZE,TILE_SIZE,x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
			}
			x++;
			if (x === MAP_WIDTH) {
				x = 0;
				y++;
			}
		}
	}
}

function getPlayerById(id) {
	for (var i = 0; i < players.length; i++) {
		if (players[i].id === id) {
			return players[i];
		}
	}
	return null;
}

function getArrowById(id) {
	for (var i =0; i < arrows.length; i++) {
		if (arrows[i].id === id) {
			return arrows[i];
		}
	}
	return null;
}

function doesPlayerExist(id) {
	for (var i = 0; i < players.length; i++) {
		if (players[i].id === id) {
			return true;
		}
	}
	return false;
}

function doesArrowExist(id) {
	for (var i = 0; i < arrows.length; i++) {
		if (arrows[i].id === id) {
			return true;
		}
	}
	return false;	
}

function deletePlayer(id) {
	for (var i =0; i < players.length; i++) {
		if (players[i].id === id) {
			players[i].destroy();
			players.splice(i,1);
		}
	}
}

function killPlayer(d) {
	for (var i = 0; i < players.length; i++) {
		if (players[i].id === d) {
			explosion = new Explosion(players[i].x,players[i].y);
			players[i].die();
		}
	}
}

function createPlayer(id,name, dir, x,y) {
	p = new Player(id,name,dir,x,y);
	players.push(p);
	return p;
}

function createArrow(id,dir,x,y,level) {
	a = new Arrow(id,dir,x,y,level);
	arrows.push(a);
}

var moveCounter = 0;
var moveTime = 5;
var arrowCounter = 0;
var arrowTime = 35;
function onTick() {
	stage.update();
	if (!connected) {
		return;
	}
	if (dead === true) {
		return;
	}
	
	// We dont want to overflow these, so lets stop once they reach the limit
	if(moveCounter <= moveTime)
		moveCounter++;
	if(arrowCounter <= arrowTime)
		arrowCounter++;
		
	if (moveCounter > moveTime) {
		if (Keyboard.isKeyDown(Keyboard.DOWN)) {
			sendMoveUpdate(DIRECTION_DOWN);
			moveCounter = 0;
		} else if (Keyboard.isKeyDown(Keyboard.RIGHT)) {
			sendMoveUpdate(DIRECTION_RIGHT);
			moveCounter = 0;
		} else if (Keyboard.isKeyDown(Keyboard.UP)) {
			sendMoveUpdate(DIRECTION_UP);
			moveCounter = 0;
		} else if (Keyboard.isKeyDown(Keyboard.LEFT)) {
			sendMoveUpdate(DIRECTION_LEFT);
			moveCounter = 0;
		}
	}
	
	if (arrowCounter > arrowTime) {
		if (Keyboard.isKeyDown(Keyboard.A)) {
			sendShootArrow();
			arrowCounter = 0;
		} 
	}
}