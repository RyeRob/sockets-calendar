// help from:
// https://www.tutorialspoint.com/socket.io/socket.io_rooms.htm
// https://socket.io/docs/

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
  
  sendStatus = function(s){
    socket.emit('status', s);
  }

  totalUsers++;
  console.log('joined index');
  socket.send('user joined', totalUsers);

  socket.on('calendarEntry', function(entry){
   io.emit('calendarEntry', entry);
  });

  socket.on('disconnect', function(){
    console.log('User Disconnected');
    totalUsers--;
    io.emit('userdisconnect', 'User has disconnected.');
  });

  socket.on('input', function(data){
    let name = data.name;

    if (name == ''){
      sendStatus('Please enter a name.')
    }
  });

  let roomno = 1;
  if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 5) 
  roomno++;
  socket.join("room-"+roomno);

  //Send this event to everyone in the room.
  io.sockets.in("room-"+roomno).emit('connectToRoom', roomno);
});

const nsp = io.of('/main');
nsp.on('connection', function(socket){
  console.log('connected to main')
});

// app.post('/', function(req, res){
//   console.log('yea');
// });

server.listen(port, function(){
    console.log('listening on *:3000');
});