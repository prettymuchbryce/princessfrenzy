var DIRECTION_UP = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_DOWN = 2;
var DIRECTION_LEFT = 3;
var TILE_SIZE = 32;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 640;
var MAP_HEIGHT = CANVAS_HEIGHT/TILE_SIZE;
var MAP_WIDTH = CANVAS_WIDTH/TILE_SIZE;
var TILE_SHEET_WIDTH = 16;
var TILE_SHEET_HEIGHT = 16;
var stage;
var canvas;
var arrows = [];
var players = [];
var explosions = [];
var id;
var tiles = [];
var dead = false;
var tileLayer = new createjs.Container();
var objectLayer = new createjs.Container();
var server_texts = [];
var princess = null;
var princessName = "Princess";
var muted = false;

$(document).ready(function() {
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	
	stage.addChild(tileLayer);
	stage.addChild(objectLayer);

	createjs.Ticker.setFPS(60);

	setTimeout(function() {
		if (!muted) {
			soundIntro.play();
		}
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
	stopRender();
	$.ajax({
	  url: "levels/"+path+"?r="+(new Date()).getTime()
	}).done(function(payload) { 
	  destroyArrows();
	  destroyTileMap();
	  parseLayers(payload.layers);
	  startRender();
	});
}

function destroyArrows() {
	for(var i = 0; i < arrows.length; i++) {
		arrows[i].destroy();
		arrows.splice(i,1);
	}
}

function getTileById(id) {
	y = Math.floor(id/TILE_SHEET_WIDTH);
	x = id - 1 - TILE_SHEET_WIDTH*y;
	return {x: x, y: y};
}

//Tile animation
setInterval(function() {
	if (tiles === null) {
		return;
	}
	for (var i = 0; i < tiles.length; i++) {
		if (tiles[i] === null) {
			continue;
		}
		if (tiles[i].sourceRect.x/TILE_SIZE === 4 && tiles[i].sourceRect.y/TILE_SIZE === 8) {
			tiles[i].sourceRect = {x:4*TILE_SIZE, y:7*TILE_SIZE, width: TILE_SIZE, height:TILE_SIZE};
		} else if (tiles[i].sourceRect.x === 4*TILE_SIZE && tiles[i].sourceRect.y === 7*TILE_SIZE) {
			tiles[i].sourceRect = {x:4*TILE_SIZE, y:8*TILE_SIZE, width: TILE_SIZE, height:TILE_SIZE};
		}
	}
}, 1000);

function parseLayers(layers) {
	console.log("parse");
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		if (layer.name === "collision") {
			continue;
		}
		if (layer.type !== "tilelayer") {
			continue;
		}
		var x = 0;
		var y = 0;
		for (var j = 0; j < layer.data.length; j++) {
			var bitmap = new createjs.Bitmap(ASSET_TILES);
			var point = getTileById(layer.data[j]);
			bitmap.sourceRect = {x:point.x*TILE_SIZE, y:point.y*TILE_SIZE, width: TILE_SIZE, height:TILE_SIZE};
			bitmap.x = x*TILE_SIZE;
			bitmap.y = y*TILE_SIZE;
			tiles.push(bitmap);
			tileLayer.addChild(bitmap);
			x++;
			if (x === MAP_WIDTH) {
				x = 0;
				y++;
			}
		}
	}
}

function destroyTileMap() {
	for (var i = 0; i < tiles.length; i++) {
		tileLayer.removeChild(tiles[i]);
		tiles.splice(i,1);
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

function createPlayer(id,dir, x,y) {
	p = new Player(id,dir,x,y);
	players.push(p);
	return p;
}

function createArrow(id,dir,x,y) {
	a = new Arrow(id,dir,x,y);
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
	moveCounter++;
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