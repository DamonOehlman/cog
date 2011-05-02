var _is = (function() {
    
    var has = 'hasOwnProperty',
        isnan = {'NaN': 1, 'Infinity': 1, '-Infinity': 1},
        lowerCase = String[proto].toLowerCase,
        objectToString = Object[proto].toString;
    
    /*
    Dmitry Baranovskiy's wonderful is function, sourced from RaphaelJS:
    https://github.com/DmitryBaranovskiy/raphael
    */
    return function(o, type) {
        type = lowerCase.call(type);
        if (type == "finite") {
            return !isnan[has](+o);
        }
        return  (type == "null" && o === null) ||
                (type == typeof o) ||
                (type == "object" && o === Object(o)) ||
                (type == "array" && Array.isArray && Array.isArray(o)) ||
                objectToString.call(o).slice(8, -1).toLowerCase() == type;
    }; // is
})();
