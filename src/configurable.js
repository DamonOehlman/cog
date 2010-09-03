GRUNT.Configurable = function(target, configParams, bindHelpers) {
    if (! target) {
        GRUNT.Log.warn("Um, make what configurable exactly?");
        return;
    } // if
    
    if (target.configure) {
        GRUNT.Log.warn("Cannot make the object configurable, it already is - I think...");
        return;
    } // if
    
    /* internal functions */
    
    function attachHelper(helperName) {
        // if the helper is not defined, then attach
        if (! target[helperName]) {
            target[helperName] = function(value) {
                target.configure(helperName, value);
            };
        } // if
    } // attachHelper
    
    /* initialization code */
    
    var enabledHelpers = {};
    for (var ii = configParams.length; ii--; ) {
        enabledHelpers[configParams[ii]] = true;
        
        if (bindHelpers) {
            attachHelper(configParams[ii]);
        } // if
    } // for
    
    target.configure = function(name, value) {
        if (enabledHelpers[name]) {
            // if the name is an member of the target, then change the value
            if (target[name]) {
                target[name] = value;
            } // if
            
            // if the target is observable then fire an event in the form of '%name%Changed' on target
            if (target.trigger) {
                // TODO: is this better than a generic event trigger
                target.trigger(name + "Changed", value);
            } // if
        } // if
        
        return target;
    };
}; 
