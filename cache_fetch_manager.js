var Worker = require('webworker-threads').Worker;

class cache_fetch_manager {

    get_cache(key, caches, callback) {
        let promise = null;
        let cachedObj = caches[key];
        let getRejectedPromise = (message) => {
            return new Promise((resolve, reject) => {
                reject(message);
            });
        };
        if(cachedObj) {
            let cachedValue = cachedObj.value;
            if(cachedValue) {
                callback(new Promise((resolve, reject) => {
                                resolve(cachedValue);
                }));
            } else {
                let backup = cachedObj.backup;
                if(backup) {
                    backup.then((data)=> {
                        cachedObj.value = data;
                        callback(new Promise((resolve, reject) => {
                                resolve(data);
                        }));
                    });
                } else {
                    promise = getRejectedPromise('No backup provided');
                }
            }
        } else {
            promise = getRejectedPromise('No key registered');
        }
        return promise;
    };
}

