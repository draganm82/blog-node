const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');


const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);


const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options ={}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  return this;

}


mongoose.Query.prototype.exec = function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
const key = JSON.stringify(Object.assign({}, this.getQuery (), {
    collection: this.mongooseCollection.name
  })
);
//see the key element in an db
const cacheValue = client.hget(this.hashKey,key);

//if exiusted return that
if (cacheValue) {
  //console.log(cacheValue);
  const doc = JSON.parse.cacheValue;

  Array.isArray(doc)
  ? doc.map(d=> new this.model(d))
  : new this.model(doc);


}
//else return the key and store in  redis



const result = exec.apply(this, arguments);

client.set( key, JSON.stringify(result), 'EX',10);
//console.log(result.validate);
return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
