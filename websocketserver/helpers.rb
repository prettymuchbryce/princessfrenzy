def get_user_from_ws(game,ws)
  game.users.each do |user|
    if user.ws == ws
      return user
    end
  end
  return nil
end

def does_user_exist?(id,game)
  game.users.each do |user|
    if user.id == id
      return true
    end
  end
  return false
end

def is_user_banned?(game,user)
  game.banned.each do |ip|
    if user.ip == ip
      return true
    end
  end
  return false
end