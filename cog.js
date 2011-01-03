/**
# COG

## Module Functions
*/
COG = (function() {
    var REGEX_TEMPLATE_VAR = /\$\{(.*?)\}/ig;

    var hasOwn = Object.prototype.hasOwnProperty,
        objectCounter = 0;

    /* exports */

    var exports = {},

        toID = exports.toID = function(text) {
            return text.replace(/\s/g, "-");
        },

        objId = exports.objId = function(prefix) {
            return (prefix ? prefix : "obj") + objectCounter++;
        };

var Log = exports.Log = (function() {
    var jsonAvailable = (typeof JSON !== 'undefined'),
        traceAvailable = window.console && window.console.markTimeline,
        logError = writer('error'),
        logInfo = writer('info');

    /* internal functions */

    function writeEntry(level, entryDetails) {
        var ii;
        var message = entryDetails && (entryDetails.length > 0) ? entryDetails[0] : "";

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

    return {
        trace: trace,
        debug: writer('debug'),
        info: logInfo,
        warn: writer('warn'),
        error: logError,

        exception: function(error) {
            if (logError) {
                for (var keyname in error) {
                    logInfo("ERROR DETAIL: " + keyname + ": " + error[keyname]);
                } // for
            }
        }

    };
})();


/**
### contains(obj, members)
This function is used to determine whether an object contains the specified names
as specified by arguments beyond and including index 1.  For instance, if you wanted
to check whether object 'foo' contained the member 'name' then you would simply call
COG.contains(foo, 'name').
*/
var contains = exports.contains = function(obj, members) {
    var fnresult = obj;
    var memberArray = arguments;
    var startIndex = 1;

    if (members && module.isArray(members)) {
        memberArray = members;
        startIndex = 0;
    } // if

    for (var ii = startIndex; ii < memberArray; ii++) {
        fnresult = fnresult && (typeof foo[memberArray[ii]] !== 'undefined');
    } // for

    return fnresult;
}; // contains

/**
### extends(args*)
*/
var extend = exports.extend = function() {
    var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }

    if ( typeof target !== "object" && !module.isFunction(target) ) {
        target = {};
    }

    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        if ( (options = arguments[ i ]) != null ) {
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                if ( target === copy ) {
                    continue;
                }

                if ( deep && copy && ( module.isPlainObject(copy) || module.isArray(copy) ) ) {
                    var clone = src && ( module.isPlainObject(src) || module.isArray(src) ) ? src
                        : module.isArray(copy) ? [] : {};

                    target[ name ] = module.extend( deep, clone, copy );

                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    return target;
}; // extend
/**
### formatStr(text, args*)
*/
var formatStr = exports.formatStr = function(text) {
    if ( arguments.length <= 1 )
    {
        return text;
    }
    var tokenCount = arguments.length - 2;
    for( var token = 0; token <= tokenCount; token++ )
    {
        text = text.replace( new RegExp( "\\{" + token + "\\}", "gi" ),
                                                arguments[ token + 1 ] );
    }
    return text;
}; // formatStr

var wordExists = exports.wordExists = function(stringToCheck, word) {
    var testString = "";

    if (word.toString) {
        word = word.toString();
    } // if

    for (var ii = 0; ii < word.length; ii++) {
        testString += (! (/\w/).test(word[ii])) ? "\\" + word[ii] : word[ii];
    } // for

    var regex = new RegExp("(^|\\s|\\,)" + testString + "(\\,|\\s|$)", "i");

    return regex.test(stringToCheck);
}; // wordExists
var isFunction = exports.isFunction = function( obj ) {
    return toString.call(obj) === "[object Function]";
};

var isArray = exports.isArray = function( obj ) {
    return toString.call(obj) === "[object Array]";
};

var isPlainObject = exports.isPlainObject = function( obj ) {
    if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
        return false;
    }

    if ( obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }


    var key;
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
};

var isEmptyObject = exports.isEmptyObject = function( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
};

var isXmlDocument = exports.isXmlDocument = function(obj) {
    return toString.call(obj) === "[object Document]";
};

/**
# COG.Loopage
This module implements a control loop that can be used to centralize
jobs draw loops, animation calculations, partial calculations for COG.Job
instances, etc.
*/
var Loopage = exports.Loopage = (function() {
    var MIN_SLEEP = 60 * 1000;

    var workerCount = 0,
        workers = [],
        removalQueue = [],
        loopTimeout = 0,
        sleepFrequency = MIN_SLEEP,
        recalcSleepFrequency = true;

    function LoopWorker(params) {
        var self = extend({
            id: workerCount++,
            frequency: 0,
            after: 0,
            single: false,
            lastTick: 0,
            execute: function() {}
        }, params);

        return self;
    } // LoopWorker


    /* internal functions */

    function joinLoop(params) {
        var worker = new LoopWorker(params);
        if (worker.after > 0) {
            worker.lastTick = new Date().getTime() + worker.after;
        } // if

        observable(worker);
        worker.bind('complete', function() {
            leaveLoop(worker.id);
        });

        workers.unshift(worker);
        reschedule();

        return worker;
    } // joinLoop

    function leaveLoop(workerId) {
        removalQueue.push(workerId);
        reschedule();
    } // leaveLoop

    function reschedule() {
        if (loopTimeout) {
            clearTimeout(loopTimeout);
        } // if

        loopTimeout = setTimeout(runLoop, 0);

        recalcSleepFrequency = true;
    } // reschedule

    function runLoop() {
        var ii,
            tickCount = new Date().getTime(),
            workerCount = workers.length;

        while (removalQueue.length > 0) {
            var workerId = removalQueue.shift();

            for (ii = workerCount; ii--; ) {
                if (workers[ii].id === workerId) {
                    workers.splice(ii, 1);
                    break;
                } // if
            } // for

            recalcSleepFrequency = true;
            workerCount = workers.length;
        } // while

        if (recalcSleepFrequency) {
            sleepFrequency = MIN_SLEEP;
            for (ii = workerCount; ii--; ) {
                sleepFrequency = workers[ii].frequency < sleepFrequency ? workers[ii].frequency : sleepFrequency;
            } // for
        } // if

        for (ii = workerCount; ii--; ) {
            var workerDiff = tickCount - workers[ii].lastTick;

            if (workers[ii].lastTick === 0 || workerDiff >= workers[ii].frequency) {
                workers[ii].execute(tickCount, workers[ii]);
                workers[ii].lastTick = tickCount;

                if (workers[ii].single) {
                    workers[ii].trigger('complete');
                } // if
            } // if
        } // for

        loopTimeout = workerCount ? setTimeout(runLoop, sleepFrequency) : 0;
    } // runLoop

    return {
        join: joinLoop,
        leave: leaveLoop
    };
})();
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

var observable = exports.observable = function(target) {
    if (! target) { return; }

    /* initialization code */

    if (! getHandlers(target)) {
        target.gtObsHandlers = {};
    } // if

    var attached = target.bind || target.trigger || target.unbind;
    if (! attached) {
        target.bind = function(eventName, callback) {
            var callbackId = objId("callback");
            getHandlersForName(target, eventName).unshift({
                fn: callback,
                id: callbackId
            });

            return callbackId;
        }; // bind

        target.trigger = function(eventName) {
            var eventCallbacks = getHandlersForName(target, eventName),
                evt = {
                    cancel: false,
                    tickCount: new Date().getTime()
                },
                eventArgs;

            if (! eventCallbacks) {
                return null;
            } // if

            eventArgs = Array.prototype.slice.call(arguments, 1);
            eventArgs.unshift(evt);

            for (var ii = eventCallbacks.length; ii-- && (! evt.cancel); ) {
                eventCallbacks[ii].fn.apply(self, eventArgs);
            } // for

            return evt;
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
var configurables = {};

/* internal functions */

function attachHelper(target, helperName) {
    if (! target[helperName]) {
        target[helperName] = function(value) {
            return target.configure(helperName, value);
        };
    } // if
} // attachHelper

function getSettings(target) {
    return target.gtConfig;
} // getSettings

function getConfigCallbacks(target) {
    return target.gtConfigFns;
} // getConfigGetters

function initSettings(target) {
    target.gtConfId = objId("configurable");
    target.gtConfig = {};
    target.gtConfigFns = [];

    return target.gtConfig;
} // initSettings

/* define the param tweaker */

var paramTweaker = exports.paramTweaker = function(params, getCallbacks, setCallbacks) {
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

/* define configurable */

var configurable = exports.configurable = function(target, configParams, callback, bindHelpers) {
    if (! target) { return; }

    if (! target.gtConfId) {
        initSettings(target);
    } // if

    var ii,
        targetId = target.gtConfId,
        targetSettings = getSettings(target),
        targetCallbacks = getConfigCallbacks(target);

    configurables[targetId] = target;

    targetCallbacks.push(callback);

    for (ii = configParams.length; ii--; ) {
        targetSettings[configParams[ii]] = true;

        if (bindHelpers) {
            attachHelper(target, configParams[ii]);
        } // if
    } // for

    if (! target.configure) {
        target.configure = function(name, value) {
            if (targetSettings[name]) {
                for (var ii = targetCallbacks.length; ii--; ) {
                    var result = targetCallbacks[ii](name, value);
                    if (typeof result !== "undefined") {
                        return result;
                    } // if
                } // for

                return configurables[targetId];
            } // if

            return null;
        };
    } // if
};

/** @namespace

Lightweight JSONP fetcher - www.nonobstrusive.com
The JSONP namespace provides a lightweight JSONP implementation.  This code
is implemented as-is from the code released on www.nonobtrusive.com, as per the
blog post listed below.  Only two changes were made. First, rename the json function
to get around jslint warnings. Second, remove the params functionality from that
function (not needed for my implementation).  Oh, and fixed some scoping with the jsonp
variable (didn't work with multiple calls).

http://www.nonobtrusive.com/2010/05/20/lightweight-jsonp-without-any-3rd-party-libraries/
*/
(function(){
    var counter = 0, head, query, key, window = this;

    function load(url) {
        var script = document.createElement('script'),
            done = false;
        script.src = url;
        script.async = true;

        script.onload = script.onreadystatechange = function() {
            if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if ( script && script.parentNode ) {
                    script.parentNode.removeChild( script );
                }
            }
        };
        if ( !head ) {
            head = document.getElementsByTagName('head')[0];
        }
        head.appendChild( script );
    } // load

    exports.jsonp = function(url, callback, callbackParam) {
        url += url.indexOf("?") >= 0 ? "&" : "?";

        var jsonp = "json" + (++counter);
        window[ jsonp ] = function(data){
            callback(data);
            window[ jsonp ] = null;
            try {
                delete window[ jsonp ];
            } catch (e) {}
        };

        load(url + (callbackParam ? callbackParam : "callback") + "=" + jsonp);
        return jsonp;
    }; // jsonp
}());

    return exports;
})();

