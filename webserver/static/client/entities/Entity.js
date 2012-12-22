var Entity = function(asset,x,y,dir,id,name) {
	/* Whether or not this entity is dead. */
	this.dead = false;

	/* Direction the Entity is facing*/
	this.dir = dir;

	/* id used for server/client communication */
	this.id = id;

	/* Visible name */
	this.name = name;

	/* Tile-based position */
	this.x = x;
	this.y = y;

	/* A container for this Entity's sprite, and it's text elements */
	this.asset = new createjs.Container();
	this.asset.x = this.x*TILE_SIZE;
	this.asset.y = this.y*TILE_SIZE;

	/* A textfield for this Entity's name */
	var nameTextField = new createjs.Text(name);
	nameTextField.textAlign = "center";
	nameTextField.color = "#FFFFFF";
	nameTextField.x = 17;
	nameTextField.y = 30;
	this.asset.addChild(nameTextField);

	/* The bitmap representing this Entity's sprite */
	this.bitmap = new createjs.Bitmap(ASSET_PLAYER);

	/* Set sprite to the first frame */
	this.bitmap.sourceRect = {x: 0, y: 0, width: TILE_SIZE, height: TILE_SIZE};

	/* add everything */
	this.asset.addChild(this.bitmap);
	this.asset.addChild(nameTextField);
	objectLayer.addChild(this.asset);
}

Entity.prototype = {
	updateVisualPosition: function() {
		if (!this.bitmap) {
			return;
		}
		this.asset.x = this.x*TILE_SIZE;
		this.asset.y = this.y*TILE_SIZE;
		this.bitmap.sourceRect = {x: this.direction*TILE_SIZE, y:0, width: TILE_SIZE, height:TILE_SIZE};

		if (this.dead===true) {
			this.bitmap.sourceRect = {x: TILE_SIZE*4, y:0, width: TILE_SIZE, height:TILE_SIZE};
		}
	},
	destroy: function() {
		objectLayer.removeChild(this.asset);
	},
	move: function(dir,x,y) {
		console.log("MOVE");
		if (x == -1 && y == -1) {
			for (var i = 0; i < players.length; i++) {
				if (players[i] === this) {
					players[i].destroy();
					players.splice(i,1);
					return;
				}
			}
		}
		this.x = x;
		this.y = y;
		this.direction = dir;
		this.updateVisualPosition();
	},
	die: function() {
		this.dead = true;
		this.bitmap.sourceRect = {x: TILE_SIZE*4, y:0, width: TILE_SIZE, height:TILE_SIZE};
		this.updateVisualPosition();
	}
}