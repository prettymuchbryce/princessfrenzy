var Explosion = function(x,y) {
	this.x = x;
	this.y = y;

	var asset = new createjs.Container();
	var bitmap = new createjs.Bitmap(ASSET_EXPLOSION);
	bitmap.sourceRect = {x: 0, y:0, width: TILE_SIZE, height: TILE_SIZE};
	asset.addChild(bitmap);

	objectLayer.addChild(asset);

	asset.x = this.x*TILE_SIZE;
	asset.y = this.y*TILE_SIZE;

	setTimeout(function() {
		objectLayer.removeChild(asset);
	},200);
	
	setTimeout(function() {
		bitmap.sourceRect = {x: TILE_SIZE, y:0, width: TILE_SIZE, height: TILE_SIZE};
	},100);
}