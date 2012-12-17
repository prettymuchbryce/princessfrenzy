class User
	attr_accessor :x, :ws, :y, :id, :dir,:is_admin, :ip, :dead, :last_action, :level, :wins
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
	end
end