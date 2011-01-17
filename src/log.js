//= require "core"

(function() {
    var traceAvailable = window.console && window.console.markTimeline,
        logError = writer('error'),
        logInfo = writer('info');
        
    /* internal functions */
    
    function writer(level) {
        if (typeof console !== 'undefined') {
            return function() {
                console[level](Array.prototype.slice.call(arguments, 0).join(' '));

                return true;
            };
        }
        else {
            return function() {
                return false;
            };
        } // if..else
    } // writer
    
    /* exports */
    
    var trace = (function() {
        if (traceAvailable) {
            return function(message, startTicks) {
                console.markTimeline(message + (startTicks ? ": " + 
                    (new Date().getTime() - startTicks) + "ms" : ""));
            };
        }
        else {
            return function() {};
        } // if..else
    })();
    
    // define the module
    COG.extend(COG, {
        trace: trace,
        debug: writer('debug'),
        info: logInfo,
        warn: writer('warn'),
        error: logError,
        
        exception: function(error) {
            if (logError) {
                // iterate through the keys of the error and add them as info sections
                // TODO: make this targeted at the stack, etc
                for (var keyname in error) {
                    logInfo("ERROR DETAIL: " + keyname + ": " + error[keyname]);
                } // for
            }
        }
        
    });
})();

