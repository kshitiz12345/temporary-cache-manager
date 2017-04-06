const cache_fetch_manager = require('./cache_fetch_manager');
const child_process = require('child_process');

class cache_manager {

    constructor() {

    };
    
    register_cache(key, expiration_time, backup, caches) {
        caches[key] = {
            expiration_time : expiration_time,
            backup : backup
        };
        console.log(key + " added successfully");
        return true;
    };

    unregister_cache(key, caches) {
        if(caches[key]) {
            delete caches[key];
            console.log(key + " removed successfully");
            return true;
        } else {
            console.log(key +  " not present");
            return false;
        }
        
    };


    add_cache(key, value, caches, memory_used, memory_limit, callback) {
        const cache_add_manager_process = child_process.fork("./cache_add_manager.js");
        
        let postData = {
            key : key,
            value : value,
            caches : caches,
            memory_used : memory_used,
            memory_limit : memory_limit,
            callback : callback
        };

        cache_add_manager_process.send(postData);

        cache_add_manager_process.on('message', (data) => {
            callback(data);
        });
    };

    get_cache(key, caches, memory_used, memory_limit, callback, add_cache_callback) {
        let cache_fetch_manager_obj = new cache_fetch_manager();
        cache_fetch_manager_obj.get_cache(key, caches, memory_used, memory_limit, callback, add_cache_callback);
    };
}

module.exports = cache_manager;