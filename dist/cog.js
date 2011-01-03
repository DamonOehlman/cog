/* GRUNTJS START */
/** @namespace */
COG = (function() {
    // initialise constants
    var REGEX_TEMPLATE_VAR = /\$\{(.*?)\}/ig;
    
    var hasOwn = Object.prototype.hasOwnProperty,
        objectCounter = 0;
    
    // define the GRUNT module
    var module = {
        /** @lends GRUNT */
        
        id: "grunt.core",
        
        /* 
        Very gr*nty jQuery stuff.
        Taken from http://github.com/jquery/jquery/blob/master/src/core.js
        */
        
        /** @static */
        extend: function() {
            // copy reference to target object
            var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !module.isFunction(target) ) {
                target = {};
            }

            // extend module itself if only one argument is passed
            if ( length === i ) {
                target = this;
                --i;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging object literal values or arrays
                        if ( deep && copy && ( module.isPlainObject(copy) || module.isArray(copy) ) ) {
                            var clone = src && ( module.isPlainObject(src) || module.isArray(src) ) ? src
                                : module.isArray(copy) ? [] : {};

                            // Never move original objects, clone them
                            target[ name ] = module.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },
        
        /** @static */
        isFunction: function( obj ) {
            return toString.call(obj) === "[object Function]";
        },

        /** @static */
        isArray: function( obj ) {
            return toString.call(obj) === "[object Array]";
        },

        /** @static */
        isPlainObject: function( obj ) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
                return false;
            }

            // Not own constructor property must be Object
            if ( obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for ( key in obj ) {}

            return key === undefined || hasOwn.call( obj, key );
        },

        /** @static */
        isEmptyObject: function( obj ) {
            for ( var name in obj ) {
                return false;
            }
            return true;
        },
        
        /** @static */
        isXmlDocument: function(obj) {
            return toString.call(obj) === "[object Document]";
        },
        
        /**
        This function is used to determine whether an object contains the specified names
        as specified by arguments beyond and including index 1.  For instance, if you wanted 
        to check whether object 'foo' contained the member 'name' then you would simply call
        COG.contains(foo, 'name'). 
        
        @static
        */
        contains: function(obj, members) {
            var fnresult = obj;
            var memberArray = arguments;
            var startIndex = 1;
            
            // if the second argument has been passed in, and it is an array use that instead of the arguments array
            if (members && module.isArray(members)) {
                memberArray = members;
                startIndex = 0;
            } // if
            
            // iterate through the arguments specified after the object, and check that they exist in the 
            for (var ii = startIndex; ii < memberArray; ii++) {
                fnresult = fnresult && (typeof foo[memberArray[ii]] !== 'undefined');
            } // for
            
            return fnresult;
        },
        
        /** @static */
        newModule: function(params) {
            params = module.extend({
                id: null,
                requires: [],
                parent: null
            }, params);
            
            // TODO: if parent is not assigned, then assign the default root module
            
            if (params.parent) {
                params = module.extend({}, params.parent, params);
            } // if
            
            return params;
        },
        
        toID: function(text) {
            return text.replace(/\s/g, "-");
        },
        
        /** @static */
        objId: function(prefix) {
            return (prefix ? prefix : "obj") + objectCounter++;
        },
        
        // TODO: rewrite implementation of this
        formatStr: function(text) {
            //check if there are two arguments in the arguments list
            if ( arguments.length <= 1 )
            {
                //if there are not 2 or more arguments there's nothing to replace
                //just return the original text
                return text;
            }
            //decrement to move to the second argument in the array
            var tokenCount = arguments.length - 2;
            for( var token = 0; token <= tokenCount; token++ )
            {
                //iterate through the tokens and replace their placeholders from the original text in order
                text = text.replace( new RegExp( "\\{" + token + "\\}", "gi" ),
                                                        arguments[ token + 1 ] );
            }
            return text;
        },
        
        wordExists: function(stringToCheck, word) {
            var testString = "";

            // if the word argument is an object, and can be converted to a string, then do so
            if (word.toString) {
                word = word.toString();
            } // if

            // iterate through the string and test escape special characters
            for (var ii = 0; ii < word.length; ii++) {
                testString += (! (/\w/).test(word[ii])) ? "\\" + word[ii] : word[ii];
            } // for

            var regex = new RegExp("(^|\\s|\\,)" + testString + "(\\,|\\s|$)", "i");

            return regex.test(stringToCheck);
        },
        
        /* some simple template parsing */
        
        parseTemplate: function(templateHtml, data) {
            // look for template variables in the html
            var matches = REGEX_TEMPLATE_VAR.exec(templateHtml);
            while (matches) {
                // remove the variable from the text
                templateHtml = templateHtml.replace(matches[0], COG.XPath.first(matches[1], data));

                // find the next match
                REGEX_TEMPLATE_VAR.lastIndex = 0;
                matches = REGEX_TEMPLATE_VAR.exec(templateHtml);
            } // while

            return templateHtml;
        }
    }; // module definition
    
    return module;
})();

