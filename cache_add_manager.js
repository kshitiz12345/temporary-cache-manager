const memcached_manager = require('./memcached_manager');

class cache_add_manager {

    constructor() {
        this.data_type_memory_size = {
            STRING : 2,
            NUMBER : 8,
            BOOLEAN : 4
        };
    }

    get_meta_data_obj_size(params) {
        let meta_size = this.data_type_memory_size.NUMBER * 3; // For memory_size, usage_count and time_of_caching
        if(params && params['expiration_time']) {
            meta_size += this.data_type_memory_size.NUMBER;
        }

        return meta_size;
    }

    get_object_size(obj, params) {
        let memory_size = 0;
        let data_type_memory_size = this.data_type_memory_size;
        
        if(typeof obj === "number") {
            memory_size += data_type_memory_size.NUMBER;
        }
        else if(typeof obj === "string") {
            memory_size += data_type_memory_size.STRING * obj.length;
        }
        else if(typeof obj === "boolean") {
            memory_size += data_type_memory_size.BOOLEAN;
        }      
        else if(typeof obj === "object" && Array.isArray(obj))    {
            obj.forEach((singleObj) => {
                memory_size += get_object_size(singleObj);
            });
        }
        else if(typeof obj === "object" && !Array.isArray(obj))  {
            let keys = Object.keys(obj);
            keys.forEach((key) => {
                memory_size += data_type_memory_size.STRING * key.toString().length;
                memory_size += get_object_size(obj[key]);
            });
        }   

        memory_size += this.get_meta_data_obj_size(params);
        
        return memory_size;
    };

    add_cache(key, value, params, caches, memory_used, memory_limit) {
        
        let cache = {};
        if(memory_used > 0 && cache['memory_size']) 
            memory_used = memory_used - cache['memory_size'];
            
        let memory_size = this.get_object_size(value, params);
        let objects_to_be_memcached = null;
        if(memory_size + memory_used > memory_limit) {
            var returned_obj = this.remove_least_used_caches(caches, memory_used, memory_limit);
            memory_used = returned_obj.memory_used;
            objects_to_be_memcached = returned_obj.objects_to_be_memcached;
        }

        cache['value'] = value;
        cache['memory_size'] = memory_size;
        cache['usage_count'] = 0;
        cache['time_of_caching'] = new Date().getTime();

        if(params && params['expiration_time']) {
            cache['expiration_time'] = params['expiration_time'];
        };

        memory_used += memory_size;
        caches[key] = cache;
        
        return {
            caches : caches,
            memory_used : memory_used,
            objects_to_be_memcached : objects_to_be_memcached
        };
    };

    remove_least_used_caches(caches, memory_used, memory_limit) {
        let keys = Object.keys(caches);

        keys.sort((key1, key2) => {
            return caches[key1].usage_count - caches[key2].usage_count;
        });

        keys.forEach((key) => {
            let cache = caches[key];
            let memory_size = cache.memory_size;
            let value = cache.value;
            let expiration_time = cache.expiration_time || 0;
            objects_to_be_memcached[key] = {
                value : value,
                expiration_time : expiration_time
            };
            delete caches[key];
    
            memory_used = memory_used - memory_size;
            
            if(memory_used < memory_limit)
                return true;
        });

        return {
            memory_used : memory_used,
            objects_to_be_memcached : objects_to_be_memcached
        };
    }
}

process.on('message', (data) => {
    try {
        let cache_add_manager_obj = new cache_add_manager();
        let return_data = cache_add_manager_obj.add_cache(data.key, data.value, data.params, data.caches, data.memory_used, data.memory_limit);
        process.send(return_data);
    } catch(e) {
        console.error(e);
    }
});


module.exports = cache_add_manager;