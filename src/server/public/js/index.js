const socket = io();
var lastKeyCode = 0;
var lastMouseClick = false;
var directs = {
    "W": "U",
    "D": "R",
    "S": "D",
    "A": "L"
};

var robotIDs = [];

function pingRes() {
    socket.emit('web-ping', Date.now());
}
function turnOnCam(onOFF) {
    socket.emit('web-control-camera', onOFF);
}
function configMinus(varName) {
    let curVal = parseInt($(`#${varName}-value`).html());
    $(`#${varName}-value`).html(curVal - 1);
    socket.emit(`web-config`, `${varName}${curVal - 1}`);
}
function configAdd(varName) {
    let curVal = parseInt($(`#${varName}-value`).html());
    $(`#${varName}-value`).html(curVal + 1);
    socket.emit(`web-config`, `${varName}${curVal + 1}`);
}

$(document).ready(function () {
    console.log("ready!");
    socket.emit(`web-join`, '');

    socket.on('connect', function () {
        console.log("reconnected");
        socket.emit(`web-join`, '');
    });

    // ping
    socket.on('web-res-ping-value', function (value) {
        let values = value.split(":");
        robotIDs[values[0]] = true;
        if ($(`#ping-value-${values[0]}`).length == 0) { //not found
            $('#ping-group').append(`<div id="${`ping-value-${values[0]}`}">${"Robot" + Object.keys(robotIDs).indexOf(values[0]) + " ping : " + values[1] + "ms"}</div>`);
        } else {
            if (!isNaN(values[1])) {
                $(`#ping-value-${values[0]}`).html("Robot" + Object.keys(robotIDs).indexOf(values[0]) + " ping : " + values[1] + "ms");
            } else {
                $(`#ping-value-${values[0]}`).remove();
            }
        }
    });
    // live-camera
    socket.on('web-livecam', function (img64) {
        $("#camera-image").attr("src", `data:image/jpeg;base64,${img64}`);
    });

    // mouse-click
    $('.button-circle').on('mousedown', function () {
        lastMouseClick = true;


        let directionCode = $(this)[0].innerHTML;
        $("#route-textarea").val($("#route-textarea").val() + directs[directionCode]);
        socket.emit('web-control-start', directionCode);
        console.log(`CONTROL START: ${directionCode} sent!`);
    }).on('mouseup', function () {
        lastMouseClick = false;
        let directionCode = $(this)[0].innerHTML;
        socket.emit('web-control-end', directionCode);
        console.log(`CONTROL END: ${directionCode} sent!`);
    }).on('mouseleave', function () {
        if (lastMouseClick) {
            lastMouseClick = false;
            let directionCode = $(this)[0].innerHTML;
            socket.emit('web-control-end', directionCode);
            console.log(`CONTROL END: ${directionCode} sent!`);
        }
    });

    // keypress
    $(document).on('keydown', function (e) {
        let keyCode = e.keyCode;
        if (keyCode != lastKeyCode) {
            keyDownAction(e.keyCode);
            lastKeyCode = keyCode;
        }
    }).on('keyup', function (e) {
        lastKeyCode = 0;
        keyUpAction(e.keyCode);
    });
});

function runRoute() {
    let routeStr = $("#route-textarea").val();
    console.log("ROUTE RUN: " + routeStr);
    socket.emit('web-route', routeStr);
}
function stopRoute() {
    socket.emit('web-route', "stop");
    console.log("ROUTE STOP");
}

// keyboard.js
function keyDownAction(keyCode) {
    let $btnASDW = null;
    switch (keyCode) {
        case 65: $btnASDW = $(".button-L"); break;//A
        case 83: $btnASDW = $(".button-D"); break;//S
        case 68: $btnASDW = $(".button-R"); break;//D
        case 87: $btnASDW = $(".button-U"); break;//W
    }
    if ($btnASDW != null) {
        $btnASDW.addClass("active");
        let directionCode = $btnASDW[0].innerHTML;
        console.log(`CONTROL START: ${directionCode} sent!`);
        socket.emit('web-control-start', directionCode);
    }
}
function keyUpAction(keyCode) {
    let $btnASDW = null;
    switch (keyCode) {
        case 65: $btnASDW = $(".button-L"); break;//A
        case 83: $btnASDW = $(".button-D"); break;//S
        case 68: $btnASDW = $(".button-R"); break;//D
        case 87: $btnASDW = $(".button-U"); break;//W
    }
    if ($btnASDW != null) {
        let directionCode = $btnASDW[0].innerHTML;
        $("#route-textarea").val($("#route-textarea").val() + directs[directionCode]);
        $btnASDW.removeClass("active");
        console.log(`CONTROL END: ${directionCode} sent!`);
        socket.emit('web-control-end', directionCode);
    }
}