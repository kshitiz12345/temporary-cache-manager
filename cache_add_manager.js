class cache_add_manager {
    get_object_size(obj) {
        let memory_size = 0;
        let data_type_memory_size = {
            STRING : 2,
            NUMBER : 8,
            BOOLEAN : 4
        };
        
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
        return memory_size;
    };

    add_cache(key, value, caches, memory_used, memory_limit) {
        if(caches[key]) {
            let cache = caches[key];
            let memory_size = this.get_object_size(value);
            if(memory_size + memory_used > memory_limit) {
                memory_used = remove_least_used_caches(caches, memory_used, memory_limit);
            }
            cache['value'] = value;
            cache['memory_size'] = memory_size;
            cache['usage_count'] = 0;
            memory_used += memory_size;
            
            return memory_used;
        }
        return null;
    };

    remove_least_used_caches(caches, memory_used, memory_limit) {
        let keys = Object.keys(caches);

        keys.sort((key1, key2) => {
            return caches[key1].usage_count - caches[key2].usage_count;
        });

        keys.forEach((key) => {
            let cache = caches[key];
            let memory_size = cache.memory_size;
            cache.value = null;
            cache.memory_size = 0;
            memory_used = memory_used - memory_size;
            if(memory_used < memory_limit)
                return true;
        });

        return memory_used;
    }

}

module.exports = cache_add_manager;