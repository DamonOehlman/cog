cog.log = function(msg, level) {
    if (typeof console !== 'undefined') {
        console[level || 'log'](msg);
    } // if
};