GRUNT.XPath = (function() {
    var xpathEnabled = typeof XPathResult !== 'undefined';
    
    // if xpath is not enabled, then throw a warning
    if (! xpathEnabled) {
        GRUNT.Log.warn("No XPATH support, this is going to cause problems");
    } // if
    
    function xpath(expression, context, resultType) {
        try {
            return document.evaluate(expression, context, null, resultType, null);
        } 
        catch (e) {
            GRUNT.Log.warn("attempted to run invalid xpath expression: " + expression + " on node: " + context);
            return null;
        } // try..catch
    } // xpath
    
    // define the module
    var module = {
        SearchResult: function(matches) {
            // initialise self
            var self = {
                
                toString: function() {
                    if (matches && matches.singleNodeValue) {
                        return matches.singleNodeValue.textContent;
                    } // if
                    
                    return matches ? "[XPath result]" : "[XPath invalid]";
                }
            };
            
            return self;
        },
        
        one: function(expression, node) {
            return new module.SearchResult(xpath(expression, node, XPathResult.ANY_UNORDERED_NODE_TYPE));
        }
    };
    
    return module;
})();

