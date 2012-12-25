require_relative 'helpers'
class User
	attr_accessor :x, :ws, :y, :id, :dir, :is_admin, :ip, :dead, :last_action, :level, :next_move, :next_bullet, :spawn_protection, :name
	def initialize(id,name,ws,dir,x,y,is_admin,ip)
		@id = id.to_s
		@name = name
		@level = nil
		@ip = ip
		@ws = ws;
		@dead = false
		@x = x
		@y = y
		@is_admin = is_admin
		@last_action = Time.now
    	@dir = dir
		@next_move = Time.now
		@next_bullet = Time.now
		@spawn_protection = Time.now
	end
end