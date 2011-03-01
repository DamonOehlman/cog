// ANIMATION LOOP BINDING
// Heavily influenced from Nicolas Belmonte's implementation in PhiloGL: http://senchalabs.github.com/philogl/

var FNS_TIME = [
        'webkitAnimationTime', 
        'mozAnimationTime', 
        'animationTime',
        'webkitAnimationStartTime', 
        'mozAnimationStartTime', 
        'animationStartTime'
    ],
    FNS_FRAME = [
        'webkitRequestAnimationFrame', 
        'mozRequestAnimationFrame', 
        'requestAnimationFrame'
    ];
        
// define the base anim time implementation
var animTime = function() {
    return new Date().getTime();
};

var animFrame = function(callback) {
    setTimeout(function() {
        callback(animTime());
    }, 1000 / 60);
};
        
FNS_TIME.forEach(function(fn) {
    if (fn in window) {
        animTime = function() {
            return window[fn];
        };
    } // if
});

FNS_FRAME.forEach(function(fn) {
    if (fn in window) {
        animFrame = function(callback) {
            window[fn](callback);
        };
    } // if
});

COG.animTime = animTime;
COG.animFrame = animFrame;