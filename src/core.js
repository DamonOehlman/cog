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

