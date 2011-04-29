function _log(msg, level) {
    if (typeof console !== 'undefined') {
        console[level || 'debug'](msg);
    } // if
} // _log