COG.Log = (function() {
    var listeners = [];
    var jsonAvailable = (typeof JSON !== 'undefined'),
        traceAvailable = window.console && window.console.markTimeline;
    
    function writeEntry(level, entryDetails) {
        // initialise variables
        var ii;
        var message = entryDetails && (entryDetails.length > 0) ? entryDetails[0] : "";
        
        // iterate through the remaining arguments and append them as required
        for (ii = 1; entryDetails && (ii < entryDetails.length); ii++) {
            message += " " + (jsonAvailable && COG.isPlainObject(entryDetails[ii]) ? JSON.stringify(entryDetails[ii]) : entryDetails[ii]);
        } // for
        
        if (typeof console !== 'undefined') {
            console[level](message);
        } // if
        
        // if we have listeners, then tell them about the event
        for (ii = 0; ii < listeners.length; ii++) {
            listeners[ii].call(module, message, level);
        } // for
    } // writeEntry
    
    // define the module
    var module = {
        id: "grunt.log",
        
        /* logging functions */
        
        getTraceTicks: function() {
            return traceAvailable ? new Date().getTime() : null;
        },
        
        trace: function(message, startTicks) {
            if (traceAvailable) {
                console.markTimeline(message + (startTicks ? ": " + (module.getTraceTicks() - startTicks) + "ms" : ""));
            } // if
        },
        
        debug: function(message) {
            writeEntry("debug", arguments);
        },
        
        info: function(message) {
            writeEntry("info", arguments);
        },

        warn: function(message) {
            writeEntry("warn", arguments);
        },

        error: function(message) {
            writeEntry("error", arguments);
        },
        
        exception: function(error) {
            module.error(arguments);
            
            // iterate through the keys of the error and add them as info sections
            // TODO: make this targeted at the stack, etc
            for (var keyname in error) {
                module.info("ERROR DETAIL: " + keyname + ": " + error[keyname]);
            } // for
        },
        
        /* error monitoring, exception raising functions */
        
        watch: function(sectionDesc, callback) {
            try {
                callback();
            }
            catch (e) {
                module.exception(e, sectionDesc);
            } // try..catch
        },
        
        throwError: function(errorMsg) {
            // log the error
            module.error(errorMsg);
            throw new Error(errorMsg);
        },
        
        /* event handler functions */
        
        requestUpdates: function(callback) {
            listeners.push(callback);
        }
    };
    
    return module;
})();

(function() {
    // initilialise local variables
    var configurables = {};
    
    /* internal functions */

    function attachHelper(target, helperName) {
        // if the helper is not defined, then attach
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
        target.gtConfId = COG.objId("configurable");
        target.gtConfig = {};
        target.gtConfigFns = [];
        
        return target.gtConfig;
    } // initSettings

    /* define the param tweaker */
    
    COG.paramTweaker = function(params, getCallbacks, setCallbacks) {
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

    COG.configurable = function(target, configParams, callback, bindHelpers) {
        if (! target) { return; }

        // if the target doesn't yet have a configurable settings member, then add it
        if (! target.gtConfId) {
            initSettings(target);
        } // if

        var ii,
            targetId = target.gtConfId,
            targetSettings = getSettings(target),
            targetCallbacks = getConfigCallbacks(target);

        // update the configurables
        // this is a which gets the last object in an extension chain in
        // the configurables list, so make sure you extend before you make
        // an object configurable, otherwise things will get a bit wierd.
        configurables[targetId] = target;

        // add the callback to the list
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
})();
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
                    evt = {
                        cancel: false,
                        tickCount: new Date().getTime()
                    },
                    eventArgs;

                // check that we have callbacks
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
})();

// TODO: add functionality that allows you to stop listening to messages
(function() {
    // initialise variables
    var messageListeners = {},
        pipes = [];
    
    // define the module
    COG.addPipe = function(callback) {
        // test the pipe because if it is broke it will break everything
        callback("pipe.test", {});
        
        // given that didn't throw an exception and we got here, we can now add the pipe
        pipes.push(callback);
    }; // addPipe
    
    COG.listen = function(message, callback) {
        // if we don't have a message listener array configured, then create one now
        if (! messageListeners[message]) {
            messageListeners[message] = [];
        } // if
        
        // add the callback to the listener queue
        if (callback) {
            messageListeners[message].push(callback);
        } // if
    }; // listen
        
    COG.say = function(message, args) {
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
    }; // say
})();

