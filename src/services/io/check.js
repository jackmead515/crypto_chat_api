const check = (socket, io, params, done) => {

  let room = io.sockets.adapter.rooms[params.room];

  if(room) {
    done(true);
  } else {
    done(false);
  }
}

module.exports = check
