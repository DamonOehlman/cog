GRUNT.Testing = (function() {
    var module = GRUNT.newModule({
        id: "grunt.test",
        requires: ["grunt.core"],
        
        /* Test Definition */
        
        Test: function(params) {
            params = GRUNT.extend({
                title: "Untitled Test",
                runner: null,
                checkMethod: "assert",
                testResult: null
            }, params);
            
            // define self
            var self = {
                
            };
            
            return self;
        },
        
        
        /* test suite */
        
        Suite: function(params) {
            params = GRUNT.extend({
                id: "untitled.suite",
                description: "",
                tests: [],
                setup: null,
                teardown: null
            }, params);
            
            var testQueue = [];
            
            // define self
            var self = {
                /**
                The queue function is used to queue a new test for execution in the current test module.
                */
                add: function(test) {
                    testQueue.push(test);
                },

                add: function(desc, runner) {
                    self.add(new module.Test({
                        description: desc,
                        runner: runner
                    }));
                },
                
                run: function() {
                    // iterate through the test queue, and process the tests
                    for (var ii = 0; ii < testQueue.length; ii++) {
                        
                    } // for
                }
            }; // self
            
            // iterate through the tests defined in the parameters, and add them
            for (var ii = 0; ii < params.tests.length; ii++) {
                self.add(new module.Test(params.tests[ii]));
            } // for
            
            return self;
        }
    });
    
    return module;
})();