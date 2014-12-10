var socket = io();

$(document).ready(function() {
	console.log("the user is" + trigger.user);
	$('.chat').submit(function(e){
	console.log("submit");
	socket.emit('chat message', $('#m').val());

	$('#m').val('');
	return false;
	});


	socket.on('chat message', function(msg){
	$('#messages').append($("<li>").text(msg));
	});

	socket.on('users', function (data) {
	  console.log(data);
	  $("#numUsers").text(data.number);
	});


    socket.on("update-people", function(people){
        if(ready) {
            $("#people").empty();
            $.each(people, function(clientid, name) {
            $('#people').append("" + name + "");
            });
        }
    });


});