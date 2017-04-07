let cache = require('./cache')
let mycache = new cache(12345)
mycache.register_cache('key1', 2);

mycache.add_cache('key1', 'value1')
mycache.get_cache('key1', (promise)=> {
    promise.then((data) => {
      console.log(data)
    })
});

mycache.get_cache('keyw', (promise)=> {
    promise.then((data) => {
      console.log(data)
    }).catch((err)=> {
      console.error(err);
    });
});