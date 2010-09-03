GRUNT.configurable = function(target, configParams, bindHelpers) {
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
    
    /* initialization code */
    
    // if the target doesn't yet have a configurable settings member, then add it
    if (! getSettings()) {
        target.configurableSettings = {};
    } // if
    
    for (var ii = configParams.length; ii--; ) {
        target.configurableSettings[configParams[ii]] = true;
        
        if (bindHelpers) {
            attachHelper(configParams[ii]);
        } // if
    } // for
    
    if (! target.configure) {
        target.configure = function(name, value) {
            var configurableSettings = getSettings();
            
            if (configurableSettings[name]) {
                // if the name is an member of the target, then change the value
                if (target[name]) {
                    target[name] = value;
                } // if

                // if the target is observable then fire an event in the form of '%name%Changed' on target
                if (target.trigger) {
                    target.trigger("configChanged", name, value);
                } // if
            } // if

            return target;
        };
    } // if
}; 
