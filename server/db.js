const redis = require('redis');

const radisDb = () => {
  const client = redis.createClient();

  client.on('connect', () => {
    console.log('Redis client connected');
  });

  client.on('error', err => {
    console.log('Error ' + err);
  });

  client.on('ready', err => {
    console.log('Ready ');
  });

  require('bluebird').promisifyAll(client);
  return client;
};
module.exports = radisDb;