# This module is used for nothing more than sending messages.
# It doesn't care about state. It just knows how to send particular messages. 
# Do you get the message ?
module Messaging
  DEBUG = true
  DELIMITER = "%"
  LOGIN = "L"
  LEVEL = "E"
  BANNED = "B"
  CHAT = "C"
  QUIT = "Q"
  DIE = "D"
  MOVE = "M"
  BULLET = "A"
  ACCEPT_LOGIN = "K"
  SERVER_MESSAGE = "S"
  NPC_MOVE = "N"
  def self.send_accept_login_message(game,ws,user)
    message = ACCEPT_LOGIN + DELIMITER + user.id
    ws.send message
    if DEBUG
      puts message
    end
  end
  def self.send_move_message(game,ws,user)
    message = MOVE + DELIMITER + user.id + DELIMITER + user.name + DELIMITER + user.dir.to_s + DELIMITER + user.x.to_s + DELIMITER + user.y.to_s + DELIMITER + user.dead.to_s
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_quit_message(game,ws,id)
    message = QUIT + DELIMITER + id
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_npc_move_message(game,ws,npc)
    message = NPC_MOVE + DELIMITER + npc.id + DELIMITER + npc.name + DELIMITER + npc.asset.to_s + DELIMITER + npc.dir.to_s + DELIMITER + npc.x.to_s + DELIMITER + npc.y.to_s + DELIMITER + npc.dead.to_s
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_specific_npc_move_message(game,ws,npc,x,y)
  message = NPC_MOVE + DELIMITER + npc.id + DELIMITER + npc.name + DELIMITER + npc.asset.to_s + DELIMITER + npc.dir.to_s + DELIMITER + x.to_s + DELIMITER + y.to_s + DELIMITER + npc.dead.to_s
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_specific_move_message(game,ws,user,x,y)
    message = MOVE + DELIMITER + user.id + DELIMITER + user.name + DELIMITER + user.dir.to_s + DELIMITER + x.to_s + DELIMITER + y.to_s + DELIMITER + user.dead.to_s
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_server_message_message(game,ws,message)
    message = SERVER_MESSAGE + DELIMITER + message
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_bullet_message(game,ws,bullet)
    message = BULLET + DELIMITER + bullet.id + DELIMITER + bullet.dir.to_s + DELIMITER + bullet.x.to_s + DELIMITER + bullet.y.to_s + DELIMITER + bullet.level.file
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_level_message(game,ws,file)
    message = LEVEL + DELIMITER + file
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_die_message(game,ws,user)
    message = DIE + DELIMITER + user.id
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_banned_message(game,ws)
    message = BANNED
    ws.send message
    if DEBUG
      puts message
    end
  end

  def self.send_chat_message(game,ws,sender,message)
    message = CHAT + DELIMITER + sender + DELIMITER + message.to_s
    ws.send message
    if DEBUG
      puts message
    end
  end
end