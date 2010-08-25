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
            var eventCallbacks = listeners[eventName],
                eventArgs;
                
            // check that we have callbacks
            if (! eventCallbacks) {
                return;
            } // if
            
            // initialise the event args
            eventArgs = [].concat(arguments);
            eventArgs.shift();
            
            for (var ii = eventCallbacks.length; ii--; ) {
                eventCallbacks.callback.apply(self, eventArgs);
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

// TODO: add functionality that allows you to stop listening to messages
GRUNT.WaterCooler = (function() {
    // initialise variables
    var messageListeners = {},
        pipes = [];
    
    // define the module
    var module = {
        addPipe: function(callback) {
            // test the pipe because if it is broke it will break everything
            callback("pipe.test", {});
            
            // given that didn't throw an exception and we got here, we can now add the pipe
            pipes.push(callback);
        },
        
        listen: function(message, callback) {
            // if we don't have a message listener array configured, then create one now
            if (! messageListeners[message]) {
                messageListeners[message] = [];
            } // if
            
            // add the callback to the listener queue
            if (callback) {
                messageListeners[message].push(callback);
            } // if
        },
        
        say: function(message, args) {
            var ii;
            
            // if there are pipes, then send the message through each
            for (ii = pipes.length; ii--; ) {
                pipes[ii](message, args);
            } // for
            
            // if we don't have any message listeners for that message, then return
            if (! messageListeners[message]) { return; }
            
            // iterate through the message callbacks
            for (ii = messageListeners[message].length; ii--; ) {
                messageListeners[message][ii](args);
            } // for
        },
        
        leave: function() {
            
        }
    };
    
    return module;
})();

