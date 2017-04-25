class cache_fetch_manager {

    get_cache(key, caches, caches_meta, memory, callback, add_cache_callback) {
        let promise = null;
        let cached_meta_obj = caches_meta[key];
        
        let getRejectedPromise = (message) => {
            return new Promise((resolve, reject) => {
                reject(message);
            });
        };

        let manage_backup = (backup) => {
            backup().then((data)=> {
                add_cache_callback(key, data, caches, memory);
                callback(new Promise((resolve, reject) => {
                        resolve(data);
                }));
            });
        };

        if(cached_meta_obj) {
            let cache = caches[key];
            if(cache) {
                let expiration_time = cached_meta_obj.expiration_time;
                if(expiration_time && (cache['time_of_caching'] + (expiration_time * 1000)
                    < (new Date().getTime()))) {
                    callback(getRejectedPromise(key + ' is expired'));
                } else {
                    cache["usage_count"]++;
                    callback(new Promise((resolve, reject) => {
                            resolve(cache.value);
                    }));
                }
                
            } else {
                let backup = cached_meta_obj.backup;
                if(backup) {
                    manage_backup(backup);
                } else {
                    callback(getRejectedPromise('No backup provided for ' + key));
                }
            }
        } else {
            callback(getRejectedPromise(key + ' not registered'));
        }
    };
}

module.exports = cache_fetch_manager;