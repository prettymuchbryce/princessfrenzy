princessfrenzy
==============

This is a game that was made for Ludum Dare 25, a 48 hour game competition. Please excuse the messy code and lack of comments. I was in a hurry.

You can view the 48 hour version of the game here:
    http://www.brycedoesludumdare.com

You can view the current version of the game here:
    http://23.21.198.199/

You can start the server and web server using ruby, although you may need some gems.

    gem install sinatra
    gem install eventmachine
    gem install em-websocket
    gem install capistrano
    gem install capistrano-ext

Then start the web and game servers, and connect on 127.0.0.1:80

    sudo ruby server.rb
    sudo ruby webserver.rb

Deploy to the server. By pushing to this repository. Requires pem file.

    cap deploy
