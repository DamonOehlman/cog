/** @namespace 

The XHR namespace provides functionality for issuing AJAX requests in a similar style 
to the way jQuery does.  Why build a replacement for jQuery's ajax functionality you ask 
(and a fair question, I might add)?  Basically, because I was writing a library that I 
didn't want to have to rely on the presence of jQuery especially when the internals of the
way AJAX is handled changed between version 1.3.2 and 1.4.2. While not a big deal for 
end users of jQuery it became a problem when you wanted to implement a replacement XHR 
object.  So what does GRUNT XHR provide then?

TODO: add information here...
*/
GRUNT.XHR = (function() {
    // define some content types
    var CONTENT_TYPES = {
        HTML: "text/html",
        XML: "text/xml",
        TEXT: "text/plain",
        STREAM: "application/octet-stream"
    };

    // define some regular expressions to help determine the type of the request
    var REQUEST_URL_EXTENSIONS = {
        JSON: ['json'],
        PDON: ['pdon.txt']
    };
    
    var INDERMINATE_CONTENT_TYPES = ["TEXT", "STREAM"];
    
    // initialise some regexes
    var REGEX_URL = /^(\w+:)?\/\/([^\/?#]+)/;

    // define the variable content type processors
    var RESPONSE_TYPE_PROCESSORS = {
        XML: function(xhr, requestParams) {
            return xhr.responseXML;
        },
        
        JSON: function(xhr, requestParams) {
            // use the JSON object to convert the responseText to a JS object
            try {
                return JSON.parse(xhr.responseText);
            }
            catch (e) {
                GRUNT.Log.error("Error parsing JSON data: ", xhr.responseText);
                GRUNT.Log.exception(e);
            }
        },
        
        PDON: function(xhr, requestParams) {
            return GRUNT.Data.parse({
                data: xhr.responseText,
                format: "PDON"
            });
        },
        
        DEFAULT: function(xhr, requestParam) {
            return xhr.responseText;
        }
    }; // CONTENT_TYPE_PROCESSORS
    
    // define headers
    var HEADERS = {
        CONTENT_TYPE: "Content-Type"
    };
    
    /**
    This function is used to determine the appropriate request type based on the extension 
    of the url that was originally requested.  This function is only called in the case where
    an indeterminate type of content-type has been received from the server that has supplied the 
    response (such as application/octet-stream).  
    
    @private
    @param {XMLHttpRequest } xhr the XMLHttpRequest object
    @param requestParams the parameters that were passed to the xhr request
    @param fallbackType the type of request that we will fallback to 
    */
    function getProcessorForRequestUrl(xhr, requestParams, fallbackType) {
        for (var requestType in REQUEST_URL_EXTENSIONS) {
            // iterate through the file extensions
            for (var ii = 0; ii < REQUEST_URL_EXTENSIONS[requestType].length; ii++) {
                var fileExt = REQUEST_URL_EXTENSIONS[requestType][ii];

                // if the request url ends with the specified file extension we have a match
                if (new RegExp(fileExt + "$", "i").test(requestParams.url)) {
                    return requestType;
                } // if
            } // for
        } // for
        
        return fallbackType ? fallbackType : "DEFAULT";
    } // getProcessorForRequestUrl

    function processResponseData(xhr, requestParams) {
        // get the content type of the response
        var contentType = xhr.getResponseHeader(HEADERS.CONTENT_TYPE);
        var processorId;
        var matchedType = false;
        
        GRUNT.Log.info("processing response data, content type = " + contentType);
        
        // determine the matching content type
        for (processorId in CONTENT_TYPES) {
            if (contentType && (contentType.indexOf(CONTENT_TYPES[processorId]) >= 0)) {
                matchedType = true;
                break;
            }
        } // for
        
        // if the match type was indeterminate, then look at the url of the request to
        // determine which is the best type to match on
        var indeterminate = (! matchedType);
        for (var ii = 0; ii < INDERMINATE_CONTENT_TYPES.length; ii++) {
            indeterminate = indeterminate || (INDERMINATE_CONTENT_TYPES[ii] == processorId);
        } // for
        
        if (indeterminate) {
            processorId = getProcessorForRequestUrl(xhr, requestParams, processorId);
        } // if
        
        try {
            GRUNT.Log.info("using processor: " + processorId + " to process response");
            return RESPONSE_TYPE_PROCESSORS[processorId](xhr, requestParams);
        }
        catch (e) {
            GRUNT.Log.warn("error applying processor '" + processorId + "' to response type, falling back to default");
            return RESPONSE_TYPE_PROCESSORS.DEFAULT(xhr, requestParams);
        } // try..catch
    } // processResponseData
    
    // define self
    var module = GRUNT.newModule({
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
                
                // determine if this is a remote request (as per the jQuery ajax calls)
                var parts = REGEX_URL.exec(params.url),
                    remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);                
                
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

                // if we are sending data, then set the correct content type
                if (params.data) {
                    xhr.setRequestHeader("Content-Type", params.contentType);
                } // if
                
                // if this is not a remote request, the set the requested with header
                if (! remote) {
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                } // if
                
                xhr.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        var responseData = null;
                        
                        try {
                            // process the response
                            responseData = processResponseData(this, params);
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
    }); // self
    
    return module;
})();

