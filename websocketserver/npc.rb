class NPC
	AGGRESSION_NONE = 0
	AGGRESSION_ZOMBIE = 1
	AGGRESSION_HUMAN = 2
	attr_accessor :x, :y, :id, :dir, :dead, :level, :aggression, :min_x, :min_y, :max_x, :max_y
	def initialize(x,y,min_x,min_y,max_x,max_y,id,level,aggression)
		@x = x
		@y = y
		@id = id
		@dir = Game::DIRECTION_DOWN
		@min_x = min_x
		@min_y = min_y
		@max_x = max_x
		@max_y = max_y
	end
	def update()
		
	end
end