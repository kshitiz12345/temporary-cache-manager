const memcached_manager = require('./memcached_manager');

class cache_add_manager {

    constructor() {
        this.data_type_memory_size = {
            STRING : 2,
            NUMBER : 8,
            BOOLEAN : 4
        };
    }

    get_meta_data_obj_size(expiration_time) {
        let meta_size = this.data_type_memory_size.NUMBER * 3; // For memory_size, usage_count and time_of_caching
        if(expiration_time) {
            meta_size += this.data_type_memory_size.NUMBER;
        }

        return meta_size;
    }

    get_object_size(obj, expiration_time) {
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

        memory_size += this.get_meta_data_obj_size(expiration_time);
        
        return memory_size;
    };

    add_cache(key, value, caches, memory) {
        
        let message = "";
        let memory_limit = memory.memory_limit;
        let memory_used = memory.memory_used;
        try {
            if(!caches[key]) {
                message = key + " not registered";
            } else {
                let cache = caches[key] || {};
                if(memory_used > 0 && cache['memory_size']) 
                    memory_used = memory_used - cache['memory_size'];
                    
                let memory_size = this.get_object_size(value, caches[key].expiration_time);

                if(memory_size + memory_used > memory_limit) {
                    var returned_obj = this.remove_least_used_caches(caches, memory_used, memory_limit);
                    memory_used = returned_obj.memory_used;
                }

                cache['value'] = value;
                cache['memory_size'] = memory_size;
                cache['usage_count'] = 0;
                cache['time_of_caching'] = new Date().getTime();
                
                memory_used += memory_size;
                
                if(!caches[key])
                    caches[key] = cache;
                
                memory.memory_limit = memory_limit;    
                memory.memory_used = memory_used;

                message = key + " added successfully";
            }
        } catch(e) {
            message = e;
        }
        
        console.log(message);
    };

    remove_least_used_caches(caches, memory_used, memory_limit) {
        let keys = Object.keys(caches);

        keys.sort((key1, key2) => {
            return caches[key1].usage_count - caches[key2].usage_count;
        });

        keys.forEach((key) => {
            let memory_size = caches[key].memory_size;
            delete caches[key];
            memory_used = memory_used - memory_size;
            
            if(memory_used < memory_limit)
                return true;
        });

        return {
            memory_used : memory_used
        };
    }
}

process.on('message', (data) => {
    try {
        let cache_add_manager_obj = new cache_add_manager();
        cache_add_manager_obj.add_cache(data.key, data.value, data.caches, data.memory);
    } catch(e) {
        console.error(e);
    }
});


module.exports = cache_add_manager;