GRUNT.Data = (function() {
    
    var pdon = {
        determineObjectMapping: function(line) {
            // if the line is empty, then return null
            if (! line) {
                return null;
            } // if
            
            // split the line on the pipe character
            var fields = line.split("|");
            var objectMapping = {};
            
            // iterate through the fields and initialise the object mapping
            for (var ii = 0; ii < fields.length; ii++) {
                objectMapping[fields[ii]] = ii;
            } // for
            
            return objectMapping;
        },
        
        mapLineToObject: function(line, mapping) {
            // split the line on the pipe character
            var fields = line.split("|");
            var objectData = {};
            
            // iterate through the mapping and pick up the fields and assign them to the object
            for (var fieldName in mapping) {
                var fieldIndex = mapping[fieldName];
                objectData[fieldName] = fields.length > fieldIndex ? fields[fieldIndex] : null;
            } // for
            
            return objectData;
        },
        
        parse: function(data) {
            // initialise variables
            var objectMapping = null;
            var results = [];

            // split the data on line breaks
            var lines = data.split("\n");
            for (var ii = 0; ii < lines.length; ii++) {
                // TODO: remove leading and trailing whitespace
                var lineData = lines[ii];

                // if the object mapping hasn't been initialised, then initialise it
                if (! objectMapping) {
                    objectMapping = pdon.determineObjectMapping(lineData);
                }
                // otherwise create an object from the object mapping
                else {
                    results.push(pdon.mapLineToObject(lineData, objectMapping));
                } // if..else
            } // for

            return results;
        }
    }; // pdon
    
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
                    return pdon.parse(data);
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