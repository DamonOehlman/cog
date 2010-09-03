GRUNT.configurable = function(target, configParams, callback, bindHelpers) {
    if (! target) { return; }
    
    /* internal functions */
    
    function attachHelper(helperName) {
        // if the helper is not defined, then attach
        if (! target[helperName]) {
            target[helperName] = function(value) {
                return target.configure(helperName, value);
            };
        } // if
    } // attachHelper
    
    function getSettings() {
        return target.configurableSettings;
    } // getSettings
    
    function getConfigCallbacks() {
        return target.configCallbacks;
    } // getConfigGetters
    
    /* initialization code */
    
    var ii;
    
    // if the target doesn't yet have a configurable settings member, then add it
    if (! getSettings()) {
        target.configurableSettings = {};
    } // if
    
    if (! getConfigCallbacks()) {
        target.configCallbacks = [];
    } // if
    
    // add the callback to the list
    getConfigCallbacks().push(callback);
    
    for (ii = configParams.length; ii--; ) {
        target.configurableSettings[configParams[ii]] = true;
        
        if (bindHelpers) {
            attachHelper(configParams[ii]);
        } // if
    } // for
    
    if (! target.configure) {
        target.configure = function(name, value) {
            var configurableSettings = getSettings(),
                callbacks = getConfigCallbacks();
            
            if (configurableSettings[name]) {
                for (var ii = callbacks.length; ii--; ) {
                    var result = callbacks[ii](name, value);
                    if (typeof result !== "undefined") {
                        return result;
                    } // if
                } // for
                
                // if the target is observable then fire an event in the form of '%name%Changed' on target
                if (target.trigger) {
                    target.trigger("configChanged", name, value);
                } // if

                return target;
            } // if
            
            return null;
        };
    } // if
}; 
