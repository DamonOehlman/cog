function _log(msg, level) {
    if (typeof console !== 'undefined') {
        console[level || 'log'](msg);
    } // if
} // _log

function _logError(error) {
    if (typeof console !== 'undefined') {
        console.error(error);
        console.log(error.stack);
    } // if
} // _logError