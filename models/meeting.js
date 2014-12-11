
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var meetingSchema = Schema({
  meeting_name:  String,
  time: String,
  date: Date,
  location: String,
  description: Schema.Types.Mixed,
  activeUserId: Schema.ObjectId
});

module.exports = mongoose.model('meeting', meetingSchema);










