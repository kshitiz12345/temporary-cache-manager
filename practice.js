var cache = require('./cache')
var mycache = new cache(5000);

mycache.register_cache('key1', 123)
mycache.add_cache('key1', 'value1')
mycache.register_cache('key2', 123)
mycache.add_cache('key2', 'kshitiz agarwal')


// console.log(mycache.caches)
// mycache.get_cache('key1', (promise)=> {
//     promise.then((data) => {
//       console.log(data)
//     })
// });

// mycache.get_cache('key1', (promise)=> {
//     promise.then((data) => {
//       console.log(data)
//     }).catch((err)=> {
//       console.error(err);
//     });
// });

// var Memcached = require('memcached');
// var memcached_obj = new Memcached("localhost" + ":" + "11211");
// memcached_obj.set("key1", "value1", 11222323);
// console.log(memcached_obj.get("key"));