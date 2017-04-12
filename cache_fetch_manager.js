class cache_fetch_manager {

    get_cache(key, caches, memory, callback, add_cache_callback) {
        let promise = null;
        let cachedObj = caches[key];
        
        let getRejectedPromise = (message) => {
            return new Promise((resolve, reject) => {
                reject(message);
            });
        };

        let manage_backup = (backup) => {
            backup.then((data)=> {
                add_cache_callback(key, data, caches, memory);
                callback(new Promise((resolve, reject) => {
                        resolve(data);
                }));
            });
        };

        if(cachedObj) {
            let cachedValue = cachedObj.value;
            if(cachedValue) {
                if(cachedObj.expiration_time && (new Date(cachedObj['time_of_caching']) + (cachedValue.expiration_time * 86400000)
                    >= new Date().getTime())) {
                    callback(getRejectedPromise('Key expired'));
                } else {
                    cachedObj["usage_count"]++;
                    callback(new Promise((resolve, reject) => {
                            resolve(cachedValue);
                    }));
                }
                
            } else {
                let backup = cachedObj.backup;
                if(backup) {
                    manage_backup(backup);
                } else {
                    callback(getRejectedPromise('No backup provided'));
                }
            }
        } else {
            callback(getRejectedPromise('No key registered'));
        }
    };
}

module.exports = cache_fetch_manager;