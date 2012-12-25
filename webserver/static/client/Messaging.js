// This class is used for nothing more than handling messages.
// It doesn't care about state. It just knows what to do when it gets a message.
// Do you get the message ?
var Messaging = {};

Messaging.DELIMITER = "%";
Messaging.LOGIN = "L";
Messaging.LEVEL = "E";
Messaging.BANNED = "B";
Messaging.CHAT = "C";
Messaging.QUIT = "Q";
Messaging.DIE = "D";
Messaging.MOVE = "M";
Messaging.BULLET = "A";
Messaging.ACCEPT_LOGIN = "K";
Messaging.SERVER_MESSAGE = "S";
Messaging.NPC_MOVE = "N";

Messaging.handleAcceptLoginMessage = function(id) {
  selfId = String(id);
  startGame();
}

Messaging.handleMoveMessage = function(id,name,dir,x,y,dead) {
  x = parseInt(x);
  y = parseInt(y);
  dir = parseInt(dir);

  if (!muted) {
    soundMove.play();
  }
  if (doesEntityExist(id) === false) {
    p = createPlayer(id,name,dir,x,y);
    if (dead === "true") {
      p.die();
    }
  } else {
    player = getEntityById(id);
    if (x === -1 && y === -1) {
      //Server is telling us to destroy this entity.
      player.destroy();
    } else {
      player.move(dir,x,y);
    }
  }
}

Messaging.handleQuitMessage = function(id) {
  deleteEntity(id);
}

Messaging.handleNpcMoveMessage = function(id,name,asset,dir,x,y,dead) {
  x = parseInt(x);
  y = parseInt(y);
  dir = parseInt(dir);
  if (!muted) {
    soundMove.play();
  }
  if (doesEntityExist(id) === false) {
    npc = createNpc(id, name, ASSET_OLD_MAN, dir, x, y);
    if (dead === "true") {
      npc.die();
    }
  } else {
    npc = getEntityById(id);
    if (x === -1 && y === -1) {
      //Server is telling us to destroy this entity.
      npc.destroy();
    } else {
      npc.move(dir,x,y);
    }
  }
}

Messaging.handleServerMessageMessage = function(message) {
    triggerAdminMessage(message);
}

Messaging.handleBulletMessage = function(id,dir,x,y,file) {
  x = parseInt(x);
  y = parseInt(y);
  dir = parseInt(dir);
  
  // is this the right level for this bullet?
  if (file === levelPath) {
    if (!muted) {
      soundShoot.play();
    }
    if (doesEntityExist(id) === false) {
      createBullet(id,dir,x,y,file);
    } else {
      bullet = getEntityById(id);
      bullet.move(dir,x,y);
    }
  }
}

Messaging.handleLevelMessage = function(file) {
  loadLevel(file);
}

Messaging.handleDieMessage = function(id) {
  if (!muted) {
    soundDie.play();
  }
  killPlayer(id);
  if (id === getSelf().id) {
    dead = true;
  }
}

Messaging.handleBannedMessage = function() {
    $(".blackout").show();
    alert("You are banned.");
}

Messaging.handleChatMessage = function(sender,message) {
    player = getEntityById(sender);
    if (player===null) {
      return;
    }
    player.chat(message);
}