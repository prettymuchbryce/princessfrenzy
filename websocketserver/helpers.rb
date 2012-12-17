def getUserFromWs(game,ws)
  game.users.each do |user|
    if user.ws == ws
      return user
    end
  end
  return nil
end

def doesUserExist(id,game)
  game.users.each do |user|
    if user.id == id
      return true
    end
  end
  return false
end

def isUserBanned(game,user)
  game.banned.each do |ip|
    if user.ip == ip
      return true
    end
  end
  return false
end