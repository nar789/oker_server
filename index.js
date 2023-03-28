const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Game = require('./game');

app.use('/assets',express.static(__dirname + '/assets'));



let game = new Map();
//callInfo[]  // call info table => call box value / current bet amount


//TEST START
//let g = new Game();
//g.init();
//g.start(io, null, ["a"]);

//TEST END


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected ' + socket.id);

  socket.emit('welcome', {
    id : socket.id
  });

  socket.on('room_join', ({id})=> {
    let room = io.sockets.adapter.rooms.get(id);
    if(room != null) {
        let roomSize =  room.size; 
        console.log(`room<${id}> user length = ${roomSize}`);
        if(roomSize >= 5) {
            socket.emit('room_join', {
                result: "fail",
                error: "full"
            });        
            return;
        }
    }
    
    socket.join(id);
    let users = io.sockets.adapter.rooms.get(id);    
    console.log(users);
    if(users == null) {
        users = [];
    }
    io.sockets.in(id).emit('user_info', {
        users: Array.from(users),
        result:"success"
    });
    
    console.log(`${socket.id} is joined ROOM ID<${id}>.`);
    socket.emit('room_join', {
        result: "success"
    });
  });

  socket.on('room_leave', ({id}) => {
    socket.leave(id);
    let users = io.sockets.adapter.rooms.get(id);    
    console.log(users);
    if(users == null) {
        users = [];
    }
    socket.emit('user_info', {
        users: Array.from(users),
        result:"success"
    });
    io.sockets.in(id).emit('user_info', {
        users: Array.from(users),
        result:"success"
    });
    socket.emit("room_leave", {
        result:"success"
    });
  });

  socket.on("choice", ({cards}) =>  {
    if(socket.rooms.size < 2) {
        return;
    }
    let roomId = Array.from(socket.rooms)[1];
    let users = io.sockets.adapter.rooms.get(roomId);
    game.get(roomId).choice(io, roomId, socket.id, cards, Array.from(users));   

  });

  socket.on("game_start", ()=> {
    if(socket.rooms.size < 2) {
        return;
    }
    let roomId = Array.from(socket.rooms)[1];
    let users = io.sockets.adapter.rooms.get(roomId);
    console.log(`GAME START, room id = ${roomId}, users len = ${users.size}`);

    if(!game.has(roomId)) {
        game.set(roomId, new Game());   
    }

    game.get(roomId).init();
    game.get(roomId).start(io, Array.from(users));


  });

  socket.on("betting", ({userId, type}) => {
    if(socket.rooms.size < 2) {
        return;
    }
    let roomId = Array.from(socket.rooms)[1];
    let users = io.sockets.adapter.rooms.get(roomId);
    game.get(roomId).betting(io, roomId, Array.from(users), userId, type);

  });



  socket.on('disconnecting', ()=>{
    if(socket.rooms.size < 2) {
        return;
    }
    let roomId = Array.from(socket.rooms)[1];
    let users = io.sockets.adapter.rooms.get(roomId);
    users.delete(socket.id);
    io.sockets.in(roomId).emit('user_info', {
        users: Array.from(users),
        result:"success"
    });
  });

  socket.on('disconnect', ()=>{
        console.log("a user disconnected, " + socket.id);
  });

});



server.listen(3000, () => {
  console.log('tomato poker server listening on *:3000');


          //test
          const Card = require('./card')().Card;
          const Result = require('./result');
          let c = [];
          c.push(new Card("D", 6));
          c.push(new Card("S", 8));
          c.push(new Card("C", 11));
          c.push(new Card("H", 5));
          c.push(new Card("D", 7));
          c.push(new Card("C", 1));
          c.push(new Card("C", 10));
          let r = new Result(c);
          let calc = r.calc();
          console.log(r.cards);
          console.log(calc);

          
          let c2 = [];
          c2.push(new Card("H", 10));
          c2.push(new Card("D", 7));
          c2.push(new Card("H", 4));
          c2.push(new Card("C", 3));
          c2.push(new Card("C", 2));
          c2.push(new Card("D", 1));
          c2.push(new Card("D", 9));
          let r2 = new Result(c2);
          console.log(r2.calc());
          
          const isWin = r.compare(r2);
          console.log('is win ' + isWin);
});