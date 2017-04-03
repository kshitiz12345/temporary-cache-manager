let Worker = require('webworker-threads').Worker;
let cache_add_manager = require('./cache_add_manager');

class cache_manager {
    
    register_cache(key, expiration_time, backup, caches) {
        caches.key = {
            expiration_time : expiration_time,
            backup : backup
        };
        return true;
    };

    unregister_cache(key, caches) {
        if(caches[key]) {
            delete caches[key];
            return true;
        }
        return false;
    };


    add_cache(key, value, caches, memory_used, memory_limit, callback) {
        let worker = new Worker(() => {
            try {
                this.onmessage = (event) => {
                    var data = event.data;
                    let cache_add_manager = new data.cache_add_manager();
                    let memory_used = cache_add_manager.add_cache(data.key, data.value, data.caches, data.memory_used, data.memory_limit);
                    let data = {
                        memory_used : memory_used
                    }
                    postMessage(data);
                }
            } catch(e) {
                console.error(e.message);
            } 
        });

        let postData = {
            cache_add_manager : cache_add_manager,
            key : key,
            value : value,
            caches : caches,
            memory_used : memory_used,
            memory_limit : memory_limit,
            callback : callback
        };

        worker.onmessage = (event) => {
            callback(event.data);
        };
        worker.postMessage(postData);
    };

    get_cache(key, callback) {
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

exports.module = cache_manager;