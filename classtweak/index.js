// classtweak 0.1.0 - Simple DOM element class manipulator
//
// Copyright (c) 2011 Damon Oehlman (http://www.sidelab.com/)
// Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.

/*\
 * classtweak
 [ function ]
 **
 * The `classtweak` function can be used in multiple ways
 **
 > Arguments (option 1)
 **
 - elements (string|array) string that is passed to the Selectors API, or an array of DOM elements to update classes on
 - initAction (string) class modifier string
 - scope (DOMElement) target dom element for querySelector calls (default: document)
 **
 = (function) returns the classtweak function for chaining
 **
 **
 > Usage
 | // add the button class to all anchor tags
 | classtweak('a', '+button');
 > Arguments (option 2)
 **
 - elements (string|array) as per option 1
 **
 = (function) returns the @tweak function to enable class manipulation on the specified elements
\*/
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.classtweak = factory();
    }
}(this, function () {
    function classtweak(elements, initAction, scope) {
        // if elements is not defined, then return
        if (! elements) {
            return undefined;
        } // if

        // internals
        var reSpaces = /[\s\,]+/,
            instructionHandlers = {
                '+': function(current, target, foundIdx) {
                    // if the style was not found, then add it
                    if (foundIdx < 0) {
                        current[current.length] = target;
                    } // if
                },
                
                '-': function(current, target, foundIdx) {
                    if (foundIdx >= 0) {
                        current.splice(foundIdx, 1);
                    } // if
                },
                
                '!': function(current, target, foundIdx) {
                    instructionHandlers[foundIdx < 0 ? '+' : '-'](current, target, foundIdx);
                }
            };
            
        /*\
         * tweak
         [ function ]
         **
         * Apply the specified actions to the previously specified elements
         **
         > Arguments
         **
         - actions (string)
         **
         = (function) return the `tweak` function for chaining
         **
        \*/
        function tweak(actions) {
            // itereate through the elements
            for (var elIdx = elements.length; elIdx--; ) {
                var element = elements[elIdx],
                    activeClasses = element.className ? element.className.split(/\s+/).sort() : [],
                    ii;

                // if the action is a string, then parse into an array
                if (typeof actions == 'string') {
                    actions = actions.split(reSpaces);
                } // if

                // iterate through the actions and apply the tweaks
                for (ii = actions.length; ii--; ) {
                    // get the action instruction
                    var action = actions[ii],
                        instruction = action.slice(0, 1),
                        lastChar = action.slice(-1),
                        className = action.slice(1),
                        handler = instructionHandlers[instruction],
                        dotSyntax = instruction == '.' || lastChar == '.',
                        classIdx, found = -1;
                        
                    // if the instruction handler is not found, then default to +
                    // also, use the full action text
                    if (! handler) {
                        // if we have the dot syntax then do more parsing
                        if (dotSyntax) {
                            // update the handler
                            handler = instructionHandlers[
                                instruction == '.' && lastChar == '.' ? '!' : 
                                    instruction == '.' ? '+' : '-'
                            ];
                            
                            // update the classname
                            className = action.slice(
                                instruction == '.' ? 1 : 0, 
                                lastChar == '.' ? -1 : undefined
                            );
                        }
                        // otherwise, just fall back to the add handler
                        else {
                            // if the last character is a dot, push to the dot handler, otherwise +
                            handler = instructionHandlers['+'];
                            className = actions[ii];
                        } // if..else
                    } // if
                    
                    // iterate through the active classes and update the found state
                    for (classIdx = activeClasses.length; (found < 0) && classIdx--; ) {
                        // if we have a match on the class, then update the found index
                        if (activeClasses[classIdx] === className) {
                            found = classIdx;
                        } // if
                    } // for

                    // apply the handler, activeClasses modified in place
                    handler(activeClasses, className, found);
                } // for

                // update the element classname
                element.className = activeClasses.join(' ');
            } // for
            
            return tweak;
        } // tweak
        
        // check the elements
        if (typeof elements == 'string' || elements instanceof String) {
            // if we have a qsa function defined (for speed or backwards compatibility) use that
            // otherwise default to the querySelector API
            elements = typeof qsa == 'function' ? qsa(elements, scope) : (scope || document).querySelectorAll(elements);
        }
        // if we don't have a splice function, then we don't have an array
        // make it one
        else if (! elements.splice) {
            elements = [elements];
        } // if..else

        // apply the requested action
        if (initAction) {
            tweak(initAction);
        } // if
        
        // return the tweak
        return initAction ? classtweak : tweak;
    } // classtweak

    return classtweak;
}));