const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

app.use(express.static(__dirname));

let scores = {};
const targetClicks = 10;

io.on('connection', (socket) => {
    scores[socket.id] = 0;
    io.emit('updateScore', scores);

    socket.on('kickBlock', () => {
        if (scores[socket.id] !== undefined) {
            scores[socket.id]++;
            io.emit('updateScore', scores);

            if (scores[socket.id] >= targetClicks) {
                io.emit('gameOver', socket.id);
                scores = {};
            }
        }
    });

    socket.on('disconnect', () => {
        delete scores[socket.id];
        io.emit('updateScore', scores);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Server aktif di port ' + PORT);
});
