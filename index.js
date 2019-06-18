const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

//serve favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')));
// serve static files in public directory
app.use('/public', express.static('public'));

//serve html
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//When use connects and dissconects
io.on('connection', function(socket){
    console.log('a user has connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});