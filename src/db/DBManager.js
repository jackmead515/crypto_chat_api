const redis = require('redis');

const addUser = (user) => {

};

class DBManager {

  constructor() {
    this.users = [];
    this.connected = false;
    this.redisdb = redis.createClient({host : 'localhost', port : 6379});

    this.redisdb.on('connect', () => {
      this.redisdb.flushdb((err, res) => {
        this.connected = true
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
  }

  addUser(room, user) {
    return new Promise((resolve, reject) => {
      if(!this.connected) return reject('Not connected');

      let userId = `user:${user.id}`;
      let userValue = JSON.stringify(user);

      this.redisdb.setnx(userId, userValue, (err, res) => {
        if(err) return reject(err);
        if(res === 0) return reject('User already exists');

        return resolve('User saved');
      });
    });
  }

  removeUser(id) {
    return new Promise((resolve, reject) => {
      if(!this.connected) return reject('Not connected');

      let userId = `user:${id}`;

      this.redisdb.del(userId, (err, res) => {
        if(err) return reject(err);
        if(res === 0) return resolve('User not found');
        return resolve('User removed');
      });
    });
  }

  getUser(id) {
    return new Promise((resolve, reject) => {
      if(!this.connected) return reject('Not connected');

      let userId = `user:${id}`;

      this.redisdb.get(userId, (err, res) => {
        if(err) return reject(err);
        return resolve(res);
      });
    });
  }

  getUsers(idArr) {
    let promises = [];
    let users = [];
    for(let i = 0; i < idArr.length; i++) {
      promises.push(new Promise((resolve, reject) => {
        let id = idArr[i];
        let userId = `user:${id}`;
        this.redisdb.get(userId, (err, res) => {
          if(err) resolve(null);
          resolve(res)
        });
      }));
    }

    return Promise.all(promises);
  }
}

module.exports = DBManager;
