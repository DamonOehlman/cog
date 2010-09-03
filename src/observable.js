GRUNT.Observable = function() {
    var listeners = {},
        callbackCounter = 0;
    
    var self = {
        bind: function(eventName, callback) {
            if (! listeners[eventName]) {
                listeners[eventName] = [];
            } // if
            
            // increment the event counter
            callbackCounter += 1;
            
            // add the callback to the list of listeners
            listeners[eventName].push({
                callback: callback,
                callbackId: callbackCounter
            });
            
            return callbackCounter;
        },
        
        trigger: function(eventName) {
            var eventCallbacks = listeners[eventName];
                
            // check that we have callbacks
            if (! eventCallbacks) {
                return;
            } // if
            
            for (var ii = eventCallbacks.length; ii--; ) {
                eventCallbacks[ii].callback.apply(self, Array.prototype.slice.call(arguments, 1));
            } // for
        },
        
        unbind: function(eventName, callbackId) {
            var eventCallbacks = listeners[eventName];
            for (var ii = 0; eventCallbacks && (ii < eventCallbacks.length); ii++) {
                if (eventCallbacks[ii].callbackId === callbackId) {
                    eventCallbacks.splice(ii, 1);
                    break;
                } // if
            } // for
        }
    };
    
    return self;
};
