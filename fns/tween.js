function _tweenValue(startValue, endValue, fn, duration, callback) {
    
    var startTicks = new Date().getTime(),
        change = endValue - startValue,
        tween = {};
        
    function runTween(tickCount) {
        // initialise the tick count if it isn't already defined
        // not all browsers pass through the ticks with the requestAnimationFrame :/
        tickCount = tickCount ? tickCount : new Date().getTime();
        
        // calculate the updated value
        var elapsed = tickCount - startTicks,
            updatedValue = fn(elapsed, startValue, change, duration),
            complete = startTicks + duration <= tickCount,
            cont = !complete,
            retVal;

        if (callback) {
            // call the callback
            retVal = callback(updatedValue, complete, elapsed);

            // check the return value
            cont = typeof retVal != 'undefined' ? retVal && cont : cont;
        } // if

        if (cont) {
            animFrame(runTween);
        } // if
    } // runTween            
        
    animFrame(runTween);
    
    return tween;
}; // tweenValue

if (typeof animFrame === 'undefined') {
    throw new Error('animFrame COG required for tweening support');
} // if