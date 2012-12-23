class Warp
	WARP_UP = "WARP_UP"
	WARP_LEFT = "WARP_LEFT"
	WARP_RIGHT = "WARP_RIGHT"
	WARP_DOWN = "WARP_DOWN"
	WARP = "WARP"
	attr_accessor :x, :y, :level,:type
	def initialize(x,y,level,type)
		@x = x;
		@y = y
		@level = level
		@type = type
	end
end