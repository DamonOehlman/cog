var _dom = (function() {
    
    var _reWhitespace = /[\s\,]\s*/,
        _reAlignOffset = /^(.*?)([\-\+]?\d*)$/,
        _aligners = {
            left: function(b, pb, offset) {
                this.style.marginLeft = (offset || 0) + 'px';
            },
            
            center: function(b, pb, offset) {
                this.style.marginLeft = (((pb.width - b.width) >> 1) + (offset || 0)) + 'px';
            },
            
            right: function(b, pb, offset) {
                this.style.marginLeft = (pb.width - b.width + (offset || 0)) + 'px';
            },
            
            top: function(b, pb, offset) {
                this.style.marginTop = (offset || 0) + 'px';
            },
            
            middle: function(b, pb, offset) {
                this.style.marginTop = (((pb.height - b.height) >> 1) + (offset || 0)) + 'px';
            },
            
            bottom: function(b, pb, offset) {
                this.style.marginTop = (pb.height - b.height + (offset || 0)) + 'px';
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
                alignA = _reAlignOffset.exec(aligns[0]) || [, 'left', 0],
                alignB = _reAlignOffset.exec(aligns[1]) || [, 'top', 0],
                alignerA = _aligners[alignA[1]] || _aligners.left,
                alignerB = _aligners[alignB[1]] || _aligners.top,
                bounds = element.getBoundingClientRect(),
                parentBounds = element.parentNode.getBoundingClientRect();
            
            // set the position to absolute
            element.style.position = 'absolute';
            
            // position the element
            alignerA.call(element, bounds, parentBounds, parseInt(alignA[2], 10));
            alignerB.call(element, bounds, parentBounds, parseInt(alignB[2], 10));
        }
    } // position
    
    return {
        create: create,
        position: position
    };
})();