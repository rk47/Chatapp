var app = require("express")();
var http = require ("http").Server(app);
var io = require("socket.io")(http);
var users = [];
var onLineuser = [];

app.get("/", function (req,res) {
    res.sendFile(__dirname+"/index.html");

});

io.sockets.on("connection", function (socket) {
    users.push(socket);
    console.log("New User Connected " + users.length),

        socket.on("disconnect", function () {
            users.splice(users.indexOf(socket), 1);
            onLineuser.splice(onLineuser.indexOf(socket.username), 1);
            console.log("User Disconnected " + users.length);
        });

    socket.on("new user", function (data) {
        socket.username = data;
        onLineuser.push(socket.username);
        console.log("User Connected" + socket.username);
        updateuser();

    });

    socket.on("msg", function (name, msg) {
        io.sockets.emit("rmsg", {name: name, msg: msg});

    });

    function updateuser() {
        io.sockets.emit("get user", onLineuser);

    }
});



http.listen(4000, function () {
    console.log("Server Created With This Port 4000");

});
