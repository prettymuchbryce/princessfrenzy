
function initAssets(prefix) {
	ASSET_ARROW = new Image();
	ASSET_ARROW.src = prefix + "assets/images/arrows.png";
	
	ASSET_PLAYER = new Image();
	ASSET_PLAYER.src = prefix + "assets/images/chars.png";
	
	ASSET_TILES = new Image();
	ASSET_TILES.src = prefix + "assets/images/tiles.png"
	
	ASSET_EXPLOSION = new Image();
	ASSET_EXPLOSION.src = prefix + "assets/images/flames.png"
	
	soundIntro = new Audio(prefix + "assets/audio/intro.wav"); // buffers automatically when created
	soundShoot = new Audio(prefix + "assets/audio/shoot.wav"); // buffers automatically when created
	soundDie = new Audio(prefix + "assets/audio/die.wav"); // buffers automatically when created
	soundMove = new Audio(prefix + "assets/audio/move.wav");
	soundRound = new Audio(prefix + "assets/raudio/ound.wav");
}