const redis = require('redis');

var client = redis.createClient({host : 'localhost', port : 6379});

var user1 = {id: '1234'};
var user2 = {id: '2345'};
var user3 = {id: '5472'};
var user4 = {id: '3356'};

const addUser = (user) => {
  return new Promise((resolve, reject) => {
    client.sadd('users', JSON.stringify(user), (err, res) => {
      if(err) reject(err);

      if(res === 1) {
        resolve('User saved');
      } else {
        reject('User already exists');
      }
    });
  });
};

const addUserToRoom = (user, room) => {
  return new Promise((resolve, reject) => {
    client.sadd(room, JSON.stringify(user), (err, res) => {
      if(err) reject(err);

      if(res === 1) {
        resolve('User saved to room');
      } else {
        reject('User already exists in room');
      }
    });
  });
};

client.on('connect', () => {
  client.del('users', (err, res) => {
    client.del('room:room1', (err, res) => {
      client.del('room:room2', (err, res) => {

        let room1 = 'room:room1';
        let room2 = 'room:room2';

        client.hmset('users', '1', 'Jack', '2', 'Maria', '3', 'Pickle', (err, res) => {
          client.hgetall('users', (err, res) => {

            console.log(Object.values(res));

          });
        });

        /*addUser(user1).then((res) => {
          console.log(res);
          return addUser(user2);
        }).then((res) => {
          console.log(res);
          return addUser(user3);
        }).then((res) => {
          console.log(res);
          return addUser(user4);
        }).then((res) => {
          console.log(res);

          client.smembers('users', (err, res) => {
            if(err) console.log(err);
            console.log(res);
            let arr = JSON.parse(`[${res}]`);
            let u1 = arr.find((u) => u.id === user1.id);
            console.log('User 1: ' + JSON.stringify(u1));

            addUserToRoom(user1, room1).then((res) => {
              return addUserToRoom(user1, room1);
            }).then((res) => {
              console.log(res);
            }).catch((err) => {
              console.log(err);
            })
          });
        });*/

      });
    });
  });
});


/**
  set -- sets a string to a value
  get -- gets a value from a string

  hmset -- sets an object to string
  hgetall -- gets the object from the string

  rpush -- stores a list by a string
  lrange -- gets a list by a string

  sadd -- sets a non-duplicate list by a string
  smembers -- gets a non-duplicate list by a string

  exists -- checks if key already exists

  del -- deletes a key

  expire -- automatically deletes a key after a given value
*/
