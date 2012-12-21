require 'sinatra'
require_relative 'cross_origin.rb'

set :port, 80
#set :public_folder, File.dirname(__FILE__) + '/static'

configure do
	enable :cross_origin
end

set :allow_origin, '*'

get '/' do
	#erb :index, :format => :html5
	send_file File.dirname(__FILE__) + "/static/index.html"
end

get '/*' do
	send_file File.dirname(__FILE__) + '/static' + request.path
end