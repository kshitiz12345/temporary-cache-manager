Temporary cache manager is in memory caching management system where data is cached in heap memory. Maximum data that can be cached is provided in bytes and LRU approach is used to manage data overflow. Backup can be attached for every key that will be used in case its value is flushed out. 

To start using caching , install the module and initialize the manager by creating new instance and passing size limit in bytes as parameter:-


var temporary_cache_manager = require('temporary-cache-manager')

var cache = temporary_cache_manager.cache;

var size_limit = 50;

var mycache = new cache(size_limit);



You need to register every key that you will be using in your project.

--  mycache.register_cache(key, params)

    Here, we register cache key along with an object as params. Params would contain the following properties:-
       1) expiration_time: Key expiration time in seconds
       2) backup: Callback function wich would return a promise containing data fetched from third party source in case its                     not available in cache.
       
-- mycache.unregister_cache(key)

     Here, we unregister the key from cache.
     
-- add_cache(key, value)     

     Here, we add value to key. Key should be registered in cache.
     
-- get_cache(key, callback)

     Here, we get the key value in form of promise which on resolve would pass on the data.
