
function initAssets(prefix) {
	ASSET_ARROW = new Image();
	ASSET_ARROW.src = prefix + "assets/arrows.png";
	
	ASSET_PLAYER = new Image();
	ASSET_PLAYER.src = prefix + "assets/chars.png";
	
	ASSET_TILES = new Image();
	ASSET_TILES.src = prefix + "assets/tiles.png"
	
	ASSET_PRINCESS = new Image();
	ASSET_PRINCESS.src = prefix + "assets/princess.png"
	
	
	ASSET_EXPLOSION = new Image();
	ASSET_EXPLOSION.src = prefix + "assets/flames.png"
	
	soundIntro = new Audio(prefix + "assets/intro.wav"); // buffers automatically when created
	soundShoot = new Audio(prefix + "assets/shoot.wav"); // buffers automatically when created
	soundPrincess = new Audio(prefix + "assets/princess.wav"); // buffers automatically when created
	soundDie = new Audio(prefix + "assets/die.wav"); // buffers automatically when created
	soundMove = new Audio(prefix + "assets/move.wav");
	soundRound = new Audio(prefix + "assets/round.wav");
}