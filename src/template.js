GRUNT.Template = (function() {
    var REGEX_TEMPLATE_VAR = /\$\{(.*?)\}/ig;
    
    // initialise module
    var module = {
        parse: function(template_html, data) {
            // initialise variables
            var fnresult = template_html;
            
            // look for template variables in the html
            var matches = REGEX_TEMPLATE_VAR.exec(fnresult);
            while (matches) {
                // remove the variable from the text
                fnresult = fnresult.replace(matches[0], GRUNT.XPath.one(matches[1], data));
                
                // find the next match
                matches = REGEX_TEMPLATE_VAR.exec(fnresult);
            } // while
            
            return fnresult;
        }
    };
    
    return module;
})();
