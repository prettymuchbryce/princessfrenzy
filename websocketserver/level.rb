require 'json'
require_relative 'warp'
require_relative 'game'
require_relative 'npc'
require_relative 'helpers'
class Level
    attr_accessor :users, :bullets, :collision, :player_collision, :warps, :spawn, :file, :npcs
    @levels = Hash.new
    class << self
        attr_accessor :levels
    end
    def initialize(game,file)
        @file = file
        @game = game
        @users = []
        @npcs = []
        @bullets = []
        @spawn = {}
        rows, cols = Game::MAP_WIDTH,Game::MAP_HEIGHT
        @collision = Array.new(rows) { Array.new(cols) }
		@player_collision = Array.new(rows) { Array.new(cols) }
        @warps = []
        load_level_data('../webserver/static/levels/'+file)

        point = find_noncollidable_space()
        @npcs.push(NPC.new(point["x"],point["y"],"npc",Helpers.get_id(game),self,"oldman.png"))
    end

    def load_level_data(path_to_json)
        level = JSON.parse(File.read(path_to_json))
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
            elsif layer["name"] == "player_collision"
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
                    if object["type"] == Warp::WARP || object["type"] == Warp::WARP_DOWN || object["type"] == Warp::WARP_UP || object["type"] == Warp::WARP_LEFT || object["type"] == Warp::WARP_RIGHT
                        if !Level.levels[object["properties"]["target"]]
                            level = Level.new(@game,object["properties"]["target"])
                            @game.levels.push(level)
                        else
                            level = Level.levels[object["properties"]["target"]]
                        end
                        warp = Warp.new((object["x"]/Game::TILE_SIZE).floor,(object["y"]/Game::TILE_SIZE).floor,level,object["type"])
                        @warps.push(warp)
                    elsif object["type"] == "SPAWN"
                        @spawn["x"] = (object["x"]/Game::TILE_SIZE).floor
                        @spawn["y"] = (object["y"]/Game::TILE_SIZE).floor
                    end
                end
            end
        end
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