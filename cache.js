var cache_manager = require('./cache_manager')

class cache extends cache_manager {
    constructor(memory_limit) {
        this.memory_limit = memory_limit;
        this.memory_used = 0;
        this.caches = {};
    };

    register_cache(key, expiration_time, backup) {
        return super.register_cache(key, expiration_time, backup, this.caches);
    }

    unregister_cache(key) {
        return super.unregister_cache(key, this.caches);
    }

    add_cache(key, value) {
        let callback = (data) => {
            this.memory_used = data.memory_used;
        };
        return super.add_cache(key, value, this.caches, this.memory_used, this.memory_limit, callback);
    }

    get_cache(key, callback) {
        return super.get_cache(key, callback);
    }

}