GT.paramTweaker = function(params, getCallbacks, setCallbacks) {
    return function(name, value) {
        if (typeof value !== "undefined") {
            if (name in params) {
                params[name] = value;
            } // if
            
            if (setCallbacks && (name in setCallbacks)) {
                setCallbacks[name](name, value);
            } // if
        }
        else {
            return (getCallbacks && (name in getCallbacks)) ? 
                getCallbacks[name](name) : 
                params[name];
        } // if..else
        
        return undefined;
    };
}; // paramTweaker

GT.configurable = function(target, configParams, callback, bindHelpers) {
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
        target.configurableId = GT.objId("configurable");
        target.configurableSettings = {};
        target.configCallbacks = [];
        
        if (! GT.configurables) {
            GT.configurables = {};
        }
    } // if
    
    // update the configurables
    // this is a which gets the last object in an extension chain in
    // the configurables list, so make sure you extend before you make
    // an object configurable, otherwise things will get a bit wierd.
    GT.configurables[target.configurableId] = target;
    
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
                
                return GT.configurables[target.configurableId];
            } // if
            
            return null;
        };
    } // if
};
