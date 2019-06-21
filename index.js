// help from:
// 1 https://www.tutorialspoint.com/socket.io/socket.io_rooms.htm
// 2 https://socket.io/docs/

var express = require('express');
var app = express();
var path = require('path');
const server = require('http').Server(app);
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

var numUsers = 0;

io.on('connection', function(socket){
  // socket.on('setUsername', function(data) {
  //   if(users.indexOf(data) > -1){
  //     users.push(data);
  //     socket.emit('userSet', {username: data});
  //   } else {
  //     socket.emit('userExists', data + '  is taken. Try something else.');
  //   }
  // });

  var addedUser = false;

  socket.on('add user', (username) => {
    if (addedUser) return;
    // soring user name and emitting total number of users
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });

    // user joined message
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // user disconnect
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
  socket.on('calendarEntry', function(entry){
   socket.broadcast.emit('calendarEntry', entry);
  });

  let roomno = 1;
  // setting rooms with max of 3 people connected
  if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 3) 
  roomno++;
  socket.join("room-"+roomno);
  // emit message to show which room you are in
  io.sockets.in("room-"+roomno).emit('connectToRoom', roomno);
});

// alternate namespace called main
const nsp = io.of('/main');
nsp.on('connection', function(socket){
  console.log('connected to main');
});

// listen at port 3000
server.listen(port, function(){
  console.log('listening on *:3000');
});