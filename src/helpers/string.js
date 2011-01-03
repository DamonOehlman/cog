/**
### formatStr(text, args*)
*/
var formatStr = exports.formatStr = function(text) {
    //check if there are two arguments in the arguments list
    if ( arguments.length <= 1 )
    {
        //if there are not 2 or more arguments there's nothing to replace
        //just return the original text
        return text;
    }
    //decrement to move to the second argument in the array
    var tokenCount = arguments.length - 2;
    for( var token = 0; token <= tokenCount; token++ )
    {
        //iterate through the tokens and replace their placeholders from the original text in order
        text = text.replace( new RegExp( "\\{" + token + "\\}", "gi" ),
                                                arguments[ token + 1 ] );
    }
    return text;
}; // formatStr

var wordExists = exports.wordExists = function(stringToCheck, word) {
    var testString = "";

    // if the word argument is an object, and can be converted to a string, then do so
    if (word.toString) {
        word = word.toString();
    } // if

    // iterate through the string and test escape special characters
    for (var ii = 0; ii < word.length; ii++) {
        testString += (! (/\w/).test(word[ii])) ? "\\" + word[ii] : word[ii];
    } // for

    var regex = new RegExp("(^|\\s|\\,)" + testString + "(\\,|\\s|$)", "i");

    return regex.test(stringToCheck);
}; // wordExists