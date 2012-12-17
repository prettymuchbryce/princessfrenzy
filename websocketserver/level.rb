require 'json'
require_relative 'warp'
require_relative 'game'
class Level
    attr_accessor :users, :arrows, :collision, :warps, :spawn, :file, :princess_point, :has_princess
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
        @warps = []
        level = JSON.parse(File.read('../webserver/static/levels/'+file))

        Level.levels[file] = self

        #Parse Level Data
        level["layers"].each do |layer|
            if layer["name"] == "collision"
                x = 0
                y = 0
                layer["data"].each do |tile|
                    collision[y][x] = tile
                    x+=1
                    if x == Game::MAP_WIDTH
                        x = 0
                        y +=1
                    end
                end
            end
            if layer["name"] == "objects"
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
            randomizePrincess()
        end
    end
    def randomizePrincess
        @princess_point = findNonCollidableSpace()
    end
    def findNonCollidableSpace
        candidates = []
        for y in 0..Game::MAP_HEIGHT
            for x in 0..Game::MAP_WIDTH
                if @collision[y][x] == 0
                    p = {}
                    p["x"] = x
                    p["y"] = y
                    candidates.push(p)
                end
            end
        end

        return candidates.sample
    end
end