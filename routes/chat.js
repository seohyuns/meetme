exports.init = function(io) {
	var currentUsers = 0; 
	var people={};
/*
*This section is for chat*/


	io.sockets.on('connection', function (socket) {

		++currentUsers;

		//emit user events to the current connection as well as other connections
		socket.emit('users', { number: currentUsers});
		socket.broadcast.emit('users', { number: currentUsers});

		socket.on('chat message', function(msg){
			io.emit('chat message', msg);
		});

		// socket.on("join", function(name){
  //       	socket.sockets.emit("update", name + " has joined the server.")
  //       	socket.sockets.emit("update-people", people);
		// })


		socket.on('disconnect', function(){
			--currentUsers;
			// socket.emit("update", people[user._id] + "has left the meetem"
			//delete.people[user._id]
			//socket.emit("update-people," people);
		})

	});

    // client.on("join", function(name){
    //     user.local.firstname
    //     client.emit("update", "You have connected to the server.");

    // });

    // client.on("disconnect", function(){
    // 	--currentMembers;
    //     socket.sockets.emit("update", people[client.id] + " has left the server.");
    //     delete people[client.id];
    //     socket.sockets.emit("update-people", people);
    // });


}

