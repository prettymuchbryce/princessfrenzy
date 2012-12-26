require 'json'
require_relative 'warp'
require_relative 'game'
require_relative 'npc'
require_relative 'helpers'
class Level
    TILE_GRASS = {"x" => 9, "y" => 4}
    TILE_TREES = [{"x" => 10, "y" => 4},{"x" => 11, "y" => 4},{"x" => 12, "y" => 4},{"x" => 13, "y" => 4},{"x" => 14, "y" => 4}]

    attr_accessor :users, :bullets, :collision, :player_collision, :warps, :spawn, :file, :npcs
    @levels = Hash.new
    @random_level_ids = 0
    class << self
        attr_accessor :levels, :random_level_ids
    end
    def initialize(game,file)
        @file = file
        @game = game
        @users = []
        @npcs = []
        @bullets = []
        @spawn = {}

        randomize()

        rows, cols = Game::MAP_WIDTH,Game::MAP_HEIGHT
        @collision = Array.new(rows) { Array.new(cols) }
		@player_collision = Array.new(rows) { Array.new(cols) }
        @warps = []
        load_level_data('../webserver/static/levels/'+@file)

        point = find_noncollidable_space()
        @npcs.push(NPC.new(point["x"],point["y"],"npc",Helpers.get_id(game),self,"oldman.png"))
    end

    def randomize()
        @file = "r" + Level.random_level_ids.to_s + ".json"
        Level.random_level_ids+=1

        @collision = []
        @tiles = []
        @details = []
        @player_collision = []

        for y in 0..Game::MAP_WIDTH-1
            for x in 0..Game::MAP_HEIGHT-1
                @tiles.push(point_to_tile(TILE_GRASS))
            end
        end

        for y in 0..Game::MAP_WIDTH-1
            for x in 0..Game::MAP_HEIGHT-1
                randomTile = rand(40)
                if randomTile <= 4
                    @details.push(point_to_tile(TILE_TREES[randomTile]))
                    @collision.push(1)
                else
                    @details.push(0)
                    @collision.push(0)
                end
                @player_collision.push(0)
            end
        end

        save_level_data('../webserver/static/levels/'+@file)
    end

    def save_level_data(path_to_json)
        temp_hash = {}
        tiles_hash = {}
        collision_hash = {}
        details_hash = {}
        player_collision_hash = {}

        tiles_hash["data"] = @tiles
        tiles_hash["type"] = "tilelayer"
        tiles_hash["name"] = "ground"

        collision_hash["data"] = @collision
        collision_hash["type"] = "tilelayer"
        collision_hash["name"] = "collision"

        player_collision_hash["data"] = @player_collision
        player_collision_hash["type"] = "tilelayer"
        player_collision_hash["name"] = "player_collision"

        details_hash["data"] = @details
        details_hash["type"] = "tilelayer"
        details_hash["name"] = "detail"

        layers = [tiles_hash,details_hash,collision_hash,player_collision_hash]

        temp_hash["layers"] = layers

        file_json = File.open(path_to_json,"w")
        file_json.write(temp_hash.to_json)
        file_json.close
    end

    def point_to_tile(point)
        return point["y"]*16+point["x"]
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
                    @collision[y][x] = tile.to_i
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
                    @player_collision[y][x] = tile.to_i
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
        for y in 0..Game::MAP_HEIGHT-1
            for x in 0..Game::MAP_WIDTH-1
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