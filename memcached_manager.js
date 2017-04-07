class memcached_manager {

    constructor(memcached_obj) {
        this.memcached_obj = memcached_obj;
    }

    add_cache(key, value, expiration_time, callback) {
        this.memcached_obj.set(key, value, expiration_time, function (err) { 
            callback(new Promise((resolve, reject)=> {
                if(err) reject(key, err);
                else resolve(key);
            }));
        });
    };

    get_cache(key, callback) {
        this.memcached_obj.get(key, function (err, data) {
            callback(new Promise((resolve, reject)=> {
                if(err) reject(err);
                else resolve(data);
            }));
        });
    }
}

exports.module = memcached_manager;