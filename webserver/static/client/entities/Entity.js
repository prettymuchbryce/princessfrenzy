//Base entity class

var Entity = function(asset,x,y,dir,id,name) {
	/* Whether or not this entity is dead. */
	this.dead = false;

	/* Direction the Entity is facing*/
	this.dir = dir;

	/* id used for server/client communication */
	this.id = String(id);

	/* Class type */
	this.classType = CLASS_ENTITY;
	
	/* Visible name */
	this.name = name;

	/* Tile-based position */
	this.x = parseInt(x);
	this.y = parseInt(y);

	/* A container for this Entity's sprite, and it's text elements */
	this.asset = new createjs.Container();
	/* A textfield for this Entity's name */
	var nameTextField = new createjs.Text(name);
	nameTextField.textAlign = "center";
	nameTextField.color = "#FFFFFF";
	nameTextField.x = 17;
	nameTextField.y = 30;
	this.asset.addChild(nameTextField);

	/* The bitmap representing this Entity's sprite */
	this.bitmap = new createjs.Bitmap(asset);

	/* Set sprite to the first frame */
	this.bitmap.sourceRect = {x: this.dir*TILE_SIZE, y: 0, width: TILE_SIZE, height: TILE_SIZE};

	/* add everything */
	this.asset.addChild(this.bitmap);
	this.asset.addChild(nameTextField);
	objectLayer.addChild(this.asset);

	this.asset.x = this.x*TILE_SIZE;
	this.asset.y = this.y*TILE_SIZE;
}

Entity.prototype = {
	updateVisualPosition: function() {
		if (this.bitmap===undefined) {
			return;
		}
		this.asset.x = this.x*TILE_SIZE;
		this.asset.y = this.y*TILE_SIZE;
		this.bitmap.sourceRect = {x: this.dir*TILE_SIZE, y:0, width: TILE_SIZE, height:TILE_SIZE};

		if (this.dead===true) {
			this.bitmap.sourceRect = {x: TILE_SIZE*4, y:0, width: TILE_SIZE, height:TILE_SIZE};
		}
	},
	destroy: function() {
		objectLayer.removeChild(this.asset);
		for (var i =0; i < entities.length; i++) {
			if (entities[i] === this) {
				entities.splice(i,1);
			}
		}
	},
	move: function(dir,x,y) {
		if (this.x === x && this.y === y && this.dir === dir) {
			return;
		}
		if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
			return;
		}
		if (collision[y][x]===1) {
			return;
		}
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.updateVisualPosition();
	},
	die: function() {
		this.dead = true;
		this.bitmap.sourceRect = {x: TILE_SIZE*4, y:0, width: TILE_SIZE, height:TILE_SIZE};
		this.updateVisualPosition();
	}
}