const message = (socket, io, params, done) => {

  const { message } = params;

  console.log('Message!');

  DBManager.getUser(socket.id).then((user) => {
    if(user) {
      user = JSON.parse(user);
      io.in(user.room).emit('message', {from: user.name, message});
    } else {
      console.log('User not found');
    }
  }).catch((err) => {
    console.log('MESSAGE: ' + err);
  });
};

module.exports = message;
