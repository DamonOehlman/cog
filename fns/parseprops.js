var _parseprops = (function() {
    var rePropValue = /^([a-z]+|[a-z\-]+(?=\:))([\d\%\.\-\!]+|\:[\"\'].*?[\"\']|\:[^\s]+)(\s|\,|$)/i,
        reQuotes = /(^[\"\']|[\"\']$)/g,
        reLeadingColon = /^\:/,
        reTrailingPerc = /\%$/;

    return function(text) {
        // first tokenize
        var match, propValue, props;

        // check for a property value
        match = rePropValue.exec(text);
        while (match) {
            // extract the property value
            propValue = match[2].replace(reLeadingColon, '').replace(reQuotes, '');

            // initialise the properties
            props = props || {};

            // define the property
            props[match[1]] = reTrailingPerc.test(propValue) ? propValue : parseFloat(propValue) || propValue;

            // remove the match
            text = text.slice(match[0].length);

            // find the next match
            match = rePropValue.exec(text);
        }

        return props;
    };
})();