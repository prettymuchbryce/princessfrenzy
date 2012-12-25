class NPC
	AGGRESSION_FLAG_ZOMBIE = "z"
	AGGRESSION_FLAG_HUMAN = "h"
	AGGRESSION_FLAG_NPCS = "n"

	BEHAVIOR_STILL = 0;
	BEHAVIOR_WANDER = 1;

	attr_accessor :x, :y, :name, :id, :dir, :dead, :level, :aggression_flags, :behavior_type, :asset
	def initialize(x,y,name,id,level,asset)
		@x = x
		@asset = asset
		@y = y
		@id = id.to_s
		@name = name
		@dir = Game::DIRECTION_DOWN
		@dead = false
		@level = level

		@aggression_flags = []
		@behavior = BEHAVIOR_WANDER
	end
	def update()
		if @behavior == BEHAVIOR_WANDER
			candidates = []

			#Try up
			try_y = @y - 1
			try_x = @x
			if is_point_valid_move?(try_x, try_y)
				p = {}
				p["x"] = try_x
				p["y"] = try_y
				p["dir"] = Game::DIRECTION_UP
				candidates.push(p)
			end

			try_y = @y + 1
			try_x = @x
			if is_point_valid_move?(try_x, try_y)
				p = {}
				p["x"] = try_x
				p["y"] = try_y
				p["dir"] = Game::DIRECTION_DOWN
				candidates.push(p)
			end

			try_x = @x - 1
			try_y = @y
			if is_point_valid_move?(try_x, try_y)
				p = {}
				p["x"] = try_x
				p["y"] = try_y
				p["dir"] = Game::DIRECTION_LEFT
				candidates.push(p)
			end

			try_x = @x + 1
			try_y = @y
			if is_point_valid_move?(try_x, try_y)
				p = {}
				p["x"] = try_x
				p["y"] = try_y
				p["dir"] = Game::DIRECTION_RIGHT
				candidates.push(p)
			end

			#Case where npc is stuck
			if candidates.length == 0
				return
			end

			destination = candidates.sample

			@x = destination["x"]
			@y = destination["y"]
			@dir = destination["dir"]
		end
	end

	private
	def is_point_valid_move?(x,y)
		if x > 0 && y > 0 && x < Game::MAP_WIDTH && y < Game::MAP_HEIGHT && @level.collision[y][x] == 0
			return true
		else
			return false
		end
	end
end