require 'eventmachine'
require 'em-websocket'
require 'net/http'
require 'json'
require_relative 'game.rb'
require_relative 'bullet.rb'
require_relative 'messaging.rb'
require_relative 'user.rb'
require_relative 'helpers.rb'

def add_user_to_level(x, y, game,user,level)
    Messaging.send_level_message(game, user.ws, level.file)

    user.x = x
    user.y = y

    level.users.each do |user_already_in_level|
      Messaging.send_move_message(game,user.ws,user_already_in_level) #Tell this person about all the players
    end

    level.npcs.each do |npc|
      Messaging.send_npc_move_message(game,user.ws,npc)
    end

    level.users.push(user)
    user.level = level

    level.users.each do |user_already_in_level|
      Messaging.send_move_message(game,user_already_in_level.ws,user) #Tell each player about this new person
    end

    level.bullets.each do |bullet|
      Messaging.send_bullet_message(game, user.ws, bullet)
    end
end

def remove_user_from_game(game,user)
  #Is this user the current winner?
  remove_user_from_level(game,user,user.level)
  game.users.delete(user)
end

def remove_user_from_level(game,user,level)
  user.x = -1
  user.y = -1
  
  #Tell all users that this guy is out of here..
  level.users.each do |user_already_in_level|
    Messaging.send_move_message(game,user_already_in_level.ws,user)
  end

  level.users.delete(user)

  level.npcs.each do |npc|
    Messaging.send_specific_npc_move_message(game,user.ws,npc,-1,-1)
  end

  #Tell this user to delete display objects of users in the level
   level.users.each do |user_already_in_level|
    Messaging.send_specific_move_message(game,user.ws,user_already_in_level,-1,-1)
  end
end

def handle_chat(user,ws,params,game)
  if user.id == nil || user == nil || params[1] == nil
    return
  end
  puts user.id.to_s + " : " + params[1]
  game.sockets.each do |ws|
    Messaging.send_chat_message(game,ws,user.id.to_s,params[1])
  end
end

def handle_login(ws,params,game)
  if params[1] == nil || params[1] == "" || params[2] == nil || params[2] == ""
    return
  end

  #Make sure that the equals sign and ampersand are not present in their username or session id
  if params[1].include?("=") || params[1].include?("&")
    return
  end

  user_name = params[1]
  password = params[2] #Not used yet
  port, ip = Socket.unpack_sockaddr_in(ws.get_peername)
  user = User.new(Helpers.get_id(game),user_name, ws, Game::DIRECTION_UP, 5, 5, false, ip)
  game.users.push(user)
  Messaging.send_accept_login_message(game,ws,user)
  point = game.levels[0].find_noncollidable_space()
  add_user_to_level(point["x"],point["y"],game,user,game.levels[0])
end

def handle_move(user,ws,params,game)
  if user==nil || user.dead
    return
  end
  
  if Time.now < user.next_move - Game::PLAYER_FUDGE_ACTION_TIME
    return
  end
  
  user.next_move = Time.now + Game::PLAYER_MOVE_TIME
  
  dir = user.dir
  x = user.x
  y = user.y
  
  # where do they want to go?
  user.dir = params[1].to_s
  
  if params[1].to_s == Game::DIRECTION_UP.to_s
    y -= 1
  elsif params[1].to_s == Game::DIRECTION_DOWN.to_s
    y += 1
  elsif params[1].to_s == Game::DIRECTION_LEFT.to_s
    x -= 1
  elsif params[1].to_s == Game::DIRECTION_RIGHT.to_s
    x += 1
  else
    # this is an invalid direction....
    user.dir = dir
  end

  user.level.warps.each do |warp|
    if warp.type == Warp::WARP_DOWN && y == Game::MAP_HEIGHT
        newX = user.x
        newY = 0
        remove_user_from_level(game,user,user.level)
        add_user_to_level(newX,newY,game,user,warp.level)
        return  
    elsif warp.type == Warp::WARP_UP && y == -1
        newX = user.x
        newY = Game::MAP_HEIGHT-1
        remove_user_from_level(game,user,user.level)
        add_user_to_level(newX,newY,game,user,warp.level)
        return  
    elsif warp.type == Warp::WARP_LEFT && x == -1
        newX = Game::MAP_WIDTH-1
        newY = user.y
        remove_user_from_level(game,user,user.level)
        add_user_to_level(newX,newY,game,user,warp.level)
        return  
    elsif warp.type == Warp::WARP_RIGHT && x == Game::MAP_WIDTH
        newX = 0
        newY = user.y
        remove_user_from_level(game,user,user.level)
        add_user_to_level(newX,newY,game,user,warp.level)
        return  
    end
  end
  
  # now lets make sure they can actually move there
  if x >= 0 && x < Game::MAP_WIDTH && y >= 0 && y < Game::MAP_HEIGHT && user.level.collision[y][x] == 0 && user.level.player_collision[y][x] == 0
    user.x = x
	  user.y = y
  end

  user.level.warps.each do |warp|
    if warp.type == Warp::WARP && warp.x == user.x && warp.y == user.y
        remove_user_from_level(game,user,user.level)
        add_user_to_level(game,user,warp.level)
    end
  end

  user.level.users.each do |user_in_level|
    Messaging.send_move_message(game,user_in_level.ws,user)
  end
