const cache_fetch_manager = require('./cache_fetch_manager');
const memcached_manager = require('./memcached_manager');
const child_process = require('child_process');


class cache_manager {

    register_cache(key, expiration_time, backup, caches) {
        caches[key] = {
            expiration_time : expiration_time,
            backup : backup
        };
        console.log(key + " registered successfully");
        return true;
    };

    unregister_cache(key, caches, memory_used) {
        if(caches[key]) {
            let cache = caches[key];
            if(memory_used > 0)
                memory_used = memory_used - cache['memory_size'];
            delete caches[key];
            console.log(key + " removed successfully");
            return memory_used;
        } else {
            console.log(key +  " not present");
            return memory_used;
        }
        
    };

    add_cache(key, value, caches, memory) {
        const cache_add_manager_process = child_process.fork("./cache_add_manager.js");
        
        let postData = {
            key : key,
            value : value,
            caches : caches,
            memory : memory
        };

        cache_add_manager_process.send(postData);

        cache_add_manager_process.on('message', (data) => {
            console.log(data.message);
        });
    };

    get_cache(key, caches, memory, callback, add_cache_callback) {
        let cache_fetch_manager_obj = new cache_fetch_manager();
        cache_fetch_manager_obj.get_cache(key, caches, memory, callback, add_cache_callback);
    };
}

module.exports = cache_manager;