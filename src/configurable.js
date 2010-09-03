GRUNT.configurable = function(target, configParams, configData, bindHelpers) {
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
    
    var targetData = configData ? configData : target;
    
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
                // if this is a read operation (no value), then read
                if (typeof value === "undefined") {
                    if (name in targetData) {
                        return targetData[name];
                    } // if
                }
                // otherwise, write
                else {
                    // if the name is an member of the target, then change the value
                    if (name in targetData) {
                        targetData[name] = value;
                    } // if

                    // if the target is observable then fire an event in the form of '%name%Changed' on target
                    if (target.trigger) {
                        target.trigger("configChanged", name, value);
                    } // if
                }
            } // if

            return target;
        };
    } // if
}; 
