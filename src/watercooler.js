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

