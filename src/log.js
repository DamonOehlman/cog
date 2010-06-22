GRUNT.Log = (function() {
    var listeners = [];
    
    function writeEntry(message, level, section) {
        if (typeof console !== 'undefined') {
            console[level]((section ? section + ": " : "") + message);
        } // if
        
        // if we have listeners, then tell them about the event
        for (var ii = 0; ii < listeners.length; ii++) {
            listeners[ii].call(module, message, level, section);
        } // for
    } // writeEntry
    
    function detectCallerSection(target) {
        return null;
    } // detectCallerSection
    
    // define the module
    var module = {
        id: "grunt.log",
        
        debug: function(message, logSection) {
            writeEntry(message, "debug", logSection);
        },
        
        info: function(message, logSection) {
            writeEntry(message, "info", logSection);
        },

        warn: function(message, logSection) {
            writeEntry(message, "warn", logSection);
        },

        error: function(message, logSection) {
            writeEntry(message, "error", logSection);
        },
        
        exception: function(error, logSection) {
            module.error(error.message, logSection);
            
            // iterate through the keys of the error and add them as info sections
            // TODO: make this targeted at the stack, etc
            for (var keyname in error) {
                module.info("ERROR DETAIL: " + keyname + ": " + error[keyname]);
            } // for
        },
        
        requestUpdates: function(callback) {
            listeners.push(callback);
        }
    };
    
    return module;
})();

