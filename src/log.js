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
        
        /* logging functions */
        
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
        
        /* error monitoring, exception raising functions */
        
        watch: function(sectionDesc, callback) {
            try {
                callback();
            }
            catch (e) {
                module.exception(e, sectionDesc);
            } // try..catch
        },
        
        throwError: function(errorMsg) {
            // log the error
            module.error(errorMsg);
            throw new Error(errorMsg);
        },
        
        /* event handler functions */
        
        requestUpdates: function(callback) {
            listeners.push(callback);
        }
    };
    
    return module;
})();

