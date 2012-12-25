module Helpers
  def self.get_user_from_ws(game,ws)
    game.users.each do |user|
      if user.ws == ws
        return user
      end
    end
    return nil
  end

  def self.get_id(game)
    game.ids+=1
    return game.ids.to_s
  end

  def self.does_user_exist?(id,game)
    game.users.each do |user|
      if user.id == id
        return true
      end
    end
    return false
  end

  def self.is_user_banned?(game,user)
    game.banned.each do |ip|
      if user.ip == ip
        return true
      end
    end
    return false
  end
end
