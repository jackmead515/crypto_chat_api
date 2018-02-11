const disconnect = (socket, io, params, done) => {

  console.log('Disconnect!')

  DBManager.getUser(socket.id).then((user) => {
    if(user) {

      user = JSON.parse(user);
      let room = user.room;
      socket.leave(user.room);

      let obj = Object.values(io.sockets.adapter.rooms[room]);
      let sockets = Object.keys(obj[0]); //Object.keys(io.sockets.adapter.sids);

      let fullUsers = [];
      let promises = sockets.map((s) => {
        return DBManager.getUser(s).then((u) => fullUsers.push(u));
      });

      Promise.all(promises).then(() => {
        io.in(room).emit('updateUserList', {users: fullUsers});
        io.in(room).emit('message', {from: 'Admin', admin: true, message: user.name + ' has left!'});

        DBManager.removeUser(socket.id).then((res) => {});
        socket.disconnect();

        done();
      });



       /*DBManager.getUserList(user.room).then((res) => {

        io.in(room).emit('updateUserList', {users: res});
        io.in(user.room).emit('message', {from: 'Admin', admin: true, message: user.name + ' has left!'});

        DBManager.removeUser(socket.id).then((res) => {});
        socket.disconnect();

      }).catch((err) => {
        console.log('disconncet: ' + err);
      });*/
    } else {
      DBManager.removeUser(socket.id).then((res) => {});
      socket.disconnect();
    }
  }).catch((err) => {

    DBManager.removeUser(socket.id).then((res) => {});
    socket.disconnect();
  });

}

module.exports = disconnect
