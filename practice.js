let cache = require('./cache')
let mycache = new cache(12345)
mycache.register_cache('key1', 2);

mycache.add_cache('key1', 'value1')
mycache.get_cache('key1', (data)=> {
  console.log(data)
});