end

def handle_bullet(user,ws,params,game)
  if user==nil || user.dead
    return
  end
  
  if Time.now < user.next_bullet - Game::PLAYER_FUDGE_ACTION_TIME
	return
  end
  
  user.next_bullet = Time.now + Game::PLAYER_BULLET_TIME

  #if user.level == game.levels[0][0]
  #  sendServerMessageMessage(game,ws,"You cannot fire bullets here.")
  #  return
  #end

  if user.dir.to_s == Game::DIRECTION_UP.to_s && user.level.collision[user.y-1][user.x] == 0
    x = user.x
    y = user.y-1
  elsif user.dir.to_s == Game::DIRECTION_DOWN.to_s && user.level.collision[user.y+1][user.x] == 0
    x = user.x
    y = user.y+1
  elsif user.dir.to_s == Game::DIRECTION_LEFT.to_s && user.level.collision[user.y][user.x-1] == 0
    x = user.x-1
    y = user.y
  elsif user.dir.to_s == Game::DIRECTION_RIGHT.to_s && user.level.collision[user.y][user.x+1] == 0
    x = user.x+1
    y = user.y
  else
    return
  end
  bullet = Bullet.new(Helpers.get_id(game), user.dir, x, y, user.level, user.id)
  game.bullets.push(bullet)

  bullet.level.users.each do |user|
    Messaging.send_bullet_message(game, user.ws, bullet)
  end
end

def parse_message(ws,msg,game)
  params = msg.split(Messaging::DELIMITER)
  puts params
	if msg[0] == Messaging::LOGIN
    handle_login(ws,params,game)
    return
  end

  user = Helpers.get_user_from_ws(game,ws)

  if user == nil
    return
  end

  if Helpers.is_user_banned?(game,user)
    Messaging.send_banned_message(game, ws)
    return
  end

  user.last_action = Time.now

	if msg[0] == Messaging::MOVE
    handle_move(user,ws,params,game)
  elsif msg[0] == Messaging::BULLET
    handle_bullet(user,ws,params,game)
  elsif msg[0] == Messaging::CHAT
    handle_chat(user,ws,params,game)
  end
end

game = Game.new

EventMachine.run {
    EM.add_periodic_timer(30) do
      #let server see list of users
      puts "Connected users:"
      game.users.each do |user|
        puts user.id + " " + user.ip
        if user.last_action + Game::TIMEOUT_SECONDS < Time.now
          user.ws.close_websocket
        end
      end
    end
    EM.add_periodic_timer(2) do
      game.levels.each do |level|
        level.npcs.each do |npc|
          npc.update()
          level.users.each do |user|
            Messaging.send_npc_move_message(game,user.ws,npc)
          end
        end
      end
    end
    EM.add_periodic_timer(0.05) do
      game.bullets.each do |bullet|

        game.users.each do |user|
          if bullet.level.collision[bullet.y][bullet.x] !=0
            bullet.x = -1
            bullet.y = -1
          end

          if bullet.owner != user.id && user.x == bullet.x && user.y == bullet.y && user.dead == false && bullet.level == user.level
            Messaging.send_server_message_message(game, user.ws, "You will be revived in 20 seconds.")
            user.dead = true
            game.sockets.each do |ws|

              # delete bullet
              bullet.x = -1
              bullet.y = -1

              timer = EventMachine::Timer.new(20) do
                if user!=nil
                  user.dead = false
				          user.spawn_protection = Time.now + 1
                end
              end
              Messaging.send_die_message(game, ws, user)
            end
          end
        end

        bullet.level.users.each do |user|
          Messaging.send_bullet_message(game, user.ws, bullet)
        end

		
		# we move the bullets after checking collision
		if bullet.x >= 0 && bullet.y >= 0 && bullet.x < Game::MAP_WIDTH && bullet.y < Game::MAP_HEIGHT
			if bullet.dir.to_s == Game::DIRECTION_UP.to_s
				bullet.y-=1
			elsif bullet.dir.to_s == Game::DIRECTION_DOWN.to_s
				bullet.y+=1
			elsif bullet.dir.to_s == Game::DIRECTION_LEFT.to_s
				bullet.x-=1
			elsif bullet.dir.to_s == Game::DIRECTION_RIGHT.to_s
				bullet.x+=1
			end
		else
          game.bullets.delete(bullet)
        end

      end
    end

    EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080) do |ws|
        ws.onopen {
          game.sockets.push(ws)
        }

        ws.onclose {
          id = ""

          #Remove the user
          game.users.each do |user|
            if user.ws == ws
              id = user.id
              remove_user_from_game(game,user)
            end
          end

          #Remove the Socket
          game.sockets.delete(ws)

          #Inform players he left
          game.sockets.each do |socket|
            Messaging.send_quit_message(game,socket,id)
          end
        }

        ws.onmessage { |msg|
        	parse_message(ws,msg,game)
        }
    end
}