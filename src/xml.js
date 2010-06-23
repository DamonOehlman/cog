GRUNT.XPath = (function() {
    var xpathEnabled = typeof XPathResult !== 'undefined';
    
    // if xpath is not enabled, then throw a warning
    if (! xpathEnabled) {
        GRUNT.Log.warn("No XPATH support, this is going to cause problems");
    } // if
    
    function xpath(expression, context, resultType) {
        return document.evaluate(expression, context, null, resultType, null);
    } // xpath
    
    // define the module
    var module = {
        SearchResult: function(matches) {
            // initialise self
            var self = {
                
                toString: function() {
                    if (matches.singleNodeValue) {
                        return matches.singleNodeValue.textContent;
                    } // if
                    
                    return "[XPath result]";
                }
            };
            
            return self;
        },
        
        one: function(xpath, node) {
            return new module.SearchResult(xpath(node, xpath, XPathResult.ANY_UNORDERED_NODE_TYPE));
        }
    };
    
    return module;
})();

