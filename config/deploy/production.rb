set :user, "ubuntu"
set :branch, 'master'
server "23.21.198.199", :app, :web, :primary => true
ssh_options[:keys] = ["#{ENV['HOME']}/.ssh/princess_frenzy.pem"]