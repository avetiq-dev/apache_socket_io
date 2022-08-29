const express = require('express');
const http = require('http');
const {Server} = require("socket.io");
const app = express();
const server = http.createServer(app);
const config = require('./config');
const io = new Server(server, {
    cors: {
        origin: config.siteUrl
    }
});

const clients = {};


io.on('connection', function(socket){

    socket.on('AddUser', function(data){
        clients[socket.id] = {
            userAgent: socket.request.headers['user-agent'],
            ip: socket.handshake.address,
            time: new Date().toLocaleString()
        }
        io.sockets.emit('getClients', { clients: clients });
    });

    socket.on('disconnect', function(data){
        if (socket.id in clients)
            delete clients[socket.id];

        io.sockets.emit('getClients', { clients: clients });
    });
});

server.listen(config.port, () => {
    console.log('server run -p ' + config.port);
});


