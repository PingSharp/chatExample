var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var moment = require('moment');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var clients = 0;
io.on('connection', function(socket){
 clients++;
 socket.on('nickname',function (data) {
     socket.username =data. name;
     socket.usercolor = data.color;
   socket.broadcast.emit('newuser',data.name);
 })
  // io.sockets.emit("broadcast",{des: clients+"clients connected!"});
  socket.on('chat message', function(msg){
      socket.emit('my message',{
          username: socket.username,
          message: msg,
          usercolor:socket.usercolor,
          time: moment().format("YYYY-MM-DD HH:mm")
      })
    socket.broadcast.emit('chat message',{
        username: socket.username,
        message: msg,
        usercolor:socket.usercolor,
        time:moment().format("YYYY-MM-DD HH:mm")
    })
  });
  socket.on('typing',(msg)=>{
      socket.broadcast.emit('typing',{
          username: socket.username
      })
  });
  socket.on('stop typing',()=>{
      socket.broadcast.emit('stop typing',{
          username: socket.username
      })
  })
  socket.on('disconnect',(reason)=>{
    clients--;
    socket.emit('userleft',{des: socket.username+" is lefted!"})
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
