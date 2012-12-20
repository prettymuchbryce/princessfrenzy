require 'json'
require_relative 'warp'
require_relative 'game'
class Level
    attr_accessor :users, :arrows, :collision, :player_collision, :warps, :spawn, :file, :princess_point, :has_princess, :princess_dir
    @levels = Hash.new
    class << self
        attr_accessor :levels
    end
    def initialize(file)
        if file == "2.json"
            @has_princess = true
        end
        @file = file
        @users = []
        @arrows = []
        @spawn = {}
        rows, cols = Game::MAP_WIDTH,Game::MAP_HEIGHT
        @collision = Array.new(rows) { Array.new(cols) }
		@player_collision = Array.new(rows) { Array.new(cols) }
        @warps = []
        level = JSON.parse(File.read('../webserver/static/levels/'+file))

        Level.levels[file] = self

        #Parse Level Data
        level["layers"].each do |layer|
            if layer["name"] == "collision"
                x = 0
                y = 0
                layer["data"].each do |tile|
                    @collision[y][x] = tile
                    x+=1
                    if x == Game::MAP_WIDTH
                        x = 0
                        y +=1
                    end
                end
			elsif layer["name"] == "playercollision"
				x = 0
				y = 0
				layer["data"].each do |tile|
					@player_collision[y][x] = tile
					x+=1
					if x == Game::MAP_WIDTH
						x = 0
						y +=1
					end
				end
            elsif layer["name"] == "objects"
                layer["objects"].each do |object|
                    if object["type"] == "WARP"
                        if !Level.levels[object["properties"]["target"]]
                            level = Level.new(object["properties"]["target"])
                        else
                            level = Level.levels[object["properties"]["target"]]
                        end
                        warp = Warp.new((object["x"]/Game::TILE_SIZE).floor,(object["y"]/Game::TILE_SIZE).floor,level)
                        @warps.push(warp)
                    elsif object["type"] == "SPAWN"
                        @spawn["x"] = (object["x"]/Game::TILE_SIZE).floor
                        @spawn["y"] = (object["y"]/Game::TILE_SIZE).floor
                    end
                end
            end
        end
        if @has_princess == true
            randomize_princess()
        end
    end
    def randomize_princess
        @princess_point = find_noncollidable_space()
		@princess_dir = ((Random.new(Time.now.to_i).rand() * 1000).to_i % 2) == 0 ? Game::DIRECTION_LEFT : Game::DIRECTION_RIGHT
    end
    def find_noncollidable_space
        candidates = []
        for y in 0..Game::MAP_HEIGHT
            for x in 0..Game::MAP_WIDTH
                if @collision[y][x] == 0 && @player_collision[y][x] == 0
					do_push = true
					#We do not want the princess to spawn on a warp
					for warp in @warps
						if warp.x == x && warp.y == y
							do_push = false
							break
						end
					end
					
					if do_push
						p = {}
						p["x"] = x
						p["y"] = y
						candidates.push(p)
					end
                end
            end
        end

        return candidates.sample
    end
end
