var Log = exports.Log = (function() {
    var jsonAvailable = (typeof JSON !== 'undefined'),
        traceAvailable = window.console && window.console.markTimeline,
        logError = writer('error'),
        logInfo = writer('info');
        
    /* internal functions */
    
    function writeEntry(level, entryDetails) {
        // initialise variables
        var ii;
        var message = entryDetails && (entryDetails.length > 0) ? entryDetails[0] : "";
        
        // iterate through the remaining arguments and append them as required
        for (ii = 1; entryDetails && (ii < entryDetails.length); ii++) {
            message += " " + (jsonAvailable && isPlainObject(entryDetails[ii]) ? JSON.stringify(entryDetails[ii]) : entryDetails[ii]);
        } // for
        
        console[level](message);
    } // writeEntry
    
    function writer(level) {
        if (typeof console !== 'undefined') {
            return function() {
                writeEntry(level, arguments);
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
    return {
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
        
    };
})();

