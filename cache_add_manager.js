class cache_add_manager {

    constructor() {
        this.data_type_memory_size = {
            STRING : 2,
            NUMBER : 8,
            BOOLEAN : 4
        };
    }

    get_object_size(obj) {
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
        return memory_size;
    };

    add_cache(key, value, caches, memory_used, memory_limit) {
        if(caches[key]) {
            let cache = caches[key];
            let memory_size = this.get_object_size(value);
            if(memory_size + memory_used > memory_limit) {
                memory_used = this.remove_least_used_caches(caches, memory_used, memory_limit);
            }
            cache['value'] = value;
            cache['memory_size'] = memory_size;
            cache['usage_count'] = 0;
            cache['time_of_caching'] = new Date().getTime();
            memory_used += memory_size;
        } else {
            console.log(key + " is not present");
        }
        return memory_used;
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

process.on('message', (data) => {
    try {
        let cache_add_manager_obj = new cache_add_manager();
        let memory_used = cache_add_manager_obj.add_cache(data.key, data.value, data.caches, data.memory_used, data.memory_limit);
        process.send({ 
            memory_used : memory_used
        });
    } catch(e) {
        console.error(e);
    }
});


module.exports = cache_add_manager;