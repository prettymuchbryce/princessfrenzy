DEBUG = true

def send_move_message(game,ws,user)
  message = Game::MOVE + Game::DELIMITER + user.id + Game::DELIMITER + user.dir.to_s + Game::DELIMITER + user.x.to_s + Game::DELIMITER + user.y.to_s + Game::DELIMITER + user.dead.to_s
  ws.send message
  if DEBUG
    puts message
  end
end

def send_specific_move_message(game,ws,user,x,y)
  message = Game::MOVE + Game::DELIMITER + user.id + Game::DELIMITER + user.dir.to_s + Game::DELIMITER + x.to_s + Game::DELIMITER + y.to_s + Game::DELIMITER + user.dead.to_s
  ws.send message
  if DEBUG
    puts message
  end
end

def send_server_message_message(game,ws,message)
  message = Game::SERVER_MESSAGE + Game::DELIMITER + message
  ws.send message
  if DEBUG
    puts message
  end
end

def send_bullet_message(game,ws,arrow)
  message = Game::BULLET + Game::DELIMITER + arrow.id + Game::DELIMITER + arrow.dir.to_s + Game::DELIMITER + arrow.x.to_s + Game::DELIMITER + arrow.y.to_s + Game::DELIMITER + arrow.level.file
  ws.send message
  if DEBUG
    puts message
  end
end

def send_level_message(game,ws,file)
  message = Game::LEVEL + Game::DELIMITER + file
  ws.send message
  if DEBUG
    puts message
  end
end

def send_die_message(game,ws,user)
  message = Game::DIE + Game::DELIMITER + user.id
  ws.send message
  if DEBUG
    puts message
  end
end

def send_banned_message(game,ws)
  message = Game::BANNED
  ws.send message
  if DEBUG
    puts message
  end
end

def send_chat_message(game,ws,sender,message)
  message = Game::CHAT + Game::DELIMITER + sender + Game::DELIMITER + message.to_s
  ws.send message
  if DEBUG
    puts message
  end
end