GRUNT.Data = (function() {
    
    function parsePdonData(data) {
        GRUNT.Log.info("will parse data - promise...");
        return {};
    } // parsePdonData
    
    // define the module
    var module = {
        supportedFormats: {
            JSON: {
                parse: function(data) {
                    return JSON.parse(data);
                }
            },
            
            PDON: {
                parse: function(data) {
                    return parsePdonData(data);
                }
            }
        },
        
        parse: function(params) {
            params = GRUNT.extend({
                data: "",
                format: "JSON"
            }, params);
            
            // check that the format is supported, if not raise an exception
            if (! module.supportedFormats[params.format]) {
                throw new Error("Unsupported data format: " + params.format + ", cannot parse data in javascript object");
            } // if
            
            try {
                return module.supportedFormats[params.format].parse(params.data);
            } 
            catch (e) {
                GRUNT.Log.error("ERROR PARSING DATA FROM FORMAT: " + params.format, params.data);
                GRUNT.Log.exception(e);
            } // try..catch
            
            return {};
        }
    };
    
    return module;
})();