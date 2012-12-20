var Princess = function(x,y,dir) {
	this.x = x;
	this.y = y;
	this.asset = new createjs.Container();

	var textField = new createjs.Text(princessName);

	this.bitmap = new createjs.Bitmap(ASSET_PRINCESS);
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
	
	if(dir == DIRECTION_RIGHT)
		this.bitmap.sourceRect.x = 0;
	else
		this.bitmap.sourceRect.x = TILE_SIZE;

	this.move = function(x,y,dir) {
		this.x = x;
		this.y = y;
		this.asset.x = this.x*TILE_SIZE;
		this.asset.y = this.y*TILE_SIZE;
		if(dir == DIRECTION_RIGHT)
			this.bitmap.sourceRect.x = 0;
		else
			this.bitmap.sourceRect.x = TILE_SIZE;
		
		if (x == -1 && y == -1) {
			princess = null;
			objectLayer.removeChild(this.asset);
		}
	}
	this.setName = function(string) {
		textField.text = string;
	}
}