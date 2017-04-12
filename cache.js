var cache_manager = require('./cache_manager')
var Memcached = require('memcached');

class cache extends cache_manager {
    constructor(memory_limit) {
        super();
        this.memory = {
            memory_limit : memory_limit,
            memory_used : 0
        }
        this.caches = {};
    };

    register_cache(key, expiration_time, backup) {
        return super.register_cache(key, expiration_time, backup, this.caches);
    }

    unregister_cache(key) {
        this.memory_used = super.unregister_cache(key, this.caches, this.memory_used);
    }

    add_cache(key, value) {
        return super.add_cache(key, value, this.caches, this.memory);
    }

    get_cache(key, callback) {
        return super.get_cache(key, this.caches, this.memory, callback, this.add_cache);
    }

}

module.exports = cache;