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
        
        // if the loop is not running, then set it running
        loopTimeout = loopTimeout ? loopTimeout : setTimeout(runLoop, 0);
        
        // return the newly created worker
        return worker;
    } // joinLoop
    
    function leaveLoop(workerId) {
        
    } // leaveLoop
    
    function runLoop() {
        // get the current tick count
        var tickCount = new Date().getTime();
        
        // iterate through the workers and run
        for (var ii = workers.length; ii--; ) {
            workers[ii].execute(tickCount, workers[ii]);
        } // for
    } // runLoop
    
    var module = {
        join: joinLoop,
        leave: leaveLoop
    };
})();
