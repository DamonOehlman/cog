/*!
 * Sidelab COG Javascript Library v0.2.0
 * http://www.sidelab.com/
 *
 * Copyright 2011, Damon Oehlman <damon.oehlman@sidelab.com>
 * Licensed under the MIT licence
 * https://github.com/sidelab/cog
 *
 */

COG = typeof COG !== 'undefined' ? COG : {};

/**
# COG.extend
*/
COG.extend = function() {
    var target = arguments[0] || {},
        sources = Array.prototype.slice.call(arguments, 1),
        length = sources.length,
        source,
        ii;

    for (ii = length; ii--; ) {
        if ((source = sources[ii]) !== null) {
            for (var name in source) {
                var copy = source[name];

                if (target === copy) {
                    continue;
                } // if

                if (copy !== undefined) {
                    target[name] = copy;
                } // if
            } // for
        } // if
    } // for

    return target;
}; // extend

/**
# COG.Loopage
This module implements a control loop that can be used to centralize
jobs draw loops, animation calculations, partial calculations for COG.Job
instances, etc.
*/
COG.Loopage = (function() {
    var MIN_SLEEP = 60 * 1000;

    var workerCount = 0,
        workers = [],
        removalQueue = [],
        loopTimeout = 0,
        sleepFrequency = MIN_SLEEP,
        recalcSleepFrequency = true;

    function LoopWorker(params) {
        var self = COG.extend({
            id: workerCount++,
            frequency: 0,
            after: 0,
            single: false,
            lastTick: 0,
            execute: function() {}
        }, params);

        return self;
    } // LoopWorker


    /* internal functions */

    function joinLoop(params) {
        var worker = new LoopWorker(params);
        if (worker.after > 0) {
            worker.lastTick = new Date().getTime() + worker.after;
        } // if

        COG.observable(worker);
        worker.bind('complete', function() {
            leaveLoop(worker.id);
        });

        workers.unshift(worker);
        reschedule();

        return worker;
    } // joinLoop

    function leaveLoop(workerId) {
        removalQueue.push(workerId);
        reschedule();
    } // leaveLoop

    function reschedule() {
        if (loopTimeout) {
            clearTimeout(loopTimeout);
        } // if

        loopTimeout = setTimeout(runLoop, 0);

        recalcSleepFrequency = true;
    } // reschedule

    function runLoop() {
        var ii,
            tickCount = new Date().getTime(),
            workerCount = workers.length;

        while (removalQueue.length > 0) {
            var workerId = removalQueue.shift();

            for (ii = workerCount; ii--; ) {
                if (workers[ii].id === workerId) {
                    workers.splice(ii, 1);
                    break;
                } // if
            } // for

            recalcSleepFrequency = true;
            workerCount = workers.length;
        } // while

        if (recalcSleepFrequency) {
            sleepFrequency = MIN_SLEEP;
            for (ii = workerCount; ii--; ) {
                sleepFrequency = workers[ii].frequency < sleepFrequency ? workers[ii].frequency : sleepFrequency;
            } // for
        } // if

        for (ii = workerCount; ii--; ) {
            var workerDiff = tickCount - workers[ii].lastTick;

            if (workers[ii].lastTick === 0 || workerDiff >= workers[ii].frequency) {
                workers[ii].execute(tickCount, workers[ii]);
                workers[ii].lastTick = tickCount;

                if (workers[ii].single) {
                    workers[ii].trigger('complete');
                } // if
            } // if
        } // for

        loopTimeout = workerCount ? setTimeout(runLoop, sleepFrequency) : 0;
    } // runLoop

    return {
        join: joinLoop,
        leave: leaveLoop
    };
})();

