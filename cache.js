var cache_manager = require('./cache_manager')
var Memcached = require('memcached');

class cache extends cache_manager {
    constructor(host, port, memory_limit) {
        super();
        this.memory_limit = memory_limit;
        this.memory_used = 0;
        this.caches = {};
        this.memcached_obj = new Memcached(host + ":" + port);
    };

    add_cache(key, value, params) {
        let add_cache_callback = (data) => {
            this.caches = data.caches;
            this.memory_used = data.memory_used;
            console.log("Memory used is " + data.memory_used);
        };
        return super.add_cache(key, value, params, this.caches, this.memory_used, this.memory_limit, this.memcached_obj, this.add_cache_callback);
    }

    get_cache(key, callback) {
        return super.get_cache(key, this.caches, this.memory_used, this.memory_limit, this.memcached_obj, callback, this.add_cache);
    }

}

module.exports = cache;