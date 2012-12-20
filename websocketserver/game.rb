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

    attr_accessor :arrow_ids, :sockets, :users, :arrows, :banned, :levels, :princess_time, :current_winner

    def initialize()
        @current_winner = nil
        @users = []
        @arrows = []
        @arrow_ids = 0
        @sockets = []
        rows, cols = Game::WORLD_WIDTH,Game::WORLD_HEIGHT
        @levels = Array.new(rows) { Array.new(cols) }
        @banned = JSON.parse(File.read('banned.json'))
        @princess_time = 60

        @levels[0][0] = Level.new("1.json")
    end
end