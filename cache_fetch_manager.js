class cache_fetch_manager {

    get_cache(key, caches, memory_used, memory_limit, memcached_obj,  callback, add_cache_callback) {
        let promise = null;
        
        let getRejectedPromise = (message) => {
            return new Promise((resolve, reject) => {
                reject(message);
            });
        };
       
        if(caches[key] && caches[key].value) {
            let cachedObj = caches[key];
            let cachedValue = cachedObj.value;
            if(cachedObj.expiration_time && (new Date(cachedObj['time_of_caching']) + (cachedValue.expiration_time * 1000)
                >= new Date().getTime())) {
                callback(getRejectedPromise('Data expired'));
            } else {
                cachedObj["usage_count"]++;
                callback(new Promise((resolve, reject) => {
                        resolve(cachedValue);
                }));
            }
            
        } else {
            let memcached_manager = require('./memcached_manager');
            let memcached_manager_obj = new memcached_manager(memcached_obj);
            let memcached_manager_callback = (promise) => {
                promise.then((data)=> {
                    console.log("-------------------------------------------------------------")
                    console.log(JSON.stringify(data))
                    callback(data.value);
                    add_cache_callback(key, data.value, {
                        expiration_time : data.expiration_time
                    });
                });
            };
            memcached_manager_obj.get_cache(key, memcached_manager_callback);
        }
    };
}

module.exports = cache_fetch_manager;