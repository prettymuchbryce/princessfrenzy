class Arrow
  attr_accessor :x, :y, :dir, :id, :level, :owner
  def initialize(id,dir,x,y,level,owner)
    @id = id;
    @x = x;
    @level = level
    @y = y;
    @dir = dir;
	@owner = owner;
  end
end