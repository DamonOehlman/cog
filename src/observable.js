GRUNT.observable = function(target) {
    if (! target) { return; }
    
    /* internal functions */
    
    function getHandlers() {
        return target.observableHandlers;
    } // getHandlers
    
    function getHandlersForName(eventName) {
        return getHandlers()[eventName];
    } // getHandlersForName
    
    function initHandlerArray(eventName) {
        var handlers = getHandlers();
        if (! handlers[eventName]) {
            handlers[eventName] = [];
        } // if
    } // initHandlerArray
    
    /* initialization code */
    
    // check that the target has handlers 
    if (! getHandlers()) {
        target.observableHandlers = {};
    } // if

    var attached = target.bind || target.trigger || target.unbind;
    if (! attached) {
        target.bind = function(eventName, callback) {
            var callbackId = GRUNT.generateObjectID("callback");
            
            initHandlerArray(eventName);
            
            getHandlersForName(eventName).push({
                callback: callback,
                callbackId: callbackId
            });
            
            return callbackId;
        }; // bind
        
        target.trigger = function(eventName) {
            var eventCallbacks = getHandlersForName(eventName);
                
            // check that we have callbacks
            if (! eventCallbacks) {
                return target;
            } // if
            
            for (var ii = eventCallbacks.length; ii--; ) {
                eventCallbacks[ii].callback.apply(self, Array.prototype.slice.call(arguments, 1));
            } // for
            
            return target;
        }; // trigger
        
        target.unbind = function(eventName, callbackId) {
            var eventCallbacks = getHandlersForName(eventName);
            for (var ii = 0; eventCallbacks && (ii < eventCallbacks.length); ii++) {
                if (eventCallbacks[ii].callbackId === callbackId) {
                    eventCallbacks.splice(ii, 1);
                    break;
                } // if
            } // for
            
            return target;
        }; // unbind
    } // if
};
