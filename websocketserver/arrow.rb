class Arrow
  attr_accessor :x, :y, :dir, :id, :level
  def initialize(id,dir,x,y,level)
    @id = id;
    @x = x;
    @level = level
    @y = y;
    @dir = dir;
  end
end