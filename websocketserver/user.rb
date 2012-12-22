class User
	attr_accessor :x, :ws, :y, :id, :dir, :is_admin, :ip, :dead, :last_action, :level, :wins, :next_move, :next_bullet, :spawn_protection
	def initialize(id,ws,dir,x,y,is_admin,ip)
		@wins = 0
		@id = id
		@level = nil
		@ip = ip
		@ws = ws;
		@dead = false;
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