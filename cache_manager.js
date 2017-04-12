const cache_fetch_manager = require('./cache_fetch_manager');
const memcached_manager = require('./memcached_manager');
const child_process = require('child_process');


class cache_manager {

    add_cache(key, value, params, caches, memory_used, memory_limit, memcached_obj, callback) {
        const cache_add_manager_process = child_process.fork("./cache_add_manager.js");
        
        let postData = {
            key : key,
            value : value,
            params : params,
            caches : caches,
            memory_used : memory_used,
            memory_limit : memory_limit
        };

        cache_add_manager_process.send(postData);

        cache_add_manager_process.on('message', (data) => {
            callback(data);
            if(data.objects_to_be_memcached) {
                let memcached_manager_obj = new memcached_manager(memcached_obj);
                memcached_manager_obj.add_cache(data.objects_to_be_memcached);
            }
        });
    };

    get_cache(key, caches, memory_used, memory_limit, memcached_obj, callback, add_cache_callback) {
        let cache_fetch_manager_obj = new cache_fetch_manager();
        cache_fetch_manager_obj.get_cache(key, caches, memory_used, memory_limit, memcached_obj, callback, add_cache_callback);
    };
}

module.exports = cache_manager;