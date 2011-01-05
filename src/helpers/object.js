/**
### contains(obj, members)
This function is used to determine whether an object contains the specified names
as specified by arguments beyond and including index 1.  For instance, if you wanted 
to check whether object 'foo' contained the member 'name' then you would simply call
COG.contains(foo, 'name'). 
*/
var contains = exports.contains = function(obj, members) {
    var fnresult = obj;
    var memberArray = arguments;
    var startIndex = 1;
    
    // if the second argument has been passed in, and it is an array use that instead of the arguments array
    if (members && module.isArray(members)) {
        memberArray = members;
        startIndex = 0;
    } // if
    
    // iterate through the arguments specified after the object, and check that they exist in the 
    for (var ii = startIndex; ii < memberArray; ii++) {
        fnresult = fnresult && (typeof foo[memberArray[ii]] !== 'undefined');
    } // for
    
    return fnresult;
}; // contains