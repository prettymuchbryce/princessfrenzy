//Main Classes
var Arrow = function(id,direction,x,y,level) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.level = level;
	this.asset = new createjs.Bitmap(ASSET_ARROW);
	this.asset.sourceRect = {x: 0, y:0, width: TILE_SIZE, height:TILE_SIZE};
	stage.addChild(this.asset);
	this.asset.x = this.x*TILE_SIZE;
	this.asset.y = this.y*TILE_SIZE;
	
	this.updateVisualPosition = function() {
		//createjs.Tween.get(this.asset)
		//.to({x:this.x*TILE_SIZE}, 10, createjs.Ease.linear)
		//.to({y:this.y*TILE_SIZE}, 10, createjs.Ease.linear);
		this.asset.x = this.x*TILE_SIZE;
		this.asset.y = this.y*TILE_SIZE;
		this.asset.sourceRect = {x: this.direction*2*TILE_SIZE, y:0, width: TILE_SIZE, height:TILE_SIZE};
	}

	this.destroy = function() {
		stage.removeChild(this.asset);
	}

	this.move = function (dir,x,y) {
		if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x === MAP_WIDTH || y === MAP_HEIGHT) {
			for (var i = 0; i < arrows.length; i++) {
				if (arrows[i] === this) {
					arrows[i].destroy();
					arrows.splice(i,1);
					return;
				}
			}
		}
		this.x = x;
		this.y = y;
		this.direction = dir;
		this.updateVisualPosition();
	}
	this.update = function() {
		if (this.direction===DIRECTION_UP) {
			this.y-=1;
			this.updateVisualPosition();
		} else if (this.direction===DIRECTION_RIGHT) {
			this.x+=1;
			this.updateVisualPosition();
		} else if (this.direction===DIRECTION_DOWN) {
			this.y+=1;
			this.updateVisualPosition();
		} else if (this.direction===DIRECTION_LEFT) {
			this.x-=1;
			this.updateVisualPosition();
		}
	}

	this.updateVisualPosition();
}