var meetingModel = require ('../models/meetingMongoose.js');

//get meetings of the current user
// exports.getYourMeeting = function(request, response){
//     console.log("the getYourMeeting method in meetingRoutes.js was hit");
//     console.log(request);
//     meetingModel.getYourMeeting(user.local.firstname,
//         function(meeting){
//             response.render('yourTable', {e: meeting})
//         });
// }

exports.getYourMeetings = function(request, response) {
    console.log("the get meeting method in meetingRoutes.js was hit");
    meetingModel.getYourMeetings( 
    function(meeting){
        console.log("meetingRoutes getYourMeetings" + meeting);
        response.render('group', {e: meeting})
    });
}

exports.getOneMeeting = function(request,response) {
    console.log("the get getOneMeeting method in meetingRoutes.js was hit");
    console.log("request in getOneMeeting is" + request);
    meetingModel.getOneMeeting(request.params.meeting,
        function(meeting){
            response.render('group', {e:meeting})
        });
}

exports.getMeeting = function(request, response) {
    console.log("the get meeting method in meetingRoutes.js was hit");
    meetingModel.getMeeting(request.params.meeting_name, 
        function(meeting){
            console.log("response.render");
            response.render('table', {e: meeting})
        });
}


exports.putMeeting = function(request, response) {
    console.log("the put meeting method in meetingRoutes.js was hit");
    meetingModel.addMeeting( request.params.meeting_name, request.params.time, request.params.date, request.params.location, request.params.description,
        function(meeting){response.send(meeting);
            console.log("sent response");
    });     
}


exports.deleteMeeting = function(request, response) {
    console.log("the delete meeting method in meetingRoutes.js was hit");
    meetingModel.deleteMeeting("meeting", {meeting_name: request.params.meeting_name},
        function(meeting){ response.send(meeting)}
    );

}


exports.updateMeeting = function (request, response) {
    console.log("the update meeting method in meetingRoutes.js was hit");
    meetingModel.updateMeeting("meeting", { find: {meeting_name: request.params.meeting_name, time: request.params.time, date: request.params.date, location: request.params.location, description: request.params.description}},
        function(meeting){ response.send(meeting)}
        );
}


// In the case that no route has been matched
exports.errorMessage = function(req, res){
  var message = '<p>Error, did not understand path '+req.path+"</p>";
    // Set the status to 404 not found, and render a message to the user.
  res.status(404).send(message);
};

