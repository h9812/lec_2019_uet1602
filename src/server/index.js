var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// serve static folder
app.use(express.static('public'))

// index
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var outPing = [];
var nextPing = [];
var robotIDs = [];

// socket-connection
io.on('connection', function (socket) {
    let clientID = socket.id;
    outPing[clientID] = setTimeout(() => { }, 0);

    // console.log(`${clientID} is CONNECTED!`);

    // ROBOT JOIN
    socket.on('robot-res-join', function (join) {
        console.log('\x1b[33m%s\x1b[0m', `Robot ${clientID} is CONNECTED!`);
        socket.join('robotio');
    });
    // WEB JOIN
    socket.on('web-join', function (join) {
        console.log('\x1b[33m%s\x1b[0m', `Web-Remote-Control ${clientID} is CONNECTED!`);
        socket.join('webio');
    });


    // STREAM PING
    socket.on('web-ping', function (ping) {
        Object.keys(nextPing).forEach(clientID=>{
            clearTimeout(nextPing[clientID]);
        })
        Object.keys(outPing).forEach(clientID=>{
            clearTimeout(outPing[clientID]);
        })
        io.sockets.to('robotio').emit('robot-ping', Date.now());
    });

    socket.on('robot-res-ping', function (ping) {
        clearTimeout(outPing[clientID]);
        io.sockets.to('webio').emit('web-res-ping-value', `${clientID}:${Date.now() - ping}`);
        // next ping
        nextPing[clientID] = setTimeout(() => {
            io.sockets.to(clientID).emit('robot-ping', Date.now());
            outPing[clientID] = setTimeout(() => {
                io.sockets.to('webio').emit('web-res-ping-value', `${clientID}:OFFLINE`);
            }, 5000);
        }, 1000);
    });

    // STREAM WEBCAM
    socket.on('robot-res-webcam', function (img64) {
        io.sockets.to('webio').emit('web-livecam', img64);
    });

    // CONTROL CONFIG P/I/D
    socket.on('web-config', function (config) {
        console.log(`web => config: `, config);
        socket.broadcast.to('robotio').emit('robot-config', config);
    });

    // CONTROL CAMERA ON/OFF
    socket.on('web-control-camera', function (onOFF) {
        console.log(`web => turn ${onOFF ? 'on' : 'off'} camera`);
        socket.broadcast.to('robotio').emit('robot-ctrl-cam', onOFF);
    });

    // CONTROL LEFT/RIGHT UP/DOWN
    socket.on('web-control-start', function (direction) {
        socket.broadcast.to('robotio').emit('robot-control-start', direction);
        console.log('web => control start: ' + direction);
    });
    socket.on('web-control-end', function (direction) {
        socket.broadcast.to('robotio').emit('robot-control-end', direction);
        console.log('web => control end:' + direction);
    });

    // CONTROL WITH CUSTOM ROUTE
    socket.on('web-route', function (route) {
        socket.broadcast.to('robotio').emit('robot-route', route);
        console.log('web => route: ' + route);

    });

    socket.on('disconnect', function () {
        console.log("\x1b[31m",`${clientID} is DISCONNECTED!`);
    });
});

// listion on port
http.listen(process.env.PORT || 3000, function () {
    console.log('Server running on port 3000...');
});

