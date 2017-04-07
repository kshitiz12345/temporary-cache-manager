var cache_manager = require('./cache_manager')

class cache extends cache_manager {
    constructor(memory_limit) {
        super();
        this.memory_limit = memory_limit;
        this.memory_used = 0;
        this.caches = {};
    };

    register_cache(key, expiration_time, backup) {
        return super.register_cache(key, expiration_time, backup, this.caches);
    }

    unregister_cache(key) {
        this.memory_used = super.unregister_cache(key, this.caches, this.memory_used);
    }

    add_cache_callback(data) {
        return (data) => {
            this.caches = data.caches;
            this.memory_used = data.memory_used;
            console.log("Memory used is " + data.memory_used);
        }
    }

    add_cache(key, value) {
        return super.add_cache(key, value, this.caches, this.memory_used, this.memory_limit, this.add_cache_callback());
    }

    get_cache(key, callback) {
        return super.get_cache(key, this.caches, this.memory_used, this.memory_limit, callback, this.add_cache_callback());
    }

}

module.exports = cache;