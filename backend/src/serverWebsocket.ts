const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("Un utilisateur est connecte");

    socket.on('newUser', (user) => {
        io.emit('UpdateUserList', user);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur deconnecte');
    });
});

server.listen(8000, () => {
    console.log('Serveur is listening on port 8000');
})
