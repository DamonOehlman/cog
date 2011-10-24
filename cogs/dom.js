var _dom = (function() {
    
    function create(tag, attributes, css) {
        var element = document.createElement(tag), key;
        
        // iterate through the attributes
        for (key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element[key] = attributes[key];
            } 
        } 
        
        for (key in css) {
            if (css.hasOwnProperty(key)) {
                element.style[key] = css[key];
            }
        }
        
        return element;
    } // createEl
    
    return {
        create: create
    };
})();