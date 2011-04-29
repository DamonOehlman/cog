function _extend() {
    var target = arguments[0] || {},
        sources = Array.prototype.slice.call(arguments, 1),
        length = sources.length,
        source,
        ii;

    for (ii = 0; ii < length; ii++) {
        if ((source = sources[ii]) !== null) {
            for (var name in source) {
                var copy = source[name];

                if (target === copy) {
                    continue;
                } // if

                if (copy !== undefined) {
                    target[name] = copy;
                } // if
            } // for
        } // if
    } // for

    return target;
} // _extend