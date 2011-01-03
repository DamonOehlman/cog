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
}; // contains

/**
### extends(args*)
*/
var extend = exports.extend = function() {
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
}; // extend