/**
GT.Loopage
----------

This module implements a control loop that can be used to centralize
jobs draw loops, animation calculations, partial calculations for GT.Job 
instances, etc.
*/
GT.Loopage = (function() {
    // initialise variables
    var workerCount = 0,
        workers = [],
        removalQueue = [],
        loopTimeout = 0;
    
    function LoopWorker(params) {
        var self = GT.extend({
            id: workerCount++,
            execute: function() {}
        }, params);
        
        return self;
    } // LoopWorker
    
    
    /* internal functions */
    
    function joinLoop(params) {
        // create the worker
        var worker = new LoopWorker(params);
        
        // make the worker observable
        GT.observable(worker);
        worker.bind('complete', leaveLoop);
        
        // add the worker to the array
        workers.unshift(worker);
        
        // if the loop is not running, then set it running
        loopTimeout = loopTimeout ? loopTimeout : setTimeout(runLoop, 0);
        
        // return the newly created worker
        return worker;
    } // joinLoop
    
    function leaveLoop(workerId) {
        removalQueue.push(workerId);
    } // leaveLoop
    
    function runLoop() {
        // get the current tick count
        var ii,
            tickCount = new Date().getTime();
        
        // iterate through removal queue
        while (removalQueue.length > 0) {
            var workerId = removalQueue.shift();
            
            // look for the worker and remove it
            for (ii = workers.length; ii--; ) {
                if (workers[ii].id === workerId) {
                    workers.splice(ii, 1);
                    break;
                } // if
            } // for
        } // while
        
        // iterate through the workers and run
        for (ii = workers.length; ii--; ) {
            workers[ii].execute(tickCount, workers[ii]);
        } // for
        
        if (workers.length > 0) {
            setTimeout(runLoop, 0);
        }
        else {
            GT.Log.info("workers completed, going to sleep");
        } // if..else
    } // runLoop
    
    var module = {
        join: joinLoop,
        leave: leaveLoop
    };
    
    return module;
})();
