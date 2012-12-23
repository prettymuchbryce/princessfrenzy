require 'sinatra'
require_relative 'cross_origin.rb'

set :port, 80
#set :public_folder, File.dirname(__FILE__) + '/static'

configure do
	enable :cross_origin
end

set :allow_origin, '*'

if ARGV[0] == "production"
	environment = "production"
else
	environment = "alpha"
end

get '/' do
	erb :index, :format => :html5, :locals => {:env => environment}
end

get '/*' do
	send_file File.dirname(__FILE__) + '/static' + request.path
end