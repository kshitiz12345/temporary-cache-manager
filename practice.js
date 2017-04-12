var cache = require('./cache')
var mycache = new cache(50);

let backup = () => {
    return new Promise((resolve, reject) => {
        resolve("value1");
    })
}

mycache.register_cache('key1', {
    expiration_time : 221321,
    backup : backup()
});
mycache.add_cache('key1', 'value1')
mycache.register_cache('key2', {
    expiration_time : 221321,
    backup : null
})
mycache.add_cache('key2', 'honey agarwal qwdqwd qwdwqdwqdqwdq')

mycache.register_cache('key3', 1223323)
mycache.add_cache('key3', 'kshtiiz agarwal')


// console.log(mycache.caches)
mycache.get_cache('key1', (promise)=> {
    promise.then((data) => {
      console.log(data)
    })
});
