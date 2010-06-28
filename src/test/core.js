GRUNT.Test = (function() {
    var module = GRUNT.newModule({
        id: "grunt.test",
        requires: ["grunt.core"],
        
        /**
        The queue function is used to queue a new test for execution in the current test module.
        */
        queue: function(params) {
            params = GRUNT.extend({
                description: "Untitled Test",
                runner: null
            }, params);
        },
        
        queue: function(desc, runner) {
            module.queue({
                description: desc,
                runner: runner
            });
        }
    });
    
    return module;
})();