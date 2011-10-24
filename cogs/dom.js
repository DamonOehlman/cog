var _dom = (function() {
    
    var _reWhitespace = /[\s\,]\s*/,
        _aligners = {
            left: function() {
                this.style['margin-left'] = '0px';
            },
            
            center: function(b, pb) {
                this.style['margin-left'] = ((pb.width - b.width) >> 1) + 'px';
            },
            
            right: function(b, pb) {
                this.style['margin-left'] = (pb.width - b.width) + 'px';
            },
            
            top: function() {
                this.style['margin-top'] = '0px';
            },
            
            middle: function(b, pb) {
                this.style['margin-top'] = ((pb.height - b.height) >> 1) + 'px';
            },
            
            bottom: function(b, pb) {
                this.style['margin-top'] = (pb.height - b.height) + 'px';
            }
        };
    
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
    
    function position(element, alignment) {
        // if we have an element and a containing node, then process
        if (element && element.parentNode) {
            var aligns = (alignment || '').split(_reWhitespace),
                xAligner = _aligners[aligns[0]] || _aligners.left,
                yAligner = _aligners[aligns[1]] || _aligners.top,
                bounds = element.getBoundingClientRect(),
                parentBounds = element.parentNode.getBoundingClientRect();
            
            // set the position to absolute
            element.style.position = 'absolute';

            // position the element
            xAligner.call(element, bounds, parentBounds);
            yAligner.call(element, bounds, parentBounds);
        }
    } // position
    
    return {
        create: create,
        position: position
    };
})();