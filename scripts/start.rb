require 'fileutils'
require 'pathname'
include FileUtils

exec("sudo ruby webserver/webserver.rb")
exec("cd")
exec("ruby server.rb")