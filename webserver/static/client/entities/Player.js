var Player = function(id,name,dir,x,y) {
	Entity.call(this,ASSET_PLAYER,x,y,dir,id,id);

	this.chatField = new createjs.Text()

	this.chatField.textAlign = "center"
	this.chatField.x = 15;
	this.chatField.color = "#FFFFFF"
	this.chatField.y = -14;
	this.asset.addChild(this.chatField);

	this.timeoutId = undefined;
}

extend(Entity,Player, {
	chat: function(text) {
		if (this.timeoutId!==undefined) {
			clearTimeout(this.timeoutId);
		}
		this.chatField.text = text;
		this.timeoutId = setTimeout(function() {
			this.chatField.text = "";
			this.timeoutId = undefined;
		}, 8000);
	}
});