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
        ajax: function(params) {
            // given that I am having to write my own AJAX handling, I think it's safe to assume that I should
            // do that in the context of a try catch statement to catch the things that are going to go wrong...
            try {
                params = SLICK.extend({
                    method: "GET",
                    data: {},
                    url: null,
                    async: true,
                    success: null,
                    contentType: "application/x-www-form-urlencoded"
                }, module.ajaxSettings, params);

                // if the url is empty, then log an error
                if (! params.url) {
                    SLICK.Logger.warn("ajax request issued with no url - that ain't going to work...");
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

                SLICK.Logger.info("opening request: " + JSON.stringify(params));

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
                            SLICK.Logger.exception(e, "PROCESSING AJAX RESPONSE");
                        } // try..catch

                        // if the success callback is defined, then call it
                        SLICK.Logger.info("received response, calling success handler: " + params.success);
                        if (params.success) {
                            params.success.call(this, responseData);
                        } // if
                    } // if
                }; // onreadystatechange

                // send the request
                SLICK.Logger.info("sending request with data: " + jQuery.param(params.data));
                xhr.send(params.method == "POST" ? jQuery.param(params.data) : null);
            } 
            catch (e) {
                alert(e.message);
                SLICK.Logger.exception(e);
            } // try..catch                    
        } // ajax
    }; // self
    
    return module;
})();