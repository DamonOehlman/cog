cog.configurable = (function() {

    function attach(target, settings, watchlist, key) {
        if (typeof target[key] == 'undefined') {
            target[key] = function(value) {
                if (typeof value != 'undefined') {
                    settings[key] = value;

                    // if the key is in the watchlist, then call the method
                    if (watchlist[key]) {
                        watchlist[key](value);
                    } // if

                    // return the target for chain friendliess
                    return target;
                }
                else {
                    return settings[key];
                }
            };
        } // if
    } // attach
    
    return function(target, settings, watchlist) {
        // if the settings have not been supplied, use the target
        settings = settings || target;
        
        // iterate through the target and expose each of the settings as configurable methods
        // if not defined already
        for (var key in settings) {
            if (typeof settings[key] != 'function') {
                attach(target, settings, watchlist, key);
            } // if
        } // for
        
        return target;
    }; // _configurable
})();

