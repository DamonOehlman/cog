GRUNT.Testing = (function() {
    // initialise variables
    var testSuites = {};
    
    var module = GRUNT.newModule({
        id: "grunt.test",
        requires: ["grunt.core"],
        
        STATUS: {
            notrun: 0,
            running: 1,
            waiting: 2,
            readyToContinue: 3
        },
        
        /* reporting functions */
        
        reportProgress: function(message) {
            SLICK.Log.info("TEST FRAMEWORK: " + message);
        },
        
        reportException: function(error) {
            SLICK.Log.exception(error);
        },
        
        /* Test Definition */
        
        Test: function(params) {
            params = GRUNT.extend({
                title: "Untitled Test",
                autoReady: false,
                runner: null
            }, params);
            
            // define self
            var self = {
                status: module.STATUS.notrun,
                
                run: function(testData) {
                    if (params.runner) {
                        self.status = module.STATUS.running;
                        try {
                            module.reportProgress("Running test " + self.title);
                            params.runner(self, testData);
                        }
                        catch (e) {
                            module.reportException(e);
                        }
                        finally {
                            self.status = module.STATUS.waiting;
                        } // try..finally
                    } // if
                    
                    // if the test style is 
                    if (params.autoReady) {
                        self.ready();
                    } // if
                },
                
                ready: function() {
                    self.status = module.STATUS.readyToContinue;
                }
            };
            
            return self;
        },
        
        
        /* test suite */
        
        registerSuite: function(id, suite) {
            if (id) {
                testSuites[id] = suite;
            } // if
        },
        
        runSuite: function(id) {
            if (id && testSuites[id]) {
                testSuites[id].run();
            } // if
        },
        
        Suite: function(params) {
            params = GRUNT.extend({
                id: "untitled.suite",
                description: "",
                tests: [],
                testData: {},
                setup: null,
                teardown: null
            }, params);
            
            var testQueue = [];
            var activeTest = null;
            var runInterval = 0;
            
            // define self
            var self = {
                /**
                The queue function is used to queue a new test for execution in the current test module.
                */
                add: function(test) {
                    testQueue.push(test);
                },

                run: function() {
                    // if we have an active test, then returm
                    if (activeTest) {
                        throw new Error("Test Suite already running");
                    } // if
                    
                    // if we have a setup method, then set it up
                    if (params.setup) {
                        params.setup();
                    } // if
                    
                    var ii = 0;
                    
                    // start the run loop
                    runInterval = setInterval(function() {
                        // while we have tests to complete, run
                        if (ii < testQueue.length) {
                            // update the active test
                            activeTest = testQueue[ii];

                            // skip null tests (just in case)
                            if (! activeTest) {
                                ii++;
                            }
                            // execute the test
                            else {
                                if (activeTest.status == module.STATUS.notrun) {
                                    activeTest.run(params.testData);
                                } // if
                                
                                // if the current test is ready to continue, the increment the index
                                if (activeTest.status == module.STATUS.readyToContinue) {
                                    ii++;
                                } // if
                            } // if..else
                        }
                        else {
                            self.stop();
                        } // if..else
                    }, 200);
                },
                
                stop: function() {
                    if (activeTest) {
                        // clear the interval
                        clearInterval(runInterval);
                        
                        // if we have a teardown task
                        if (params.teardown) {
                            params.teardown();
                        } // if
                    } // if
                }
            }; // self
            
            // iterate through the tests defined in the parameters, and add them
            for (var ii = 0; ii < params.tests.length; ii++) {
                self.add(new module.Test(params.tests[ii]));
            } // for
            
            // register the test suite
            module.registerSuite(params.id, self);
            
            return self;
        }
    });
    
    return module;
})();