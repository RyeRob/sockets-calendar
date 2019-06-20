var express = require('express');
var app = express();
var path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000;


//serve favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')));
// serve static files in public directory
app.use('/public', express.static('public'));

//serve html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

let totalUsers = 0;

//When use connects and dissconects
io.on('connection', function(socket){
  
  totalUsers++;

  socket.broadcast.emit('user joined', {
  numUsers: totalUsers
  });

  console.log(totalUsers);

  socket.on('disconnect', function(){
    totalUsers--;
    console.log(totalUsers);
  });

  socket.on('calendarEntry', function(entry){
   io.emit('calendarEntry', entry);
  });
});

server.listen(port, function(){
    console.log('listening on *:3000');
});