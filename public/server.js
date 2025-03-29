const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// إعدادات السيرفر
app.use(express.static('public')); // لخدمة الملفات الثابتة
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// إدارة الغرف
const rooms = {};

io.on('connection', (socket) => {
  console.log('مستخدم متصل:', socket.id);

  socket.on('createRoom', (data) => {
    const roomId = generateRoomId();
    rooms[roomId] = {
      host: { id: data.playerId, name: data.playerName, socketId: socket.id },
      guest: null,
      board: Array(9).fill(''),
      currentPlayer: 'X',
      scores: { X: 0, O: 0 }
    };
    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
  });

  socket.on('joinRoom', (data) => {
    if (rooms[data.roomId]) {
      if (!rooms[data.roomId].guest) {
        rooms[data.roomId].guest = { 
          id: data.playerId, 
          name: data.playerName,
          socketId: socket.id
        };
        socket.join(data.roomId);
        socket.emit('roomJoined', { 
          success: true, 
          roomId: data.roomId,
          hostName: rooms[data.roomId].host.name,
          symbol: 'O'
        });
        io.to(data.roomId).emit('playerJoined', {
          playerName: data.playerName
        });
        io.to(rooms[data.roomId].host.socketId).emit('gameStart', {
          symbol: 'X'
        });
      } else {
        socket.emit('roomJoined', { 
          success: false, 
          message: 'الغرفة ممتلئة' 
        });
      }
    } else {
      socket.emit('roomJoined', { 
        success: false, 
        message: 'الغرفة غير موجودة' 
      });
    }
  });

  // بقية الأحداث (makeMove, resetGame, disconnect) كما هي في الكود السابق
});

function generateRoomId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`السيرفر يعمل على port ${PORT}`);
});
