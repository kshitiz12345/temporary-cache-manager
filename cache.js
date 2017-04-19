var cache_manager = require('./cache_manager')

class cache extends cache_manager {
    constructor(memory_limit) {
        super();
        this.memory = {
            memory_limit : memory_limit,
            memory_used : 0
        }
        this.caches = {};
        this.caches_meta = {};
    };

    register_cache(key, params) {
        super.register_cache(key, params, this.caches_meta);
    }

    unregister_cache(key) {
        super.unregister_cache(key, this.caches, this.caches_meta, this.memory);
    }

    add_cache(key, value) {
        let callback = (data) => {
            this.caches = data.caches;
            this.memory = data.memory;
        }
        if(this.caches_meta[key])
            super.add_cache(key, value, this.caches, this.memory, callback);
        else
            console.log(key + " not present");
    }

    get_cache(key, callback) {
        let add_cache = this.add_cache.bind(this);
        return super.get_cache(key, this.caches, this.caches_meta, this.memory, callback, add_cache);
    }

}

module.exports = cache;