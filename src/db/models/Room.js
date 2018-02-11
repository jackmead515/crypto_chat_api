const mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({

});

var Room = mongoose.model('Rooms', RoomSchema);

module.exports = {
  Room
}
