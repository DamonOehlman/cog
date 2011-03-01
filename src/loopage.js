//= require "core"
//= require "animframe"

/**
# COG.Loopage
This module implements a control loop that can be used to centralize
jobs draw loops, animation calculations, partial calculations for COG.Job 
instances, etc.
*/
COG.Loopage = (function() {
    // initialise variables
    var frameId = 0,
        workerCount = 0,
        workers = [],
        removalQueue = [];
    
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
        // create the worker
        var worker = new LoopWorker(params);
        if (worker.after > 0) {
            worker.lastTick = new Date().getTime() + worker.after;
        } // if
        
        // make the worker observable
        COG.observable(worker);
        worker.bind('complete', function() {
            leaveLoop(worker.id);
        });
        
        // add the worker to the array
        workers.unshift(worker);
        reschedule();
        
        // return the newly created worker
        return worker;
    } // joinLoop
    
    function leaveLoop(workerId) {
        removalQueue.push(workerId);
        reschedule();
    } // leaveLoop
    
    function reschedule() {
        // if the loop is not running, then set it running
        if (! frameId) {
            frameId = animFrame(runLoop);
        } // if
        
        // return the newly created worker
        recalcSleepFrequency = true;
    } // reschedule
    
    function runLoop() {
        // get the current tick count
        var ii,
            tickCount = animTime(),
            workerCount = workers.length;
    
        // iterate through removal queue
        while (removalQueue.length > 0) {
            var workerId = removalQueue.shift();
        
            // look for the worker and remove it
            for (ii = workerCount; ii--; ) {
                if (workers[ii].id === workerId) {
                    workers.splice(ii, 1);
                    break;
                } // if
            } // for
        
            workerCount = workers.length;
        } // while
    
        // iterate through the workers and run
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
    
        // update the loop timeout
        frameId = workerCount ? animFrame(runLoop) : 0;
    } // runLoop

    return {
        join: joinLoop,
        leave: leaveLoop
    };
})();