/** 
# defaults(target, objA, objB, ..., objN)\

*/
module.exports = function(target) {
    [].slice.call(arguments, 1).forEach(function(source) {
        if (! source) return;

        for (var prop in source) {
            if (target[prop] === void 0) target[prop] = source[prop];
        }
    });

    return target;
};