(function() {
    var BACK_S = 1.70158,

        tweens = [],
        tweenWorker = null,
        updatingTweens = false;

    /*
    Easing functions

    sourced from Robert Penner's excellent work:
    http://www.robertpenner.com/easing/

    Functions follow the function format of fn(t, b, c, d, s) where:
    - t = time
    - b = beginning position
    - c = change
    - d = duration
    */
    var easingFns = {
        linear: function(t, b, c, d) {
            return c*t/d + b;
        },

        /* back easing functions */

        backin: function(t, b, c, d) {
            return c*(t/=d)*t*((BACK_S+1)*t - BACK_S) + b;
        },

        backout: function(t, b, c, d) {
            return c*((t=t/d-1)*t*((BACK_S+1)*t + BACK_S) + 1) + b;
        },

        backinout: function(t, b, c, d) {
            return ((t/=d/2)<1) ? c/2*(t*t*(((BACK_S*=(1.525))+1)*t-BACK_S))+b : c/2*((t-=2)*t*(((BACK_S*=(1.525))+1)*t+BACK_S)+2)+b;
        },

        /* bounce easing functions */

        bouncein: function(t, b, c, d) {
            return c - easingFns.bounceout(d-t, 0, c, d) + b;
        },

        bounceout: function(t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
            }
        },

        bounceinout: function(t, b, c, d) {
            if (t < d/2) return easingFns.bouncein(t*2, 0, c, d) / 2 + b;
            else return easingFns.bounceout(t*2-d, 0, c, d) / 2 + c/2 + b;
        },

        /* cubic easing functions */

        cubicin: function(t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },

        cubicout: function(t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        cubicinout: function(t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },

        /* elastic easing functions */

        elasticin: function(t, b, c, d, a, p) {
            var s;

            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (!a || a < abs(c)) { a=c; s=p/4; }
            else s = p/TWO_PI * asin (c/a);
            return -(a*pow(2,10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )) + b;
        },

        elasticout: function(t, b, c, d, a, p) {
            var s;

            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (!a || a < abs(c)) { a=c; s=p/4; }
            else s = p/TWO_PI * asin (c/a);
            return (a*pow(2,-10*t) * sin( (t*d-s)*TWO_PI/p ) + c + b);
        },

        elasticinout: function(t, b, c, d, a, p) {
            var s;

            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
            if (!a || a < abs(c)) { a=c; s=p/4; }
            else s = p/TWO_PI * asin (c/a);
            if (t < 1) return -0.5*(a*pow(2,10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )) + b;
            return a*pow(2,-10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )*0.5 + c + b;
        },

        /* quad easing */

        quadin: function(t, b, c, d) {
            return c*(t/=d)*t + b;
        },

        quadout: function(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },

        quadinout: function(t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },

        /* sine easing */

        sinein: function(t, b, c, d) {
            return -c * cos(t/d * HALF_PI) + c + b;
        },

        sineout: function(t, b, c, d) {
            return c * sin(t/d * HALF_PI) + b;
        },

        sineinout: function(t, b, c, d) {
            return -c/2 * (cos(Math.PI*t/d) - 1) + b;
        }
    };

    /* animation internals */

    function simpleTypeName(typeName) {
        return typeName.replace(/[\-\_\s\.]/g, '').toLowerCase();
    } // simpleTypeName

    function updateTweens(tickCount, worker) {
        if (updatingTweens) { return tweens.length; }

        updatingTweens = true;
        try {
            var ii = 0;
            while (ii < tweens.length) {
                if (tweens[ii].isComplete()) {
                    tweens[ii].triggerComplete(false);
                    tweens.splice(ii, 1);
                }
                else {
                    tweens[ii].update(tickCount);
                    ii++;
                } // if..else
            } // while
        }
        finally {
            updatingTweens = false;
        } // try..finally

        if (tweens.length === 0) {
            tweenWorker.trigger('complete');
        } // if

        return tweens.length;
    } // update

    function cancelAnimation(checkCallback) {
        if (updatingTweens) { return ; }

        updatingTweens = true;
        try {
            var ii = 0;

            while (ii < tweens.length) {
                if ((! checkCallback) || checkCallback(tweens[ii])) {
                    tweens[ii].triggerComplete(true);
                    tweens.splice(ii, 1);
                }
                else {
                    ii++;
                } // if..else
            } // for
        }
        finally {
            updatingTweens = false;
        } // try..finally
    } // T5.cancelAnimation

    function wakeTweens() {
        if (tweenWorker) { return; }

        tweenWorker = COG.Loopage.join({
            execute: updateTweens,
            frequency: 20
        });

        tweenWorker.bind('complete', function(evt) {
            tweenWorker = null;
        });
    } // wakeTweens

    /* animation exports */

    /**
    # COG.tweenValue
    */
    var tweenValue = COG.tweenValue = function(startValue, endValue, fn, callback, duration) {
        var fnresult = new Tween({
            startValue: startValue,
            endValue: endValue,
            tweenFn: fn,
            complete: callback,
            duration: duration
        });

        tweens.push(fnresult);
        return fnresult;
    }, // T5.tweenValue

    /*
    # T5.tween
    */
    tween = COG.tween = function(target, property, targetValue, fn, callback, duration) {
        var fnresult = new Tween({
            target: target,
            property: property,
            endValue: targetValue,
            tweenFn: fn,
            duration: duration,
            complete: callback
        });

        tweens.push(fnresult);
        return fnresult;
    }, // T5.tween

    /**
    # COG.easing
    */
    easing = COG.easing = function(typeName) {
        return easingFns[simpleTypeName(typeName)];
    }, // easing

    /**
    # COG.registerEasingType
    */
    registerEasingType = COG.registerEasingType = function(typeName, callback) {
        easingFns[simpleTypeName(typeName)] = callback;
    }, // registerEasingType

    /**
    # COG.Tween
    */
    Tween = COG.Tween = function(params) {
        params = COG.extend({
            target: null,
            property: null,
            startValue: 0,
            endValue: null,
            duration: 2000,
            tweenFn: COG.easing('sine.out'),
            complete: null,
            cancelOnInteract: false
        }, params);

        var startTicks = ticks(),
            updateListeners = [],
            complete = false,
            beginningValue = 0.0,
            change = 0;

        function notifyListeners(updatedValue, complete) {
            for (var ii = updateListeners.length; ii--; ) {
                updateListeners[ii](updatedValue, complete);
            } // for
        } // notifyListeners

        var self = {
            cancelOnInteract: params.cancelOnInteract,

            isComplete: function() {
                return complete;
            },

            triggerComplete: function(cancelled) {
                if (params.complete) {
                    params.complete(cancelled);
                } // if
            },

            update: function(tickCount) {
                try {
                    var elapsed = tickCount - startTicks,
                        updatedValue = params.tweenFn(
                                            elapsed,
                                            beginningValue,
                                            change,
                                            params.duration);

                    if (params.target) {
                        params.target[params.property] = updatedValue;
                    } // if

                    notifyListeners(updatedValue);

                    complete = startTicks + params.duration <= tickCount;
                    if (complete) {
                        if (params.target) {
                            params.target[params.property] = params.tweenFn(params.duration, beginningValue, change, params.duration);
                        } // if

                        notifyListeners(updatedValue, true);
                    } // if
                }
                catch (e) {
                    COG.exception(e);
                } // try..catch
            },

            requestUpdates: function(callback) {
                updateListeners.push(callback);
            }
        };

        beginningValue =
            (params.target && params.property && params.target[params.property]) ? params.target[params.property] : params.startValue;

        if (typeof params.endValue !== 'undefined') {
            change = (params.endValue - beginningValue);
        } // if

        if (change == 0) {
            complete = true;
        } // if..else

        wakeTweens();

        return self;
    };
})();
