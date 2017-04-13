var cache = require('./cache')
var mycache = new cache(50);

let backup = (text) => {
    return new Promise((resolve, reject) => {
        resolve(text);
    })
}

mycache.register_cache('key1', {
    expiration_time : 10,
    backup : backup('value1')
});


mycache.register_cache('key2', {
    expiration_time : 221321,
    backup : backup('value2')
})

mycache.register_cache('key3', {
    expiration_time : 221321,
    backup : backup('value3')
})

setTimeout(function(){
    mycache.add_cache('key1', 'value1')
    mycache.add_cache('key2', 'honey agarwal qwdqwd qwdwqdwqdqwdq')
    mycache.add_cache('key3', 'kshtiiz agarwal')
    // console.log(mycache.caches)
mycache.get_cache('key1', (promise)=> {
    promise.then((data) => {
      console.log(data)
    })
});
}, 5000)




