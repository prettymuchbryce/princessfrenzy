var Player = function(id,dir,x,y) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.dead = false;
	this.direction = dir;
	this.asset = new createjs.Container();

	var textField = new createjs.Text(id);
	var chatField = new createjs.Text()

	this.bitmap = new createjs.Bitmap(ASSET_PLAYER);
	this.bitmap.sourceRect = {x: 0, y: 0, width: TILE_SIZE, height: TILE_SIZE};
	this.asset.addChild(this.bitmap);

	objectLayer.addChild(this.asset);

	this.asset.x = this.x*TILE_SIZE;
	this.asset.y = this.y*TILE_SIZE;

	textField.textAlign = "center";
	textField.color = "#FFFFFF";
	textField.x = 17;
	textField.y = 30;
	this.asset.addChild(textField);

	chatField.textAlign = "center"
	chatField.x = 15;
	chatField.color = "#FFFFFF"
	chatField.y = -14;
	this.asset.addChild(chatField);


	var moveCounter = 0;
	var moveTime = 0;
	var arrowCounter = 0;
	var arrowTime = 5;
	var timeoutId = undefined;
	this.chat = function(text) {
		if (timeoutId!==undefined) {
			clearTimeout(timeoutId);
		}
		chatField.text = text;
		timeoutId = setTimeout(function() {
			chatField.text = "";
			timeoutId = undefined;
		}, 8000);
	}

	this.shootArrow = function(direction) {
		if (arrowCounter > arrowTime) {
			arrowCounter = 0;
		} else {
			return;
		}
		var arrowStartX = this.x;
		var arrowStartY = this.y;

		if (direction === DIRECTION_UP) {
			arrowStartY-=1;
		} else if (direction === DIRECTION_RIGHT) {
			arrowStartX+=1;
		} else if (direction === DIRECTION_DOWN) {
			arrowStartY+=1;
		} else if (direction === DIRECTION_LEFT) {
			arrowStartX-=1;
		}

		moveCounter = 0;
		var arrow = new Arrow(arrowStartX,arrowStartY,direction);
		arrows.push(arrow);
	}

	this.die = function() {
		this.dead = true;
		this.bitmap.sourceRect = {x: TILE_SIZE*4, y:0, width: TILE_SIZE, height:TILE_SIZE};

		var count = 0;
		var max = 20;
		var player = this;
		var i = setInterval(function() {
			count++;
			if (count >= max) {
				if (this.id === id) {
					dead = false;
				}
				player.dead = false;
				clearInterval(i);
				player.updateVisualPosition();
			}
		}, 1000);
	}

	this.update = function() {
		moveCounter++;
		arrowCounter++;
		for (var i = 0; i < arrows.length; i++) {
			if (arrows[i].x==this.x && arrows[i].y==this.y) {
				this.die();
			}
		}
	}

	this.destroy = function() {
		objectLayer.removeChild(this.asset);
	}

	this.move = function(dir,x,y) {
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
	}

	this.canMove = function() {
		if (this.dead) {
			return false;
		}

		if (moveCounter > moveTime) {
			moveCounter = 0;
			return true;
		} else {
			return false;
		}
	}

	this.moveLeft = function() {
		if (!this.canMove()) {
			return;
		}
		if (this.x > 0) {
			this.x--;
			this.direction = DIRECTION_LEFT;
			this.updateVisualPosition();
		}
	}

	this.moveRight = function() {
		if (!this.canMove()) {
			return;
		}
		if (this.x < MAP_WIDTH-1) {
			this.x++;
			this.direction = DIRECTION_RIGHT;
			this.updateVisualPosition();
		}
	}

	this.moveUp = function() {
		if (!this.canMove()) {
			return;
		}
		if (this.y > 0) {
			this.y--;
			this.direction = DIRECTION_UP;
			this.updateVisualPosition();
		}
	}

	this.moveDown = function() {
		if (!this.canMove()) {
			return;
		}
		if (this.y < MAP_HEIGHT-1) {
			this.y++;
			this.direction = DIRECTION_DOWN;
			this.updateVisualPosition();
		}
	}

	this.updateVisualPosition = function() {
		if (!this.bitmap) {
			return;
		}
		//createjs.Tween.get(this.asset)
		//.to({x:this.x*TILE_SIZE}, 40, createjs.Ease.linear)
		//.to({y:this.y*TILE_SIZE}, 40, createjs.Ease.linear);
		this.asset.x = this.x*TILE_SIZE;
		this.asset.y = this.y*TILE_SIZE;
		this.bitmap.sourceRect = {x: this.direction*TILE_SIZE, y:0, width: TILE_SIZE, height:TILE_SIZE};

		if (this.dead===true) {
			this.bitmap.sourceRect = {x: TILE_SIZE*4, y:0, width: TILE_SIZE, height:TILE_SIZE};
		}
	}

	this.updateVisualPosition();
}