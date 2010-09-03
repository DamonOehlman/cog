GRUNT.Storage = (function() {
    function getStorageScope(scope) {
        if (scope && (scope == "session")) {
            return sessionStorage;
        } // if
        
        return localStorage;
    } // getStorageTarget

    return {
        get: function(key, scope) {
            // get the storage target
            var value = getStorageScope(scope).getItem(key);
            
            // if the value looks like serialized JSON, parse it
            return (/^(\{|\[).*(\}|\])$/).test(value) ? JSON.parse(value) : value;
        },
        
        set: function(key, value, scope) {
            // if the value is an object, the stringify using JSON
            var serializable = jQuery.isArray(value) || jQuery.isPlainObject(value);
            var storeValue = serializable ? JSON.stringify(value) : value;
            
            // save the value
            getStorageScope(scope).setItem(key, storeValue);
        },
        
        remove: function(key, scope) {
            getStorageScope(scope).removeItem(key);
        }
    };
})();
