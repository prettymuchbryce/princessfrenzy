require 'json'
require_relative 'level'

class Game
    TILE_SIZE = 32 #This is only necessary for parsing data in from the TILED editor
    DIRECTION_UP = 0
    DIRECTION_RIGHT = 1
    DIRECTION_DOWN = 2
    DIRECTION_LEFT = 3
    MAP_HEIGHT = 448/32
    TIMEOUT_SECONDS = 60*5
    MAP_WIDTH = 800/32
    WORLD_WIDTH = 1
    WORLD_HEIGHT = 1
    
	#Please match these with Game.js, divided by the framerate of the client
	#This does not stop hacking, it merely makes speedhacks less effective
	#It does have the chance to skip a bullet/movement:
	#Client sends bullet packet, it arrives at the server later than would be expected because of lag, server sets bullet time
	#Client sends packet, it arrives very quickly, bullet time not yet expired, so server discards the bullet
	PLAYER_MOVE_TIME = 5.0 / 60
	PLAYER_BULLET_TIME = 35.0 / 60
	PLAYER_FUDGE_ACTION_TIME = 0.01 #Time in seconds to allow for a player action to happen, to allow for connection speed stuff
	
    attr_accessor :ids, :sockets, :users, :bullets, :banned, :levels, :princess_time, :current_winner

    def initialize()
        @current_winner = nil
        @users = []
        @bullets = []
        @ids = 0
        @sockets = []
        @levels = []
        @banned = JSON.parse(File.read('banned.json'))
        @princess_time = 60


        rows, cols = 10,5
        grid = Array.new(rows) { Array.new(cols) }
        puts rows
        puts cols
        for y in 0..5
            for x in 0..10
                if rand(20) == 1
                    level = Level.new(self,"1.json",false)
                    @levels.push(level)
                else
                    level = Level.new(self,"",true)
                    @levels.push(level)
                end
                grid[y][x] = level
            end
        end

        for y in 0..5
            for x in 0..10
                hook_up(grid, x, y)
            end
        end

    end

    def hook_up(grid,x,y)
        if y > 0
            grid[y][x].add_warp(grid[y-1][x],Warp::WARP_UP)
        end
        if x > 0
            grid[y][x].add_warp(grid[y][x-1],Warp::WARP_LEFT)
        end
        if x < 9
            grid[y][x].add_warp(grid[y][x+1],Warp::WARP_RIGHT)
        end
        if y < 4
            grid[y][x].add_warp(grid[y+1][x],Warp::WARP_DOWN)
        end
    end
end
