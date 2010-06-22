GRUNT.XHR = (function() {
    // define some content types
    var CONTENT_TYPES = {
        HTML: "text/html",
        XML: "text/xml"
    };

    // define the variable content type processors
    var RESPONSE_TYPE_PROCESSORS = {
        XML: function(xhr) {
            return xhr.responseXML;
        },
        
        DEFAULT: function(xhr) {
            return xhr.responseText;
        }
    }; // CONTENT_TYPE_PROCESSORS
    
    // define headers
    var HEADERS = {
        CONTENT_TYPE: "Content-Type"
    };

    function processResponseData(xhr) {
        // get the content type of the response
        var contentType = xhr.getResponseHeader(HEADERS.CONTENT_TYPE);
        var processorId;
        var matchedType = false;
        
        // determine the matching content type
        for (processorId in CONTENT_TYPES) {
            if (CONTENT_TYPES[processorId] == contentType) {
                matchedType = true;
                break;
            }
        } // for
        
        // if we didn't match the type then set to the default handler
        if ((! matchedType) || (! RESPONSE_TYPE_PROCESSORS[processorId])) {
            processorId = "DEFAULT";
        } // if

        // return the data from the xhr using the appropriate processor
        return RESPONSE_TYPE_PROCESSORS[processorId](xhr);
    } // processResponseData
    
    // define self
    var module = {
        id: "grunt.xhr",
        
        ajaxSettings: {
            xhr: null
        },
        
        ajax: function(params) {
            // given that I am having to write my own AJAX handling, I think it's safe to assume that I should
            // do that in the context of a try catch statement to catch the things that are going to go wrong...
            try {
                params = GRUNT.extend({
                    method: "GET",
                    data: null,
                    url: null,
                    async: true,
                    success: null,
                    contentType: "application/x-www-form-urlencoded"
                }, module.ajaxSettings, params);
                
                // if we have data, then update the method to POST
                if (params.data) {
                    params.method = "POST";
                } // if

                // if the url is empty, then log an error
                if (! params.url) {
                    GRUNT.Log.warn("ajax request issued with no url - that ain't going to work...");
                    return;
                } // if
                
                // if the we have an xhr creator registered, then let it decide whether it wants to create the client
                var xhr = null;
                if (params.xhr) {
                    xhr = params.xhr(params);
                } // if
                
                // if the optional creator, didn't create the client, then create the default client
                if (! xhr) {
                    xhr = new XMLHttpRequest();
                } // if

                GRUNT.Log.info("opening request: " + JSON.stringify(params));

                // open the request
                // TODO: support basic authentication
                xhr.open(params.method, params.url, params.async);

                // set the content type
                xhr.setRequestHeader("Content-Type", params.contentType);
                xhr.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        try {
                            // process the response
                            var responseData = processResponseData(this);
                        }
                        catch (e) {
                            GRUNT.Log.exception(e, "PROCESSING AJAX RESPONSE");
                        } // try..catch

                        // if the success callback is defined, then call it
                        GRUNT.Log.info("received response, calling success handler: " + params.success);
                        if (params.success) {
                            params.success.call(this, responseData);
                        } // if
                    } // if
                }; // onreadystatechange

                // send the request
                GRUNT.Log.info("sending request with data: " + module.param(params.data));
                xhr.send(params.method == "POST" ? module.param(params.data) : null);
            } 
            catch (e) {
                alert(e.message);
                GRUNT.Log.exception(e);
            } // try..catch                    
        }, // ajax
        
        param: function(data) {
            // iterate through the members of the data and convert to a paramstring
            var params = [];
            var addKeyVal = function (key, value) {
                // If value is a function, invoke it and return its value
                value = GRUNT.isFunction(value) ? value() : value;
                params[ params.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

            // If an array was passed in, assume that it is an array of form elements.
            if (GRUNT.isArray(data)) {
                for (var ii = 0; ii < data.length; ii++) {
                    addKeyVal(data[ii].name, data[ii].value);
                } // for
            }
            else {
                for (var keyname in data) {
                    addKeyVal(keyname, data[keyname]);
                } // for
            } // if..else

            // Return the resulting serialization
            return params.join("&").replace(/%20/g, "+");
        }
    }; // self
    
    return module;
})();

