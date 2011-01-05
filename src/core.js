/*!
 * Sidelab COG Javascript Library v<%= VERSION %>
 * http://www.sidelab.com/
 *
 * Copyright 2011, <%= AUTHOR %>
 * Licensed under the MIT licence
 * https://github.com/sidelab/cog
 *
 */

// the absolute bare minimum function for cog
if (typeof COG === undefined) {
    COG = {};

    /**
    # COG.extend
    */
    COG.extend = function() {
        // copy reference to target object
        var target = arguments[0] || {},
            sources = Array.prototype.slice.call(arguments, 1),
            length = sources.length,
            source,
            ii;

        for (ii = length; ii--; ) {
            if ((source = sources[ii]) !== null) {
                for (var name in source) {
                    var copy = source[name];

                    // as per jquery implementation, prevent the endless loop
                    if (target === copy) {
                        continue;
                    } // if

                    if (copy !== undefined) {
                        target[name] = copy;
                    } // if
                } // for
            } // if
        } // for

        // Return the modified object
        return target;
    }; // extend    
} // if