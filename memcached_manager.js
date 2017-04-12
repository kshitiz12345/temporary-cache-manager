class memcached_manager {

    constructor(memcached_obj) {
        this.memcached_obj = memcached_obj;
    }

    add_cache(objects) {
        let keys = Object.keys(objects), that = this;
        console.log("objects " + JSON.stringify(objects))
        keys.forEach((key) => {
            console.log("Setting value in memcache");
            console.log("For key " + key)
            console.log("Data " + JSON.stringify(objects[key]))
            that.memcached_obj.set(key, objects[key].value, 123456);
        });
        
    };

    get_cache(key, callback) {
        console.log("Getting value in memcache");
            console.log("For key " + key)
        this.memcached_obj.get(key, function (err, data) {
            console.log("Data " + JSON.stringify(data));
            callback(new Promise((resolve, reject)=> {
                if(err) reject(err);
                else resolve(data);
            }));
        });
    }
}

module.exports = memcached_manager;