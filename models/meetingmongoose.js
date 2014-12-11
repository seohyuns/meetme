var Meeting = require('./meeting.js')

exports.showUsers = function(meeting_name){

};

function doError(err) {
  console.log("Got error " + err);
};

exports.addMeeting =  function(req, callback) {
  Meeting.create(
  {
    meeting_name: req.params.meeting_name, 
    time: req.params.time, 
    date: req.params.date, 
    location: req.params.location, 
    description: req.params.description,
    activeUserId: req.user._id
  },
  {safe:true},
  function(err, crsr) {
      if (err) doError(err);
      console.log("completed mongo insert");
      console.log(crsr);
      callback(crsr);
      console.log("done with insert callback");
  });
  console.log("leaving insert");
};

exports.getMeeting = function(meeting_name, callback) {
  Meeting.find({meeting_name: meeting_name},
  function(err, docs) {
  if (err) doError(err);
    console.log(err);
    callback(docs);
  });
};


//retrieves all the meetings that the current user is associated with. 
exports.getYourMeetings = function(user, callback){
  console.log("meetingmongoose.js getYourMeeting was hit");
  console.log("meetingmongoose.js" + user);
  Meeting.find({activeUserId: user.local._id},
    function(err,docs){
      if (err) doError(err);
        callback(docs);
    });
}

// meetingSchema.methods.getUserMeeting = function(meeting_name) {
//   var crsr = meetingSchema.find({meeting_name: meeting_name});
//   crsr.toArray(function(err, docs) {
//   if (err) doError(err);
//     callback(docs);
//   });
// };
exports.getOneMeeting = function(meeting, callback){
  Meeting.find({meeting_name : meeting_name},
        function(err,docs){
      if (err) doError(err);
        callback(docs);
    });
}

exports.showMeeting = function() {
  return collection;
};



exports.updateMeeting = function(meeting_name, time, location, description, user, callback) {
  Meeting.update(
  {meeting_name : meeting_name},
  {
      meeting_name: meeting_name,
      time: time,
      date: date,
      location: location,
      description: description,
      //activeUserId.push(user._id)
  },
  function(err,crsr) {
      if (err) doError(err);
      callback('Update succeeded');
  });        
};


module.exports.deleteMeeting = function(meeting_name) {
    // for (i = 0; i < meetingCollection.length; i++) {
    //     if (meetingCollection[i].meeting_name === meeting_name) {
    //         meetingCollection.splice(i, 1);
    //         return meetingCollection;
    //     }
    // }
  Meeting.remove({meeting_name: meeting_name});
};