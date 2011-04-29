var REGEX_FORMAT_HOLDERS = /\{(\d+)(?=\})/g;

function _formatter(format) {
    var matches = format.match(REGEX_FORMAT_HOLDERS),
        regexes = [],
        regexCount = 0,
        ii;
        
    // iterate through the matches
    for (ii = matches ? matches.length : 0; ii--; ) {
        var argIndex = matches[ii].slice(1);
        
        if (! regexes[argIndex]) {
            regexes[argIndex] = new RegExp('\\{' + argIndex + '\\}', 'g');
        } // if
    } // for
    
    // update the regex count
    regexCount = regexes.length;
    
    return function() {
        var output = format;
        
        for (ii = 0; ii < regexCount; ii++) {
            var argValue = arguments[ii];
            if (typeof argValue == 'undefined') {
                argValue = '';
            } // if
            
            output = output.replace(regexes[ii], argValue);
        } // for
        
        return output;
    };
} // _formatter

function _wordExists(string, word) {
    var words = string.split(/\s|\,/);
    for (var ii = words.length; ii--; ) {
        if (string.toLowerCase() == word.toLowerCase()) {
            return true;
        } // if
    } // for
    
    return false;
} // _wordExists