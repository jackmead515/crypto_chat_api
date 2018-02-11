const { getRandomColor } = require('../../util/util');

const join = (socket, io, params, done) => {
  const { name, room } = params;

  console.log('Join!');

  socket.leave(room);
  socket.join(room);

  let color = getRandomColor();
  let user = {name, id: socket.id, color, room};

  DBManager.removeUser(socket.id).then(() => {
    DBManager.addUser(room, user).then(() => {

      let obj = Object.values(io.sockets.adapter.rooms[room]);
      let sockets = Object.keys(obj[0]); //Object.keys(io.sockets.adapter.sids);

      let fullUsers = [];
      let promises = sockets.map((s) => {
        return DBManager.getUser(s).then((u) => fullUsers.push(u));
      });

      Promise.all(promises).then(() => {
        io.in(room).emit('updateUserList', {users: fullUsers});
        socket.broadcast.to(room).emit('message', {from: 'Admin', admin: true, message: name + ' has joined!'});
        done();
      });

    }).catch((err) => {
      console.log('JOIN 1: ' + err);
      done(err);
    });
  }).catch((err) => {
    console.log('JOIN 2: ' + err);
    done('Server error');
  });
}

module.exports = join;