/**
COG.Loopage
----------

This module implements a control loop that can be used to centralize
jobs draw loops, animation calculations, partial calculations for COG.Job 
instances, etc.
*/
COG.Loopage = (function() {
    // initialise some defaults (to once per minute)
    var MIN_SLEEP = 60 * 1000;
    
    // initialise variables
    var workerCount = 0,
        workers = [],
        removalQueue = [],
        loopTimeout = 0,
        sleepFrequency = MIN_SLEEP,
        recalcSleepFrequency = true;
    
    function LoopWorker(params) {
        var self = COG.extend({
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
        // create the worker
        var worker = new LoopWorker(params);
        if (worker.after > 0) {
            worker.lastTick = new Date().getTime() + worker.after;
        } // if
        
        // make the worker observable
        COG.observable(worker);
        worker.bind('complete', function() {
            leaveLoop(worker.id);
        });
        
        // add the worker to the array
        workers.unshift(worker);
        reschedule();
        
        // return the newly created worker
        return worker;
    } // joinLoop
    
    function leaveLoop(workerId) {
        removalQueue.push(workerId);
        reschedule();
    } // leaveLoop
    
    function reschedule() {
        // if the loop is not running, then set it running
        if (loopTimeout) {
            clearTimeout(loopTimeout);
        } // if
        
        // reschedule the loop
        loopTimeout = setTimeout(runLoop, 0);
        
        // return the newly created worker
        recalcSleepFrequency = true;
    } // reschedule
    
    function runLoop() {
        // get the current tick count
        var ii,
            tickCount = new Date().getTime(),
            workerCount = workers.length;
    
        // iterate through removal queue
        while (removalQueue.length > 0) {
            var workerId = removalQueue.shift();
        
            // look for the worker and remove it
            for (ii = workerCount; ii--; ) {
                if (workers[ii].id === workerId) {
                    workers.splice(ii, 1);
                    break;
                } // if
            } // for
        
            recalcSleepFrequency = true;
            workerCount = workers.length;
        } // while
    
        // if the sleep frequency needs to be calculated then do that now
        if (recalcSleepFrequency) {
            sleepFrequency = MIN_SLEEP;
            for (ii = workerCount; ii--; ) {
                sleepFrequency = workers[ii].frequency < sleepFrequency ? workers[ii].frequency : sleepFrequency;
            } // for
        } // if
    
        // iterate through the workers and run
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
    
        // update the loop timeout
        loopTimeout = workerCount ? setTimeout(runLoop, sleepFrequency) : 0;
    } // runLoop
    
    var module = {
        join: joinLoop,
        leave: leaveLoop
    };
    
    return module;
})();
/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

(function() {
    
    function determineObjectMapping(line) {
        // if the line is empty, then return null
        if (! line) {
            return null;
        } // if
        
        // split the line on the pipe character
        var fields = line.split("|");
        var objectMapping = {};
        
        // iterate through the fields and initialise the object mapping
        for (var ii = 0; ii < fields.length; ii++) {
            objectMapping[fields[ii]] = ii;
        } // for
        
        return objectMapping;
    } // determineObjectMapping
    
    function mapLineToObject(line, mapping) {
        // split the line on the pipe character
        var fields = line.split("|");
        var objectData = {};
        
        // iterate through the mapping and pick up the fields and assign them to the object
        for (var fieldName in mapping) {
            var fieldIndex = mapping[fieldName];
            objectData[fieldName] = fields.length > fieldIndex ? fields[fieldIndex] : null;
        } // for
        
        return objectData;
    } // mapLineToObject
    
    function parsePDON(data) {
        // initialise variables
        var objectMapping = null;
        var results = [];

        // split the data on line breaks
        var lines = data.split("\n");
        for (var ii = 0; ii < lines.length; ii++) {
            // TODO: remove leading and trailing whitespace
            var lineData = lines[ii];

            // if the object mapping hasn't been initialised, then initialise it
            if (! objectMapping) {
                objectMapping = determineObjectMapping(lineData);
            }
            // otherwise create an object from the object mapping
            else {
                results.push(mapLineToObject(lineData, objectMapping));
            } // if..else
        } // for

        return results;
    } // parsePDON
    
    // define the supported formats
    var supportedFormats = {
        JSON: {
            parse: function(data) {
                return JSON.parse(data);
            }
        },
        
        PDON: {
            parse: function(data) {
                return parsePDON(data);
            }
        }
    }; // supportedFormats
    
    // define the module
    COG.parseData = function(data, format) {
        format = format ? format.toUpperCase() : "JSON";
        
        // check that the format is supported, if not raise an exception
        if (! supportedFormats[format]) {
            throw new Error("Unsupported data format: " + format);
        } // if
        
        try {
            return supportedFormats[format].parse(data);
        } 
        catch (e) {
            COG.Log.exception(e);
        } // try..catch
        
        return {};
    }; // parseData
})();

COG.XPath = (function() {
    var xpathEnabled = typeof XPathResult !== 'undefined';
    var nsResolvers = [];
    
    // defne a set of match handlers that are invoked for the various different type of xpath match results
    var MATCH_HANDLERS = [
        // 0: ANY_TYPE
        null, 
        
        // 1: NUMBER_TYPE
        function(match) {
            return match.numberValue;
        },
        
        // 2: STRING_TYPE
        function(match) {
            return match.stringValue;
        },
        
        // 3: BOOLEAN_TYPE
        function(match) {
            return match.booleanValue;
        },
        
        // 4: UNORDERED_NODE_ITERATOR_TYPE
        null,
        
        // 5: ORDERED_NODE_ITERATOR_TYPE
        null,
        
        // 6: UNORDERED_NODE_SNAPSHOT_TYPE
        null,
        
        // 7: ORDERED_NODE_SNAPSHOT_TYPE
        null,
        
        // 8: ANY_UNORDERED_NODE_TYPE
        function(match) {
            return match.singleNodeValue ? match.singleNodeValue.textContent : null;
        },
        
        // 9: FIRST_ORDERED_NODE_TYPE
        function(match) {
            return match.singleNodeValue ? match.singleNodeValue.textContent : null;
        }
    ];
    
    function namespaceResolver(prefix) {
        var namespace = null;
        
        // iterate through the registered resolvers and give them the opportunity to provide a namespace
        for (var ii = 0; ii < nsResolvers.length; ii++) {
            namespace = nsResolvers[ii](prefix);
            
            // if the namespace has been defined, by this resolver then break from the loop
            if (namespace) { break; }
        } // for
        
        return namespace;
    } // namespaceResolver
    
    // if xpath is not enabled, then throw a warning
    if (! xpathEnabled) {
        COG.Log.warn("No XPATH support");
    } // if
    
    function xpath(expression, context, resultType) {
        // if the result type is not specified, then use any type
        if (! resultType) {
            resultType = XPathResult.ANY_TYPE;
        } // if
        
        try {
            // if the context node is not xml, then return null and raise a warning
            if (! COG.isXmlDocument(context)) {
                COG.Log.warn("attempted xpath expression: " + expression + " on a non-xml document");
                return null;
            } // if
            
            // return the value of the expression
            return context.evaluate(expression, context, namespaceResolver, resultType, null);
        } 
        catch (e) {
            COG.Log.warn("invalid xpath expression: " + expression + " on node: " + context);
            return null;
        } // try..catch
    } // xpath
    
    // define the module
    var module = {
        SearchResult: function(matches) {
            // initialise self
            var self = {
                
                toString: function() {
                    var result = null;
                    
                    if (matches) {
                        var matchHandler = null;
                        if ((matches.resultType >= 0) && (matches.resultType < MATCH_HANDLERS.length)) {
                            matchHandler = MATCH_HANDLERS[matches.resultType];
                        } // if
                        
                        // if we have a match handler, then call it
                        if (matchHandler) {
                            // COG.Log.info("invoking match handler for result type: " + matches.resultType);
                            result = matchHandler(matches);
                        }
                    } // if
                    
                    return result ? result : "";
                }
            };
            
            return self;
        },
        
        first: function(expression, node) {
            return new module.SearchResult(xpath(expression, node, XPathResult.FIRST_ORDERED_NODE_TYPE));
        },
        
        registerResolver: function(callback) {
            nsResolvers.push(callback);
        }
    };
    
    return module;
})();

COG.Storage = (function() {
    function getStorageScope(scope) {
        if (scope && (scope == "session")) {
            return sessionStorage;
        } // if
        
        return localStorage;
    } // getStorageTarget

    return {
        get: function(key, scope) {
            // get the storage target
            var value = getStorageScope(scope).getItem(key);
            
            // if the value looks like serialized JSON, parse it
            return (/^(\{|\[).*(\}|\])$/).test(value) ? JSON.parse(value) : value;
        },
        
        set: function(key, value, scope) {
            // if the value is an object, the stringify using JSON
            var serializable = jQuery.isArray(value) || jQuery.isPlainObject(value);
            var storeValue = serializable ? JSON.stringify(value) : value;
            
            // save the value
            getStorageScope(scope).setItem(key, storeValue);
        },
        
        remove: function(key, scope) {
            getStorageScope(scope).removeItem(key);
        }
    };
})();
COG.ParseRules = function(params) {
    var rules = [];
    
    var self = {
        add: function(regex, handler) {
            rules.push({
                regex: regex,
                handler: handler
            });
        },
        
        each: function(input, outputReceiver, allCompleteCallback) {
            var completionCounter = 0;
            
            function incCounter() {
                completionCounter++;
                if (allCompleteCallback && (completionCounter >= rules.length)) {
                    allCompleteCallback(outputReceiver);
                } // if
            } // incCounter
            
            for (var ii = 0; ii < rules.length; ii++) {
                var regex = rules[ii].regex,
                    handler = rules[ii].handler,
                    handled = false;
                
                if (regex) {
                    regex.lastIndex = -1;
                    
                    var matches = regex.exec(input);
                    if (matches && handler) {
                        handled = true;
                        if (handler(matches, outputReceiver, incCounter)) {
                            incCounter();
                        } // if
                    } // if
                } // if
                
                if (! handled) {
                    incCounter();
                } // if
            }
        }
    };
    
    return self;
}; // ParseRules
/** @namespace 

The XHR namespace provides functionality for issuing AJAX requests in a similar style 
to the way jQuery does.  Why build a replacement for jQuery's ajax functionality you ask 
(and a fair question, I might add)?  Basically, because I was writing a library that I 
didn't want to have to rely on the presence of jQuery especially when the internals of the
way AJAX is handled changed between version 1.3.2 and 1.4.2. While not a big deal for 
end users of jQuery it became a problem when you wanted to implement a replacement XHR 
object.  So what does GRUNT XHR provide then?

TODO: add information here...
*/
(function() {
    // define some content types
    var CONTENT_TYPES = {
        HTML: "text/html",
        XML: "text/xml",
        TEXT: "text/plain",
        STREAM: "application/octet-stream"
    };

    // define some regular expressions to help determine the type of the request
    var REQUEST_URL_EXTENSIONS = {
        JSON: ['json'],
        PDON: ['pdon.txt']
    };
    
    var INDERMINATE_CONTENT_TYPES = ["TEXT", "STREAM"];
    
    // initialise some regexes
    var REGEX_URL = /^(\w+:)?\/\/([^\/?#]+)/;

    // define the variable content type processors
    var RESPONSE_TYPE_PROCESSORS = {
        XML: function(xhr, requestParams) {
            return xhr.responseXML;
        },
        
        JSON: function(xhr, requestParams) {
            return COG.parseData(xhr.responseText);
        },
        
        PDON: function(xhr, requestParams) {
            return COG.parseData(xhr.responseText, "PDON");
        },
        
        DEFAULT: function(xhr, requestParam) {
            return xhr.responseText;
        }
    }; // CONTENT_TYPE_PROCESSORS
    
    // define headers
    var HEADERS = {
        CONTENT_TYPE: "Content-Type"
    };
    
    /**
    This function is used to determine the appropriate request type based on the extension 
    of the url that was originally requested.  This function is only called in the case where
    an indeterminate type of content-type has been received from the server that has supplied the 
    response (such as application/octet-stream).  
    
    @private
    @param {XMLHttpRequest } xhr the XMLHttpRequest object
    @param requestParams the parameters that were passed to the xhr request
    @param fallbackType the type of request that we will fallback to 
    */
    function getProcessorForRequestUrl(xhr, requestParams, fallbackType) {
        for (var requestType in REQUEST_URL_EXTENSIONS) {
            // iterate through the file extensions
            for (var ii = 0; ii < REQUEST_URL_EXTENSIONS[requestType].length; ii++) {
                var fileExt = REQUEST_URL_EXTENSIONS[requestType][ii];

                // if the request url ends with the specified file extension we have a match
                if (new RegExp(fileExt + "$", "i").test(requestParams.url)) {
                    return requestType;
                } // if
            } // for
        } // for
        
        return fallbackType ? fallbackType : "DEFAULT";
    } // getProcessorForRequestUrl
    
    function requestOK(xhr, requestParams) {
        return ((! xhr.status) && (location.protocol === "file:")) ||
            (xhr.status >= 200 && xhr.status < 300) || 
            (xhr.status === 304) || 
            (xhr.status === 1223) || 
            (xhr.status === 0);
    } // getStatus
    
    function param(data) {
        // iterate through the members of the data and convert to a paramstring
        var params = [];
        var addKeyVal = function (key, value) {
            // If value is a function, invoke it and return its value
            value = COG.isFunction(value) ? value() : value;
            params[ params.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };

        // If an array was passed in, assume that it is an array of form elements.
        if (COG.isArray(data)) {
            for (var ii = 0; ii < data.length; ii++) {
                addKeyVal(data[ii].name, data[ii].value);
            } // for
        }
        else {
            for (var keyname in data) {
                addKeyVal(keyname, data[keyname]);
            } // for
        } // if..else

        // Return the resulting serialization
        return params.join("&").replace(/%20/g, "+");
    } // param
    
    function processResponseData(xhr, requestParams) {
        // get the content type of the response
        var contentType = xhr.getResponseHeader(HEADERS.CONTENT_TYPE),
            processorId,
            matchedType = false;
        
        // COG.Log.info("processing response data, content type = " + contentType);
        
        // determine the matching content type
        for (processorId in CONTENT_TYPES) {
            if (contentType && (contentType.indexOf(CONTENT_TYPES[processorId]) >= 0)) {
                matchedType = true;
                break;
            }
        } // for
        
        // if the match type was indeterminate, then look at the url of the request to
        // determine which is the best type to match on
        var indeterminate = (! matchedType);
        for (var ii = 0; ii < INDERMINATE_CONTENT_TYPES.length; ii++) {
            indeterminate = indeterminate || (INDERMINATE_CONTENT_TYPES[ii] == processorId);
        } // for
        
        if (indeterminate) {
            processorId = getProcessorForRequestUrl(xhr, requestParams, processorId);
        } // if
        
        try {
            // COG.Log.info("using processor: " + processorId + " to process response");
            return RESPONSE_TYPE_PROCESSORS[processorId](xhr, requestParams);
        }
        catch (e) {
            // COG.Log.warn("error applying processor '" + processorId + "' to response type, falling back to default");
            return RESPONSE_TYPE_PROCESSORS.DEFAULT(xhr, requestParams);
        } // try..catch
    } // processResponseData
    
    COG.xhr = function(params) {
        
        function handleReadyStateChange() {
            if (this.readyState === 4) {
                var responseData = null,
                    success = requestOK(this, params);

                try {
                    // get and check the status
                    if (success) {
                        // process the response
                        if (params.handleResponse) {
                            params.handleResponse(this);
                        }
                        else {
                            responseData = processResponseData(this, params);
                        }
                    }
                    else if (params.error) {
                        params.error(this);
                    } // if..else
                }
                catch (e) {
                    COG.Log.exception(e, "PROCESSING AJAX RESPONSE");
                } // try..catch

                // if the success callback is defined, then call it
                // COG.Log.info("received response, calling success handler: " + params.success);
                if (success && responseData && params.success) {
                    params.success.call(this, responseData);
                } // if
            } // if
        } // handleReadyStateChange
        
        // given that I am having to write my own AJAX handling, I think it's safe to assume that I should
        // do that in the context of a try catch statement to catch the things that are going to go wrong...
        try {
            params = COG.extend({
                method: "GET",
                data: null,
                url: null,
                async: true,
                success: null,
                handleResponse: null,
                error: null,
                contentType: "application/x-www-form-urlencoded"
            }, params);
            
            // determine if this is a remote request (as per the jQuery ajax calls)
            var parts = REGEX_URL.exec(params.url),
                remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);                
            
            // if we have data, then update the method to POST
            if (params.data) {
                params.method = "POST";
            } // if

            // if the url is empty, then log an error
            if (! params.url) {
                COG.Log.warn("ajax request issued with no url - that ain't going to work...");
                return;
            } // if
            
            // if the we have an xhr creator registered, then let it decide whether it wants to create the client
            var xhr = null;
            if (params.xhr) {
                xhr = params.xhr(params);
            } // if
            
            // if the optional creator, didn't create the client, then create the default client
            if (! xhr) {
                xhr = new XMLHttpRequest();
            } // if

            // COG.Log.info("opening request: " + JSON.stringify(params));

            // open the request
            // TODO: support basic authentication
            xhr.open(params.method, params.url, params.async);

            // if we are sending data, then set the correct content type
            if (params.data) {
                xhr.setRequestHeader("Content-Type", params.contentType);
            } // if
            
            // if this is not a remote request, the set the requested with header
            if (! remote) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            } // if
            
            xhr.onreadystatechange = handleReadyStateChange;

            // send the request
            // COG.Log.info("sending request with data: " + param(params.data));
            xhr.send(params.method == "POST" ? param(params.data) : null);
        } 
        catch (e) {
            COG.Log.exception(e);
        } // try..catch                    
    }; // COG.xhr
})();

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
    
    function prepAndLoad(url, callback, callbackParam) {
        // apply either a ? or & to the url depending on whether we already have query params
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
    } // jsonp
    
    COG.jsonp = prepAndLoad;
}());COG.Touch = (function() {
    // initialise constants
    var MAX_TOUCHES = 10,
        WHEEL_DELTA_STEP = 120,
        WHEEL_DELTA_LEVEL = WHEEL_DELTA_STEP * 8,
        DEFAULT_INERTIA_MAX = 500,
        INERTIA_TIMEOUT_MOUSE = 100,
        INERTIA_TIMEOUT_TOUCH = 250,
        THRESHOLD_DOUBLETAP = 300,
        THRESHOLD_PINCHZOOM = 5;
        
    // define the touch modes
    var TOUCH_MODE_TAP = 0,
        TOUCH_MODE_MOVE = 1,
        TOUCH_MODE_PINCH = 2;

    // TODO: configure the move distance to be screen size sensitive....
    var MIN_MOVEDIST = 7;

    var elementCounter = 0,
        listenerCount = 0,
        supportsTouch = undefined;
        
    function calcDiff(v1, v2) {
        return {
            x: v1.x - v2.x, 
            y: v1.y - v2.y
        };
    } // calcDiff
    
    function calcDistance(v1, v2) {
        var distV = calcDiff(v1, v2);
            
        return Math.sqrt(distV.x * distV.x + distV.y * distV.y);
    } // calcDistance
        
    function touchDistance(touchData) {
        if (touchData.count > 1) {
            return calcDistance(
                touchData.touches[0],
                touchData.touches[1]);
        } // if
        
        return 0;
    } // calcDistance
    
    function calcChange(first, second) {
        var srcVector = (first && (first.count > 0)) ? first.touches[0] : null;
        if (srcVector && second && (second.count > 0)) {
            return calcDiff(srcVector, second.touches[0]);
        } // if
        
        return null;
    } // calcChange
    
    function copyTouchData(dst, src) {
        dst.count = src.count;
        
        for (var ii = MAX_TOUCHES; ii--; ) {
            dst.touches[ii].x = src.touches[ii].x;
            dst.touches[ii].y = src.touches[ii].y;
        } // for
    } // copyTouchData
    
    function initTouchData() {
        // initialise some empty touch data
        var touchData = {
            count: 0,
            touches: new Array(MAX_TOUCHES)
        }; 
        
        // create ten touch points
        for (var ii = MAX_TOUCHES; ii--; ) {
            touchData.touches[ii] = createPoint();
        } // for
        
        return touchData;
    } // initTouchData
    
    function preventDefault(evt) {
        if (evt.preventDefault) {
            evt.preventDefault();
            evt.stopPropagation();
        }
        else if (evt.cancelBubble) {
            evt.cancelBubble();
        } // if..else
    } // preventDefault
    
    function fillTouchData(touchData, evt, evtProp) {
        if (supportsTouch) {
            var touches = evt[evtProp ? evtProp : 'touches'],
                touchCount = touches.length;
            
            touchData.count = touchCount;
            for (var ii = touchCount; ii--; ) {
                touchData.touches[ii].x = touches[ii].pageX;
                touchData.touches[ii].y = touches[ii].pageY;
            } // for
        }
        else if (evt.button === 0) {
            touchData.count = 1;
            touchData.touches[0].x = evt.pageX ? evt.pageX : evt.screenX;
            touchData.touches[0].y = evt.pageY ? evt.pageY : evt.screenY;
        }
        else {
            touchData.count = 0;
        } // if//else
    } // fillTouchPoints
    
    // used to return a composite xy value compatible with a T5.Vector
    function createPoint(x, y) {
        return {
            x: x ? x : 0,
            y: y ? y : 0
        };
    } // createPoint
    
    /* touch helper */
    
    var TouchHelper =  function(params) {
        params = COG.extend({
            element: null,
            observable: null,
            inertiaTrigger: 20,
            maxDistDoubleTap: 20,
            touchStartHandler: null,
            moveHandler: null,
            moveEndHandler: null,
            pinchZoomHandler: null,
            pinchZoomEndHandler: null,
            tapHandler: null,
            doubleTapHandler: null,
            wheelZoomHandler: null
        }, params);

        /*
        // determine whether touch is supported
        // nice work to thomas fuchs on this:
        // http://mir.aculo.us/2010/06/04/making-an-ipad-html5-app-making-it-really-fast/
        var touchReady = 'createTouch' in document;
        */

        // initialise private members
        var doubleTap = false,
            tapTimer = 0,
            config = T5.getConfig(),
            touchesStart = initTouchData(),
            touchesCurrent = initTouchData(),
            touchesLast = initTouchData(),
            touchesEnd = initTouchData(),
            touchDelta = null,
            totalDelta = createPoint(),
            panDelta = createPoint(),
            touchMode = null,
            touchDown = false,
            touchStartTick = 0,
            listeners = [],
            lastXY = createPoint(),
            inertia = false,
            inertiaDuration,
            inertiaMaxDist,
            ticksCurrent = 0,
            ticksLast = 0,
            targetElement = params.element,
            observable = params.observable,
            aggressiveCapture = typeof FlashCanvas !== 'undefined',
            BENCHMARK_INTERVAL = 300;
            
        function calculateInertia(upXY, currentXY, distance, tickDiff) {
            var theta = Math.asin((upXY.y - currentXY.y) / distance),
                // TODO: remove the magic numbers from here (pass through animation time from view, and determine max from dimensions)
                extraDistance = distance * (inertiaDuration / tickDiff) >> 0;
                
            // ensure that the extra distance does not exist the max distance
            extraDistance = extraDistance > inertiaMaxDist ? inertiaMaxDist : extraDistance;
                
            // calculate theta
            theta = currentXY.x > upXY.x ? theta : Math.PI - theta;
            
            // trigger the pan event
            triggerEvent(
                "pan",
                Math.cos(theta) * -extraDistance,
                Math.sin(theta) * extraDistance,
                true);
        } // calculateInertia
        
        function checkInertia(upXY, currentTick) {
            var tickDiff, distance;
            
            if (! supportsTouch) {
                lastXY.x = upXY.x;
                lastXY.y = upXY.y;
                
                COG.Loopage.join({
                    execute: function(tickCount, worker) {
                        tickDiff = tickCount - currentTick;
                        
                        // calculate the distance from the upXY (which doesn't change) and the
                        // lastXY (which changes as the mouse continues to move) if we move over
                        // a certain distance then trigger the intertia
                        distance = calcDistance(upXY, lastXY);

                        // calculate the inertia
                        if ((tickDiff < INERTIA_TIMEOUT_MOUSE) && (distance > params.inertiaTrigger)) {
                            worker.trigger('complete');
                            calculateInertia(upXY, lastXY, distance, tickDiff);
                        }
                        else if (tickDiff > INERTIA_TIMEOUT_MOUSE) {
                            worker.trigger('complete');
                        } // if..else
                    },
                    frequency: 10
                });
            }
            else {
                tickDiff = currentTick - touchStartTick;
                
                if ((tickDiff < INERTIA_TIMEOUT_TOUCH)) {
                    distance = calcDistance(touchesStart.touches[0], upXY);
                    
                    if (distance > params.inertiaTrigger) {
                        calculateInertia(touchesStart.touches[0], upXY, distance, tickDiff);
                    } // if
                } // if
            } // if..else                
        } // checkInertia
        
        function getOffset(obj) {
            var calcLeft = 0, 
                calcTop = 0;
                
            if (obj.offsetParent) {
                do {
                    calcLeft += obj.offsetLeft;
                    calcTop += obj.offsetTop;

                    obj = obj.offsetParent;
                } while (obj);
            } // if
            
            return createPoint(calcLeft, calcTop);
        } // getOffset
            
        function relativeTouches(touchData) {
            var touchCount = touchData.count,
                fnresult = new Array(touchCount),
                elementOffset = getOffset(targetElement);
            
            // apply the offset
            for (var ii = touchCount; ii--; ) {
                fnresult[ii] = createPoint(
                    touchData.touches[ii].x - elementOffset.x, 
                    touchData.touches[ii].y - elementOffset.y);
            } // for
            
            return fnresult;
        } // relativeTouches
        
        function triggerEvent() {
            // COG.Log.info("triggering event: " + arguments[0]);
            if (observable) {
                observable.trigger.apply(null, arguments);
            } // if
        } // triggerEvent
        
        function triggerPositionEvent(eventName, absVector) {
            var offsetVector = getOffset(targetElement),
                relativeVector = createPoint(
                    absVector.x - offsetVector.x,
                    absVector.y - offsetVector.y);
            
            // fire the event
            triggerEvent(eventName, absVector, relativeVector);
        } // triggerPositionEvent
        
        function touchStart(evt) {
            var targ = evt.target ? evt.target : evt.srcElement;
            
            if (aggressiveCapture || targ && (targ === targetElement)) {
                fillTouchData(touchesStart, evt);
                if (touchesStart.count === 0) {
                    return;
                } // if
                
                // reset the touch and total vectors
                touchDelta = null;
                totalDelta.x = 0;
                totalDelta.y = 0;
                
                touchDown = true;
                doubleTap = false;
                touchStartTick = new Date().getTime();

                // cancel event propogation
                preventDefault(evt);
                targ.style.cursor = 'move';

                // trigger the inertia cancel event
                triggerEvent("inertiaCancel");

                // log the current touch start time
                ticksCurrent = touchStartTick;
        
                // fire the touch start event handler
                var touchVector = touchesStart.count > 0 ? touchesStart.touches[0] : null;
        
                // if we don't have a touch vector, then log a warning, and exit
                if (! touchVector) {
                    COG.Log.warn("Touch start fired, but no touch vector found");
                    return;
                } // if
        
                // fire the touch start handler
                triggerEvent("touchStart", touchVector.x, touchVector.y);
        
                // check to see whether this is a double tap (if we are watching for them)
                if (ticksCurrent - ticksLast < THRESHOLD_DOUBLETAP) {
                    // calculate the difference between this and the last touch point
                    var touchChange = calcDiff(touchesStart.touches[0], touchesLast.touches[0]);
                    if (touchChange && (Math.abs(touchChange.x) < params.maxDistDoubleTap) && (Math.abs(touchChange.y) < params.maxDistDoubleTap)) {
                        doubleTap = true;
                    } // if
                } // if

                // reset the touch mode to unknown
                touchMode = TOUCH_MODE_TAP;
        
                // update the last touches
                copyTouchData(touchesLast, touchesStart);
            } // if
        } // touchStart
        
        function touchMove(evt) {
            var targ = evt.target ? evt.target : evt.srcElement,
                zoomDistance = 0;
            
            if (aggressiveCapture || targ && (targ === targetElement)) {
                // fill the touch data
                fillTouchData(touchesCurrent, evt);
                
                // update the last xy
                if (touchesCurrent.count > 0) {
                    lastXY.x = touchesCurrent.touches[0].x;
                    lastXY.y = touchesCurrent.touches[0].y;
                } // if
                
                if (! touchDown) { return; }

                // cancel event propogation
                if (supportsTouch) {
                    preventDefault(evt);
                } // if

                // check to see if we are pinching or zooming
                if (touchesCurrent.count > 1) {
                    // if the start touches does have two touch points, then reset to the current
                    if (touchesStart.count === 1) {
                        copyTouchData(touchesStart, touchesCurrent);
                    } // if

                    zoomDistance = touchDistance(touchesStart) - touchDistance(touchesCurrent);
                } // if

                // if the touch mode is tap, then check to see if we have gone beyond a move threshhold
                if (touchMode === TOUCH_MODE_TAP) {
                    // get the delta between the first touch and the current touch
                    var tapDelta = calcChange(touchesCurrent, touchesStart);

                    // if the delta.x or delta.y is greater than the move threshhold, we are no longer moving
                    if (tapDelta && ((Math.abs(tapDelta.x) >= MIN_MOVEDIST) || (Math.abs(tapDelta.y) >= MIN_MOVEDIST))) {
                        touchMode = TOUCH_MODE_MOVE;
                    } // if
                } // if


                // if we aren't in tap mode, then let's see what we should do
                if (touchMode !== TOUCH_MODE_TAP) {
                    // TODO: queue touch count history to enable an informed decision on touch end whether
                    // a single or multitouch event is completing...

                    // if we aren't pinching or zooming then do the move 
                    if ((! zoomDistance) || (Math.abs(zoomDistance) < THRESHOLD_PINCHZOOM)) {
                        // calculate the pan delta
                        touchDelta = calcChange(touchesCurrent, touchesLast);

                        // update the total delta
                        if (touchDelta) {
                            totalDelta.x -= touchDelta.x; totalDelta.y -= touchDelta.y;
                            panDelta.x -= touchDelta.x; panDelta.y -= touchDelta.y;
                        } // if

                        // trigger the pan event
                        triggerEvent("pan", panDelta.x, panDelta.y);
                        
                        // reset the pan vector
                        panDelta.x = 0;
                        panDelta.y = 0;

                        // set the touch mode to move
                        touchMode = TOUCH_MODE_MOVE;
                    }
                    else {
                        triggerEvent('pinchZoom', relativeTouches(touchesStart), relativeTouches(touchesCurrent));

                        // set the touch mode to pinch zoom
                        touchMode = TOUCH_MODE_PINCH;
                    } // if..else
                } // if..else

                copyTouchData(touchesLast, touchesCurrent);
            } // if
        } // touchMove
        
        function touchEnd(evt) {
            var targ = evt.target ? evt.target : evt.srcElement;
            
            if (touchDown && (aggressiveCapture || targ && (targ === targetElement))) {
                fillTouchData(touchesEnd, evt, 'changedTouches');
                
                var touchUpXY = touchesEnd.touches[0];
                
                // cancel event propogation
                if (supportsTouch) {
                    preventDefault(evt);
                } // if

                // get the end tick
                var endTick = new Date().getTime();

                // save the current ticks to the last ticks
                ticksLast = ticksCurrent;

                // if tapping, then first the tap event
                if (touchMode === TOUCH_MODE_TAP) {
                    // trigger the tap
                    triggerPositionEvent('tap', touchesStart.touches[0]);
                    
                    // start the timer to fire the tap handler, if 
                    if (! tapTimer) {
                        tapTimer = setTimeout(function() {
                            // reset the timer 
                            tapTimer = 0;

                            // we've had a second tap, so trigger the double tap
                            if (doubleTap) {
                                triggerPositionEvent('doubleTap', touchesStart.touches[0]);
                            } // if
                        }, THRESHOLD_DOUBLETAP + 50);
                    }
                }
                // if moving, then fire the move end
                else if (touchMode == TOUCH_MODE_MOVE) {
                    triggerEvent("panEnd", totalDelta.x, totalDelta.y);
                    
                    if (inertia) {
                        checkInertia(touchUpXY, endTick);
                    } // if
                }
                // if pinchzooming, then fire the pinch zoom end
                else if (touchMode == TOUCH_MODE_PINCH) {
                    triggerEvent('pinchZoomEnd', relativeTouches(touchesStart), relativeTouches(touchesLast), endTick - touchStartTick);
                } // if..else
                
                targ.style.cursor = 'default';
                touchDown = false;
            } // if
        } // touchEnd
        
        function getWheelDelta(evt) {
            // process ff DOMMouseScroll event
            if (evt.detail) {
                var delta = -evt.detail * WHEEL_DELTA_STEP;
                
                return createPoint(
                    evt.axis === 1 ? delta : 0,
                    evt.axis === 2 ? delta : 0);
            }
            else {
                return createPoint(
                    evt.wheelDeltaX,
                    evt.wheelDeltaY);
            } // if..else
        } // getWheelDelta
        
        function wheelie(evt) {
            var targ = evt.target ? evt.target : evt.srcElement;
            
            if (aggressiveCapture || targ && (targ === targetElement)) {
                var delta = getWheelDelta(evt), 
                    zoomAmount = delta.y / WHEEL_DELTA_LEVEL;
                    
                if (lastXY && (zoomAmount !== 0)) {
                    // apply the offset to the xy
                    var xy = createPoint(
                        lastXY.x - targetElement.offsetLeft, 
                        lastXY.y - targetElement.offsetTop);
                    
                    triggerEvent('wheelZoom', xy, zoomAmount);
                } // if
                
                preventDefault(evt);
            } // if
        } // wheelie

        // initialise self
        var self = {
            supportsTouch: supportsTouch,

            /* define methods */
            
            addListeners: function(args) {
                listeners.push(args);
            },
            
            decoupleListeners: function(listenerId) {
                // iterate through the listeners and look for the matching listener id
                for (var ii = 0; listenerId && (ii < listeners.length); ii++) {
                    if (listeners[ii].listenerId === listenerId) {
                        listeners.splice(ii, 1);

                        break;
                    } // if
                } // for
            },
            
            release: function() {
                config.unbindEvent(supportsTouch ? 'touchstart' : 'mousedown', touchStart, false);
                config.unbindEvent(supportsTouch ? 'touchmove' : 'mousemove', touchMove, false);
                config.unbindEvent(supportsTouch ? 'touchend' : 'mouseup', touchEnd, false);
                
                // handle mouse wheel events by
                if (! supportsTouch) {
                    window.removeEventListener("mousewheel", wheelie, false);
                    window.removeEventListener("DOMMouseScroll", wheelie, false);
                } // if
            },

            inertiaEnable: function(animationTime, dimensions) {
                inertia = true;
                inertiaDuration = animationTime;
                inertiaMaxDist = dimensions ? Math.min(dimensions.width, dimensions.height) : DEFAULT_INERTIA_MAX;
            },
            
            inertiaDisable: function() {
                inertia = false;
            }
        };
        
        if (typeof supportsTouch === 'undefined') {
            supportsTouch = T5.getConfig().supportsTouch;
        } // if
        
        // wire up the events
        config.bindEvent(supportsTouch ? 'touchstart' : 'mousedown', touchStart, false);
        config.bindEvent(supportsTouch ? 'touchmove' : 'mousemove', touchMove, false);
        config.bindEvent(supportsTouch ? 'touchend' : 'mouseup', touchEnd, false);
        
        // handle mouse wheel events by
        if (! supportsTouch) {
            config.bindEvent("mousewheel", wheelie, window);
            config.bindEvent("DOMMouseScroll", wheelie, window);
        } // if

        return self;
    }; // TouchHelper
    
    // initialise touch helpers array
    var touchHelpers = [];
    
    /* start module definition */
    
    var module = {
        capture: function(element, params) {
            if (! element) {
                throw new Error("Unable to capture touch of null element");
            } // if

            // if the element does not have an id, then generate on
            if (! element.id) {
                element.id = "touchable_" + elementCounter++;
            } // if

            // create the touch helper
            var touchHelper = touchHelpers[element.id];

            // if the touch helper has not been created, then create it and attach to events
            if (! touchHelper) {
                touchHelper = new TouchHelper(COG.extend({ element: element}, params));
                touchHelpers[element.id] = touchHelper;
            } // if

            // if we have params, then perform extra initialization
            if (params) {
                // if we already have an association with listeners, then remove first
                if (params.listenerId) {
                    touchHelper.decoupleListeners(params.listenerId);
                } // if

                // flag the parameters with touch listener ids so they can be removed later
                params.listenerId = (++listenerCount);

                // add the listeners to the helper
                touchHelper.addListeners(params);
            } // if

            return touchHelper;
        },
        
        release: function(element) {
            if (element && element.id && touchHelpers[element.id]) {
                touchHelpers[element.id].release();
                delete touchHelpers[element.id];
            } // if
        }
    }; // module definition
    
    return module;
})();
/* GRUNTJS END */
