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

    mycache.add_cache('key1', 'value1')
    mycache.add_cache('key2', 'honey agarwal qwdqwd qwdwqdwqdqwdq')
    mycache.add_cache('key3', 'kshtiiz agarwal')

let temp = 0;
let arr = ['key1', 'key2', 'key3', 'key4'];
setInterval(function(){

    // console.log(mycache.caches)
mycache.get_cache(arr[temp], (promise)=> {
    promise.then((data) => {
      console.log(data)
      console.log(mycache)
    }).catch((data)=>{
        console.log(data)
    }).then(()=>{
        temp++;
      if(temp > 3)
        temp=0;
    });
});
}, 1000)




