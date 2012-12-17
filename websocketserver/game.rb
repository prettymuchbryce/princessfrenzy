require 'json'
require_relative 'level'

class Game
    TILE_SIZE = 32 #This is only necessary for parsing data in from the TILED editor
    DIRECTION_UP = 0
    DIRECTION_RIGHT = 1
    DIRECTION_DOWN = 2
    DIRECTION_LEFT = 3
    MAP_HEIGHT = 640/32
    TIMEOUT_SECONDS = 60*5
    MAP_WIDTH = 800/32
    WORLD_WIDTH = 1
    WORLD_HEIGHT = 1
    DELIMITER = "%"
    LOGIN = "L"
    LEVEL = "E"
    BANNED = "B"
    CHAT = "C"
    PRINCESS = "P"
    QUIT = "Q"
    DIE = "D"
    MOVE = "M"
    WINNING = "W"
    ARROW = "A"
    LEADERBOARD = "R"
    OK_RESPONSE = "ok"
    SERVER_MESSAGE = "S"
	#Please match these with Game.js, divided by the framerate of the client
	#This does not stop hacking, it merely makes speedhacks less effective
	#It does have the chance to skip an arrow/movement:
	#Client sends arrow packet, it arrives at the server later than would be expected because of lag, server sets arrow time
	#Client sends packet, it arrives very quickly, arrow time not yet expired, so server discards the arrow
	PLAYER_MOVE_TIME = 5.0 / 60
	PLAYER_ARROW_TIME = 35.0 / 60
	PLAYER_FUDGE_ACTION_TIME = 0.01 #Time in seconds to allow for a player action to happen, to allow for connection speed stuff
	
    attr_accessor :arrowIds, :sockets, :users, :arrows, :banned, :levels, :princess_time, :current_winner

    def initialize()
        @current_winner = nil
        @users = []
        @arrows = []
        @arrowIds = 0
        @sockets = []
        rows, cols = Game::WORLD_WIDTH,Game::WORLD_HEIGHT
        @levels = Array.new(rows) { Array.new(cols) }
        @banned = JSON.parse(File.read('banned.json'))
        @princess_time = 60

        @levels[0][0] = Level.new("1.json")
    end
end