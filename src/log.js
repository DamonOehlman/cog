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
            writeEntry(message, "debug", logSection ? logSection : detectCallerSection(caller) );
        },
        
        info: function(message) {
            writeEntry(message, "info", logSection ? logSection : detectCallerSection(caller) );
        },

        warn: function(message) {
            writeEntry(message, "warn", logSection ? logSection : detectCallerSection(caller) );
        },

        error: function(message) {
            writeEntry(message, "error", logSection ? logSection : detectCallerSection(caller) );
        },
        
        exception: function(error) {
            module.error(error.message);
        },
        
        requestUpdates: function(callback) {
            listeners.push(callback);
        }
    };
    
    return module;
})();
