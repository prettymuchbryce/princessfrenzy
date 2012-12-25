// Constants are declared at the top of the file,
// If you don't do it then you're in denial.

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
var CLASS_BULLET = "BULLET";
var CLASS_ENTITY = "ENTITY";
var CLASS_PLAYER = "PLAYER";

//HTML5, and Framework globals.
var stage;
var entities = [];
var canvas;
var canvasBg;
var contextBg;
var collision;
var tileLayer = new createjs.Container();
var objectLayer = new createjs.Container();
var requestParams = [];
var levelPath = "";
var muted = true;

//Client vars
var self = undefined;
var dead = false;

//Effects
var explosions = [];
var server_texts = [];

$(document).ready(function() {
	canvas = document.getElementById("canvas");
	canvasBg = document.getElementById("canvasBg");
	contextBg = canvasBg.getContext("2d");
	stage = new createjs.Stage(canvas);
	
	// To change where assets are loaded from, change ASSET_URL here
	// ASSET_URL = "http://place/";
	initAssets(ASSET_URL);

	//Initialize Collision Data
	collision = [];
	for (var y = 0; y < MAP_HEIGHT; y++) {
		collision.push([]);
	}
	
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
	  destroyBullets();
	  parseLayers(payload.layers);
	  parseCollision(payload.layers);
	  startRender();
	});
}

function destroyBullets() {
	for(var i = 0; i < entities.length; i++) {
		if (entities[i].classType === CLASS_BULLET) {
			entities[i].destroy();
		}
	}
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

function parseCollision(layers) {
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		if (layer.name !== "collision" && layer.name !== "playercollision") {
			continue;
		}
		var x = 0;
		var y = 0;
		for (var j = 0; j < layer.data.length; j++) {
			if (layer.data[j]!==0) {
				collision[y][x] = 1;
			} else {
				collision[y][x] = 0;
			}
			x++;
			if (x === MAP_WIDTH) {
				x = 0;
				y++;
			}
		}
	}
}

function getSelf() {
	if (self===undefined) {
		self = getEntityById(selfId);
	}
	return self;
}

function getEntityById(id) {
	for (var i = 0; i < entities.length; i++) {
		if (entities[i].id === String(id)) {
			return entities[i];
		}
	}
	return null;
}

function doesEntityExist(id) {
	for (var i = 0; i < entities.length; i++) {
		if (entities[i].id === String(id)) {
			return true;
		}
	}
	return false;
}

function createNpc(id,name,asset,dir,x,y) {
	npc = new Entity(asset,x,y,dir,id,name);
	entities.push(npc);
	return npc;
}

function createPlayer(id,name,dir,x,y) {
	player = new Player(id,name,dir,x,y);
	entities.push(player);
	return player;
}

function createBullet(id,dir,x,y,level) {
	bullet = new Bullet(id,dir,x,y,level);
	entities.push(bullet);
	return bullet;
}

function deleteEntity(id) {
	for (var i =0; i < entities.length; i++) {
		if (entities[i].id === id) {
			entities[i].destroy();
			entities.splice(i,1);
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
	
	// We dont want to overflow these, so lets stop once they reach the limit.
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