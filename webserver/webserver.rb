require 'sinatra'

set :port, 80
set :public_folder, File.dirname(__FILE__) + '/static'

get '/' do
	erb :index, :format => :html5
end