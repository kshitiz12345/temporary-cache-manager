Temporary cache manager is in memory caching management system where data is cached in heap memory. Maximum data that can be cached is provided in bytes and LRU approach is used to manage data overflow. Backup can be attached for every key that will be used in case its value is flushed out. 

To start using caching , install the module and initialize the manager by creating new instance and passing size limit in bytes as parameter:-

var temporary_cache_manager = require('temporary-cache-manager')
var cache = temporary_cache_manager.cache;
var limit = 50;
var mycache = new cache(limit);

You need to register every key that you will be using in your project.

mycache.
