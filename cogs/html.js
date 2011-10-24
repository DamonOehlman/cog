var _html = (function() {
    
    function createEl(tag, attributes, css) {
        var element = document.createElement(tag), key;
        
        // iterate through the attributes
        for (key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
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
        createEl: createEl
    };
})();