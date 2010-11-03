(function() {
    function getHandlers(target) {
        return target.gtObsHandlers;
    } // getHandlers
    
    function getHandlersForName(target, eventName) {
        var handlers = getHandlers(target);
        if (! handlers[eventName]) {
            handlers[eventName] = [];
        } // if

        return handlers[eventName];
    } // getHandlersForName
    
    COG.observable = function(target) {
        if (! target) { return; }

        /* initialization code */

        // check that the target has handlers 
        if (! getHandlers(target)) {
            target.gtObsHandlers = {};
        } // if

        var attached = target.bind || target.trigger || target.unbind;
        if (! attached) {
            target.bind = function(eventName, callback) {
                var callbackId = COG.objId("callback");
                getHandlersForName(target, eventName).unshift({
                    fn: callback,
                    id: callbackId
                });

                return callbackId;
            }; // bind

            target.trigger = function(eventName) {
                var eventCallbacks = getHandlersForName(target, eventName),
                    evt = null,
                    eventArgs;

                // check that we have callbacks
                if (! eventCallbacks) {
                    return target;
                } // if
                
                // create a new event object
                evt = {
                    cancel: false
                };
                
                eventArgs = Array.prototype.slice.call(arguments, 1);
                eventArgs.unshift(evt);

                for (var ii = eventCallbacks.length; ii--; ) {
                    eventCallbacks[ii].fn.apply(self, eventArgs);
                    
                    if (evt.cancel) {
                        break;
                    } // if
                } // for

                return target;
            }; // trigger

            target.unbind = function(eventName, callbackId) {
                var eventCallbacks = getHandlersForName(target, eventName);
                for (var ii = 0; eventCallbacks && (ii < eventCallbacks.length); ii++) {
                    if (eventCallbacks[ii].id === callbackId) {
                        eventCallbacks.splice(ii, 1);
                        break;
                    } // if
                } // for

                return target;
            }; // unbind
        } // if
    };
})();

