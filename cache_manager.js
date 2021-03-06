const cache_fetch_manager = require('./cache_fetch_manager');
const child_process = require('child_process');


class cache_manager {

    register_cache(key, params, caches_meta) {
        caches_meta[key] = {
            expiration_time : params.expiration_time,
            backup : params.backup
        };
        console.log(key + " registered successfully");
        return true;
    };

    unregister_cache(key, caches, caches_meta, memory) {
        if(caches_meta[key]) {
            delete caches_meta[key];
            if(caches[key]) {
                let memory_used = memory.memory_used;
                let cache = caches[key];
                if(memory_used > 0)
                    memory_used = memory_used - cache['memory_size'];
                delete caches[key];
                memory.memory_used = memory_used;
            }
            console.log(key + " removed successfully");
        } else {
            console.log(key +  " not present");
        }
        
    };

    add_cache(key, value, caches, memory, callback) {
        const cache_add_manager_process = child_process.fork("./cache_add_manager.js");
        
        let postData = {
            key : key,
            value : value,
            caches : caches,
            memory : memory
        };
        
        cache_add_manager_process.send(postData);

        cache_add_manager_process.on('message', (data) => {
            callback(data);
        });
    };

    get_cache(key, caches, caches_meta, memory, callback, add_cache_callback) {
        let cache_fetch_manager_obj = new cache_fetch_manager();
        cache_fetch_manager_obj.get_cache(key, caches, caches_meta, memory, callback, add_cache_callback);
    };
}

module.exports = cache_manager;